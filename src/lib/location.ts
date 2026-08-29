// Location is the backbone of this product: a review is only trustworthy because the
// device was near the store. So this module never gives up after one attempt.
//
// Acquisition is layered. We watch rather than take a single reading, because the first
// fix a device emits is often a coarse one that sharpens a second later; a one-shot call
// either takes that coarse value or times out waiting for perfection. Discovery returns
// a safe cached or coarse fix immediately and lets the live watcher sharpen it in the
// background. Visit verification has its own fresh, high-accuracy path below.
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
// A device-selected discovery fix remains valid long enough to open one of its results
// and start a review. Manual locations never enter this path.
const RECENT_DEVICE_VISIT_MAX_AGE=10*60*1000;
let recentLivePosition:Position|undefined;
let liveWatch:number|undefined;

type Attempt={options:PositionOptions;deadline:number;target:number};
// Good enough to place someone on a street, which is all a search needs.
// Indoors a satellite fix may never arrive. A wifi or cell reading still places the
// device in the right neighbourhood, and that beats refusing to answer.
// Six seconds was not long enough. A desktop browser asked for the first time after a
// wake, or one whose network provider is warming up, routinely takes longer than that and
// then reports a timeout -- which we were showing as "your device's location is off", an
// accusation the browser gives us no grounds for. The visitor can always type a place
// instead, so the cost of waiting a little longer is a slower failure, not a worse one.
const DISCOVERY:Attempt={options:{enableHighAccuracy:false,timeout:10000,maximumAge:120000},deadline:10000,target:1500};
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

// Somebody who takes the permission away has withdrawn their consent, and the only honest
// reading of that is that we stop using what it gave us. Nothing here read the device
// again -- the browser would refuse -- but we were still answering from a copy we had kept,
// which looks identical from the outside and is the thing they were trying to stop.
//
// A place they typed themselves is left alone. That was never the device's to give, so
// revoking the device permission says nothing about it.
// Whether a stored device location may still be used. Anything other than a live grant
// means it may not: the person took the permission away, and answering from a copy we kept
// is the thing they were trying to stop. "unknown" is a browser without the Permissions
// API, where there is nothing to check and refusing would break location entirely.
export async function deviceLocationAllowed():Promise<boolean>{
  const state=await locationPermission();
  return state==='granted'||state==='unknown';
}

export function forgetDeviceLocation(){
  try{
    window.localStorage.removeItem(REMEMBERED);
    const selected=savedSearchLocation();
    if(selected?.source==='device')window.localStorage.removeItem(SEARCH_LOCATION);
  }catch{}
}

// Watches for the permission being taken away, and forgets immediately when it is. Called
// on mount as well, because a person may have revoked it in another tab, or yesterday.
export function watchLocationConsent(onForgotten:()=>void):()=>void{
  if(typeof navigator==='undefined'||!navigator.permissions?.query)return()=>undefined;
  let status:PermissionStatus|undefined;
  const check=()=>{
    // Anything other than "granted" means the grant is gone. Watching only for "denied"
    // missed the ordinary case: resetting a site's permission in Chrome puts it back to
    // "ask", not to "denied", so somebody who removed our access kept being located from
    // the copy we had saved. Reported twice from the live site before this was right.
    //
    // Clearing on "prompt" is safe on a first visit too, because there is nothing stored
    // to clear.
    if(!status||status.state==='granted')return;
    forgetDeviceLocation();
    onForgotten();
  };
  let cancelled=false;
  void navigator.permissions.query({name:'geolocation'}).then(result=>{
    if(cancelled)return;
    status=result;
    check();
    result.addEventListener('change',check);
  }).catch(()=>undefined);
  return()=>{cancelled=true;status?.removeEventListener('change',check);};
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
// Fired when a position we were holding can no longer be confirmed by the device. The UI
// drops what it is showing rather than leaving somebody looking at a location the phone
// itself has stopped vouching for.
export const LOCATION_LOST_EVENT='bosagezme:location-lost';

function stopLiveWatch(){
  if(liveWatch===undefined)return;
  navigator.geolocation.clearWatch(liveWatch);
  liveWatch=undefined;
  recentLivePosition=undefined;
  try{window.sessionStorage.removeItem(LIVE_POSITION);}catch{}
}

function startLiveWatch(){
  if(typeof navigator==='undefined'||!navigator.geolocation||liveWatch!==undefined)return;
  liveWatch=navigator.geolocation.watchPosition(
    fix=>{
      const position=toPosition(fix);
      recentLivePosition=position;
      remember(position);
      try{window.sessionStorage.setItem(LIVE_POSITION,JSON.stringify(position));}catch{}
    },
    error=>{
      // This handler used to swallow everything, and that is how a saved position outlived
      // the thing that produced it: turning off the device's location services makes every
      // live read fail, and with the failure ignored the stored copy went on answering as
      // though nothing had happened.
      //
      // A timeout is not evidence of anything -- a fix indoors can simply take too long --
      // so only a refusal or an unavailable device counts. Both mean the position we hold
      // can no longer be confirmed, and an unconfirmable position is not one to answer with.
      if(error?.code===3)return;
      stopLiveWatch();
      forgetDeviceLocation();
      window.dispatchEvent(new Event(LOCATION_LOST_EVENT));
    },
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
  // A timeout says one thing only: no fix arrived in time. It does not say the device is
  // switched off, and telling somebody to go and change a system setting that is already
  // correct wastes their time and makes the product look like it is guessing.
  if(reason==='timeout')return 'locationTimeout' as const;
  if(reason==='inaccurate')return 'verifyAccuracy' as const;
  // The browser was allowed and the operating system still returned nothing. That does
  // happen when location services are off for the browser -- but it also happens when the
  // provider fails for a moment, which looks identical from in here. So the advice leads
  // with what actually works and mentions the setting second, as a possibility rather
  // than as a diagnosis we cannot make.
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
  // Discover has already obtained this fix from the device and the background watcher
  // keeps its timestamp current. Requiring the browser to produce the same coordinates
  // again on the next page created a second permission-looking step and failed on iOS.
  const selected=savedSearchLocation();
  if(selected?.source==='device'&&Date.now()-selected.updated_at<=RECENT_DEVICE_VISIT_MAX_AGE&&typeof selected.accuracy_meters==='number'&&selected.accuracy_meters<=VISIT.target){
    return {ok:true,position:{latitude:selected.latitude,longitude:selected.longitude,accuracy_meters:selected.accuracy_meters,captured_at:selected.updated_at},cached:true};
  }
  const permission=await locationPermission();
  try{
    const position=toPosition(await acquire(VISIT));
    if(typeof position.accuracy_meters!=='number'||position.accuracy_meters>VISIT.target){
      return {ok:false,reason:'inaccurate'};
    }
    rememberLive(position);
    return {ok:true,position};
  }catch(error){
    const code=(error as GeolocationPositionError|undefined)?.code;
    if(code===1)return {ok:false,reason:permission==='denied'?'blocked':permission==='granted'?'unavailable':'denied'};
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
  // Search does not need a fresh GPS lock before it can render. Returning the last
  // successful browser fix first avoids a 15 + 12 second loading state after the user
  // has already granted access. The session watcher refreshes this point and publishes
  // the sharper coordinates through LOCATION_UPDATE_EVENT as soon as they arrive.
  // Consent is checked before the saved copy is offered, not after. The previous attempt
  // put the check in a watcher on one screen, which meant a permission revoked anywhere
  // else went unnoticed and this line answered from storage as though nothing had changed.
  // Guarding at the point of use covers every screen at once, including ones written
  // later, because everything that needs a position comes through here.
  const consent=await locationPermission();
  // A grant that is gone means the saved copy goes with it, whichever way it went: pressing
  // Block leaves the state "denied", resetting the site's permission leaves it "prompt",
  // and both mean the person withdrew what they gave us.
  //
  // But only the copy goes. A "prompt" state is the browser saying it will ask again, so
  // the live attempt below still runs and the person still gets the choice -- refusing here
  // would answer a question they were never asked.
  if(consent==='denied'||consent==='prompt'){
    forgetDeviceLocation();
  }
  if(allowRemembered&&consent!=='denied'&&consent!=='prompt'){
    const previous=rememberedPosition();
    if(previous){startLiveWatch();return {ok:true,position:previous,cached:true};}
  }
  const blocked=consent==='denied';
  const failure=(error:unknown):LocationFailure=>{
    const code=(error as GeolocationPositionError|undefined)?.code;
    if(code===1)return blocked?'blocked':'denied';
    return code===3?'timeout':'unavailable';
  };
  let reason:LocationFailure;
  // A Wi-Fi/cell fix is normally available almost immediately and is sufficient for
  // nearby discovery. Do not stack a second long GPS attempt after this one: the live
  // watcher is already doing that work, while the visitor can choose a place by name.
  try{
    const position=toPosition(await acquire(DISCOVERY));
    rememberLive(position);
    return {ok:true,position};
  }catch(error){
    reason=failure(error);
    // A refusal would only be refused again, and retrying reads as ignoring the answer.
    if(reason==='denied'||reason==='blocked')return {ok:false,reason};
  }
  // "The device has no position" is often "the device had no position a second ago". The
  // system provider can fail for a moment -- waking, changing network, a scan that found
  // nothing -- and the same request a breath later succeeds. Asking the visitor to press
  // the button again to discover that is work we can do for them, once.
  if(reason==='unavailable'){
    await new Promise(resolve=>window.setTimeout(resolve,800));
    try{
      const position=toPosition(await acquire(DISCOVERY));
      rememberLive(position);
      return {ok:true,position};
    }catch(error){
      reason=failure(error);
    }
  }
  return {ok:false,reason};
}
