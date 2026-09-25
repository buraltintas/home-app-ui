'use client';

import {Check,CircleCheck,Eraser,Info,MapPin,ShoppingBag,Star,TriangleAlert} from 'lucide-react';
import Image from 'next/image';
import {useRouter,useSearchParams} from 'next/navigation';
import {Suspense,useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {AuthDialog} from '@/components/AuthDialog';
import {RatingStars} from '@/components/Rating';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import {canUseDeviceLocationWithoutPrompt,locationMessage,requestVisitPosition} from '@/lib/location';
import {isBrandMark,storePhotoURL} from '@/lib/store-photo';
import {readOriginSearch} from '@/lib/search-origin';
import {refreshStorePage} from '@/lib/store-cache';
import {useScrollTopWhenReady} from '@/lib/scroll-top';
import type {Locale,StoreDetail,VisitVerification} from '@/lib/types';

const UUID=/^[0-9a-f-]{36}$/i;

// The review, in the order it is asked. The keys are the server's field names, so the form
// state and the request body are the same eight things named the same way -- there is no
// mapping table in between to fall out of step.
const criterionLabels={
  availability:'criterionAvailability',
  value:'criterionValue',
  layout:'criterionLayout',
  staff_care:'criterionStaffCare',
  staff_knowledge:'criterionStaffKnowledge',
  checkout:'criterionCheckout',
  returns:'criterionReturns',
  cleanliness:'criterionCleanliness',
} as const;
// Two sentences that do two different jobs -- what to do, and what it produces -- so they
// are given a line each rather than run together.
const criteriaIntroCopy:Record<Locale,[string,string]>={
  tr:['Sekiz başlığın hepsini puanla.','Mağaza puanı bunların ortalamasından oluşur.'],
  en:['Score all eight headings.','The store rating is their average.'],
  de:['Bewerte alle acht Bereiche.','Die Ladenbewertung ist ihr Durchschnitt.'],
  ru:['Оцените все восемь пунктов.','Оценка магазина — их среднее.'],
};
// A hundred characters. Long enough for the sentence somebody actually wants to write, short
// enough that nobody is being asked to compose.
const NOTE_LIMIT=100;
const lowScoreCopy:Record<Locale,{prompt:string;hint:string}>={
  tr:{prompt:'1 ve 2 puan için yorum yazman gerek. Memnuniyetsizliğini kısaca buraya yaz.',hint:'Ne olduğunu bir cümleyle anlat'},
  en:{prompt:'A one or a two needs a reason. Say briefly what was wrong.',hint:'One sentence on what happened'},
  de:{prompt:'Eine Eins oder Zwei braucht eine Begründung. Schreibe kurz, was nicht gepasst hat.',hint:'Ein Satz dazu, was passiert ist'},
  ru:{prompt:'Оценке 1 или 2 нужна причина. Коротко напишите, что было не так.',hint:'Одно предложение о том, что случилось'},
};
type CriterionKey=keyof typeof criterionLabels;
const criterionKeys=Object.keys(criterionLabels) as CriterionKey[];

function ReviewLoadingState(){
  return <main className="create-page create-page-loading" aria-busy="true" aria-label="Loading">
    <div className="review-loading-copy"><span/><span/><span/></div>
    <div className="review-loading-steps"><span/><span/></div>
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
  const [criteria,setCriteria]=useState<Partial<Record<CriterionKey,number>>>({});
  // Why a criterion was given one or two stars. Kept beside the score it belongs to rather
  // than as one free-text box at the end, because "the checkout was slow" answers a different
  // question from "the staff were unhelpful" and a single box loses which is which.
  const [notes,setNotes]=useState<Partial<Record<CriterionKey,string>>>({});
  // Whether the visit ended in a purchase, and what was bought. Unanswered is a third state
  // and not a silent "no": the step can be walked past, and a review is still a review.
  const [purchased,setPurchased]=useState<boolean|undefined>(undefined);
  const [purchasedItem,setPurchasedItem]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const [submitError,setSubmitError]=useState('');
  const autoVerificationAttempted=useRef(false);

  // The two steps are history entries, not component state. On a phone the back button
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
  // Each step starts where the last one started. Moving between them is a history entry, not
  // a navigation, so nothing resets the scroll: after eight scoring questions the page was
  // already near its bottom, and the purchase step -- three lines long -- opened there,
  // showing its footer with its question off the top of the screen.
  useLayoutEffect(()=>{window.scrollTo(0,0);},[step]);

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
    // Verified, and that is where this stops. It used to walk straight on to the scores,
    // which meant the page that says "your visit is verified" was drawn and left behind in
    // the same instant -- the reader never saw the one thing this step exists to tell them.
    // The background check saves a button press; it does not get to skip the answer.
    setVerification(await response.json() as VisitVerification);
  },[locale,reviewRadiusMeters,storeId,t]);

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

  // Reset again once the page has its real height. The mount-time reset below is not
  // enough on its own: this route paints a short loading state first, so a browser
  // arriving from far down a store page clamps the old offset to the bottom of that short
  // page instead of the top, and nothing moves it back when the content finally makes the
  // page tall. Locally the loading state is quick enough to hide this; in production it
  // left the review flow opening a hundred pixels down, with its own heading cut off.
  useScrollTopWhenReady(Boolean(store)&&signedIn!==undefined);

  // Advancing to the final check changes the URL without remounting the page. The browser
  // therefore keeps the score sheet's scroll offset unless this step owns the correction.
  // Do it before paint so the final check opens at its heading rather than jumping there.
  useLayoutEffect(()=>{
    if(step!==4)return;
    const root=document.documentElement;
    const previous=root.style.scrollBehavior;
    root.style.scrollBehavior='auto';
    window.scrollTo(0,0);
    root.style.scrollBehavior=previous;
  },[step]);

  // A one or a two is the only score somebody cannot act on. "Kasa hızı: 2" tells the next
  // reader nothing they can do anything with, and tells the shop nothing it could put right.
  // So a low mark is asked to say why, in the reader's own words, and the answer becomes the
  // review's text -- which until now these reviews did not have at all.
  const lowScores=criterionKeys.filter(key=>criteria[key]===1||criteria[key]===2);
  const notesGiven=lowScores.every(key=>(notes[key]??'').trim().length>0);
  const scored=criterionKeys.every(key=>(criteria[key]??0)>=1)&&notesGiven;
  const criteriaAverage=scored
    ?criterionKeys.reduce((sum,key)=>sum+(criteria[key]??0),0)/criterionKeys.length
    :0;

  const submit=async()=>{
    if(!verification||!scored)return;
    setSubmitting(true);setSubmitError('');
    const origin=readOriginSearch();
    try{
      // The eight go up; the overall rating is not sent, because the server derives it from
      // them. Two places computing the same average is two places that can disagree.
      const response=await apiFetch('/api/proxy/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        store_id:storeId,visit_verification_id:verification.id,content_language:locale,
        criteria:Object.fromEntries(criterionKeys.map(key=>[key,criteria[key]])),
        // Each low mark's reason, keyed by the heading it belongs to, so the store page can
        // put it beside the score it explains. It also goes into the review's body, where it
        // is the first written content these reviews have carried -- but the body is a
        // paragraph in whatever language the reviewer was using, and a heading translated
        // into it cannot be read back out. The keys can.
        ...(lowScores.length?{
          criterion_notes:Object.fromEntries(lowScores.map(key=>[key,(notes[key]??'').trim()])),
          text:lowScores.map(key=>`${t(criterionLabels[key])}: ${(notes[key]??'').trim()}`).join('\n'),
        }:{}),
        ...(purchased===undefined?{}:{purchased,...(purchased&&purchasedItem.trim()?{purchased_item:purchasedItem.trim()}:{})}),
        ...(origin?{origin_search_id:origin.search_id,origin_search_result_id:origin.search_result_id}:{}),
      })});
      if(response.status===401){setSignedIn(false);setAuth(true);return;}
      if(!response.ok)throw new Error();
      sessionStorage.setItem('bosagezme:review-nudge','1');
      // Two caches stand between writing a review and seeing it, and dropping one of them
      // was not enough.
      //
      // The first is the server's: the shop's page is prerendered, so without this the
      // reviewer arrives at a copy rendered before they wrote anything. That is what
      // refreshStorePage expires, under both addresses the page answers to.
      //
      // The second is the one that kept the review invisible after that was fixed, and it
      // is in the browser. The page comes back with `x-nextjs-stale-time: 300`, so the
      // router keeps its copy of the shop for five minutes and serves it on navigation
      // without asking the server at all -- and the reviewer was on that very page a moment
      // ago, which is how it got there. refresh() is what drops it, and it has to happen
      // before the navigation rather than after: afterwards it is refreshing a page that has
      // already been shown, which is the refresh the reader was having to do by hand.
      await refreshStorePage(storeId,store?.store.slug).catch(()=>undefined);
      // Loaded rather than navigated to, and this is the third attempt at it.
      //
      // The server's copy of the shop's page is expired above, so the page that gets built
      // is a fresh one. What kept showing the old review count was never the server: the
      // router keeps its own copy of a page for five minutes and serves it on navigation
      // without asking, and the reviewer had been on that very page a moment earlier, which
      // is how it got there. refresh() is supposed to drop it and, ordered either way
      // against the navigation, did not -- reported again with the detail that settles it:
      // reloading by hand three seconds later shows the review, so nothing is waiting on
      // the backend.
      //
      // So this one transition asks the browser for the page instead of the router. It
      // costs the instant transition once, on the one journey in the product where being
      // right matters more than being quick: somebody has just written something and is
      // going to look for it.
      window.location.assign(localePath(locale,`/stores/${storeId}`));
    }catch{setSubmitError(t('reviewError'));}
    finally{setSubmitting(false);}
  };

  if(loadError)return <main className="create-page"><div className="empty-state"><h1>{t('storeUnavailable')}</h1><button className="button primary" onClick={()=>router.push(localePath(locale,'/discover'))}>{t('discover')}</button></div></main>;
  if(!store||signedIn===undefined)return <ReviewLoadingState/>;

  // The first step renames itself once it is done. "Konumu doğrula" is an instruction and
  // it stops being true the moment the location is verified; leaving it there asks for
  // something already given.
  // Whatever the store page would show in its frame: an administrator's photograph first,
  // then the mark of the chain, then nothing -- the backend decides, and this screen only
  // draws what it decided.
  const photo=storePhotoURL(store.store.photo,320,store.store.name,store.store.categories);

  const steps=[[verification?t('verifyLocationDone'):t('verifyLocation'),MapPin],[t('criteriaTitle'),Star],[t('purchaseTitle'),ShoppingBag],[t('reviewSummaryTitle'),Check]] as const;
  return <main className="create-page">
    {/* The shop, drawn the way the list you came from draws it: the same frame in the same
        place, the same three lines beside it, at the same sizes. You arrived here by picking
        this shop out of a row of them, and the thing you picked should still look like the
        thing you picked -- a name set twice as large on the next screen is a second shop as
        far as recognising it goes. The picture is the point of the revision: the name and
        the address were already here, and neither of them tells you that you are standing
        in front of the right door. */}
    <div className="review-store">
      <div className="result-photo">{photo
        ?<Image className={`result-photo-mark${isBrandMark(store.store.photo,store.store.name,store.store.categories)?' is-brand-mark':''}`} src={photo} width={184} height={184} alt="" unoptimized/>
        :<div className="result-photo-empty" aria-hidden="true"><span>{store.store.name.trim().charAt(0).toLocaleUpperCase(locale)}</span></div>}</div>
      <div className="result-identity">
        <p className="eyebrow">{t('reviewFor')}</p>
        <h1>{store.store.name}</h1>
        <p className="result-address">{store.store.address||[store.store.district,store.store.city].filter(Boolean).join(', ')}</p>
      </div>
    </div>

    {/* Four stops across the top rather than a column the page scrolls past: the flow is the
        subject of this page, so where you are in it stays on the screen while you work. The
        marks are the ones each step already had -- a numbered circle would name the steps
        twice, once by position and once by what they are. */}
    <ol className="review-steps">{steps.map(([label,Icon],index)=>{
      const position=index+1;
      const verified=position===1&&Boolean(verification);
      // A step behind you can be returned to; one ahead cannot. Going back is how somebody
      // fixes a score they got wrong, and the stepper is the only thing on the screen that
      // says where that score was. Forward stays shut, because the steps are not optional --
      // the evidence of the visit is what unlocks the rest, and a stepper that let you skip
      // to the end would be offering something the flow would then refuse.
      const behind=position<step;
      const mark=<><span><Icon/></span><strong>{label}</strong></>;
      return <li key={label} className={[position===step?'current':behind?'done':'',verified?'is-verified':''].filter(Boolean).join(' ')} aria-current={position===step?'step':undefined}>
        {behind?<button type="button" className="review-step-jump" onClick={()=>advance(position)}>{mark}</button>:mark}
      </li>;
    })}</ol>

    {/* Below the whole stepper rather than inside the first step. It is the reason nothing
        can continue, so it belongs where the eye lands after reading what the steps are --
        not tucked under a button that has just refused. */}
    {verifyError&&<p className="verify-warning" role="alert"><TriangleAlert aria-hidden="true"/><span>{verifyError}</span></p>}

    {step===1&&<section className="review-step">
      {/* The sentence changes when the thing it describes does. Before the check it explains
          what the check buys you; after it, it says what you now have and how long you have
          it for. The green "visit verified" line that used to sit under it said the same
          thing a second time -- and the step itself is already marked done, in green, at the
          top of the page. */}
      {verification
        // Two facts, two lines, and each one dressed as what it is. The first is the same
        // verdict the results list gives -- same words, same tick, same green -- so a reader
        // who has seen it there recognises it here. The second is a condition with a date in
        // it, which is a notice and not a verdict, so it is framed like every other notice.
        ?<><p className="review-verified"><CircleCheck aria-hidden="true"/>{t('verifyValidityDone')}</p>
          <p className="review-window" role="note"><Info aria-hidden="true"/><span>{t('verifyValidityWindow')}</span></p></>
        :<><p>{t('verifyValidity')}</p>
          <button className="button primary" onClick={()=>void verify()} disabled={verifying||!signedIn}>{verifying?t('verifying'):verifyError?t('locationRetry'):t('verifyNow')}</button></>}
      {verification&&<div className="review-nav"><button className="button primary" onClick={()=>advance(2)}>{t('continue')}</button></div>}
    </section>}

    {step===2&&<section className="review-step">
      {/* A note about how the scoring works, not an instruction competing with the scores
          themselves: marked as one, and inside its own frame. */}
      <aside className="criteria-intro" role="note"><Info aria-hidden="true"/><p>{criteriaIntroCopy[locale][0]}<span>{criteriaIntroCopy[locale][1]}</span></p></aside>
      {/* Eight fieldsets rather than one, because each line is its own question and a
          screen reader has to be able to say which one it is reading. The overall rating is
          not among them: it is the average of these, worked out by the server. */}
      <div className="criteria-list">{criterionKeys.map((key,index)=>
        <fieldset key={key} className="rating-picker criterion">
          <legend><span className="criterion-number" aria-hidden="true">{index+1}</span>{t(criterionLabels[key])}</legend>
          <div className="criterion-stars">{[1,2,3,4,5].map(value=>
            <label key={value}><input type="radio" name={key} value={value} aria-label={`${value} / 5`} checked={criteria[key]===value} onChange={()=>setCriteria(current=>({...current,[key]:value}))}/><Star aria-hidden="true" className={value<=(criteria[key]??0)?'is-on':undefined}/></label>)}</div>
          {(criteria[key]===1||criteria[key]===2)&&<label className="criterion-note">
            <span>{lowScoreCopy[locale].prompt}</span>
            <textarea rows={2} maxLength={NOTE_LIMIT} value={notes[key]??''} placeholder={lowScoreCopy[locale].hint}
              onChange={event=>setNotes(current=>({...current,[key]:event.target.value}))}/>
            <small>{(notes[key]??'').length}/{NOTE_LIMIT}</small>
          </label>}
        </fieldset>)}
      </div>
      {/* Under the last question, where somebody who wants to start again is looking. It is
          not a primary action: starting over is the rarer of the two things to do here. */}
      <button type="button" className="button quiet criteria-clear" onClick={()=>setCriteria({})} disabled={!Object.keys(criteria).length}><Eraser aria-hidden="true"/>{t('clearScores')}</button>
      {!scored&&<p className="criteria-hint" role="note"><Info aria-hidden="true"/><span>{t('criteriaIncomplete')}</span></p>}
      {submitError&&<p className="form-error" role="alert">{submitError}</p>}
      <div className="review-nav"><button className="button quiet" onClick={()=>router.back()}>{t('back')}</button><button className="button primary" onClick={()=>advance(3)} disabled={!scored||!verification}>{t('confirmReview')}</button></div>
    </section>}

    {step===3&&<section className="review-step">
      <p className="criteria-intro-plain">{t('purchaseIntro')}</p>
      <fieldset className="purchase-answer">
        <legend>{t('purchaseQuestion')}</legend>
        <label data-selected={purchased===true}><input type="radio" name="purchased" checked={purchased===true} onChange={()=>setPurchased(true)}/><span>{t('yes')}</span></label>
        <label data-selected={purchased===false}><input type="radio" name="purchased" checked={purchased===false} onChange={()=>{setPurchased(false);setPurchasedItem('');}}/><span>{t('no')}</span></label>
      </fieldset>
      {/* Asked only where there is something to name. The words are the shopper's own: what
          somebody calls what they bought is the vocabulary the next search for it will use. */}
      {purchased===true&&<label className="purchase-item">
        <span>{t('purchasedItemLabel')}</span>
        <input type="text" maxLength={120} value={purchasedItem} placeholder={t('purchasedItemHint')} onChange={event=>setPurchasedItem(event.target.value)}/>
      </label>}
      {/* The step asks a question, so it cannot be left before it is answered. Saying yes and
          naming nothing is the same as not answering: the name is the whole value of the yes,
          because it is the word the next person searching for that thing will type. */}
      <div className="review-nav"><button className="button quiet" onClick={()=>router.back()}>{t('back')}</button><button className="button primary" onClick={()=>advance(4)} disabled={purchased===undefined||(purchased===true&&!purchasedItem.trim())}>{t('continue')}</button></div>
    </section>}

    {/* Nothing is written until this page. Eight scores given one after another are easy to
        get wrong by a star and impossible to check while giving them; this is where they are
        all visible at once, and the only place the review is actually published from. */}
    {step===4&&<section className="review-step">
      <p className="criteria-intro-plain">{t('reviewSummaryIntro')}</p>
      <div className="review-summary-average"><span>{t('ratingLabel')}</span><RatingStars value={criteriaAverage}/></div>
      <dl className="review-summary">{criterionKeys.map((key,index)=>
        <div key={key}>
          <dt><span className="criterion-number" aria-hidden="true">{index+1}</span>{t(criterionLabels[key])}</dt>
          <dd><RatingStars value={criteria[key]??0} showValue={false}/><span>{criteria[key]}</span></dd>
        </div>)}
      </dl>
      {purchased!==undefined&&<p className="review-summary-purchase">{purchased?(purchasedItem.trim()?`${t('purchasedYes')} · ${purchasedItem.trim()}`:t('purchasedYes')):t('purchasedNo')}</p>}
      {submitError&&<p className="form-error" role="alert">{submitError}</p>}
      {/* The button keeps its own name while it is working. It used to borrow the search
          page's loading word, so publishing a review said "Aranıyor…". */}
      <div className="review-nav"><button className="button quiet" onClick={()=>router.back()}>{t('back')}</button><button className="button primary" onClick={()=>void submit()} disabled={submitting||!scored||!verification}>{t('submitReview')}</button></div>
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
