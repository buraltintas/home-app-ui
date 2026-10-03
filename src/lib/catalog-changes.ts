// Hears about catalogue writes made through the API, wherever they were made, and drops the
// pages they made wrong from this instance's cache.
//
// A store page is cached for a day (stores/[id]/page.tsx), and the only thing that dropped it
// early was a write made through this site, on the web server that handled it. Every other
// web server kept its copy, and a review written from the mobile app reached none of them:
// the shop's page went on showing it without that review for up to a day. The owner's rule
// is plain -- if there is a write, the current data must show; if there is not, the cache is
// fine.
//
// The API already tells its own instances about every catalogue write through one small
// object in Cloud Storage (home-app-api, internal/changes): each write appends an entry
// naming the shops whose page changed, whether the lists moved (`full`), whether a review
// changed (`reviews`), or that it cannot say which pages moved (`all_pages`). This reads the
// same object. A look is one metadata read, taken at most once per LOOK_EVERY inside a page
// request -- Cloud Run gives a container no CPU between requests, so a timer would not run
// -- and only when the generation has moved are the entries read. What they name is handed
// to a route handler on this same instance, because revalidateTag cannot be called from the
// proxy, and the request that took the look waits for it, so it is answered fresh too.
//
// Nothing here can fail a visitor's request. When Cloud Storage or the route does not
// answer, the look is skipped and the news is taken again on the next one; until then the
// pages fall back on their own lifetime, as they did before this existed.

// gs://<bucket>/<object>. Unset -- every development machine -- turns all of this off.
const OBJECT=process.env.CATALOG_CHANGES_OBJECT??'';
// The names Google's own client libraries read to be pointed at a local stand-in; unset in
// production.
const METADATA_HOST=process.env.GCE_METADATA_HOST||'metadata.google.internal';
const STORAGE_ORIGIN=process.env.STORAGE_EMULATOR_HOST||'https://storage.googleapis.com';
// How often an instance looks. The API's instances look as often (CATALOG_CHANGES_INTERVAL),
// and the cost is one Class B read per look: under five cents a month per instance.
const LOOK_EVERY=30_000;
// The API answers from its own copy of the catalogue, and an API instance learns of a write
// made on another one only at its next look, up to thirty seconds later. A page rendered in
// that window can still be the old one, so every entry is acted on again later: once it is
// old enough that every API instance should have looked since (thirty seconds, plus room for
// a slow look and two clocks that disagree), and once more after five minutes, for an API
// instance whose look failed or was still running when the page was rendered. Each pass
// costs one render of the pages it names.
const SETTLE=45_000;
const LATER_PASSES=[SETTLE,300_000];
// How long a look may hold up the request that takes it.
const LOOK_TIMEOUT=1_000;
const EXPIRE_TIMEOUT=3_000;
// The route answers 503 when it could not learn a changed shop's slug. After this many failed
// tries the news is sent as "every store page", which needs no slug; after GIVE_UP_AFTER the
// pages are left to their own lifetime, so a broken route cannot hold up a request every
// thirty seconds for ever.
const WIDEN_AFTER=3;
const GIVE_UP_AFTER=10;
// The API folds an entry naming more shops than this into "every page", and so does this.
const MAX_STORES=50;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Entry={seq:number;at:string;stores?:string[];full?:boolean;reviews?:boolean;all_pages?:boolean};
type Marker={run:string;seq:number;changes?:Entry[]};
export type CatalogNews={stores:string[];allPages:boolean;lists:boolean;highlights:boolean};
type News={stores:Set<string>;allPages:boolean;lists:boolean;highlights:boolean};

const started=Date.now();
let nextLook=0;
let looking=false;
// What this instance has already acted on. -1 until the first look.
let seenGeneration=-1;
let seenRun='';
let seenSeq=-1;
// Entries already acted on that still have a later pass to come, by when it is due.
let pending:{due:number;news:News}[]=[];
let token:{value:string;expires:number}|undefined;
let lastFailureLogged=0;
let failedExpires=0;

function empty():News{return {stores:new Set(),allPages:false,lists:false,highlights:false};}
function everything():News{return {stores:new Set(),allPages:true,lists:true,highlights:true};}
function isEmpty(news:News){return !news.allPages&&!news.lists&&!news.highlights&&news.stores.size===0;}
function merge(into:News,from:News){
  into.allPages||=from.allPages;into.lists||=from.lists;into.highlights||=from.highlights;
  for(const id of from.stores)into.stores.add(id);
  if(into.allPages||into.stores.size>MAX_STORES){into.allPages=true;into.stores.clear();}
}
function fromEntry(entry:Entry):News{
  const news=empty();
  for(const id of entry.stores??[]){
    if(typeof id==='string'&&UUID.test(id))news.stores.add(id.toLowerCase());
  }
  // `full` with no shop named is a write that cannot say which shops it touched -- a brand
  // import rewriting addresses and phones, a match merge, a new shop -- so every store page
  // goes. These are rare administrator actions.
  news.allPages=Boolean(entry.all_pages||(entry.full&&news.stores.size===0));
  // A review changes a shop's rating and count, which every list of shops shows; `full` is
  // what the API sets when any list may have moved. The API drops its own highlights on
  // either, and so does this.
  news.lists=Boolean(entry.full||entry.all_pages||entry.reviews);
  news.highlights=news.lists;
  if(news.allPages||news.stores.size>MAX_STORES){news.allPages=true;news.stores.clear();}
  return news;
}
// The later passes for news first acted on now, about writes made at `at`.
function passes(at:number,now:number,news:News){
  return LATER_PASSES.map(delay=>at+delay).filter(due=>Number.isFinite(due)&&due>now).map(due=>({due,news}));
}

// Takes a look if one is due, and returns once anything it found has been dropped. Called by
// the proxy on page requests; every other request carries on without waiting.
export async function lookForCatalogChanges():Promise<void>{
  if(!OBJECT.startsWith('gs://'))return;
  const now=Date.now();
  if(looking||now<nextLook)return;
  looking=true;
  nextLook=now+LOOK_EVERY;
  try{
    await look(now);
  }catch(reason){
    // At most one line every ten minutes: a Cloud Storage outage would otherwise write one
    // per look per instance.
    if(now-lastFailureLogged>600_000){
      lastFailureLogged=now;
      console.warn('catalog-changes',JSON.stringify({msg:'look failed, pages fall back on their own lifetime',error:String(reason)}));
    }
  }finally{
    looking=false;
  }
}

async function look(now:number){
  const {bucket,name}=parseObject(OBJECT);
  const auth=await accessToken();
  const generation=await currentGeneration(bucket,name,auth);
  const news=empty();
  const later:{due:number;news:News}[]=[];
  let next:{generation:number;run:string;seq:number}|undefined;

  if(generation!==seenGeneration){
    const marker=generation===0?undefined:await readMarker(bucket,name,auth);
    if(!marker){
      // No marker: nothing has been written since it was last started. One that existed and
      // is gone means it is being started again, and what was in it cannot be known.
      if(seenGeneration>0){merge(news,everything());later.push(...passes(now,now,everything()));}
      next={generation,run:'',seq:-1};
    }else{
      const entries=(marker.changes??[]).filter(entry=>typeof entry?.seq==='number').sort((a,b)=>a.seq-b.seq);
      let fresh:Entry[];
      if(seenGeneration===-1){
        // This instance started with an empty cache, and anything it rendered since was read
        // from the API after it started. Only a write too recent for every API instance to
        // have heard of by then can have made one of those renders wrong.
        fresh=entries.filter(entry=>Date.parse(entry.at)+SETTLE>started);
      }else if(seenGeneration===0){
        // There was no marker at the last look, so everything in it is new.
        fresh=entries;
      }else if(marker.run!==seenRun||marker.seq<seenSeq||(entries[0]&&entries[0].seq>seenSeq+1&&marker.seq>seenSeq)){
        // Started again under another name, gone backwards, or more entries than it keeps
        // were written since the last look: what was missed cannot be told, so every page goes,
        // and goes again once the newest of it has settled.
        merge(news,everything());
        const newest=Math.max(...entries.map(entry=>Date.parse(entry.at)).filter(Number.isFinite));
        later.push(...passes(Number.isFinite(newest)?newest:now,now,everything()));
        fresh=[];
      }else{
        fresh=entries.filter(entry=>entry.seq>seenSeq);
      }
      for(const entry of fresh){
        const changed=fromEntry(entry);
        merge(news,changed);
        later.push(...passes(Date.parse(entry.at),now,changed));
      }
      next={generation,run:marker.run,seq:marker.seq};
    }
  }

  const due=pending.filter(item=>item.due<=now);
  for(const item of due)merge(news,item.news);

  if(!isEmpty(news)){
    if(failedExpires>=WIDEN_AFTER)merge(news,{...empty(),allPages:true});
    if(!await expire(news)){
      if(++failedExpires<GIVE_UP_AFTER)return; // taken again on the next look
      console.warn('catalog-changes',JSON.stringify({msg:'gave up dropping changed pages, they keep their own lifetime',tries:failedExpires}));
    }
    failedExpires=0;
  }
  if(next){seenGeneration=next.generation;seenRun=next.run;seenSeq=next.seq;}
  pending=[...pending.filter(item=>item.due>now),...later];
}

function parseObject(object:string){
  const rest=object.slice('gs://'.length);
  const slash=rest.indexOf('/');
  return {bucket:rest.slice(0,slash),name:rest.slice(slash+1)};
}

// The service account's token, from the metadata server Cloud Run gives every container.
async function accessToken():Promise<string>{
  if(token&&token.expires>Date.now()+60_000)return token.value;
  const response=await fetch(`http://${METADATA_HOST}/computeMetadata/v1/instance/service-accounts/default/token`,{
    headers:{'Metadata-Flavor':'Google'},cache:'no-store',signal:AbortSignal.timeout(LOOK_TIMEOUT),
  });
  if(!response.ok)throw new Error(`metadata token ${response.status}`);
  const body=await response.json() as {access_token:string;expires_in:number};
  token={value:body.access_token,expires:Date.now()+body.expires_in*1000};
  return token.value;
}

function objectURL(bucket:string,name:string){
  return `${STORAGE_ORIGIN}/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(name)}`;
}

async function currentGeneration(bucket:string,name:string,auth:string):Promise<number>{
  const response=await fetch(`${objectURL(bucket,name)}?fields=generation`,{
    headers:{Authorization:`Bearer ${auth}`},cache:'no-store',signal:AbortSignal.timeout(LOOK_TIMEOUT),
  });
  if(response.status===404)return 0;
  if(!response.ok)throw new Error(`marker generation ${response.status}`);
  return Number((await response.json() as {generation:string}).generation);
}

async function readMarker(bucket:string,name:string,auth:string):Promise<Marker|undefined>{
  const response=await fetch(`${objectURL(bucket,name)}?alt=media`,{
    headers:{Authorization:`Bearer ${auth}`},cache:'no-store',signal:AbortSignal.timeout(LOOK_TIMEOUT),
  });
  if(response.status===404)return undefined;
  if(!response.ok)throw new Error(`marker read ${response.status}`);
  return await response.json() as Marker;
}

// Hands the news to the route on this same instance. Loopback, never the public address: that
// would reach whichever instance the load balancer picked, and drop that one's pages instead.
async function expire(news:News):Promise<boolean>{
  const body:CatalogNews={stores:[...news.stores],allPages:news.allPages,lists:news.lists,highlights:news.highlights};
  try{
    const response=await fetch(`http://127.0.0.1:${process.env.PORT??'3000'}/api/internal/catalog-changes`,{
      method:'POST',
      headers:{'Content-Type':'application/json','X-Catalog-Changes-Key':process.env.BFF_SECRET??''},
      body:JSON.stringify(body),
      cache:'no-store',
      signal:AbortSignal.timeout(EXPIRE_TIMEOUT),
    });
    if(!response.ok)throw new Error(`expire ${response.status}`);
    return true;
  }catch(reason){
    console.warn('catalog-changes',JSON.stringify({msg:'could not drop changed pages, will try again on the next look',error:String(reason)}));
    return false;
  }
}
