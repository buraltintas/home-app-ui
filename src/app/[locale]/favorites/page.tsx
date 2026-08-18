'use client';

import {ArrowRight,Heart} from 'lucide-react';
import Link from 'next/link';
import {useCallback,useEffect,useState} from 'react';
import {AuthDialog} from '@/components/AuthDialog';
import {Rating} from '@/components/Rating';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import type {Store} from '@/lib/types';

export default function Page(){
  const {t,locale}=useI18n();
  const [open,setOpen]=useState(false);
  const [signedIn,setSignedIn]=useState(false);
  const [checking,setChecking]=useState(true);
  const [stores,setStores]=useState<Store[]>([]);
  const [error,setError]=useState('');

  const load=useCallback(async()=>{
    setError('');
    try{
      const response=await apiFetch('/api/proxy/me/favorites?limit=50',{cache:'no-store'});
      if(!response.ok)throw new Error();
      const result=await response.json() as {items:Store[]};
      setStores(result.items??[]);
    }catch{setError(t('favoritesError'));}
  },[t]);

  useEffect(()=>{
    let active=true;let requestSequence=0;
    const checkSession=async()=>{
      const sequence=++requestSequence;setChecking(true);
      try{
        const response=await apiFetch('/api/proxy/me',{cache:'no-store'});
        if(!active||sequence!==requestSequence)return;
        setSignedIn(response.ok);
        if(response.ok)await load();else setStores([]);
      }catch{if(active&&sequence===requestSequence)setSignedIn(false);}
      finally{if(active&&sequence===requestSequence)setChecking(false);}
    };
    const handleAuthentication=()=>void checkSession();
    void checkSession();window.addEventListener('bosagezme:authenticated',handleAuthentication);
    return()=>{active=false;window.removeEventListener('bosagezme:authenticated',handleAuthentication);};
  },[load]);

  if(signedIn&&stores.length)return <main className="favorites-page">
    <p className="eyebrow">{t('favorites')}</p>
    <h1>{t('favoritesTitle')}</h1>
    {error&&<p className="form-error" role="alert">{error}</p>}
    <ul className="favorites-list">{stores.map(store=><li key={store.id}><Link href={localePath(locale,`/stores/${store.id}`)}>
      <div><strong>{store.name}</strong><span>{[store.district,store.city].filter(Boolean).join(', ')}</span>
      {store.platform.review_count?<small><Rating value={store.platform.average_rating}/> · {store.platform.review_count} {t('reviews')}</small>:<small>{t('noCommunity')}</small>}</div>
      <ArrowRight aria-hidden="true"/>
    </Link></li>)}</ul>
  </main>;

  return <main className="empty-page"><Heart/><p className="eyebrow">{t('favorites')}</p><h1>{t('favoritesTitle')}</h1><p>{signedIn?t('favoritesSignedInEmpty'):t('favoritesEmpty')}</p>{error&&<p className="form-error" role="alert">{error}</p>}{!checking&&!signedIn&&<button className="button primary" onClick={()=>setOpen(true)}>{t('signIn')}</button>}<AuthDialog open={open} onClose={()=>setOpen(false)} onAuthenticated={()=>setSignedIn(true)}/></main>;
}
