'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LocateFixed, MapPin, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import type { Coordinates, LocationResult, SearchResponse, SearchResult } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Rating } from './Rating';
import { AuthDialog } from './AuthDialog';

function Result({item,index,onAuth}:{item:SearchResult;index:number;onAuth:()=>void}) {
  const {t,locale}=useI18n();
  const body=<article className="search-result"><Image src={index===0?'/images/store-detail.jpg':'/images/store-lighting.jpg'} width={260} height={195} alt={`Interior at ${item.name}`}/><div><p className="result-category">{item.categories.join(' · ')}</p><h2>{item.name}</h2><p className="result-address">{item.address}</p>{item.distance_meters!==undefined&&<p className="distance">{(item.distance_meters/1000).toLocaleString(locale,{maximumFractionDigits:1})} km</p>}{item.platform?<div className="dual-score"><div><span>{t('communityRating')}</span><strong><Rating value={item.platform.average_rating}/></strong><small>{item.platform.review_count} {t('reviews')} · {item.platform.favorite_count} {t('favorites').toLowerCase()}</small></div>{item.google&&<div><span>{t('googleRating')}</span><strong><Rating value={item.google.rating}/></strong><small>{item.google.rating_count} {t('reviews')}</small></div>}</div>:<div className="google-only"><strong>{t('noCommunity')}</strong><p>{t('firstReview')}</p><span>{t('googleRating')} <Rating value={item.google?.rating??0}/> · {item.google?.rating_count} {t('reviews')}</span></div>}</div><ArrowRight aria-hidden="true"/></article>;
  return item.id?<Link href={`/stores/${item.id}`}>{body}</Link>:<button className="result-button" onClick={onAuth}>{body}</button>;
}

export function SearchExperience() {
  const {t,locale}=useI18n();
  const [query,setQuery]=useState('');
  const [data,setData]=useState<SearchResponse>();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [auth,setAuth]=useState(false);
  const [locationOpen,setLocationOpen]=useState(false);
  const [manual,setManual]=useState('');
  const [candidates,setCandidates]=useState<LocationResult[]>([]);
  const [location,setLocation]=useState<{label:string;coordinates:Coordinates}>();

  useEffect(()=>{
    if(!locationOpen||manual.trim().length<2)return;
    const controller=new AbortController();
    const timer=window.setTimeout(async()=>{
      try{const response=await fetch(`/api/proxy/locations/search?q=${encodeURIComponent(manual.trim())}&limit=5`,{signal:controller.signal,headers:{'X-Locale':locale}});if(!response.ok)throw new Error();const result=await response.json() as {items:LocationResult[]};setCandidates(result.items);}catch(err){if((err as Error).name!=='AbortError')setCandidates([]);}
    },350);
    return()=>{window.clearTimeout(timer);controller.abort();};
  },[locationOpen,manual,locale]);

  const runSearch=async(nextQuery=query,nextLocation=location)=>{
    if(nextQuery.trim().length<2)return;
    setLoading(true);setError('');
    try{const response=await fetch('/api/proxy/search',{method:'POST',headers:{'Content-Type':'application/json','X-Locale':locale},body:JSON.stringify({query:nextQuery.trim(),...(nextLocation?.coordinates??{})})});if(!response.ok)throw await response.json();setData(await response.json() as SearchResponse);}catch{setError(t('searchError'));}finally{setLoading(false);}
  };
  const submit=(event:FormEvent)=>{event.preventDefault();void runSearch();};
  const useCurrent=()=>{
    if(!navigator.geolocation){setError(t('locationUnavailable'));return;}
    navigator.geolocation.getCurrentPosition(({coords})=>{const selected={label:t('currentLocation'),coordinates:{latitude:coords.latitude,longitude:coords.longitude}};setLocation(selected);setLocationOpen(false);void runSearch(query||t('nearby'),selected);},()=>setError(t('locationDenied')),{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  };
  const choose=(candidate:LocationResult)=>{const selected={label:candidate.name,coordinates:{latitude:candidate.latitude,longitude:candidate.longitude}};setLocation(selected);setLocationOpen(false);void runSearch(query||t('nearby'),selected);};
  const categories=[t('lighting'),t('furniture'),t('textile'),t('decoration')];

  return <main className="search-page"><header className="search-hero"><p className="eyebrow">{t('discover')}</p><h1>{t('searchTitle')}</h1><form className="search-form" onSubmit={submit}><Search aria-hidden="true"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t('searchHint')} aria-label={t('searchHint')}/><button type="submit" disabled={loading}>{loading?t('loading'):t('searchAction')}</button></form><div className="location-control">{location?<><MapPin aria-hidden="true"/><span>{location.label}</span><button onClick={()=>setLocationOpen(true)}>{t('change')}</button><button aria-label={t('clearLocation')} onClick={()=>{setLocation(undefined);setData(undefined);}}><X/></button></>:<button className="nearby-button" onClick={()=>setLocationOpen(true)}><MapPin/>{t('nearby')}</button>}</div>{locationOpen&&<section className="location-sheet" aria-label={t('chooseLocation')}><div><h2>{t('locationTitle')}</h2><p>{t('locationBenefit')}</p></div><div className="location-actions"><button className="button primary" onClick={useCurrent}><LocateFixed/>{t('useCurrentLocation')}</button><label><span>{t('chooseLocation')}</span><input value={manual} onChange={event=>setManual(event.target.value)} placeholder={t('locationHint')}/></label><button className="button quiet" onClick={()=>setLocationOpen(false)}>{t('later')}</button></div>{manual.trim().length>=2&&<div className="location-results" aria-live="polite">{candidates.length===0?<p>{t('noLocations')}</p>:candidates.map(candidate=><button key={candidate.place_id} onClick={()=>choose(candidate)}><strong>{candidate.name}</strong><span>{candidate.address}</span><small>{candidate.attributions.join(' · ')}</small></button>)}</div>}</section>}{!data&&!locationOpen&&<div className="search-suggestions"><div><h2>{t('recent')}</h2><button onClick={()=>{const value="Kadıköy'de modern avize mağazaları";setQuery(value);void runSearch(value);}}>Kadıköy’de modern avize mağazaları <ArrowRight/></button></div><div><h2>{t('categories')}</h2><div className="category-links">{categories.map(category=><button onClick={()=>{setQuery(category);void runSearch(category);}} key={category}>{category}</button>)}</div></div></div>}{error&&<p className="form-error" role="alert">{error}</p>}</header>{data?.guidance&&<section className="guidance-card"><h2>{data.guidance.message}</h2><div>{data.guidance.examples.map(example=><button key={example} onClick={()=>{setQuery(example);void runSearch(example);}}>{example}<ArrowRight/></button>)}</div></section>}{data&&!data.guidance&&<section className="results-layout"><div className="result-list"><p className="result-count">{data.results.length} {t('results')}</p>{data.results.length===0?<div className="zero-state"><h2>{t('zeroTitle')}</h2><p>{t('zeroBody')}</p></div>:data.results.map((item,index)=><Result item={item} index={index} key={item.search_result_impression_id} onAuth={()=>setAuth(true)}/>)}</div><aside className="map-panel" aria-label="Map"><div className="map-grid"/><span>{location?.label??data.intent.location_text}</span></aside></section>}<AuthDialog open={auth} onClose={()=>setAuth(false)}/></main>;
}
