'use client';

import Image from 'next/image';
import {X} from 'lucide-react';
import {useCallback,useEffect,useRef,useState} from 'react';
import {CategoryIcon,hasCategoryPicture,hasCategorySign} from './CategoryIcon';
import type {Locale} from '@/lib/types';

// Tapping a category used to run the search on the spot. That is one tap for a decision the
// reader had not made yet: the names are short and several are close together -- "Ev
// Gereçleri" and "Ev Aksesuarları" are not the same shelf and do not read as different words
// at a glance -- so the list was answering before it had been asked.
//
// It opens the category instead, at the size the picture was drawn for, and the search is
// behind its own button. The picture is the point: it says what the category means faster
// than the name does, which is what pictures are for.
// The qualifier and the act are two different things and were one string. "Nearest to me"
// is which shop the search will find; "search" is what pressing this does. Only the second
// belongs on the button. The whole sentence stays as the button's accessible name, because
// a reader who cannot see the line above it would otherwise lose half the meaning.
const copy:Record<Locale,{lead:string;search:string;full:string;close:string}>={
  tr:{lead:'Bana en yakın',search:'Mağazayı ara',full:'Bana en yakın mağazayı ara',close:'Kapat'},
  en:{lead:'Nearest to me',search:'Find a store',full:'Find the nearest store',close:'Close'},
  de:{lead:'Mir am nächsten',search:'Geschäft finden',full:'Nächstgelegenes Geschäft finden',close:'Schließen'},
  ru:{lead:'Ближайший ко мне',search:'Найти магазин',full:'Найти ближайший магазин',close:'Закрыть'},
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

  return <div className="dialog-backdrop category-sheet-backdrop" data-state={leaving?'leaving':'visible'} role="presentation"
    onMouseDown={event=>{if(event.target===event.currentTarget)close();}}>
    <div className="category-sheet" role="dialog" aria-modal="true" aria-labelledby="category-sheet-title">
      <header>
        <h2 id="category-sheet-title">{name}</h2>
        <button type="button" className="icon-button" onClick={close} aria-label={words.close}><X aria-hidden="true"/></button>
      </header>
      {/* Shot wide and shown as a 44px circle in the list, which is almost all of a photograph
          thrown away. Here it runs the full width of the sheet, uncropped. A category without
          a photograph falls back to its line icon rather than to an empty frame -- three of
          them have no picture yet and an empty box would read as a fault. */}
      <div className="category-sheet-art">
        {hasCategoryPicture(slug)
          ?<Image src={`/categories/${slug}.webp`} width={720} height={400} alt="" aria-hidden="true" sizes="(max-width:600px) 100vw, 372px"/>
          :<CategoryIcon slug={slug}/>}
      </div>
      {/* R44: the shop whose sign carries this category's name. Picked by the slug rather
          than by anybody's judgement -- the file is named after the category it shows. */}
      <div className="category-sheet-foot">
        {hasCategorySign(slug)&&<Image className="category-sheet-sign" src={`/categories/signs/${slug}.webp`} width={300} height={290} alt="" aria-hidden="true"/>}
        <div className="category-sheet-act">
          <p className="category-sheet-lead">{words.lead}</p>
          <button ref={action} type="button" className="button primary category-sheet-search" onClick={onSearch} aria-label={words.full}>
            {words.search}
          </button>
        </div>
      </div>
    </div>
  </div>;
}
