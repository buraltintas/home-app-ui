import {timingSafeEqual} from 'node:crypto';
import {revalidateTag} from 'next/cache';
import {NextResponse,type NextRequest} from 'next/server';
import type {CatalogNews} from '@/lib/catalog-changes';
import {HIGHLIGHTS_TAG,STORE_LISTS_TAG,STORE_PAGES_TAG,storeTag} from '@/lib/server-api';

export const dynamic='force-dynamic';

const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const MAX_STORES=50;

// Drops the cached pages a catalogue write made wrong, on this instance. Called only by the
// proxy of this same instance over loopback (lib/catalog-changes.ts), because revalidateTag
// cannot be called from the proxy itself. It is reachable from outside like any route, so it
// asks for the server's own secret and answers 404 without it; all it can do is make pages
// render again.
export async function POST(request:NextRequest){
  if(!authorised(request.headers.get('x-catalog-changes-key')))return new NextResponse(null,{status:404});
  const news=await request.json().catch(()=>undefined) as Partial<CatalogNews>|undefined;
  if(!news)return new NextResponse(null,{status:400});

  const tags=new Set<string>();
  const ids=(Array.isArray(news.stores)?news.stores:[]).filter((id):id is string=>typeof id==='string'&&UUID.test(id)).slice(0,MAX_STORES);
  let allPages=Boolean(news.allPages);
  // A page is cached under the reference it was asked for, the id or the slug, and the news
  // names shops by id only -- so each shop's slug is asked for, fresh. It is one request per
  // changed shop, and the database is awake anyway: it has just been written. When every
  // store page goes, no slug is needed.
  const lookups=allPages?[]:await Promise.all(ids.map(slugOf));
  for(const id of ids)tags.add(storeTag(id));
  for(const lookup of lookups){
    if('slug' in lookup){if(lookup.slug)tags.add(storeTag(lookup.slug));}
    // A shop merged into another answers as the one it was merged into, and a shop that is
    // gone answers 404: either way the slug its own page is cached under cannot be learned
    // any more, and only dropping every store page reaches it. Both are rare.
    else if('unknowable' in lookup)allPages=true;
  }
  if(allPages)tags.add(STORE_PAGES_TAG);
  if(news.lists)tags.add(STORE_LISTS_TAG);
  if(news.highlights)tags.add(HIGHLIGHTS_TAG);

  // Expired outright rather than marked stale: a stale entry is still served once while it
  // renders again, and the request that brought the news is about to ask for one of these.
  for(const tag of tags)revalidateTag(tag,{expire:0});
  const failed=ids.filter((_,index)=>{const lookup=lookups[index];return Boolean(lookup&&'failed' in lookup);});
  console.info('catalog-changes',JSON.stringify({msg:'dropped changed pages',stores:ids.length,all_pages:allPages,lists:Boolean(news.lists),highlights:Boolean(news.highlights),...(failed.length?{slug_lookup_failed:failed}:{})}));
  // What could be dropped has been. A slug that could not be read leaves that shop's page in
  // place, so the caller is told to send the news again, and after a few tries it sends it as
  // every store page, which needs no slug (lib/catalog-changes.ts).
  const status=failed.length?503:200;
  return NextResponse.json({tags:tags.size,...(failed.length?{retry:failed.length}:{})},{status,headers:{'cache-control':'no-store'}});
}

function authorised(given:string|null){
  const secret=process.env.BFF_SECRET??'';
  if(!secret||!given)return false;
  const a=Buffer.from(given),b=Buffer.from(secret);
  return a.length===b.length&&timingSafeEqual(a,b);
}

type Lookup={slug:string}|{unknowable:true}|{failed:true};

async function slugOf(id:string):Promise<Lookup>{
  try{
    const response=await fetch(`${API_ORIGIN}/v1/stores/${id}`,{
      cache:'no-store',
      headers:{'Content-Type':'application/json','X-BFF-Secret':process.env.BFF_SECRET??''},
      signal:AbortSignal.timeout(2000),
    });
    if(response.status===404)return {unknowable:true};
    if(!response.ok)return {failed:true};
    const store=(await response.json() as {store?:{id?:string;slug?:string}}).store;
    if(!store?.id||store.id.toLowerCase()!==id.toLowerCase())return {unknowable:true};
    // A shop with no slug is only ever addressed by its id, which is dropped anyway.
    return {slug:store.slug&&SLUG.test(store.slug)?store.slug:''};
  }catch{
    return {failed:true};
  }
}
