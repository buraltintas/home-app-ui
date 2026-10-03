'use client';

import {X} from 'lucide-react';
import {type ReactNode,useCallback,useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {useI18n} from '@/i18n/I18nProvider';

// The sheet an "i" opens: a heading, a sentence or two, and a way to close it.
//
// It was drawn inline inside the review card that first needed it. R54 asked for the same
// sheet beside "Rutin alışveriş" -- same look, and in particular the same speed in and out --
// so it is one component now rather than a second copy that would drift at the next change
// to either. It arrives and leaves on the curve and the 0.52s every other sheet in this
// product uses (the animation lives on `.add-store-sheet` in daylight.css).
//
// It goes to document.body through a portal, as everything that floats over the page does
// (AGENTS.md): opened from inside a form, a <details> or a card with overflow hidden, it still
// covers the page and none of them changes what it does.
//
// Rendered only while open: the owner mounts it on the tap and unmounts it from `onClosed`,
// which is called once the leaving animation has finished.
const LEAVE_MS=520;

export function InfoSheet({title,children,onClosed,className}:{title:string;children:ReactNode;onClosed:()=>void;className?:string}){
  const {t}=useI18n();
  const id=useId();
  const [leaving,setLeaving]=useState(false);
  const closeButton=useRef<HTMLButtonElement>(null);
  const opener=useRef<Element|null>(null);
  const timer=useRef<number|undefined>(undefined);
  // Read through a ref so that an owner passing a new function on every render does not
  // re-run the opening effect below -- which would move focus back to the close button and
  // forget which control opened the sheet.
  const closed=useRef(onClosed);
  useEffect(()=>{closed.current=onClosed;},[onClosed]);
  const close=useCallback(()=>{
    if(timer.current!==undefined)return;
    const done=()=>{
      // Back to the control that opened it, so a keyboard reader carries on from there.
      if(opener.current instanceof HTMLElement)opener.current.focus({preventScroll:true});
      closed.current();
    };
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){timer.current=0;done();return;}
    setLeaving(true);
    timer.current=window.setTimeout(done,LEAVE_MS);
  },[]);
  useEffect(()=>{
    opener.current??=document.activeElement;
    closeButton.current?.focus({preventScroll:true});
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')close();};
    window.addEventListener('keydown',escape);
    return()=>{window.removeEventListener('keydown',escape);if(timer.current)window.clearTimeout(timer.current);};
  },[close]);
  return createPortal(<div className="dialog-backdrop add-store-backdrop" data-state={leaving?'leaving':'visible'} role="presentation"
    onMouseDown={event=>{if(event.target===event.currentTarget)close();}}>
    <div className={['add-store-sheet','criterion-rule-sheet',className].filter(Boolean).join(' ')} role="dialog" aria-modal="true" aria-labelledby={id}>
      <header>
        <h3 id={id}>{title}</h3>
        <button ref={closeButton} type="button" className="icon-button" aria-label={t('close')} onClick={close}><X aria-hidden="true"/></button>
      </header>
      {children}
    </div>
  </div>,document.body);
}
