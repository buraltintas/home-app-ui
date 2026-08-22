'use client';

import {useEffect,useRef,useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import type {Locale} from '@/lib/types';

const CODES:Locale[]=['tr','en','de','ru'];
const SHORT:Record<Locale,string>={tr:'TR',en:'EN',de:'DE',ru:'RU'};
const NAMES:Record<Locale,string>={tr:'Türkçe',en:'English',de:'Deutsch',ru:'Русский'};

// A native select renders the operating system's own menu, which on a desktop browser is a
// small grey panel that opens over the masthead and belongs to no design system at all. The
// menu is ours, so it looks like the rest of the product and can show each language in its
// own name rather than a two-letter code.
export function HeaderLocale(){
  const {locale,setLocale}=useI18n();
  const [open,setOpen]=useState(false);
  const box=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!open)return;
    const away=(event:MouseEvent)=>{if(box.current&&!box.current.contains(event.target as Node))setOpen(false);};
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false);};
    document.addEventListener('mousedown',away);
    document.addEventListener('keydown',escape);
    return()=>{document.removeEventListener('mousedown',away);document.removeEventListener('keydown',escape);};
  },[open]);

  const choose=(code:Locale)=>{setOpen(false);if(code!==locale)void setLocale(code).catch(()=>undefined);};

  return <div className="header-locale" ref={box}>
    <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={NAMES[locale]}
      className="header-locale-trigger" onClick={()=>setOpen(value=>!value)}>
      <span>{SHORT[locale]}</span>
      <svg viewBox="0 0 12 8" aria-hidden="true" className="header-locale-caret"><path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    {open&&<ul className="header-locale-menu" role="listbox" aria-label={NAMES[locale]}>
      {CODES.map(code=><li key={code}>
        <button type="button" role="option" aria-selected={code===locale}
          className={code===locale?'is-current':undefined} onClick={()=>choose(code)}>
          <span className="header-locale-code">{SHORT[code]}</span>{NAMES[code]}
        </button>
      </li>)}
    </ul>}
  </div>;
}
