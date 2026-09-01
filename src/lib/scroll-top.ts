'use client';

import {useLayoutEffect} from 'react';

// A page that paints a loading state before its content opens scrolled down.
//
// The browser keeps the scroll offset it had on the page you came from. While the loading
// state is on screen the document is short, so that offset is clamped to nearly nothing
// and looks fine; when the real content arrives the document grows and the offset is
// restored against it. You land part way down a page you have never seen, and the header
// is above you.
//
// Forcing the top once -- and only once the content has settled -- is the whole fix. It
// runs in a layout effect so the correction happens before the frame is painted, rather
// than as a visible jump.
export function useScrollTopWhenReady(ready:boolean){
  useLayoutEffect(()=>{
    if(!ready)return;
    const previous=history.scrollRestoration;
    history.scrollRestoration='manual';
    const top=()=>window.scrollTo(0,0);
    top();
    // Framework navigation and bfcache restoration can both apply their saved offset
    // after the first layout effect. Cover those two browser-owned moments, then stop;
    // a real scroll by the visitor must never be pulled back to the top.
    let secondFrame=0;
    const firstFrame=requestAnimationFrame(()=>{top();secondFrame=requestAnimationFrame(top);});
    const restore=()=>top();
    window.addEventListener('pageshow',restore,{once:true});
    const timer=window.setTimeout(()=>{history.scrollRestoration=previous;},120);
    return()=>{
      cancelAnimationFrame(firstFrame);cancelAnimationFrame(secondFrame);
      clearTimeout(timer);window.removeEventListener('pageshow',restore);
      history.scrollRestoration=previous;
    };
  },[ready]);
}
