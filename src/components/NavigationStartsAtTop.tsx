'use client';

import {useEffect} from 'react';

// A navigation begins at the top of the page it goes to. This makes that true at the moment
// the reader asks for it, rather than after the new page has already been shown to them.
//
// What it fixes was reported as "the shop page opens part way down and then jumps to the
// top", and the measurement is worth writing down because the cause is not where it looks.
// Tapping a shop from a page scrolled to 2200px went: 2200, then 760 while the page being
// left was *still on screen*, then 0 once the shop arrived. The 760 is the framework
// scrolling the new route into view before it exists, which lands on the old document. On a
// fast connection that state lasts 50ms; on a phone it lasts as long as the fetch, and what
// a person sees is a page that opened somewhere in its middle and then moved on its own.
//
// Correcting it on arrival cannot work -- by then it has been seen. So the scroll is done
// before leaving: one instant jump on the page being left, which is either invisible
// (the next page is already there) or shows the top of a page the reader is done with.
//
// Only plain in-app navigations. A new tab, a download, a modified click and an anchor
// within the page all keep whatever the browser does with them.
export function NavigationStartsAtTop(){
  useEffect(()=>{
    const onClick=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const anchor=(event.target as Element|null)?.closest?.('a[href]') as HTMLAnchorElement|null;
      if(!anchor||anchor.target&&anchor.target!=='_self'||anchor.hasAttribute('download'))return;
      const href=anchor.getAttribute('href')??'';
      if(!href.startsWith('/')||href.startsWith('//')||href.startsWith('/#'))return;
      const destination=new URL(anchor.href,window.location.href);
      if(destination.origin!==window.location.origin)return;
      // Same page, different hash: that is a jump within this document and belongs to
      // whatever asked for it.
      if(destination.pathname===window.location.pathname&&destination.search===window.location.search)return;
      if(window.scrollY===0)return;
      window.scrollTo({top:0,left:0,behavior:'instant'});
    };
    document.addEventListener('click',onClick,true);
    return()=>document.removeEventListener('click',onClick,true);
  },[]);
  return null;
}
