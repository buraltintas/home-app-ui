'use client';

import {useEffect,useLayoutEffect} from 'react';
import {usePathname} from 'next/navigation';

// A navigation begins at the top of the page it goes to, and the next thing shown after the
// tap is that page.
//
// The first half was reported as "the shop page opens part way down and then jumps to the
// top". Tapping a shop from a page scrolled to 2200px went: 2200, then 760 while the page
// being left was *still on screen*, then 0 once the shop arrived. The 760 is the framework
// scrolling the new route into view before it exists, which lands on the old document. So the
// scroll was moved to before leaving: one instant jump on the page being left.
//
// R86 is the cost of that, reported in turn: the jump shows the top of the page being left --
// the store's photograph, on the way to its reviews -- for as long as the next page takes to
// arrive. Neither page is the one asked for. So the page being left is now taken off the
// screen in the same instant it is scrolled: what shows between the tap and the next page is
// the masthead over the page's own empty ground, and the first page drawn after the tap is
// the destination, at its top.
//
// Taking a page off the screen is only safe if it always comes back, so every way a
// navigation can end gives it back: the new route arriving (before that frame is painted), a
// click no in-app link took (the browser loads the page itself, or nothing happens), a click
// on the page already showing (it replaces whatever was pending), back and forward, the page
// being put into or brought out of the browser's back-forward cache, and -- for a navigation
// that never ends -- a long last-resort timer.
//
// Only plain in-app navigations to another path. A new tab, a download, a modified click, an
// anchor within the page and a change of query on the same page all keep whatever the
// browser and the page do with them.
const LEAVING='navigating';
let fallback=0;

function settle(){
  window.clearTimeout(fallback);
  delete document.documentElement.dataset[LEAVING];
}

export function NavigationStartsAtTop(){
  const pathname=usePathname();
  // Before paint: the new page's first frame is the one that has the slot visible again.
  useLayoutEffect(()=>{settle();},[pathname]);

  useEffect(()=>{
    const onClick=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const anchor=(event.target as Element|null)?.closest?.('a[href]') as HTMLAnchorElement|null;
      if(!anchor||anchor.target&&anchor.target!=='_self'||anchor.hasAttribute('download'))return;
      const href=anchor.getAttribute('href')??'';
      if(!href.startsWith('/')||href.startsWith('//')||href.startsWith('/#'))return;
      const destination=new URL(anchor.href,window.location.href);
      if(destination.origin!==window.location.origin)return;
      // The page already showing, with or without another query: it replaces anything still
      // pending, so a page taken off the screen for that is given back now.
      if(destination.pathname===window.location.pathname){
        settle();
        // Same page, different hash: a jump within this document, and it belongs to whatever
        // asked for it.
        if(destination.search===window.location.search)return;
      }else{
        document.documentElement.dataset[LEAVING]='';
        window.clearTimeout(fallback);
        fallback=window.setTimeout(settle,15000);
      }
      if(window.scrollY!==0)window.scrollTo({top:0,left:0,behavior:'instant'});
    };
    // After every handler has had the click: if no in-app link took it, there is no route
    // change to wait for -- the browser is loading the page itself, or nothing happens.
    const afterClick=(event:MouseEvent)=>{if(!event.defaultPrevented)settle();};
    const onShow=(event:PageTransitionEvent)=>{if(event.persisted)settle();};
    document.addEventListener('click',onClick,true);
    window.addEventListener('click',afterClick);
    window.addEventListener('popstate',settle);
    window.addEventListener('pagehide',settle);
    window.addEventListener('pageshow',onShow);
    return()=>{
      document.removeEventListener('click',onClick,true);
      window.removeEventListener('click',afterClick);
      window.removeEventListener('popstate',settle);
      window.removeEventListener('pagehide',settle);
      window.removeEventListener('pageshow',onShow);
      settle();
    };
  },[]);
  return null;
}
