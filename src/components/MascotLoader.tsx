'use client';

import Image from 'next/image';
import {useSyncExternalStore} from 'react';
import {useI18n} from '@/i18n/I18nProvider';

// The media query is an external store, so it is subscribed to rather than copied into
// state. Rendering the still image on the server keeps the reduced-motion promise even
// for the very first frame.
const REDUCED='(prefers-reduced-motion: reduce)';
const subscribeToMotion=(notify:()=>void)=>{
  const query=window.matchMedia(REDUCED);
  query.addEventListener('change',notify);
  return()=>query.removeEventListener('change',notify);
};

// Reduced motion is resolved before render so the video element is never mounted
// for people who asked not to see looping animation.
export function MascotLoader({label}:{label?:string}){
  const {t}=useI18n();
  const reducedMotion=useSyncExternalStore(subscribeToMotion,()=>window.matchMedia(REDUCED).matches,()=>true);
  const text=label??t('loading');
  return <div className="mascot-loader" role="status" aria-live="polite">
    {reducedMotion
      ?<Image src="/brand/mascot-magnifier.png" width={168} height={168} alt="" priority/>
      :<video src="/brand/mascot-search.mp4" poster="/brand/mascot-magnifier.png" autoPlay muted loop playsInline aria-hidden="true"/>}
    <p>{text}</p>
  </div>;
}
