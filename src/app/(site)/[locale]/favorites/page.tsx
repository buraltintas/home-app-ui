'use client';

import {ArrowRight,ClipboardCheck,Clock,Heart} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useCallback,useEffect,useState} from 'react';
import {AuthDialog} from '@/components/AuthDialog';
import {AccountPageSkeleton} from '@/components/AccountPageSkeleton';
import {useScrollTopWhenReady} from '@/lib/scroll-top';
import {RatingStars} from '@/components/Rating';
import {emphasisedTitle,plainTitle} from '@/lib/emphasis';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import type {Locale,Store} from '@/lib/types';
import {isBrandMark,storePhotoURL} from '@/lib/store-photo';
import {TimedNudge} from '@/components/TimedNudge';
import {metresBetween,StoreDistance,useReviewRadius,useViewerPosition} from '@/components/StoreDistance';

// The same wording the store page uses for the same action; one product, one name for it.
const reviewAction:Record<Locale,string>={tr:'Değerlendirme yap',en:'Write a review',de:'Bewertung abgeben',ru:'Оставить оценку'};
// "yours" takes the number, because the number is the point of the sentence. It used to be
// the word "one" written out, which is right exactly as often as somebody has reviewed a shop
// once and no more -- and wrong, silently, the rest of the time.
const favoriteSummary:Record<Locale,{saved:string;pending:string;pendingEmpty:string;yours:(n:number)=>string;awaiting:string;reviewed:string}>={
  tr:{saved:'Kaydedilen\nmağaza',pending:'Değerlendirmeni bekleyen mağaza',pendingEmpty:'Kaydettiğin mağazaların hepsini değerlendirmişsin.',yours:n=>`${n} tanesi senin`,awaiting:'Değerlendirmeni bekliyor',reviewed:'Değerlendirdin'},
  en:{saved:'Saved stores',pending:'Waiting for your review',pendingEmpty:'You have reviewed every store you saved.',yours:n=>n===1?'one of them is yours':`${n} of them are yours`,awaiting:'Waiting for your review',reviewed:'You reviewed this'},
  de:{saved:'Gespeicherte Geschäfte',pending:'Wartet auf deine Bewertung',pendingEmpty:'Du hast jedes gespeicherte Geschäft bewertet.',yours:n=>n===1?'eine davon ist deine':`${n} davon sind deine`,awaiting:'Wartet auf deine Bewertung',reviewed:'Von dir bewertet'},
  ru:{saved:'Сохранённые магазины',pending:'Ждут вашей оценки',pendingEmpty:'Вы оценили все сохранённые магазины.',yours:n=>n===1?'одна из них ваша':`ваших: ${n}`,awaiting:'Ждёт вашей оценки',reviewed:'Вы оценили'},
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
  // Which of the two counts the list is showing. The page opens on the one that holds
  // everything, which is the list this page has always opened with.
  const [showing,setShowing]=useState<'saved'|'pending'>('saved');

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
  if(checking)return <AccountPageSkeleton className="favorites-page" eyebrow={t('favorites')} title={plainTitle(t('favoritesTitle'))}/>;

  const pending=stores.filter(store=>!store.viewer_has_reviewed);
  const shown=showing==='pending'?pending:stores;
  if(signedIn&&stores.length)return <main className="favorites-page">
    <p className="eyebrow">{t('favorites')}</p>
    {/* Off the screen, not out of the document. The two counts underneath say what the page
        is holding, so the sentence above them was repeating them; a page with no heading at
        all is a page a screen reader cannot announce, which is a different loss. */}
    <h1 className="visually-hidden">{plainTitle(t('favoritesTitle'))}</h1>
    {/* Two counts, and each one opens the list it counts. A number a reader cannot act on is
        a fact; a number that shows them the shops behind it is a way into the page, and this
        page only has two questions to ask. */}
    <div className="favorites-summary" role="group" aria-label={plainTitle(t('favoritesTitle'))}>
      <button type="button" className={showing==='saved'?'is-showing':undefined} aria-pressed={showing==='saved'} onClick={()=>setShowing('saved')}>
        <span className="favorites-summary-mark" aria-hidden="true"><Heart/></span>
        <span className="favorites-summary-copy"><span>{favoriteSummary[locale].saved}</span><strong>{stores.length}</strong></span>
      </button>
      <button type="button" className={showing==='pending'?'is-showing':undefined} aria-pressed={showing==='pending'} onClick={()=>setShowing('pending')}>
        <span className="favorites-summary-mark" aria-hidden="true"><Clock/></span>
        <span className="favorites-summary-copy"><span>{favoriteSummary[locale].pending}</span><strong>{pending.length}</strong></span>
      </button>
    </div>
    {error&&<p className="form-error" role="alert">{error}</p>}
    {/* The review action sits outside the link, not inside it: an anchor cannot hold
        another anchor, and starting a review is not a step on the way to opening the
        store's page. It is the same control, and the same wording, the store page uses. */}
    {shown.length?<ul className="favorites-list">{shown.map(store=>{const photo=storePhotoURL(store.photo,320,store.name,store.categories);return <li key={store.id}>
      <Link href={localePath(locale,`/stores/${store.id}`)} prefetch={false}>
        {photo?<Image className={`favorite-store-photo${isBrandMark(store.photo,store.name,store.categories)?' is-brand-mark':''}`} src={photo} width={160} height={120} alt="" unoptimized/>:<div className="favorite-store-photo is-empty" aria-hidden="true">{store.name.trim().charAt(0)}</div>}
        <div>{/* Said before the name, because it is the reason this list is two lists. Which of
                 the two counts a shop belongs to was only legible by opening the other tab and
                 seeing whether it was there as well. */}
        <span className={`favorite-store-state${store.viewer_has_reviewed?' is-done':''}`}>{store.viewer_has_reviewed?<ClipboardCheck aria-hidden="true"/>:<Clock aria-hidden="true"/>}{store.viewer_has_reviewed?favoriteSummary[locale].reviewed:favoriteSummary[locale].awaiting}</span>
        <strong>{store.name}</strong><span>{[store.district,store.city].filter(Boolean).join(', ')}</span>
        {/* The count sits under the score rather than beside it: on a phone the two together
            wrapped onto a second line anyway, and the number of reviews is what the score is
            made of, not a second fact competing with it. Muted, like the count on the home
            page. */}
        {/* One of these is yours, when it is: the difference between "somebody scored this"
            and "I scored this". */}
        {store.platform.review_count
          ?<div className="favorite-store-score"><RatingStars value={store.platform.average_rating}/><span>{store.platform.review_count} {t('reviewWord')}{store.viewer_has_reviewed&&<em> · {favoriteSummary[locale].yours(store.viewer_review_count||1)}</em>}</span></div>
          :<small>{t('noCommunity')}</small>}</div>
        <ArrowRight aria-hidden="true"/>
      </Link>
      <div className="favorite-review-row">
        <StoreDistance store={{latitude:store.latitude,longitude:store.longitude}} viewer={viewer} radiusMeters={reviewRadius} locale={locale} isApproximate={store.location_approximate}/>
        {/* Offered only where the review would actually be accepted. A review has to be
            written from the shop, so inviting somebody to start one from the other side of
            the city is an invitation to be turned away at the end of the form. Knowing where
            the reader is is not enough on its own -- they have to be near this shop -- and a
            shop we placed ourselves cannot support the claim either. */}
        {viewer&&!store.location_approximate
          &&metresBetween(viewer,{latitude:store.latitude,longitude:store.longitude})<=reviewRadius
          &&<Link className="button store-contribution-action favorite-review-action" href={localePath(locale,`/create?store=${store.id}`)}>{reviewAction[locale]}</Link>}
      </div>
    </li>})}</ul>:<p className="favorites-none">{favoriteSummary[locale].pendingEmpty}</p>}<TimedNudge kind="favorites"/>
  </main>;

  // Two different empty pages share this one return. A reader who is not signed in is
  // looking at a locked list -- the drawing says exactly that, a saved list behind a
  // padlock, which is the reason there is nothing to show. A reader who IS signed in and
  // has saved nothing is not locked out of anything; showing them a padlock would blame
  // the wrong thing, so they keep the heart, which is the mark this page has always used
  // for the act of saving.
  return <main className="empty-page favorites-empty">
    {signedIn
      ?<Heart/>
      :<Image className="favorites-locked" src="/illustrations/favorites-locked.png" width={512} height={512} alt="" aria-hidden="true" priority/>}
    <p className="eyebrow">{t('favorites')}</p>
    <h1>{emphasisedTitle(t('favoritesTitle'))}</h1>
    <p>{signedIn?t('favoritesSignedInEmpty'):t('favoritesEmpty')}</p>
    {error&&<p className="form-error" role="alert">{error}</p>}
    {!checking&&!signedIn&&<button className="button primary" onClick={()=>setOpen(true)}>{t('signIn')}</button>}
    <AuthDialog open={open} onClose={()=>setOpen(false)} onAuthenticated={()=>setSignedIn(true)}/>
  </main>;
}
