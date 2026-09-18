'use client';

import Image from 'next/image';
import {X} from 'lucide-react';
import {useCallback,useEffect,useRef,useState} from 'react';
import {CategoryIcon,hasCategoryPicture} from './CategoryIcon';
import type {Locale} from '@/lib/types';

// Tapping a category used to run the search on the spot. That is one tap for a decision the
// reader had not made yet: the names are short and several are close together -- "Ev
// Gereçleri" and "Ev Aksesuarları" are not the same shelf and do not read as different words
// at a glance -- so the list was answering before it had been asked.
//
// It opens the category instead, at the size the picture was drawn for, and the search is
// behind its own button. The picture is the point: it says what the category means faster
// than the name does, which is what pictures are for.
const copy:Record<Locale,{search:string;close:string}>={
  tr:{search:'Bana en yakın mağazayı ara',close:'Kapat'},
  en:{search:'Find the nearest store',close:'Close'},
  de:{search:'Nächstgelegenes Geschäft finden',close:'Schließen'},
  ru:{search:'Найти ближайший магазин',close:'Закрыть'},
};

const MOTION_MS=520;

export function CategorySheet({slug,name,locale,onSearch,onClose}:{
  slug:string;name:string;locale:Locale;onSearch:()=>void;onClose:()=>void;
}){
  const words=copy[locale];
  const action=useRef<HTMLButtonElement>(null);
  const [leaving,setLeaving]=useState(false);

  const close=useCallback(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){onClose();return;}
    setLeaving(true);
    window.setTimeout(onClose,MOTION_MS);
  },[onClose]);

  useEffect(()=>{
    action.current?.focus();
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')close();};
    window.addEventListener('keydown',escape);
    return()=>window.removeEventListener('keydown',escape);
  },[close]);

  return <div className={`dialog-backdrop category-sheet-backdrop${leaving?' is-leaving':''}`} role="presentation"
    onMouseDown={event=>{if(event.target===event.currentTarget)close();}}>
    <div className="category-sheet" role="dialog" aria-modal="true" aria-labelledby="category-sheet-title">
      <header>
        <h2 id="category-sheet-title">{name}</h2>
        <button type="button" className="icon-button" onClick={close} aria-label={words.close}><X aria-hidden="true"/></button>
      </header>
      {/* Drawn at 192px and shown at 26 in the list. Here it gets the size it was made for.
          A category without a drawing falls back to its line icon rather than to an empty
          frame -- three of them have no picture yet and an empty box would read as a fault. */}
      <div className="category-sheet-art">
        {hasCategoryPicture(slug)
          ?<Image src={`/categories/${slug}.png`} width={192} height={192} alt="" aria-hidden="true"/>
          :<CategoryIcon slug={slug}/>}
      </div>
      <button ref={action} type="button" className="button primary category-sheet-search" onClick={onSearch}>
        {words.search}
      </button>
    </div>
  </div>;
}
