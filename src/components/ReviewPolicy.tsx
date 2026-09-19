'use client';

import {ShieldCheck,X} from 'lucide-react';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {Locale} from '@/lib/types';

// What this product will and will not do about what is written under it, said where somebody
// decides whether to believe it.
//
// The first sentence is the one that answers that question, so it is always on screen. The
// second is the disclaimer, and it opens -- in a panel rather than by growing the note in
// place. A note that unfolds pushes the reviews down the page, which moves the thing the
// reader was looking at in order to explain the thing they were not.
const MOTION_MS=520;

export function ReviewPolicy({locale,copy}:{
  locale:Locale;
  copy:{first:string;rest:string;more:string;title:string;close:string};
}){
  const [open,setOpen]=useState(false);
  const [leaving,setLeaving]=useState(false);
  const opener=useRef<HTMLButtonElement>(null);
  const action=useRef<HTMLButtonElement>(null);

  // The same 0.52s and the same curve the category sheet and the location panel arrive on.
  // Three panels in one product that open at three speeds read as three products.
  const close=useCallback(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setOpen(false);opener.current?.focus({preventScroll:true});return;}
    setLeaving(true);
    window.setTimeout(()=>{setOpen(false);setLeaving(false);opener.current?.focus({preventScroll:true});},MOTION_MS);
  },[]);

  useEffect(()=>{
    if(!open)return;
    action.current?.focus();
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')close();};
    window.addEventListener('keydown',escape);
    return()=>window.removeEventListener('keydown',escape);
  },[open,close]);

  return <>
    <aside className="store-review-policy" role="note" lang={locale}>
      <ShieldCheck aria-hidden="true"/>
      <div>
        <p>{copy.first}</p>
        <button ref={opener} type="button" className="store-review-policy-more" onClick={()=>setOpen(true)}>{copy.more}</button>
      </div>
    </aside>
    {open&&<div className={`dialog-backdrop review-policy-backdrop${leaving?' is-leaving':''}`} role="presentation"
      onMouseDown={event=>{if(event.target===event.currentTarget)close();}}>
      <div className="review-policy-sheet" role="dialog" aria-modal="true" aria-labelledby="review-policy-title">
        <header>
          <h2 id="review-policy-title">{copy.title}</h2>
          <button ref={action} type="button" className="icon-button" onClick={close} aria-label={copy.close}><X aria-hidden="true"/></button>
        </header>
        {/* Both sentences, because a panel opened to read the whole thing should hold the
            whole thing -- not the half the note was not already showing. */}
        <p>{copy.first}</p>
        <p>{copy.rest}</p>
      </div>
    </div>}
  </>;
}
