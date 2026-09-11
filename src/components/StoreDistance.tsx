'use client';

import {useEffect,useState} from 'react';
import {LOCATION_LOST_EVENT,LOCATION_UPDATE_EVENT,canUseDeviceLocationWithoutPrompt,requestPosition,type Position} from '@/lib/location';
import type {Coordinates,Locale} from '@/lib/types';

// How far the visitor is from a store, and whether that is close enough to review it.
//
// It reads the device rather than the search location on purpose: the question is where
// the reader is standing now, not which city they are browsing. Nothing is prompted -- a
// browser that has not already been granted permission is simply not asked, and the row
// shows no distance at all rather than a guess.
const eligible:Record<Locale,string>={
  tr:'Değerlendirme yapmak için uygun mesafedesiniz',
  en:'You are close enough to write a review',
  de:'Du bist nah genug, um zu bewerten',
  ru:'Вы достаточно близко, чтобы оставить отзыв',
};

// The backend is the authority on the limit and rejects anything beyond it; this value
// only decides whether an encouraging line is shown, so the documented default is a safe
// degradation when the runtime endpoint cannot be reached.
const DEFAULT_REVIEW_RADIUS=2000;

export function useViewerPosition():Position|undefined{
  const [position,setPosition]=useState<Position>();
  useEffect(()=>{
    let active=true;
    void(async()=>{
      if(!await canUseDeviceLocationWithoutPrompt())return;
      const outcome=await requestPosition({allowRemembered:true,allowRecentLive:true});
      if(active&&outcome.ok)setPosition(outcome.position);
    })();
    // The live watch sharpens the fix while the page is open, and publishes each better
    // reading here; a distance that never moves while the reader does is worse than none.
    const update=(event:Event)=>{const next=(event as CustomEvent<Position>).detail;if(next)setPosition(next);};
    const lost=()=>setPosition(undefined);
    window.addEventListener(LOCATION_UPDATE_EVENT,update);
    window.addEventListener(LOCATION_LOST_EVENT,lost);
    return()=>{active=false;window.removeEventListener(LOCATION_UPDATE_EVENT,update);window.removeEventListener(LOCATION_LOST_EVENT,lost);};
  },[]);
  return position;
}

export function useReviewRadius():number{
  const [radius,setRadius]=useState(DEFAULT_REVIEW_RADIUS);
  useEffect(()=>{
    let active=true;
    void(async()=>{
      try{
        const response=await fetch('/api/runtime-config',{cache:'no-store'});
        if(!response.ok)return;
        const config=await response.json() as {reviewRadiusMeters?:number};
        if(active&&typeof config.reviewRadiusMeters==='number'&&config.reviewRadiusMeters>0)setRadius(config.reviewRadiusMeters);
      }catch{}
    })();
    return()=>{active=false;};
  },[]);
  return radius;
}

// Great-circle distance in metres.
export function metresBetween(from:Coordinates,to:Coordinates):number{
  const radius=6371000;
  const toRadians=(degrees:number)=>degrees*Math.PI/180;
  const deltaLatitude=toRadians(to.latitude-from.latitude);
  const deltaLongitude=toRadians(to.longitude-from.longitude);
  const a=Math.sin(deltaLatitude/2)**2+Math.cos(toRadians(from.latitude))*Math.cos(toRadians(to.latitude))*Math.sin(deltaLongitude/2)**2;
  return 2*radius*Math.asin(Math.min(1,Math.sqrt(a)));
}

export function formatDistance(metres:number,locale:Locale):string{
  return metres<1000
    ?`${new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(metres)} m`
    :`${new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(metres/1000)} km`;
}

export function StoreDistance({store,viewer,radiusMeters,locale}:{store:Coordinates;viewer?:Position;radiusMeters:number;locale:Locale}){
  if(!viewer)return null;
  const metres=metresBetween(viewer,store);
  const close=metres<=radiusMeters;
  return <p className={`store-distance${close?' is-eligible':''}`}>
    <strong>{formatDistance(metres,locale)}</strong>
    {close&&<small>{eligible[locale]}</small>}
  </p>;
}
