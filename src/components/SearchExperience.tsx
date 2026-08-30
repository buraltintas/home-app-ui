'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LocateFixed, MapPin, Search, X, Phone} from 'lucide-react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { Coordinates, LocationResult, Me, MonthlyStoreHighlights, SearchHistory, SearchResponse, SearchResult, StoreHighlight } from '@/lib/types';
import { SaveStoreButton } from './SaveStoreButton';
import { useI18n } from '@/i18n/I18nProvider';
import { localePath ,slogan} from '@/lib/site';
import { apiFetch } from '@/lib/api-client';
import type { LocationFailure } from '@/lib/location';
import { LOCATION_LOST_EVENT, deviceLocationAllowed, forgetDeviceLocation, watchLocationConsent, canUseDeviceLocationWithoutPrompt, clearSearchLocation, LOCATION_UPDATE_EVENT, locationMessage, rememberedPosition, requestPosition, savedSearchLocation, saveSearchLocation } from '@/lib/location';
import { seasonalPool } from '@/i18n/search-seasons';
import { rememberOriginSearch } from '@/lib/search-origin';
import { RESET_EVENT, SNAPSHOT_KEY } from '@/lib/search-session';
import { categoryLabels, searchExamples, storeStatusCopy } from '@/i18n/dictionaries';
import { Rating } from './Rating';
import { SearchOverlay } from './SearchOverlay';
import { LocationAlert } from './LocationAlert';
import {mapsLink} from '@/lib/maps';
import {storePhotoURL} from '@/lib/store-photo';
import {CategoryIcon} from './CategoryIcon';

type SearchPlace={source?:'device'|'manual';label:string;city?:string;placeID?:string;address?:string;accuracyMeters?:number;coordinates:Coordinates};
type SearchSnapshot={query:string;location?:SearchPlace;data?:SearchResponse};

function HighlightLink({item,label,metric}:{item:StoreHighlight;label:string;metric:string}){
  const {locale}=useI18n();
  const place=[item.district,item.city].filter(Boolean).join(', ');
  // The photograph comes first, the same one and chosen the same way as in the result
  // list. A store recommended as a name and a number reads like a statistic; with its own
  // picture it reads like a place somebody could walk into.
  const photo=storePhotoURL(item.photo,520);
  return <Link className="store-highlight" href={localePath(locale,`/stores/${item.id}`)}>
    {photo
      ?<Image className="store-highlight-photo" src={photo} width={72} height={72} alt="" unoptimized/>
      :<span className="store-highlight-photo store-highlight-photo-empty" aria-hidden="true">{item.name.trim().charAt(0)}</span>}
    <span className="store-highlight-copy">
      <span>{label}</span>
      <strong>{item.name}</strong>
      {place&&<small className="store-highlight-place">{place}</small>}
      <small className="store-highlight-metric">{metric}</small>
    </span>
    <ArrowRight aria-hidden="true"/>
  </Link>;
}

// The field carries a whole sentence, so it has to wrap instead of scrolling a long
// placeholder out of sight on a phone. Enter still means search; a search query has
// no use for line breaks.
function growToFit(element:HTMLTextAreaElement|null){
  if(!element)return;
  element.style.height='auto';
  let measured=element.scrollHeight;
  // An empty field still has to show the whole of its placeholder. The browser measures
  // from the value, and the value is empty, so a placeholder that wrapped to a second
  // line was drawn outside the box -- where the hidden overflow cut the descenders off
  // the bottom row of letters. Measuring with the placeholder in place is the only way
  // to ask the browser how tall the text it is about to draw actually is.
  if(!element.value&&element.placeholder){
    element.value=element.placeholder;
    element.style.height='auto';
    measured=Math.max(measured,element.scrollHeight);
    element.value='';
    element.style.height='auto';
  }
  // Fractional line-height rounding can leave the last line clipped by a pixel at mobile
  // widths. A tiny buffer keeps both placeholder and typed copy visible.
  element.style.height=`${measured+2}px`;
}

// Google photos are streamed through the BFF and never optimised, because caching
// the bytes would breach the Places terms. Stores without a photo get a typographic
// block rather than a stand-in image.
// Today's line out of the week the provider publishes. Google writes the week starting on
// Monday and a JavaScript weekday starts on Sunday, and the day wanted is the store's own,
// not the reader's -- at 23:00 in Antalya it is already tomorrow in Auckland.
function todaysHours(hours:{descriptions?:string[];utc_offset_minutes:number}):string|undefined{
  if(!hours.descriptions?.length)return undefined;
  const local=new Date(Date.now()+hours.utc_offset_minutes*60000);
  return hours.descriptions[(local.getUTCDay()+6)%7];
}

function ResultPhoto({item}:{item:SearchResult}) {
  const {t}=useI18n();
  // An administrator-selected cover is the store's canonical image. Without one, the live
  // Google result is freshest; a stored Google reference covers internal/promoted results.
  const adminCover=item.photo?.source==='admin'?storePhotoURL(item.photo,520):undefined;
  const liveGoogle=item.google?.photo_name;
  const storedGoogle=item.photo?.source==='google'?storePhotoURL(item.photo,520):undefined;
  const src=adminCover??(liveGoogle?`/api/places/photo?name=${encodeURIComponent(liveGoogle)}&w=520`:undefined)??storedGoogle;
  if(!src)return <div className="result-photo result-photo-empty"><span aria-hidden="true">{item.name.trim().charAt(0)}</span><small>{t('noPhoto')}</small></div>;
  // Search uses a compact thumbnail that opens the full store page. The full-size hero
  // carries the provider's author attribution; repeating a personal name under every
  // result makes the list harder to scan and can be omitted for linked thumbnails.
  return <div className="result-photo"><Image src={src} width={260} height={195} alt="" unoptimized/></div>;
}

// A result normally carries a store id and links to its detail page. One without an id
// cannot be opened, so it stays plain content instead of linking to /stores/undefined.
// A telephone number is dialled by stripping it down to what a dialler understands.
// Everything Google publishes is spaced for reading, and tel: does not read spaces.
const dialable=(phone:string)=>phone.replace(/[^\d+]/g,'');
const isClosedStatus=(status?:string)=>status==='CLOSED_TEMPORARILY'||status==='CLOSED_PERMANENTLY';

function Result({item,onSelect,onCall,saved}:{item:SearchResult;onSelect:()=>void;onCall:()=>void;saved:boolean}) {
  const {t,locale}=useI18n();
  // The API guarantees an array, but this read path stays defensive: one malformed or
  // cached store result must never replace the whole result page with a global error.
  const categoryText=(item.category_labels?.length
    ?item.category_labels
    :(item.categories??[]).map(category=>categoryLabels[locale][category]??category)).join(' · ');
  const card=<article className="search-result"><ResultPhoto item={item}/><div><p className="result-category">{categoryText}{item.premium&&<span className="promoted-flag">{t('promoted')}</span>}</p><h2>{item.name}</h2><p className="result-address">{item.address}</p>{isClosedStatus(item.google?.business_status)&&<p className="store-status-warning">{storeStatusCopy[locale]}</p>}{(()=>{
      const hours=item.google?.opening_hours;
      if(!hours||hours.open_now===undefined)return null;
      const today=todaysHours(hours);
      return <p className="result-hours"><span className={hours.open_now?'is-open':'is-shut'}>{hours.open_now?t('openNow'):t('closedNow')}</span>{today&&<small>{today}</small>}</p>;
    })()}{item.distance_meters!==undefined&&<p className="distance">{(item.distance_meters/1000).toLocaleString(locale,{maximumFractionDigits:1})} km</p>}{/* "Boşa Gezme!'de yeni" used to depend on whether the store was in our catalogue at
       all, which is our bookkeeping and none of the reader's business. It made the badge
       move on its own: a store arriving from the provider showed it, and the same store
       searched again showed "0 reviews · 0 favourites" instead -- because the first search
       had added it to the catalogue. Nothing about the store had changed.
       It now depends on the only thing a reader cares about: whether anybody here has
       reviewed it. The community column keeps its place either way, so the two sources
       stay side by side and comparable, and the badge stops moving. */}
    {(() => {
      const reviewed=(item.platform?.review_count??0)>0;
      return <div className="dual-score"><div><span>{t('communityRating')}</span>{reviewed&&item.platform
        ?<><strong><Rating value={item.platform.average_rating}/></strong><small>{item.platform.review_count} {t('reviews')} · {item.platform.favorite_count} {t('favoriteCount')}</small></>
        :<><strong className="new-here">{t('newHere')}</strong><small>{t('firstReview')}</small>{(item.platform?.favorite_count??0)>0&&<small>{item.platform?.favorite_count} {t('favoriteCount')}</small>}</>}
      </div>{item.google&&<div><span>{t('googleRating')}</span><strong><Rating value={item.google.rating}/></strong><small>{item.google.rating_count} {t('reviews')}</small></div>}</div>;
    })()}</div><ArrowRight aria-hidden="true"/></article>;
  // The call sits outside the link rather than inside it: an anchor cannot contain
  // another anchor, and more to the point, tapping a phone number should place a call,
  // not open a store page on the way there.
  return <div className="result-row">
    {item.id?<Link href={localePath(locale,`/stores/${item.id}`)} onClick={onSelect}>{card}</Link>:card}
    {/* Outside the link, for the same reason the call is: an anchor cannot hold a button,
        and saving a store is not a step on the way to opening it. */}
    {item.id&&<SaveStoreButton storeId={item.id} initialSaved={saved}/>}
    {item.phone&&<a className="result-call" href={`tel:${dialable(item.phone)}`} onClick={onCall}><Phone aria-hidden="true"/><span>{t('callStore')}</span><strong>{item.phone}</strong></a>}
    {/* No directions here. A list is where somebody is still choosing; directions belong
        on the page for the store they chose. This one is different -- it answers "is this
        place real, is it open", which is a question people ask while still deciding. */}
    {item.google?.place_id&&<a className="result-google" href={mapsLink(item.latitude,item.longitude,item.google.place_id)} target="_blank" rel="noopener noreferrer"><MapPin aria-hidden="true"/>{t('seeOnGoogleMaps')}</a>}
  </div>;
}

export function SearchExperience() {
  const {t,locale}=useI18n();
  // Which stores this viewer has already saved. The search response does not carry it, so
  // it is read once from the same place the favourites page reads, and a failure here --
  // including the ordinary one of not being signed in -- leaves every row unsaved rather
  // than breaking the results.
  const [savedStores,setSavedStores]=useState<Set<string>>(new Set());
  useEffect(()=>{
    let active=true;
    void(async()=>{
      try{
        const response=await apiFetch('/api/proxy/me/favorites?limit=100',{cache:'no-store'});
        if(!response.ok)return;
        const body=await response.json() as {items?:{id:string}[]};
        if(active)setSavedStores(new Set((body.items??[]).map(store=>store.id)));
      }catch{/* anonymous browsing is the normal case, not an error */}
    })();
    return()=>{active=false;};
  },[]);
  const [query,setQuery]=useState('');
  const [data,setData]=useState<SearchResponse>();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  // Why the location failed, not just what to say about it. The instruction that helps
  // depends entirely on this: telling somebody to press "Allow" is wrong advice when the
  // browser has already decided never to ask again.
  const [errorReason,setErrorReason]=useState<LocationFailure|''>('');
  const [locationOpen,setLocationOpen]=useState(false);
  const [autoLocating,setAutoLocating]=useState(false);
  const [manual,setManual]=useState('');
  const [candidates,setCandidates]=useState<LocationResult[]>([]);const [lookingUp,setLookingUp]=useState(false);
  const [location,setLocationState]=useState<SearchPlace>();
  const [restored,setRestored]=useState(false);
  // A query carried in from the homepage, waiting for the page to settle before it runs.
  const pending=useRef<string>('');
  const [history,setHistory]=useState<SearchHistory[]>([]);
  const [historyAnswered,setHistoryAnswered]=useState(false);
  const [rotation,setRotation]=useState(0);
  const field=useRef<HTMLTextAreaElement>(null);
  const searchSequence=useRef(0);
  const searchAbort=useRef<AbortController|null>(null);

  useEffect(()=>()=>searchAbort.current?.abort(),[]);

  const setLocation=useCallback((selected:SearchPlace|undefined)=>{
    if(!selected){
      clearSearchLocation();
      void apiFetch('/api/proxy/me/discovery-location',{method:'DELETE'}).catch(()=>undefined);
    }
    setLocationState(selected);
  },[]);

  const selectLocation=useCallback((selected:SearchPlace)=>{
    setLocationState(selected);
    saveSearchLocation({
      source:selected.source??'device',label:selected.label,city:selected.city,place_id:selected.placeID,address:selected.address,
      latitude:selected.coordinates.latitude,longitude:selected.coordinates.longitude,accuracy_meters:selected.accuracyMeters,updated_at:Date.now(),
    });
    // Anonymous discovery remains fully functional. Signed-in visitors additionally get
    // the same private preference on another device; a 401 or a coarse device fix is not
    // allowed to interrupt the search they just asked for.
    const body=selected.source==='manual'
      ?{source:'manual',place_id:selected.placeID}
      :{source:'device',latitude:selected.coordinates.latitude,longitude:selected.coordinates.longitude,accuracy_meters:selected.accuracyMeters};
    if(selected.source==='manual'||(selected.accuracyMeters!==undefined&&selected.accuracyMeters<=1000)){
      void apiFetch('/api/proxy/me/discovery-location',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).catch(()=>undefined);
    }
  },[]);

  // Keep a device-selected discovery point current for the whole browser session. A
  // manual place is never overwritten by the device until the visitor explicitly picks
  // “use current location” again.
  useEffect(()=>{
    const update=(event:Event)=>{
      const position=(event as CustomEvent<{latitude:number;longitude:number;accuracy_meters?:number}>).detail;
      const selected=savedSearchLocation();
      if(selected?.source!=='device')return;
      setLocationState(current=>current?.source==='device'?{...current,accuracyMeters:position.accuracy_meters,coordinates:{latitude:position.latitude,longitude:position.longitude}}:current);
      if(position.accuracy_meters!==undefined&&position.accuracy_meters<=1000){
        void apiFetch('/api/proxy/me/discovery-location',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({source:'device',latitude:position.latitude,longitude:position.longitude,accuracy_meters:position.accuracy_meters})}).catch(()=>undefined);
      }
    };
    window.addEventListener(LOCATION_UPDATE_EVENT,update);
    return()=>window.removeEventListener(LOCATION_UPDATE_EVENT,update);
  },[]);

  // Opening a result and coming back must not throw the results away. The snapshot is
  // per tab and only holds what the user already typed and already received.
  //
  // These assignments have to happen after hydration rather than during render: the
  // server has no sessionStorage and must not guess the rotation, so applying either one
  // while rendering would make the server and client markup disagree. That is exactly
  // what the rule below forbids, and it is the one case where the effect is the correct
  // tool, so it is silenced here and nowhere else.
  useEffect(()=>{
    let snapshot:SearchSnapshot|undefined;
    try{const raw=sessionStorage.getItem(SNAPSHOT_KEY);if(raw)snapshot=JSON.parse(raw) as SearchSnapshot;}catch{}
    // Someone who typed on the homepage arrives with their words in the address bar. Those
    // win over whatever the last visit left behind -- they were written a second ago, and
    // the results from before are about something else.
    const asked=new URLSearchParams(window.location.search).get('q')?.trim();
    const saved=savedSearchLocation();
    const persisted=saved?{source:saved.source,label:saved.label,city:saved.city,placeID:saved.place_id,address:saved.address,accuracyMeters:saved.accuracy_meters,coordinates:{latitude:saved.latitude,longitude:saved.longitude}} satisfies SearchPlace:undefined;
    // ...but only while they are still the newest thing here. The address bar is written
    // once, on the way in from the homepage, and every search made on this page since
    // then has left it untouched. So coming back from a store page found a query from
    // three searches ago sitting in the URL, ran it again, and threw away the results the
    // visitor was actually looking at. Reported from the live site: searched "yastık",
    // opened a store, pressed back, and landed in "perde".
    //
    // The snapshot wins when it answers the same question the address bar is asking,
    // which also spares a refetch of results we already hold.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(asked&&asked!==snapshot?.query){setQuery(asked);const initial=snapshot?.location??persisted;if(initial)setLocation(initial);pending.current=asked;}
    else if(snapshot){setQuery(snapshot.query);const initial=snapshot.location??persisted;if(initial)setLocation(initial);setData(snapshot.data);}
    else if(persisted)setLocation(persisted);
    // Offering the same three examples on every visit teaches people the product only
    // understands those three.
    setRotation(Math.floor(Math.random()*997));
    setRestored(true);
  },[setLocation]);

  // Local storage gives the fastest return path. The private profile is the cross-device
  // fallback for signed-in visitors and only fills the gap when this browser has no
  // explicit choice of its own.
  useEffect(()=>{
    if(!restored||savedSearchLocation())return;
    let active=true;
    apiFetch('/api/proxy/me',{cache:'no-store'})
      .then(async response=>response.ok?await response.json() as Me:undefined)
      .then(me=>{
        const saved=me?.discovery_location;
        if(!active||!saved)return;
        const selected:SearchPlace={source:saved.source,label:saved.label||t('currentLocation'),city:saved.source==='manual'?saved.label:undefined,placeID:saved.place_id,address:saved.address,accuracyMeters:saved.accuracy_meters,coordinates:{latitude:saved.latitude,longitude:saved.longitude}};
        saveSearchLocation({source:saved.source,label:selected.label,city:selected.city,place_id:saved.place_id,address:saved.address,latitude:saved.latitude,longitude:saved.longitude,accuracy_meters:saved.accuracy_meters,updated_at:Date.parse(saved.updated_at)||Date.now()});
        setLocationState(current=>current??selected);
      })
      .catch(()=>undefined);
    return()=>{active=false;};
  },[restored,t]);

  // Signed-in visitors get their own last searches back instead of an invented one.
  // Anonymous visitors answer 401 here, which is the normal case and not an error.
  useEffect(()=>{
    let active=true;
    apiFetch('/api/proxy/me/searches?limit=3')
      .then(async response=>response.ok?(await response.json() as {items:SearchHistory[]}).items:[])
      .then(items=>{if(active){setHistory(items);setHistoryAnswered(true);}})
      // A refusal is an answer too. What matters here is that the question has been
      // settled, because the strip below must not choose a heading before it has been.
      .catch(()=>{if(active)setHistoryAnswered(true);});
    return()=>{active=false;};
  },[]);

  useEffect(()=>{
    if(!restored)return;
    try{
      if(data)sessionStorage.setItem(SNAPSHOT_KEY,JSON.stringify({query,location,data} satisfies SearchSnapshot));
      else sessionStorage.removeItem(SNAPSHOT_KEY);
    }catch{}
  },[restored,query,location,data]);

  // Reaching this page from the navigation is a request to start over, while coming
  // back from a store detail is not. The header clears the snapshot and announces the
  // reset, which also covers pressing the link while already standing on this page.
  // The chosen location survives, because asking for it again on every visit is the
  // one thing that makes the whole search useless.
  useEffect(()=>{
    const reset=()=>{setQuery('');setData(undefined);setError('');setLocationOpen(false);setCandidates([]);setLookingUp(false);setManual('');setRotation(Math.floor(Math.random()*997));};
    window.addEventListener(RESET_EVENT,reset);
    return()=>window.removeEventListener(RESET_EVENT,reset);
  },[]);

  // The field grows with whatever ends up in it, including text put there by tapping
  // a suggestion rather than typing.
  useEffect(()=>{growToFit(field.current);},[query]);

  // The panel is open either because it was asked for or because there is no location
  // yet. Gating this on the first case alone left the field on screen with nothing behind
  // it: a visitor could type a district and never get a single candidate back.
  const sheetOpen=locationOpen||!location;
  useEffect(()=>{
    if(!sheetOpen||manual.trim().length<2)return;
    const controller=new AbortController();
    const timer=window.setTimeout(async()=>{setLookingUp(true);
      // Any idea of where this person is makes the list dramatically better: without one,
      // typing "bostanl" in Antalya offers the Bostanlı in Afyonkarahisar, because the
      // provider falls back to ranking by fame. A remembered fix is enough of a hint, and
      // it is only ever a hint -- the point searched is resolved from the place picked.
      const near=location?.coordinates??rememberedPosition();
      const bias=near?`&latitude=${near.latitude}&longitude=${near.longitude}`:'';
      try{const response=await apiFetch(`/api/proxy/locations/search?q=${encodeURIComponent(manual.trim())}&limit=5${bias}`,{signal:controller.signal,headers:{'X-Locale':locale}});if(!response.ok)throw new Error();const result=await response.json() as {items:LocationResult[]};setCandidates(result.items);setLookingUp(false);}catch(err){if((err as Error).name!=='AbortError')setCandidates([]);}
    },350);
    return()=>{window.clearTimeout(timer);controller.abort();};
  },[sheetOpen,manual,locale,location]);

  // Taking the permission away has to mean something. Until now it did not: the browser
  // stopped answering, but we kept answering from a copy we had saved -- which from the
  // outside is indistinguishable from still tracking somebody who asked us to stop.
  // Checked on every mount, not only when the browser reports a change. A permission taken
  // away while this screen was closed produces no event to hear, and a saved device
  // location would otherwise be restored as though the grant were still there.
  useEffect(()=>{
    let active=true;
    void deviceLocationAllowed().then(allowed=>{
      if(!active||allowed)return;
      const saved=savedSearchLocation();
      if(!saved||saved.source!=='device')return;
      forgetDeviceLocation();
      setLocation(undefined);
      setData(undefined);
    });
    return()=>{active=false;};
  },[setLocation]);

  // The device stopped vouching for the position we were showing -- its location services
  // went off, or the browser withdrew access mid-session. Either way what is on screen is
  // no longer something we can stand behind, so it goes.
  useEffect(()=>{
    const lost=()=>{setLocation(undefined);setData(undefined);};
    window.addEventListener(LOCATION_LOST_EVENT,lost);
    return()=>window.removeEventListener(LOCATION_LOST_EVENT,lost);
  },[setLocation]);

  useEffect(()=>watchLocationConsent(()=>{
    setLocation(undefined);
    setData(undefined);
    setLocationOpen(true);
  }),[setLocation]);

  // A browser that has already been granted permission does not need to be asked again,
  // so the fix is taken as soon as the page settles and the visitor simply arrives with
  // a location. It stays visible while it happens -- an interface that quietly rewrites
  // itself a second after load is worse than one that says what it is doing. Nothing is
  // prompted here: an unanswered or refused permission still waits for a deliberate tap.
  useEffect(()=>{
    if(!restored||location)return;
    let active=true;
    void (async()=>{
      if(!await canUseDeviceLocationWithoutPrompt())return;
      if(!active)return;
      setAutoLocating(true);
      const outcome=await requestPosition({allowRemembered:true});
      if(!active)return;
      setAutoLocating(false);
      if(outcome.ok){
        selectLocation({source:'device',label:t('currentLocation'),accuracyMeters:outcome.position.accuracy_meters,coordinates:{latitude:outcome.position.latitude,longitude:outcome.position.longitude}});
        setLocationOpen(false);
        setError('');
      }
    })();
    return()=>{active=false;};
  },[restored,location,t,selectLocation]);

  // Results are ordered near to far, so a search without a location is not a weaker
  // search but a meaningless one: it cannot tell a store down the road from one in the
  // next province. The location sheet opens instead of running an unusable query, and
  // the query is kept so the visitor returns to it once a place is chosen.
  const runSearch=async(nextQuery=query,nextLocation=location)=>{
    if(nextQuery.trim().length<2)return;
    if(!nextLocation){
      // Keep the search waiting while an already-authorised device fix arrives. The
      // location effect below resumes it automatically, so permission is not exposed
      // as another user step. This also makes a manually picked place continue the
      // query without requiring a second press of Search.
      pending.current=nextQuery;
      setQuery(nextQuery);setLocationOpen(true);setError(t('locationRequired'));return;
    }
    // A search on this page is now written into the address bar, so the URL never falls
    // behind what is on screen: a refresh repeats the search that is showing, a link can
    // be sent to somebody, and coming back from a store returns to the query that was
    // open rather than to whichever one happened to arrive from the homepage. Replaced
    // rather than pushed -- back means "leave the search", not "walk through every
    // wording I tried".
    try{
      const url=new URL(window.location.href);
      url.searchParams.set('q',nextQuery.trim());
      window.history.replaceState(window.history.state,'',url);
    }catch{}
    searchAbort.current?.abort();
    const controller=new AbortController();
    searchAbort.current=controller;
    const sequence=++searchSequence.current;
    // Old results are about the old words. Clear them at the request boundary and only
    // let the newest response settle state, so a slower earlier search cannot overwrite
    // a correction the visitor typed immediately afterwards.
    setLoading(true);setError('');setData(undefined);
    try{
      const response=await apiFetch('/api/proxy/search',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json','X-Locale':locale},body:JSON.stringify({query:nextQuery.trim(),...(nextLocation?.coordinates??{})})});
      if(!response.ok)throw await response.json();
      const responseData=await response.json() as SearchResponse;
      if(sequence===searchSequence.current)setData(responseData);
    }catch(reason){
      if(sequence===searchSequence.current&&(reason as Error)?.name!=='AbortError')setError(t('searchError'));
    }finally{
      if(sequence===searchSequence.current)setLoading(false);
    }
  };
  const submit=(event:FormEvent)=>{event.preventDefault();void runSearch();};

  useEffect(()=>{
    if(!restored||!pending.current||!location)return;
    const asked=pending.current;
    pending.current='';
    // The query waits above until either the already-authorised device fix arrives or
    // the visitor deliberately chooses a place. In both cases it resumes by itself.
    void runSearch(asked,location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[restored,location]);

  const locateMe=async()=>{
    // Browsing is happy with a recent fix, so a device that cannot answer right now
    // still gets nearby results instead of an error.
    setAutoLocating(true);setError('');setErrorReason('');
    const outcome=await requestPosition({allowRemembered:true,allowRecentLive:true});
    setAutoLocating(false);
    // A refused or missing fix is not a failed search. The location sheet stays open so
    // the visitor can pick a place by name and keep going.
    if(!outcome.ok){setError(t(locationMessage(outcome.reason)));setErrorReason(outcome.reason);return;}
    const selected:SearchPlace={source:'device',label:t('currentLocation'),accuracyMeters:outcome.position.accuracy_meters,coordinates:{latitude:outcome.position.latitude,longitude:outcome.position.longitude}};
    selectLocation(selected);setLocationOpen(false);setError('');setErrorReason('');
  };
  // The list carries no coordinates -- a prediction has none, and a point we search
  // around should be fetched from the provider rather than taken from the page. So the
  // chosen place is resolved first, and only a resolved one is ever set.
  const choose=async(candidate:LocationResult)=>{
    setError('');
    try{
      const response=await apiFetch(`/api/proxy/locations/resolve?place_id=${encodeURIComponent(candidate.place_id)}`,{headers:{'X-Locale':locale}});
      if(!response.ok)throw new Error();
      const place=await response.json() as LocationResult;
      selectLocation({source:'manual',label:place.name,city:place.name,placeID:place.place_id,address:place.address,coordinates:{latitude:place.latitude,longitude:place.longitude}});
      setLocationOpen(false);
    }catch{setError(t('locationResolveError'));}
  };
  const fill=(example:string)=>{setQuery(example);void runSearch(example);};

  // Attribute the visit back to the search so the backend can measure which results
  // actually lead somewhere, and so a later favorite or review keeps the same origin.
  // A call placed from the list is the moment the product replaces the trip to Google, so
  // it is recorded as its own kind of interaction. It is fire-and-forget: the dialler is
  // already opening and must not wait for us.
  const call=(item:SearchResult)=>{
    if(!data)return;
    void apiFetch(`/api/proxy/searches/${data.search_id}/interactions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({search_result_id:item.search_result_impression_id,event_type:'call_click',idempotency_key:`call_click:${item.search_result_impression_id}`})}).catch(()=>undefined);
  };

  const select=(item:SearchResult)=>{
    if(!data)return;
    rememberOriginSearch({search_id:data.search_id,search_result_id:item.search_result_impression_id});
    void apiFetch(`/api/proxy/searches/${data.search_id}/interactions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({search_result_id:item.search_result_impression_id,event_type:'result_click',idempotency_key:`result_click:${item.search_result_impression_id}`})}).catch(()=>undefined);
  };

  // What people around here have actually looked for. It needs a location to mean
  // anything, so it is read once one exists and cleared when it changes.
  // Answers are tagged with the place and language they were fetched for, so a list read
  // for a previous location is never shown beside a new one.
  const [nearby,setNearby]=useState<{key:string;items:string[]}>({key:'',items:[]});
  const point=location?.coordinates;
  // Rounded to about a kilometre. The live watcher keeps sharpening the device fix, and
  // every refinement -- five metres of it -- used to change this key, which asked the
  // question again and blanked the strip while it waited. That is what people saw as
  // suggestions appearing and disappearing by themselves. Nobody moves neighbourhood by
  // standing still, so the question is the same question.
  const coarse=(v:number)=>(Math.round(v*100)/100).toFixed(2);
  const nearbyKey=point?`${coarse(point.latitude)},${coarse(point.longitude)},${locale}`:'';
  useEffect(()=>{
    if(!nearbyKey)return;
    const [latitude,longitude]=nearbyKey.split(',');
    let active=true;
    apiFetch(`/api/proxy/search/suggestions?latitude=${latitude}&longitude=${longitude}`,{headers:{'X-Locale':locale}})
      .then(async response=>response.ok?(await response.json() as {items:{query:string}[]}).items??[]:[])
      // A quiet neighbourhood has nothing to report yet, and neither does a web release
      // that lands before the API one. Both fall through to the seasonal list.
      .then(items=>{if(active)setNearby({key:nearbyKey,items:items.map(item=>item.query)});})
      .catch(()=>{if(active)setNearby({key:nearbyKey,items:[]});});
    return()=>{active=false;};
  },[nearbyKey,locale]);
  // While a new neighbourhood is being asked about, the previous answer stays on screen
  // rather than collapsing to a loading state. These are suggestions, not results: a list
  // that is a moment out of date is worth far more than a list that blinks.
  const nearbyPhrases=nearbyKey?nearby.items:[];
  // Without a location the neighbourhood is never asked, which counts as answered. With
  // one, it counts as answered as soon as it has ever answered.
  const nearbyAnswered=!nearbyKey||nearby.key!=='';

  const [categories,setCategories]=useState<{slug:string;name:string;search_count:number}[]>([]);
  // Built inside the effect so it is recomputed with the locale it belongs to, rather than
  // becoming a dependency that changes on every render.
  useEffect(()=>{
    const fallbackCategories=['lighting','furniture','home_textile','decoration'].map(slug=>({slug,name:categoryLabels[locale][slug]}));
    let active=true;
    apiFetch('/api/proxy/categories',{headers:{'X-Locale':locale}})
      .then(async response=>response.ok?(await response.json() as {items:{slug:string;name:string;search_count:number}[]}).items??[]:[])
      // The section never goes empty: if the catalogue cannot be reached -- an outage, or a
      // web release that lands before the API one -- it falls back to the four it used to
      // carry, without counts, because a count we did not fetch is not a count.
      .then(items=>{if(active)setCategories(items.length?items:fallbackCategories.map(category=>({...category,search_count:0})));})
      .catch(()=>{if(active)setCategories(fallbackCategories.map(category=>({...category,search_count:0})));});
    return()=>{active=false;};
  },[locale,t]);

  const [highlights,setHighlights]=useState<MonthlyStoreHighlights>({});
  useEffect(()=>{
    let active=true;
    apiFetch('/api/proxy/search/highlights',{headers:{'X-Locale':locale}})
      .then(async response=>response.ok?await response.json() as MonthlyStoreHighlights:{})
      // Highlights are an enhancement to the search prompts. If the API is older or
      // unavailable, the core search remains complete and no empty heading is shown.
      .then(items=>{if(active)setHighlights(items);})
      .catch(()=>{if(active)setHighlights({});});
    return()=>{active=false;};
  },[locale]);
  // City-shaped examples are only offered once a city has actually been chosen, so the
  // product never guesses out loud where someone lives.
  const pool=searchExamples[locale];
  const phrasings=location?.city?[...pool.withCity.map(example=>example.replace('{city}',location.city as string)),...pool.anywhere]:[...pool.anywhere];
  const picks=[0,1,2,3].map(step=>phrasings[(rotation+step)%phrasings.length]);
  const [placeholder]=picks;
  // The placeholder decides the height of an empty field, and it changes: a new one is
  // drawn each visit, and the width it has to wrap into changes when the window does.
  useEffect(()=>{
    const fit=()=>growToFit(field.current);
    fit();
    window.addEventListener('resize',fit);
    return()=>window.removeEventListener('resize',fit);
  },[placeholder]);
  // Three sources, in order of how much they are worth: what this visitor searched
  // before, what people around them searched, and -- when neither exists yet -- a pool
  // of about fifty phrases for the season we are in. The strip is offset by a number
  // drawn once per visit, so it is a different six each time rather than the same six
  // forever.
  // The heading names where these phrases came from, so it can only be chosen once both
  // sources have answered. They arrive over the network and the seasonal list does not, so
  // choosing early meant showing "Bu mevsim akla gelenler" and then swapping it for "Son
  // aramalar" under the reader -- a heading changing by itself, with nothing they did to
  // cause it. The three sources are right; the timing was not.
  const suggestionsAnswered=historyAnswered&&nearbyAnswered;
  const strip=history.length?{title:t('recent'),phrases:history.map(entry=>entry.raw_query)}
    :nearbyPhrases.length?{title:t('nearbySearches'),phrases:nearbyPhrases}
    :{title:t('seasonalSuggestions'),phrases:seasonalPool(locale)};
  const stripPhrases=Array.from(new Set(strip.phrases));
  const prompts=stripPhrases.length<=6?stripPhrases:[0,1,2,3,4,5].map(step=>stripPhrases[(rotation+step)%stripPhrases.length]);
  const showHighlights=Boolean(highlights.rating_gainer||highlights.most_reviewed);
  return <main className="search-page"><header className="search-hero"><p className="search-slogan" lang="tr">{slogan}</p><div className="search-title"><h1>{t('searchTitle')}</h1><span aria-hidden="true">↗</span></div>{!location&&<p className="location-lead">{t('locationRequired')}</p>}{location&&<div className="location-control"><MapPin aria-hidden="true"/><span>{location.label}</span><button onClick={()=>setLocationOpen(true)} disabled={loading}>{t('change')}</button><button className="location-clear" aria-label={t('clearLocation')} onClick={()=>{setLocation(undefined);setData(undefined);}} disabled={loading}><X/></button></div>}{sheetOpen&&<section className="location-sheet" aria-label={t('chooseLocation')}>{error&&<LocationAlert message={error} reason={errorReason} onRetry={()=>void locateMe()} busy={autoLocating}/>}{location&&<div><h2>{t('locationTitle')}</h2><p>{t('locationBenefit')}</p></div>}<div className="location-actions">{autoLocating&&<p className="location-working" aria-live="polite"><span className="location-pulse" aria-hidden="true"/>{t('locatingYou')}</p>}<button className="button primary" onClick={()=>void locateMe()} disabled={loading||autoLocating} aria-busy={autoLocating}><LocateFixed/>{t('useCurrentLocation')}</button><label><span>{t('chooseLocation')}</span><input value={manual} onChange={event=>setManual(event.target.value)} placeholder={t('locationHint')} disabled={loading}/></label>{location&&<button className="button quiet" onClick={()=>setLocationOpen(false)}>{t('later')}</button>}</div>{manual.trim().length>=2&&<div className="location-results" aria-live="polite">{lookingUp?<p>{t('searchingLocations')}</p>:candidates.length===0?<p>{t('noLocations')}</p>:candidates.map(candidate=><button key={candidate.place_id} onClick={()=>void choose(candidate)} disabled={loading}><strong>{candidate.name}</strong><span>{candidate.address}</span><small>{candidate.attributions.join(' · ')}</small></button>)}</div>}</section>}{location&&<form className="search-form" onSubmit={submit} aria-busy={loading}><Search aria-hidden="true"/><div className="search-field"><textarea ref={field} rows={1} value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();void runSearch();}}} placeholder={placeholder} aria-label={t('searchHint')} disabled={loading}/>{query&&!loading&&<button type="button" className="search-clear" onClick={()=>{setQuery('');field.current?.focus();}} aria-label={t('clearSearch')}><X aria-hidden="true"/></button>}</div><button type="submit" disabled={loading}>{loading?t('loading'):t('searchAction')}</button></form>}{!data&&!locationOpen&&!loading&&<><div className="search-suggestions"><div>{suggestionsAnswered?<><h2>{strip.title}</h2>{prompts.map(phrase=><button key={phrase} onClick={()=>fill(phrase)}>{phrase} <ArrowRight/></button>)}</>:<div className="suggestions-waiting" aria-busy="true" aria-label={t('loading')}><span/><span/><span/><span/></div>}</div><div><h2>{t('categories')}</h2><div className="category-links">{categories.map(category=><button onClick={()=>fill(category.name)} key={category.slug}><CategoryIcon slug={category.slug}/><span>{category.name}{category.search_count>0&&<small title={t('searchCount')}>{category.search_count.toLocaleString(locale)} {t('searchCountShort')}</small>}</span></button>)}</div></div></div>{showHighlights&&<section className="store-highlights" aria-labelledby="store-highlights-title"><h2 id="store-highlights-title">{t('monthlyStandouts')}</h2><div>{highlights.rating_gainer&&<HighlightLink item={highlights.rating_gainer} label={t('mostImproved')} metric={`+${(highlights.rating_gainer.rating_increase??0).toLocaleString(locale,{maximumFractionDigits:2})} ${t('ratingIncrease')}`}/>} {highlights.most_reviewed&&<HighlightLink item={highlights.most_reviewed} label={t('mostReviewed')} metric={`${highlights.most_reviewed.recent_review_count.toLocaleString(locale)} ${t('reviewsThisMonth')}`}/>}</div></section>}</>}</header>{loading&&<SearchOverlay/>}{!loading&&data?.guidance&&<section className="guidance-card"><h2>{data.guidance.message}</h2><div>{data.guidance.examples.map(example=><button key={example} onClick={()=>fill(example)}>{example}<ArrowRight/></button>)}</div></section>}{!loading&&data&&!data.guidance&&<section className="results-layout"><div className="result-list"><p className="result-count">{data.results.length} {t('results')}</p>{data.results.length===0?<div className="zero-state"><h2>{t('zeroTitle')}</h2><p>{t('zeroBody')}</p></div>:data.results.map(item=><Result item={item} key={item.search_result_impression_id} onSelect={()=>select(item)} onCall={()=>call(item)} saved={savedStores.has(item.id??'')}/>)}</div></section>}</main>;
}
