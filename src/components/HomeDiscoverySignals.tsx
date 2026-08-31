'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {useEffect,useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import {localePath} from '@/lib/site';
import {storePhotoURL} from '@/lib/store-photo';
import type {MonthlyStoreHighlights,StoreHighlight} from '@/lib/types';
import {homeSignalsCopy} from '@/content/home';

type PopularCity={name:string;search_count:number};
type PopularCategory={slug:string;name:string;search_count:number};
type Signals={highlights:MonthlyStoreHighlights;cities:PopularCity[];categories:PopularCategory[]};

function HighlightLink({item,label,metric}:{item:StoreHighlight;label:string;metric:string}){
  const {locale}=useI18n();
  const place=[item.district,item.city].filter(Boolean).join(', ');
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

export function HomeDiscoverySignals(){
  const {locale,t}=useI18n();
  const copy=homeSignalsCopy[locale];
  const [signals,setSignals]=useState<Signals>();
  useEffect(()=>{
    let active=true;
    Promise.all([
      apiFetch('/api/proxy/search/highlights',{headers:{'X-Locale':locale}}).then(async response=>response.ok?await response.json() as MonthlyStoreHighlights:{}),
      apiFetch('/api/proxy/search/popular-cities?limit=5',{headers:{'X-Locale':locale}}).then(async response=>response.ok?(await response.json() as {items:PopularCity[]}).items??[]:[]),
      apiFetch('/api/proxy/categories',{headers:{'X-Locale':locale}}).then(async response=>response.ok?(await response.json() as {items:PopularCategory[]}).items??[]:[]),
    ]).then(([highlights,cities,categories])=>{
      if(active)setSignals({highlights,cities,categories:categories.filter(item=>item.search_count>0).slice(0,5)});
    }).catch(()=>{if(active)setSignals({highlights:{},cities:[],categories:[]});});
    return()=>{active=false;};
  },[locale]);

  if(!signals)return <section className="home-signals home-signals-loading" aria-label={copy.title} aria-busy="true"><span/><span/><span/></section>;
  const highlights=[
    signals.highlights.rating_gainer&&<HighlightLink key="rating" item={signals.highlights.rating_gainer} label={t('mostImproved')} metric={`+${(signals.highlights.rating_gainer.rating_increase??0).toLocaleString(locale,{maximumFractionDigits:2})} ${t('ratingIncrease')}`}/>,
    signals.highlights.most_reviewed&&<HighlightLink key="reviews" item={signals.highlights.most_reviewed} label={t('mostReviewed')} metric={`${signals.highlights.most_reviewed.recent_review_count.toLocaleString(locale)} ${t('reviewsThisMonth')}`}/>,
  ].filter(Boolean);
  if(!highlights.length&&!signals.cities.length&&!signals.categories.length)return null;

  return <section className="home-signals" aria-labelledby="home-signals-title">
    <header><h2 id="home-signals-title">{copy.title}</h2><p>{copy.intro}</p></header>
    {highlights.length>0&&<div className="home-signal-stores"><h3>{t('monthlyStandouts')} <small>{t('lastMonth')}</small></h3><div>{highlights}</div></div>}
    <div className="home-signal-rankings">
      {signals.cities.length>0&&<section><h3>{copy.cities}</h3><ol>{signals.cities.map((item,index)=><li key={item.name}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.name}</strong><small>{item.search_count.toLocaleString(locale)} {copy.searches}</small></li>)}</ol></section>}
      {signals.categories.length>0&&<section><h3>{copy.categories}</h3><ol>{signals.categories.map((item,index)=><li key={item.slug}><span>{String(index+1).padStart(2,'0')}</span><Link href={`${localePath(locale,'/discover')}?q=${encodeURIComponent(item.name)}`}>{item.name}</Link><small>{item.search_count.toLocaleString(locale)} {copy.searches}</small></li>)}</ol></section>}
    </div>
  </section>;
}
