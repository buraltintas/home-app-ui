'use client';

import {ChevronRight,NotebookPen,X} from 'lucide-react';
import {useCallback,useEffect,useRef,useState} from 'react';
import {StoreCorrectionForm,storeCorrectionIntro} from './StoreCorrectionForm';
import type {Locale} from '@/lib/types';

// Reporting a wrong address is a footnote to reading a store page, not a destination.
//
// It used to be a page: the reader was taken off the shop they were looking at, and coming
// back meant the browser's back button and whatever scroll position survived it. Somebody
// who spots a wrong phone number halfway down a page is not looking to go somewhere; they
// want to say one thing and carry on reading. So it opens where they are, the way suggesting
// a missing shop opens at the end of a list of results.
//
// The form itself is the same component the page still uses -- a link somebody was sent has
// to keep working -- and the heading and its sentence are read from one place, so the two
// cannot drift into saying different things.
const closeLabel:Record<Locale,string>={tr:'Kapat',en:'Close',de:'Schließen',ru:'Закрыть'};

// Every sheet in the product opens and closes over this long, on this curve.
const MOTION_MS=520;

export function StoreCorrectionSheet({locale,storeId,storeName,title,body}:{
  locale:Locale;storeId:string;storeName:string;title:string;body:string;
}){
  const [open,setOpen]=useState(false);
  // Closing waits for the animation rather than cutting to nothing. The duration is the
  // product's one sheet duration; a second number here would be a second product.
  const [leaving,setLeaving]=useState(false);
  const opener=useRef<HTMLButtonElement>(null);
  const action=useRef<HTMLButtonElement>(null);
  const intro=storeCorrectionIntro[locale];

  // Focus goes back to the control that opened the sheet, without the scroll that focusing
  // normally brings: that control sits a long way down the page, and returning the reader to
  // it by jumping there is the thing this sheet exists to avoid.
  const restoreTo=useRef(0);
  const finish=useCallback(()=>{
    setOpen(false);setLeaving(false);
    opener.current?.focus({preventScroll:true});
    window.scrollTo(0,restoreTo.current);
  },[]);
  const close=useCallback(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    setLeaving(true);
    window.setTimeout(finish,MOTION_MS);
  },[finish]);

  useEffect(()=>{
    if(!open)return;
    restoreTo.current=window.scrollY;
    action.current?.focus();
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')close();};
    window.addEventListener('keydown',escape);
    return()=>window.removeEventListener('keydown',escape);
  },[open,close]);

  return <>
    {/* The same card the page has always shown, drawn the same way. Only what it does
        changed, so only the element changed with it: a button, because it no longer
        goes anywhere. */}
    <button ref={opener} type="button" className="store-correction-card" onClick={()=>setOpen(true)}>
      <span className="store-correction-mark" aria-hidden="true"><NotebookPen/></span>
      <span className="store-correction-copy"><strong>{title}</strong><span>{body}</span></span>
      <ChevronRight className="store-correction-go" aria-hidden="true"/>
    </button>
    {open&&<div className="dialog-backdrop add-store-backdrop" data-state={leaving?'leaving':'visible'} role="presentation"
      onMouseDown={event=>{if(event.target===event.currentTarget)close();}}>
      <div className="add-store-sheet store-correction-sheet" role="dialog" aria-modal="true" aria-labelledby="store-correction-title">
        <header>
          <h3 id="store-correction-title">{intro.title}</h3>
          <button ref={action} type="button" className="icon-button" aria-label={closeLabel[locale]} onClick={close}><X aria-hidden="true"/></button>
        </header>
        {/* The shop is not named here. On the page this sheet replaces, the reader had left
            the shop behind and needed telling which one they were writing about; here the
            shop is the thing underneath the sheet. */}
        <p className="store-correction-sheet-intro">{intro.intro}</p>
        <StoreCorrectionForm locale={locale} storeId={storeId} storeName={storeName}/>
      </div>
    </div>}
  </>;
}
