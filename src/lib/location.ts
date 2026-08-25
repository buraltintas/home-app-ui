// Location is the backbone of this product: a review is only trustworthy because the
// device was near the store. So this module never gives up after one attempt.
//
// Acquisition is layered. We watch rather than take a single reading, because the first
// fix a device emits is often a coarse one that sharpens a second later; a one-shot call
// either takes that coarse value or times out waiting for perfection. We keep the best
// fix seen, settle as soon as it is good enough, and on a deadline return the best we
// have instead of failing. If the precise attempt is refused by the hardware we retry
// coarsely, and only a genuine permission refusal stops us.
export type Position={latitude:number;longitude:number;accuracy_meters?:number;captured_at:number};
export type LocationFailure='unsupported'|'denied'|'blocked'|'unavailable'|'timeout'|'inaccurate';
export type LocationOutcome={ok:true;position:Position;cached?:boolean}|{ok:false;reason:LocationFailure};
export type SearchLocationPreference={source:'device'|'manual';label:string;city?:string;place_id?:string;address?:string;latitude:number;longitude:number;accuracy_meters?:number;updated_at:number};

const REMEMBERED='bosagezme:last-location';
const LOCATION_ENABLED='bosagezme:device-location-enabled';
const LIVE_POSITION='bosagezme:live-location';
const SEARCH_LOCATION='bosagezme:search-location';
export const LOCATION_UPDATE_EVENT='bosagezme:location-update';
// A remembered fix is a convenience for browsing, never proof of a visit, so it is only
// offered where being roughly right is better than asking again.
const REMEMBERED_MAX_AGE=6*60*60*1000;
// A live fix can bridge a client-side navigation from Discover to the review flow.
// It stays in memory and expires quickly, so a typed or hours-old browsing location
// can never become visit evidence.
const RECENT_LIVE_MAX_AGE=2*60*1000;
let recentLivePosition:Position|undefined;
let liveWatch:number|undefined;

type Attempt={options:PositionOptions;deadline:number;target:number};
// Good enough to place someone on a street, which is all a search needs.
const PRECISE:Attempt={options:{enableHighAccuracy:true,timeout:15000,maximumAge:0},deadline:15000,target:60};
// Indoors a satellite fix may never arrive. A wifi or cell reading still places the
// device in the right neighbourhood, and that beats refusing to answer.
const COARSE:Attempt={options:{enableHighAccuracy:false,timeout:12000,maximumAge:120000},deadline:12000,target:1500};
// Review verification can safely accept a wider horizontal-accuracy estimate because
// the backend adds the full estimate to the measured store distance. A 700 m reading
// therefore reduces, rather than expands, the part of the 2 km boundary available to
// the measured distance.
const VISIT:Attempt={options:{enableHighAccuracy:true,timeout:20000,maximumAge:30000},deadline:20000,target:1000};

function toPosition(fix:GeolocationPosition):Position{
  return {latitude:fix.coords.latitude,longitude:fix.coords.longitude,accuracy_meters:fix.coords.accuracy,captured_at:Date.now()};
}

// Resolves with the sharpest fix seen before the deadline. Rejects only when the deadline
// passes with nothing at all, or the device reports an error before any fix arrives.
function acquire({options,deadline,target}:Attempt):Promise<GeolocationPosition>{
  return new Promise((resolve,reject)=>{
    let best:GeolocationPosition|undefined;
    let settled=false;
    const stop=()=>{settled=true;window.clearTimeout(timer);navigator.geolocation.clearWatch(watch);};
    const timer=window.setTimeout(()=>{
      if(settled)return;
      stop();
      if(best)resolve(best);
      else reject({code:3,message:'timeout'} as GeolocationPositionError);
    },deadline);
    const watch=navigator.geolocation.watchPosition(fix=>{
      if(settled)return;
      if(!best||fix.coords.accuracy<best.coords.accuracy)best=fix;
      if(best.coords.accuracy<=target){const found=best;stop();resolve(found);}
    },error=>{
      if(settled)return;
      // A late error after a usable fix is not a failure; we already have an answer.
      if(best){const found=best;stop();resolve(found);return;}
      stop();reject(error);
    },options);
  });
}

// Reports whether the browser has already stored a decision. A denied state means no
// prompt will ever appear again, which is the difference between "allow us" and
// "re-enable us in your browser settings".
export async function locationPermission():Promise<PermissionState|'unknown'>{
  if(typeof navigator==='undefined'||!navigator.permissions?.query)return 'unknown';
  try{return (await navigator.permissions.query({name:'geolocation'})).state;}catch{return 'unknown';}
}

export function rememberedPosition():Position|undefined{
  if(typeof window==='undefined')return undefined;
  try{
    const raw=window.localStorage.getItem(REMEMBERED);
    if(!raw)return undefined;
    const position=JSON.parse(raw) as Position;
    if(typeof position?.latitude!=='number'||typeof position?.longitude!=='number')return undefined;
    return Date.now()-position.captured_at>REMEMBERED_MAX_AGE?undefined:position;
  }catch{return undefined;}
}

// This is the place the visitor deliberately chose for discovery, not visit evidence.
// It stays until they change or clear it so closing a tab never turns location into a
// repeated onboarding step. Device choices are refreshed whenever the browser supplies
// a better fix; manual choices remain exactly where the visitor selected them.
export function savedSearchLocation():SearchLocationPreference|undefined{
  if(typeof window==='undefined')return undefined;
  try{
    const raw=window.localStorage.getItem(SEARCH_LOCATION);
    if(!raw)return undefined;
    const location=JSON.parse(raw) as SearchLocationPreference;
    if((location?.source!=='device'&&location?.source!=='manual')||!location.label||typeof location.latitude!=='number'||typeof location.longitude!=='number')return undefined;
    return location;
  }catch{return undefined;}
}

export function saveSearchLocation(location:SearchLocationPreference){
  try{window.localStorage.setItem(SEARCH_LOCATION,JSON.stringify(location));}catch{}
}

export function clearSearchLocation(){
  try{window.localStorage.removeItem(SEARCH_LOCATION);}catch{}
}

function remember(position:Position){
  try{window.localStorage.setItem(REMEMBERED,JSON.stringify(position));}catch{}
  const selected=savedSearchLocation();
  if(selected?.source==='device')saveSearchLocation({...selected,latitude:position.latitude,longitude:position.longitude,accuracy_meters:position.accuracy_meters,updated_at:Date.now()});
  window.dispatchEvent(new CustomEvent<Position>(LOCATION_UPDATE_EVENT,{detail:position}));
}

function rememberLive(position:Position){
  recentLivePosition=position;
  remember(position);
  try{
    // This records the user's product choice, not the permission itself. The browser
    // remains the authority and can revoke access at any time. Persisting the choice
    // lets Safari and other browsers without a reliable Permissions API refresh the
    // location silently when Boşa Gezme! is opened again.
    window.localStorage.setItem(LOCATION_ENABLED,'1');
    window.sessionStorage.setItem(LIVE_POSITION,JSON.stringify(position));
  }catch{}
  startLiveWatch();
}

function recentLive():Position|undefined{
  if(!recentLivePosition&&typeof window!=='undefined'){
    try{
      const raw=window.sessionStorage.getItem(LIVE_POSITION);
      if(raw)recentLivePosition=JSON.parse(raw) as Position;
    }catch{}
  }
  if(!recentLivePosition)return undefined;
  if(Date.now()-recentLivePosition.captured_at>RECENT_LIVE_MAX_AGE){recentLivePosition=undefined;return undefined;}
  return recentLivePosition;
}

export function hasDeviceLocationPreference(){
  if(typeof window==='undefined')return false;
  try{return window.localStorage.getItem(LOCATION_ENABLED)==='1';}catch{return false;}
}

// `granted` is safe to use silently. `prompt` must always stay behind the explained
// user action. Safari may report no Permissions API at all, so a previous successful
// in-product choice is the only reliable signal there.
export async function canUseDeviceLocationWithoutPrompt(){
  const permission=await locationPermission();
  return permission==='granted'||(permission==='unknown'&&hasDeviceLocationPreference());
}

// After one deliberate location grant, keep the best device fix warm while the app is
// open and resume it on the next visit. Client-side navigation or closing the tab must
// not turn a permission the user already gave into another step. Browsers pause watchers
// in the background, so verification still requests a fresh fix when the current live
// reading is older than two minutes.
function startLiveWatch(){
  if(typeof navigator==='undefined'||!navigator.geolocation||liveWatch!==undefined)return;
  liveWatch=navigator.geolocation.watchPosition(
    fix=>{
      const position=toPosition(fix);
      recentLivePosition=position;
      remember(position);
      try{window.sessionStorage.setItem(LIVE_POSITION,JSON.stringify(position));}catch{}
    },
    ()=>undefined,
    {enableHighAccuracy:true,maximumAge:30000,timeout:20000},
  );
}

export async function resumeLiveLocationSession(){
  if(await canUseDeviceLocationWithoutPrompt())startLiveWatch();
}

// Each failure gets its own wording, because "permission needed" is actively wrong
// advice when the browser has already blocked us or the device itself is switched off.
export function locationMessage(reason:LocationFailure){
  if(reason==='unsupported')return 'locationUnavailable' as const;
  // Once a geolocation request has returned a permission error, telling the visitor to
  // wait for another prompt is stale advice. Some Safari versions cannot expose the
  // permission state, but the browser/site settings path works for both denied states.
  if(reason==='blocked'||reason==='denied')return 'locationBlocked' as const;
  if(reason==='timeout')return 'locationTimeout' as const;
  if(reason==='inaccurate')return 'verifyAccuracy' as const;
  // The browser was allowed but the operating system returned nothing, which it does
  // when location services are switched off for the browser itself. No amount of
  // retrying inside the page fixes that, so we point at the real setting.
  if(reason==='unavailable')return 'locationDeviceOff' as const;
  return 'locationPermissionNeeded' as const;
}

// A visit proof never uses the persisted discovery point. It may reuse only a live fix
// captured in the last two minutes, otherwise it waits for a new high-accuracy reading.
// Unlike discovery, it does not make a second coarse request: returning an arbitrarily
// broad neighbourhood estimate here only produces a confusing server rejection.
export async function requestVisitPosition():Promise<LocationOutcome>{
  if(typeof navigator==='undefined'||!navigator.geolocation)return {ok:false,reason:'unsupported'};
  const live=recentLive();
  if(live&&typeof live.accuracy_meters==='number'&&live.accuracy_meters<=VISIT.target){
    return {ok:true,position:live,cached:true};
  }
  const blocked=await locationPermission()==='denied';
  try{
    const position=toPosition(await acquire(VISIT));
    if(typeof position.accuracy_meters!=='number'||position.accuracy_meters>VISIT.target){
      return {ok:false,reason:'inaccurate'};
    }
    rememberLive(position);
    return {ok:true,position};
  }catch(error){
    const code=(error as GeolocationPositionError|undefined)?.code;
    if(code===1)return {ok:false,reason:blocked?'blocked':'denied'};
    if(code===3)return {ok:false,reason:'timeout'};
    return {ok:false,reason:'unavailable'};
  }
}

// Browsing may opt into a persisted approximation. Review verification can only opt
// into a live fix captured in this tab within the last two minutes.
export async function requestPosition({allowRemembered=false,allowRecentLive=false}:{allowRemembered?:boolean;allowRecentLive?:boolean}={}):Promise<LocationOutcome>{
  if(typeof navigator==='undefined'||!navigator.geolocation)return {ok:false,reason:'unsupported'};
  if(allowRecentLive){
    const position=recentLive();
    if(position)return {ok:true,position,cached:true};
  }
  const blocked=await locationPermission()==='denied';
  const failure=(error:unknown):LocationFailure=>{
    const code=(error as GeolocationPositionError|undefined)?.code;
    if(code===1)return blocked?'blocked':'denied';
    return code===3?'timeout':'unavailable';
  };
  let reason:LocationFailure;
  try{
    const position=toPosition(await acquire(PRECISE));
    rememberLive(position);
    return {ok:true,position};
  }catch(error){
    reason=failure(error);
    // A refusal would only be refused again, and retrying reads as ignoring the answer.
    if(reason==='denied'||reason==='blocked')return {ok:false,reason};
  }
  try{
    const position=toPosition(await acquire(COARSE));
    rememberLive(position);
    return {ok:true,position};
  }catch(error){
    reason=failure(error);
  }
  if(allowRemembered){
    const previous=rememberedPosition();
    if(previous)return {ok:true,position:previous,cached:true};
  }
  return {ok:false,reason};
}
