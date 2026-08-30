'use client';

import {Camera,Check,MapPin,Star,Store,TriangleAlert,X} from 'lucide-react';
import Image from 'next/image';
import {useRouter,useSearchParams} from 'next/navigation';
import {ChangeEvent,Suspense,useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {AuthDialog} from '@/components/AuthDialog';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import {canUseDeviceLocationWithoutPrompt,locationMessage,requestVisitPosition} from '@/lib/location';
import {readOriginSearch} from '@/lib/search-origin';
import type {MediaUpload,StoreDetail,VisitVerification} from '@/lib/types';

const UUID=/^[0-9a-f-]{36}$/i;
type Draft={id:string;url:string};

function ReviewLoadingState(){
  return <main className="create-page create-page-loading" aria-busy="true" aria-label="Loading">
    <div className="review-loading-copy"><span/><span/><span/></div>
    <div className="review-loading-steps"><span/><span/><span/><span/></div>
  </main>;
}

// A review only means something attached to a store, so this screen is reachable
// only as /create?store=<id>. Without one there is nothing to review and the user is
// sent back to discovery rather than shown an empty stepper.
function ReviewWizard({storeId}:{storeId:string}){
  const {t,locale}=useI18n();
  const router=useRouter();
  const [store,setStore]=useState<StoreDetail>();
  const [loadError,setLoadError]=useState('');
  const searchParams=useSearchParams();
  const [auth,setAuth]=useState(false);
  const [signedIn,setSignedIn]=useState<boolean>();
  const [verification,setVerification]=useState<VisitVerification>();
  const [verifying,setVerifying]=useState(false);
  const [verifyError,setVerifyError]=useState('');
  const [reviewRadiusMeters,setReviewRadiusMeters]=useState(2000);
  const [rating,setRating]=useState(0);
  const [photos,setPhotos]=useState<Draft[]>([]);
  const [uploading,setUploading]=useState(false);
  const [uploadError,setUploadError]=useState('');
  const [text,setText]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const [submitError,setSubmitError]=useState('');
  const autoVerificationAttempted=useRef(false);

  // The four steps are history entries, not component state. On a phone the back button
  // -- and the edge swipe that means the same thing -- is how people undo, and a wizard
  // that keeps its position in state cannot answer that: back leaves the flow altogether
  // and takes the half-written review with it. The step therefore lives in the URL, and
  // every forward move pushes an entry, so the browser's own back walks the wizard
  // backwards one step at a time.
  const requestedStep=Math.min(Math.max(Math.trunc(Number(searchParams.get('step')))||1,1),4);
  // Evidence of the visit is what unlocks the rest of the flow, so a step claimed by the
  // URL is only honoured once that evidence exists.
  const step=verification?requestedStep:1;
  const stepUrl=useCallback((next:number)=>`?store=${encodeURIComponent(storeId)}${next>1?`&step=${next}`:''}`,[storeId]);
  const advance=useCallback((next:number)=>{window.history.pushState(null,'',stepUrl(next));},[stepUrl]);
  // A reload or a shared link can claim progress this session does not have. The address
  // is repaired once on entry so the flow always starts where the evidence starts.
  useEffect(()=>{window.history.replaceState(null,'',stepUrl(1));},[stepUrl]);

  const checkSession=useCallback(async()=>{
    try{const response=await apiFetch('/api/proxy/me',{cache:'no-store'});return response.ok;}catch{return false;}
  },[]);

  useEffect(()=>{
    let active=true;
    void(async()=>{
      const ok=await checkSession();
      if(!active)return;
      setSignedIn(ok);
      // The dialog opens because the session is genuinely missing, never on every tap.
      if(!ok)setAuth(true);
    })();
    void(async()=>{
      try{
        const response=await apiFetch(`/api/proxy/stores/${storeId}`,{cache:'no-store'});
        if(!response.ok)throw new Error();
        const detail=await response.json() as StoreDetail;
        if(active)setStore(detail);
      }catch{if(active)setLoadError(t('storeUnavailable'));}
    })();
    void(async()=>{
      try{
        const response=await fetch('/api/runtime-config',{cache:'no-store'});
        if(!response.ok)return;
        const config=await response.json() as {reviewRadiusMeters?:number};
        if(active&&typeof config.reviewRadiusMeters==='number'&&config.reviewRadiusMeters>0){
          setReviewRadiusMeters(config.reviewRadiusMeters);
        }
      }catch{
        // The backend remains authoritative. This value only improves the explanation
        // shown after a rejection, so the documented default is a safe degradation.
      }
    })();
    return()=>{active=false;};
  },[checkSession,storeId,t]);

  const submitVerification=useCallback(async(latitude:number,longitude:number,accuracy:number)=>{
    const response=await apiFetch(`/api/proxy/stores/${storeId}/visit-verifications`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({latitude,longitude,accuracy_meters:accuracy})});
    if(response.status===401){setSignedIn(false);setAuth(true);return;}
    if(!response.ok){
      const body=await response.json().catch(()=>undefined) as {error?:{code?:string}}|undefined;
      if(body?.error?.code==='STORE_VISIT_NOT_VERIFIED'){
        const distance=reviewRadiusMeters>=1000
          ?`${new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(reviewRadiusMeters/1000)} km`
          :`${new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(reviewRadiusMeters)} m`;
        setVerifyError(t('reviewDistanceLimit').replace('{distance}',distance));
        return;
      }
      if(body?.error?.code==='LOCATION_ACCURACY_TOO_LOW'){setVerifyError(t('verifyAccuracy'));return;}
      throw new Error();
    }
    setVerification(await response.json() as VisitVerification);
    advance(2);
  },[advance,locale,reviewRadiusMeters,storeId,t]);

  const verify=useCallback(async()=>{
    setVerifying(true);setVerifyError('');
    try{
      // Reuse the live fix that Discover just captured in this tab. Persistent/manual
      // discovery locations are deliberately excluded from review evidence.
      const outcome=await requestVisitPosition();
      if(!outcome.ok){
        setVerifyError(t(locationMessage(outcome.reason)));
        return;
      }
      const {latitude,longitude,accuracy_meters}=outcome.position;
      if(typeof accuracy_meters!=='number'){setVerifyError(t('verifyAccuracy'));return;}
      await submitVerification(latitude,longitude,accuracy_meters);
    }catch{setVerifyError(t('verifyError'));}
    finally{setVerifying(false);}
  },[submitVerification,t]);

  // Discover already established the device-location preference. Opening the review flow
  // should therefore verify in the background, not ask the user to press another
  // location button. A manually typed search location never enables this path.
  useEffect(()=>{
    if(signedIn!==true||verification||autoVerificationAttempted.current)return;
    let active=true;
    void(async()=>{
      const canVerify=await canUseDeviceLocationWithoutPrompt();
      if(!active||!canVerify)return;
      autoVerificationAttempted.current=true;
      await verify();
    })();
    return()=>{active=false;};
  },[signedIn,verification,verify]);

  const addPhoto=async(event:ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];
    event.target.value='';
    if(!file||photos.length>=10)return;
    setUploading(true);setUploadError('');
    try{
      const created=await apiFetch('/api/proxy/media/uploads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mime_type:file.type,size_bytes:file.size})});
      if(!created.ok)throw new Error();
      const {id,upload}=await created.json() as MediaUpload;
      // The upload URL is a pre-signed object-storage target handed to us by the API
      // for exactly this purpose; it is not the backend origin.
      const stored=await fetch(upload.upload_url,{method:'PUT',headers:upload.headers,body:file});
      if(!stored.ok)throw new Error();
      const bitmap=await createImageBitmap(file);
      const completed=await apiFetch(`/api/proxy/media/${id}/complete`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({width:bitmap.width,height:bitmap.height})});
      bitmap.close();
      if(!completed.ok)throw new Error();
      setPhotos(current=>[...current,{id,url:URL.createObjectURL(file)}]);
    }catch{setUploadError(t('uploadError'));}
    finally{setUploading(false);}
  };

  const removePhoto=(id:string)=>setPhotos(current=>{
    const target=current.find(photo=>photo.id===id);
    if(target)URL.revokeObjectURL(target.url);
    return current.filter(photo=>photo.id!==id);
  });

  // Reset again once the page has its real height. The mount-time reset below is not
  // enough on its own: this route paints a short loading state first, so a browser
  // arriving from far down a store page clamps the old offset to the bottom of that short
  // page instead of the top, and nothing moves it back when the content finally makes the
  // page tall. Locally the loading state is quick enough to hide this; in production it
  // left the review flow opening a hundred pixels down, with its own heading cut off.
  const settled=Boolean(store)&&signedIn!==undefined;
  useLayoutEffect(()=>{if(settled)window.scrollTo(0,0);},[settled]);

  const submit=async()=>{
    if(!verification||rating<1||text.trim().length<3)return;
    setSubmitting(true);setSubmitError('');
    const origin=readOriginSearch();
    try{
      const response=await apiFetch('/api/proxy/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        store_id:storeId,rating,text:text.trim(),visit_verification_id:verification.id,
        media_ids:photos.map(photo=>photo.id),content_language:locale,
        ...(origin?{origin_search_id:origin.search_id,origin_search_result_id:origin.search_result_id}:{}),
      })});
      if(response.status===401){setSignedIn(false);setAuth(true);return;}
      if(!response.ok)throw new Error();
      router.push(localePath(locale,`/stores/${storeId}`));
      router.refresh();
    }catch{setSubmitError(t('reviewError'));}
    finally{setSubmitting(false);}
  };

  if(loadError)return <main className="create-page"><div className="empty-state"><h1>{t('storeUnavailable')}</h1><button className="button primary" onClick={()=>router.push(localePath(locale,'/discover'))}>{t('discover')}</button></div></main>;
  if(!store||signedIn===undefined)return <ReviewLoadingState/>;

  // The first step renames itself once it is done. "Konumu doğrula" is an instruction and
  // it stops being true the moment the location is verified; leaving it there asks for
  // something already given.
  const steps=[[verification?t('verifyLocationDone'):t('verifyLocation'),MapPin],[t('addRating'),Star],[t('addPhotos'),Camera],[t('tellExperience'),Check]] as const;
  const textLength=text.trim().length;
  return <main className="create-page">
    <div>
      <p className="eyebrow">{t('reviewFor')}</p>
      <h1>{store.store.name}</h1>
      <p className="review-store-address"><Store aria-hidden="true"/>{store.store.address||[store.store.district,store.store.city].filter(Boolean).join(', ')}</p>
    </div>

    <ol className="review-steps">{steps.map(([label,Icon],index)=>{
      const position=index+1;
      const verified=position===1&&Boolean(verification);
      return <li key={label} className={[position===step?'current':position<step?'done':'',verified?'is-verified':''].filter(Boolean).join(' ')} aria-current={position===step?'step':undefined}><span><Icon/></span><strong>{label}</strong></li>;
    })}</ol>

    {/* Below the whole stepper rather than inside the first step. It is the reason nothing
        can continue, so it belongs where the eye lands after reading what the steps are --
        not tucked under a button that has just refused. */}
    {verifyError&&<p className="verify-warning" role="alert"><TriangleAlert aria-hidden="true"/><span>{verifyError}</span></p>}

    {step===1&&<section className="review-step">
      <p>{t('verifyValidity')}</p>
      {verification
        ?<p className="review-ok" role="status"><Check aria-hidden="true"/>{t('verifyDone')}</p>
        :<button className="button primary" onClick={()=>void verify()} disabled={verifying||!signedIn}>{verifying?t('verifying'):verifyError?t('locationRetry'):t('verifyNow')}</button>}
      {verification&&<div className="review-nav"><button className="button primary" onClick={()=>advance(2)}>{t('continue')}</button></div>}
    </section>}

    {step===2&&<section className="review-step">
      <fieldset className="rating-picker"><legend>{t('ratingLabel')}</legend>{[1,2,3,4,5].map(value=>
        <label key={value}><input type="radio" name="rating" value={value} checked={rating===value} onChange={()=>setRating(value)}/><Star aria-hidden="true" className={value<=rating?'is-on':undefined}/><span>{value}</span></label>)}
      </fieldset>
      <div className="review-nav"><button className="button quiet" onClick={()=>router.back()}>{t('back')}</button><button className="button primary" onClick={()=>advance(3)} disabled={rating<1}>{t('continue')}</button></div>
    </section>}

    {step===3&&<section className="review-step">
      <p>{t('addPhotosOptional')}</p>
      <div className="photo-drafts">{photos.map(photo=>
        <figure key={photo.id}><Image src={photo.url} width={120} height={120} alt="" unoptimized/><button className="icon-button" onClick={()=>removePhoto(photo.id)} aria-label={t('removePhoto')}><X/></button></figure>)}
      </div>
      <label className="button secondary photo-input"><Camera aria-hidden="true"/>{t('addPhotos')}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>void addPhoto(event)} disabled={uploading||photos.length>=10}/></label>
      {uploadError&&<p className="form-error" role="alert">{uploadError}</p>}
      <div className="review-nav"><button className="button quiet" onClick={()=>router.back()}>{t('back')}</button><button className="button primary" onClick={()=>advance(4)} disabled={uploading}>{t('continue')}</button></div>
    </section>}

    {step===4&&<section className="review-step">
      <label className="review-text"><span>{t('reviewTextLabel')}</span><textarea value={text} onChange={event=>setText(event.target.value.slice(0,5000))} rows={6} placeholder={t('reviewTextHint')} maxLength={5000}/></label>
      <small>{textLength}/5000</small>
      {textLength>0&&textLength<3&&<p className="form-error" role="alert">{t('reviewTooShort')}</p>}
      {submitError&&<p className="form-error" role="alert">{submitError}</p>}
      <div className="review-nav"><button className="button quiet" onClick={()=>router.back()}>{t('back')}</button><button className="button primary" onClick={()=>void submit()} disabled={submitting||textLength<3||rating<1||!verification}>{submitting?t('loading'):t('submitReview')}</button></div>
    </section>}

    <AuthDialog open={auth} onClose={()=>setAuth(false)} onAuthenticated={()=>{setSignedIn(true);setAuth(false);}}/>
  </main>;
}

function CreateRoute(){
  const {t,locale}=useI18n();
  const router=useRouter();
  const storeId=useSearchParams().get('store')??'';
  const valid=UUID.test(storeId);
  // A store link is often opened from low on the detail page. Reset before paint so the
  // new review flow never appears halfway down the page and then jumps to its heading.
  useLayoutEffect(()=>{window.scrollTo(0,0);},[]);
  useEffect(()=>{if(!valid)router.replace(localePath(locale,'/discover'));},[router,valid,locale]);
  if(!valid)return <main className="create-page"><div className="empty-state"><h1>{t('chooseStoreToReview')}</h1><p>{t('chooseStoreBody')}</p></div></main>;
  return <ReviewWizard storeId={storeId}/>;
}

export default function Page(){
  return <Suspense fallback={<ReviewLoadingState/>}><CreateRoute/></Suspense>;
}
