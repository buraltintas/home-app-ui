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
export type LocationFailure='unsupported'|'denied'|'blocked'|'unavailable'|'timeout';
export type LocationOutcome={ok:true;position:Position;cached?:boolean}|{ok:false;reason:LocationFailure};

const REMEMBERED='bosagezme:last-location';
const LIVE_SESSION='bosagezme:live-location-session';
const LIVE_POSITION='bosagezme:live-location';
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
    const raw=window.sessionStorage.getItem(REMEMBERED);
    if(!raw)return undefined;
    const position=JSON.parse(raw) as Position;
    if(typeof position?.latitude!=='number'||typeof position?.longitude!=='number')return undefined;
    return Date.now()-position.captured_at>REMEMBERED_MAX_AGE?undefined:position;
  }catch{return undefined;}
}

function remember(position:Position){
  try{
    window.sessionStorage.setItem(REMEMBERED,JSON.stringify(position));
    // Older releases kept this privacy-sensitive hint beyond the browser session.
    // The product promise is now explicit: closing the tab ends the location session.
    window.localStorage.removeItem(REMEMBERED);
  }catch{}
}

function rememberLive(position:Position){
  recentLivePosition=position;
  remember(position);
  try{
    window.sessionStorage.setItem(LIVE_SESSION,'1');
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

export function hasLiveLocationSession(){
  if(typeof window==='undefined')return false;
  try{return window.sessionStorage.getItem(LIVE_SESSION)==='1';}catch{return false;}
}

// After one deliberate location grant, keep the best device fix warm for the rest of
// this tab session. Client-side navigation must not turn a permission the user already
// gave into another step. Browsers pause watchers in a background tab, so verification
// still requests a fresh fix when the remembered live reading is older than two minutes.
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

export function resumeLiveLocationSession(){
  if(hasLiveLocationSession())startLiveWatch();
}

// Each failure gets its own wording, because "permission needed" is actively wrong
// advice when the browser has already blocked us or the device itself is switched off.
export function locationMessage(reason:LocationFailure){
  if(reason==='unsupported')return 'locationUnavailable' as const;
  if(reason==='blocked')return 'locationBlocked' as const;
  if(reason==='timeout')return 'locationTimeout' as const;
  // The browser was allowed but the operating system returned nothing, which it does
  // when location services are switched off for the browser itself. No amount of
  // retrying inside the page fixes that, so we point at the real setting.
  if(reason==='unavailable')return 'locationDeviceOff' as const;
  return 'locationPermissionNeeded' as const;
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
