'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LocateFixed, MapPin, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import type { Coordinates, LocationResult, SearchHistory, SearchResponse, SearchResult } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { localePath ,slogan} from '@/lib/site';
import { apiFetch } from '@/lib/api-client';
import { locationMessage, requestPosition } from '@/lib/location';
import { rememberOriginSearch } from '@/lib/search-origin';
import { RESET_EVENT, SNAPSHOT_KEY } from '@/lib/search-session';
import { categoryLabels, searchExamples } from '@/i18n/dictionaries';
import { Rating } from './Rating';
import { SearchOverlay } from './SearchOverlay';

type SearchPlace={label:string;city?:string;coordinates:Coordinates};
type SearchSnapshot={query:string;location?:SearchPlace;data?:SearchResponse};

// The field carries a whole sentence, so it has to wrap instead of scrolling a long
// placeholder out of sight on a phone. Enter still means search; a search query has
// no use for line breaks.
function growToFit(element:HTMLTextAreaElement|null){
  if(!element)return;
  element.style.height='auto';
  element.style.height=`${element.scrollHeight}px`;
}

// Google photos are streamed through the BFF and never optimised, because caching
// the bytes would breach the Places terms. Stores without a photo get a typographic
// block rather than a stand-in image.
function ResultPhoto({item}:{item:SearchResult}) {
  const {t}=useI18n();
  // A photograph taken by somebody who went there outranks the provider's frame, so the
  // store's own community picture comes first. Behind it: the live provider response, then
  // whatever we already hold -- a store from our own catalogue, every promoted one among
  // them, reaches the list without a live lookup and would otherwise be a blank tile.
  const own=item.own_photo?.media_id;
  const photo=item.google?.photo_name??item.photo?.name;
  if(own)return <div className="result-photo"><Image src={`/api/media/${own}`} width={260} height={195} alt="" unoptimized/></div>;
  if(!photo)return <div className="result-photo result-photo-empty"><span aria-hidden="true">{item.name.trim().charAt(0)}</span><small>{t('noPhoto')}</small></div>;
  const attributions=item.google?.photo_name?item.google.photo_attributions:item.photo?.attributions;
  // The provider requires the credit to travel with the photograph, but a bare personal
  // name under a picture of a shop reads as the shop's name. It is labelled as a credit.
  const credit=attributions?.length?`${t('photoBy')}: ${attributions.join(' · ')}`:t('photoByGoogle');
  return <div className="result-photo"><Image src={`/api/places/photo?name=${encodeURIComponent(photo)}&w=520`} width={260} height={195} alt="" unoptimized/><small className="photo-credit">{credit}</small></div>;
}

// A result normally carries a store id and links to its detail page. One without an id
// cannot be opened, so it stays plain content instead of linking to /stores/undefined.
function Result({item,onSelect}:{item:SearchResult;onSelect:()=>void}) {
  const {t,locale}=useI18n();
  const categoryText=item.categories.map(category=>categoryLabels[locale][category]??category).join(' · ');
  const card=<article className="search-result"><ResultPhoto item={item}/><div><p className="result-category">{categoryText}{item.premium&&<span className="promoted-flag">{t('promoted')}</span>}</p><h2>{item.name}</h2><p className="result-address">{item.address}</p>{item.distance_meters!==undefined&&<p className="distance">{(item.distance_meters/1000).toLocaleString(locale,{maximumFractionDigits:1})} km</p>}{item.platform?<div className="dual-score"><div><span>{t('communityRating')}</span><strong><Rating value={item.platform.average_rating}/></strong><small>{item.platform.review_count} {t('reviews')} · {item.platform.favorite_count} {t('favorites').toLowerCase()}</small></div>{item.google&&<div><span>{t('googleRating')}</span><strong><Rating value={item.google.rating}/></strong><small>{item.google.rating_count} {t('reviews')}</small></div>}</div>:<div className="google-only"><strong>{t('newHere')}</strong><p>{t('firstReview')}</p>{item.google&&<span>{t('googleRating')} <Rating value={item.google.rating}/> · {item.google.rating_count} {t('reviews')}</span>}</div>}</div><ArrowRight aria-hidden="true"/></article>;
  return item.id?<Link href={localePath(locale,`/stores/${item.id}`)} onClick={onSelect}>{card}</Link>:card;
}

export function SearchExperience() {
  const {t,locale}=useI18n();
  const [query,setQuery]=useState('');
  const [data,setData]=useState<SearchResponse>();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [locationOpen,setLocationOpen]=useState(false);
  const [manual,setManual]=useState('');
  const [candidates,setCandidates]=useState<LocationResult[]>([]);
  const [location,setLocation]=useState<SearchPlace>();
  const [restored,setRestored]=useState(false);
  const [history,setHistory]=useState<SearchHistory[]>([]);
  const [rotation,setRotation]=useState(0);
  const field=useRef<HTMLTextAreaElement>(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(snapshot){setQuery(snapshot.query);setLocation(snapshot.location);setData(snapshot.data);}
    // Offering the same three examples on every visit teaches people the product only
    // understands those three.
    setRotation(Math.floor(Math.random()*997));
    setRestored(true);
  },[]);

  // Signed-in visitors get their own last searches back instead of an invented one.
  // Anonymous visitors answer 401 here, which is the normal case and not an error.
  useEffect(()=>{
    let active=true;
    apiFetch('/api/proxy/me/searches?limit=3')
      .then(async response=>response.ok?(await response.json() as {items:SearchHistory[]}).items:[])
      .then(items=>{if(active)setHistory(items);})
      .catch(()=>undefined);
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
    const reset=()=>{setQuery('');setData(undefined);setError('');setLocationOpen(false);setCandidates([]);setManual('');setRotation(Math.floor(Math.random()*997));};
    window.addEventListener(RESET_EVENT,reset);
    return()=>window.removeEventListener(RESET_EVENT,reset);
  },[]);

  // The field grows with whatever ends up in it, including text put there by tapping
  // a suggestion rather than typing.
  useEffect(()=>{growToFit(field.current);},[query]);

  useEffect(()=>{
    if(!locationOpen||manual.trim().length<2)return;
    const controller=new AbortController();
    const timer=window.setTimeout(async()=>{
      try{const response=await apiFetch(`/api/proxy/locations/search?q=${encodeURIComponent(manual.trim())}&limit=5`,{signal:controller.signal,headers:{'X-Locale':locale}});if(!response.ok)throw new Error();const result=await response.json() as {items:LocationResult[]};setCandidates(result.items);}catch(err){if((err as Error).name!=='AbortError')setCandidates([]);}
    },350);
    return()=>{window.clearTimeout(timer);controller.abort();};
  },[locationOpen,manual,locale]);

  // Results are ordered near to far, so a search without a location is not a weaker
  // search but a meaningless one: it cannot tell a store down the road from one in the
  // next province. The location sheet opens instead of running an unusable query, and
  // the query is kept so the visitor returns to it once a place is chosen.
  const runSearch=async(nextQuery=query,nextLocation=location)=>{
    if(nextQuery.trim().length<2)return;
    if(!nextLocation){setQuery(nextQuery);setLocationOpen(true);setError(t('locationRequired'));return;}
    setLoading(true);setError('');
    try{const response=await apiFetch('/api/proxy/search',{method:'POST',headers:{'Content-Type':'application/json','X-Locale':locale},body:JSON.stringify({query:nextQuery.trim(),...(nextLocation?.coordinates??{})})});if(!response.ok)throw await response.json();setData(await response.json() as SearchResponse);}catch{setError(t('searchError'));}finally{setLoading(false);}
  };
  const submit=(event:FormEvent)=>{event.preventDefault();void runSearch();};
  const locateMe=async()=>{
    // Browsing is happy with a recent fix, so a device that cannot answer right now
    // still gets nearby results instead of an error.
    const outcome=await requestPosition({allowRemembered:true});
    // A refused or missing fix is not a failed search. The location sheet stays open so
    // the visitor can pick a place by name and keep going.
    if(!outcome.ok){setError(t(locationMessage(outcome.reason)));return;}
    const selected={label:t('currentLocation'),coordinates:{latitude:outcome.position.latitude,longitude:outcome.position.longitude}};
    setLocation(selected);setLocationOpen(false);setError('');
  };
  const choose=(candidate:LocationResult)=>{const selected={label:candidate.name,city:candidate.name,coordinates:{latitude:candidate.latitude,longitude:candidate.longitude}};setLocation(selected);setLocationOpen(false);};
  const fill=(example:string)=>{setQuery(example);void runSearch(example);};

  // Attribute the visit back to the search so the backend can measure which results
  // actually lead somewhere, and so a later favorite or review keeps the same origin.
  const select=(item:SearchResult)=>{
    if(!data)return;
    rememberOriginSearch({search_id:data.search_id,search_result_id:item.search_result_impression_id});
    void apiFetch(`/api/proxy/searches/${data.search_id}/interactions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({search_result_id:item.search_result_impression_id,event_type:'result_click',idempotency_key:`result_click:${item.search_result_impression_id}`})}).catch(()=>undefined);
  };

  const categories=[t('lighting'),t('furniture'),t('textile'),t('decoration')];
  // City-shaped examples are only offered once a city has actually been chosen, so the
  // product never guesses out loud where someone lives.
  const pool=searchExamples[locale];
  const phrasings=location?.city?[...pool.withCity.map(example=>example.replace('{city}',location.city as string)),...pool.anywhere]:[...pool.anywhere];
  const picks=[0,1,2,3].map(step=>phrasings[(rotation+step)%phrasings.length]);
  const [placeholder,...prompts]=picks;
  return <main className="search-page"><header className="search-hero"><p className="search-slogan" lang="tr">{slogan}</p><div className="search-title"><h1>{t('searchTitle')}</h1><span aria-hidden="true">↗</span></div>{!location&&<p className="location-lead">{t('locationRequired')}</p>}{location&&<div className="location-control"><MapPin aria-hidden="true"/><span>{location.label}</span><button onClick={()=>setLocationOpen(true)} disabled={loading}>{t('change')}</button><button className="location-clear" aria-label={t('clearLocation')} onClick={()=>{setLocation(undefined);setData(undefined);}} disabled={loading}><X/></button></div>}{(locationOpen||!location)&&<section className="location-sheet" aria-label={t('chooseLocation')}>{location&&<div><h2>{t('locationTitle')}</h2><p>{t('locationBenefit')}</p></div>}<div className="location-actions"><button className="button primary" onClick={()=>void locateMe()} disabled={loading}><LocateFixed/>{t('useCurrentLocation')}</button><label><span>{t('chooseLocation')}</span><input value={manual} onChange={event=>setManual(event.target.value)} placeholder={t('locationHint')} disabled={loading}/></label>{error&&<p className="location-error" role="alert">{error}</p>}{location&&<button className="button quiet" onClick={()=>setLocationOpen(false)}>{t('later')}</button>}</div>{manual.trim().length>=2&&<div className="location-results" aria-live="polite">{candidates.length===0?<p>{t('noLocations')}</p>:candidates.map(candidate=><button key={candidate.place_id} onClick={()=>choose(candidate)} disabled={loading}><strong>{candidate.name}</strong><span>{candidate.address}</span><small>{candidate.attributions.join(' · ')}</small></button>)}</div>}</section>}{location&&<form className="search-form" onSubmit={submit} aria-busy={loading}><Search aria-hidden="true"/><textarea ref={field} rows={1} value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();void runSearch();}}} placeholder={placeholder} aria-label={t('searchHint')} disabled={loading}/><button type="submit" disabled={loading}>{loading?t('loading'):t('searchAction')}</button></form>}{!data&&!locationOpen&&!loading&&<div className="search-suggestions"><div><h2>{history.length?t('recent'):t('suggestions')}</h2>{Array.from(new Set(history.length?history.map(entry=>entry.raw_query):prompts)).map(phrase=><button key={phrase} onClick={()=>fill(phrase)}>{phrase} <ArrowRight/></button>)}</div><div><h2>{t('categories')}</h2><div className="category-links">{categories.map(category=><button onClick={()=>fill(category)} key={category}>{category}</button>)}</div></div></div>}</header>{loading&&<SearchOverlay/>}{!loading&&data?.guidance&&<section className="guidance-card"><h2>{data.guidance.message}</h2><div>{data.guidance.examples.map(example=><button key={example} onClick={()=>fill(example)}>{example}<ArrowRight/></button>)}</div></section>}{!loading&&data&&!data.guidance&&<section className="results-layout"><div className="result-list"><p className="result-count">{data.results.length} {t('results')}</p>{data.results.length===0?<div className="zero-state"><h2>{t('zeroTitle')}</h2><p>{t('zeroBody')}</p></div>:data.results.map(item=><Result item={item} key={item.search_result_impression_id} onSelect={()=>select(item)}/>)}</div></section>}</main>;
}
