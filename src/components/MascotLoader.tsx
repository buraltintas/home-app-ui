'use client';

import Image from 'next/image';
import {useState,useSyncExternalStore} from 'react';
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

// The still is what is drawn, and the video only takes over once it is actually running.
//
// Two things were visible here and both were this swap. The server has no media query to
// read, so it draws the still; the browser then decided motion was fine and replaced it,
// which is a picture changing under the reader for no reason they caused. And when the
// video could not start -- an iPhone in low power mode refuses to autoplay -- Safari left
// its own play button sitting on the poster, so a loading indicator looked like something
// you were supposed to press.
//
// Waiting for `playing` answers both: nothing changes unless there is something better to
// change to, and a video that never starts is never shown.
//
// It lives in one place because it was fixed in one place and stayed broken in the other.
// The search overlay drew the same mascot the old way and kept showing Safari's play
// button months after this was understood.
export function MascotArt({className='mascot-loader-art'}:{className?:string}){
  const reducedMotion=useSyncExternalStore(subscribeToMotion,()=>window.matchMedia(REDUCED).matches,()=>true);
  // It has to go back, too. Waiting for `playing` covered a video that never starts, but
  // not one that starts and then stops: a phone entering low power mode mid-loop pauses
  // it, and a paused video is exactly what the browser draws its own play button on. So a
  // stop of any kind hands the screen back to the still, which is the one thing here that
  // can never fail.
  const [playing,setPlaying]=useState(false);
  const stopped=()=>setPlaying(false);
  return <span className={className} data-playing={playing||undefined}>
    <Image src="/brand/mascot-magnifier.png" width={168} height={168} alt="" priority/>
    {!reducedMotion&&<video src="/brand/mascot-search.mp4" autoPlay muted loop playsInline aria-hidden="true"
      onPlaying={()=>setPlaying(true)} onPause={stopped} onEnded={stopped} onError={stopped} onStalled={stopped} onSuspend={stopped}/>}
  </span>;
}

// Reduced motion is resolved before render so the video element is never mounted
// for people who asked not to see looping animation.
export function MascotLoader({label}:{label?:string}){
  const {t}=useI18n();
  return <div className="mascot-loader" role="status" aria-live="polite">
    <MascotArt/>
    <p>{label??t('loading')}</p>
  </div>;
}
