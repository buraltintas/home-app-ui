'use client';

import {ArrowRight,Heart} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useCallback,useEffect,useState} from 'react';
import {AuthDialog} from '@/components/AuthDialog';
import {AccountPageSkeleton} from '@/components/AccountPageSkeleton';
import {useScrollTopWhenReady} from '@/lib/scroll-top';
import {RatingStars} from '@/components/Rating';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import type {Locale,Store} from '@/lib/types';
import {isBrandMark,storePhotoURL} from '@/lib/store-photo';
import {TimedNudge} from '@/components/TimedNudge';
import {StoreDistance,useReviewRadius,useViewerPosition} from '@/components/StoreDistance';

// The same wording the store page uses for the same action; one product, one name for it.
const reviewAction:Record<Locale,string>={tr:'Değerlendirme yap',en:'Write a review',de:'Bewertung abgeben',ru:'Оставить оценку'};
const favoriteSummary:Record<Locale,{saved:string;pending:string}>={
  tr:{saved:'Kaydedilen mağaza',pending:'Değerlendirilmeyi bekleyen mağaza'},
  en:{saved:'Saved stores',pending:'Saved, not yet reviewed'},
  de:{saved:'Gespeicherte Geschäfte',pending:'Geschäfte, die auf deine Bewertung warten'},
  ru:{saved:'Сохранённые магазины',pending:'Магазины, ожидающие вашей оценки'},
};

export default function Page(){
  const {t,locale}=useI18n();
  // How far the reader is from each saved store, and whether that is near enough to
  // review it. Read from the device, and only where the browser has already granted it.
  const viewer=useViewerPosition();
  const reviewRadius=useReviewRadius();
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

  // Until the session is known this page cannot say anything true. It used to render the
  // signed-out screen first and then swap to the list, so a signed-in visitor was briefly
  // told they had no favourites.
  useScrollTopWhenReady(!checking);
  if(checking)return <AccountPageSkeleton className="favorites-page" eyebrow={t('favorites')} title={t('favoritesTitle')}/>;

  if(signedIn&&stores.length)return <main className="favorites-page">
    <p className="eyebrow">{t('favorites')}</p>
    <h1>{t('favoritesTitle')}</h1>
    <dl className="favorites-summary" aria-label={t('favoritesTitle')}>
      <div><dt>{favoriteSummary[locale].saved}</dt><dd>{stores.length}</dd></div>
      <div><dt>{favoriteSummary[locale].pending}</dt><dd>{stores.filter(store=>!store.viewer_has_reviewed).length}</dd></div>
    </dl>
    {error&&<p className="form-error" role="alert">{error}</p>}
    {/* The review action sits outside the link, not inside it: an anchor cannot hold
        another anchor, and starting a review is not a step on the way to opening the
        store's page. It is the same control, and the same wording, the store page uses. */}
    <ul className="favorites-list">{stores.map(store=>{const photo=storePhotoURL(store.photo,320);return <li key={store.id}>
      <Link href={localePath(locale,`/stores/${store.id}`)} prefetch={false}>
        {photo?<Image className={`favorite-store-photo${isBrandMark(store.photo)?' is-brand-mark':''}`} src={photo} width={160} height={120} alt="" unoptimized/>:<div className="favorite-store-photo is-empty" aria-hidden="true">{store.name.trim().charAt(0)}</div>}
        <div><strong>{store.name}</strong><span>{[store.district,store.city].filter(Boolean).join(', ')}</span>
        {store.platform.review_count?<small><RatingStars value={store.platform.average_rating}/> · {store.platform.review_count} {t('reviewWord')}</small>:<small>{t('noCommunity')}</small>}</div>
        <ArrowRight aria-hidden="true"/>
      </Link>
      <div className="favorite-review-row">
        <StoreDistance store={{latitude:store.latitude,longitude:store.longitude}} viewer={viewer} radiusMeters={reviewRadius} locale={locale}/>
        {/* Offered only once the distance is known. A review has to be written from the
            shop, so inviting somebody to start one before we can tell where they are is an
            invitation to be turned away at the end of the form. */}
        {viewer&&<Link className="button store-contribution-action favorite-review-action" href={localePath(locale,`/create?store=${store.id}`)}>{reviewAction[locale]}</Link>}
      </div>
    </li>})}</ul><TimedNudge kind="favorites"/>
  </main>;

  return <main className="empty-page favorites-empty"><Heart/><p className="eyebrow">{t('favorites')}</p><h1>{t('favoritesTitle')}</h1><p>{signedIn?t('favoritesSignedInEmpty'):t('favoritesEmpty')}</p>{error&&<p className="form-error" role="alert">{error}</p>}{!checking&&!signedIn&&<button className="button primary" onClick={()=>setOpen(true)}>{t('signIn')}</button>}<AuthDialog open={open} onClose={()=>setOpen(false)} onAuthenticated={()=>setSignedIn(true)}/></main>;
}
