'use client';
import {useEffect,useState,useSyncExternalStore} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {MascotArt} from './MascotLoader';

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
      {/* A bare video with a poster is what put Safari's own play button on this screen:
          autoplay is refused in low power mode, and the browser then offers the control
          it thinks the reader wants. A loading indicator you can press is not a loading
          indicator. This draws the still and lets the video take over only once it is
          genuinely running -- the same rule the profile and favourites loaders follow. */}
      <MascotArt className="search-overlay-art"/>

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
