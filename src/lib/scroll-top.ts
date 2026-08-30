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
    if(ready)window.scrollTo(0,0);
  },[ready]);
}
