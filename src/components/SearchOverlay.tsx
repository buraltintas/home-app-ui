'use client';
import Image from 'next/image';
import {useEffect,useState,useSyncExternalStore} from 'react';
import {useI18n} from '@/i18n/I18nProvider';

const REDUCED='(prefers-reduced-motion: reduce)';
const subscribeToMotion=(notify:()=>void)=>{
  const query=window.matchMedia(REDUCED);
  query.addEventListener('change',notify);
  return()=>query.removeEventListener('change',notify);
};

const STEPS=['searchStep1','searchStep2','searchStep3','searchStep4'] as const;
const STEP_MS=1600;

// A search takes long enough that a single spinner tells the visitor nothing except that
// they are waiting. The steps name what is actually happening -- reading the request,
// looking nearby, weighing community reviews, ordering by distance -- so the wait reads as
// work rather than a stall.
//
// The steps loop rather than stopping at the last one. A progress bar that fills and then
// sits at the end looks broken when the answer takes longer than expected, and this cannot
// know how long it will take.
export function SearchOverlay(){
  const {t}=useI18n();
  const reducedMotion=useSyncExternalStore(subscribeToMotion,()=>window.matchMedia(REDUCED).matches,()=>true);
  const [step,setStep]=useState(0);

  useEffect(()=>{
    if(reducedMotion)return;
    const timer=window.setInterval(()=>setStep(value=>(value+1)%STEPS.length),STEP_MS);
    return()=>window.clearInterval(timer);
  },[reducedMotion]);

  return <div className="search-overlay" role="status" aria-live="polite">
    <div className="search-overlay-card">
      {reducedMotion
        ?<Image src="/brand/mascot-magnifier.png" width={132} height={132} alt="" priority/>
        :<video src="/brand/mascot-search.mp4" poster="/brand/mascot-magnifier.png" autoPlay muted loop playsInline aria-hidden="true"/>}

      <p className="search-overlay-title">{t('searchingStores')}</p>

      {/* Under reduced motion the whole list is shown at once rather than cycling: the
          information is the point, the animation is not. */}
      <ol className="search-overlay-steps" data-static={reducedMotion||undefined}>
        {STEPS.map((key,index)=>
          <li key={key} data-state={reducedMotion?'shown':index===step?'active':index<step?'done':'waiting'}>
            {t(key)}
          </li>)}
      </ol>
    </div>
  </div>;
}
