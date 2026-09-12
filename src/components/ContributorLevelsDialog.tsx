'use client';

import {X} from 'lucide-react';
import {useEffect,useState} from 'react';
import {about} from '@/content/legal/about';
import type {Locale} from '@/lib/types';

// What the levels are for, shown where somebody is looking at their own level rather than
// on a page they have to leave for. The words are not written again here: they are read
// from the "katki" section of the About document, which is the one place this is stated
// and the place the store page links to. Two copies of an explanation drift apart, and the
// one nobody remembers to update is the one people read.
// The same two lines the store page shows, in the same order, so the control a reader
// meets in two places is one control rather than two that happen to agree.
const openLabel:Record<Locale,string>={
  tr:'Katkı seviyeni yükselt',
  en:'Raise your contributor level',
  de:'Beitragsstufe erhöhen',
  ru:'Повысить уровень участника',
};
const openHint:Record<Locale,string>={
  tr:'Katkı seviyeleri ne işe yarar?',
  en:'What are contributor levels for?',
  de:'Wozu dienen Beitragsstufen?',
  ru:'Для чего нужны уровни участника?',
};
const closeLabel:Record<Locale,string>={tr:'Kapat',en:'Close',de:'Schließen',ru:'Закрыть'};

export function ContributorLevelsDialog({locale}:{locale:Locale}){
  const [open,setOpen]=useState(false);
  const [leaving,setLeaving]=useState(false);
  const section=about.content[locale].sections.find(entry=>entry.id==='katki');

  // It arrives and leaves at the speed the docks do, which is the only other thing on this
  // product that slides up from the bottom edge. It used to appear and vanish in the same
  // frame -- nothing about that said which direction it came from or that it had gone.
  //
  // Closing waits for the animation before it unmounts, because an element removed from the
  // page cannot animate its way off it.
  const close=()=>{
    setLeaving(true);
    window.setTimeout(()=>{setOpen(false);setLeaving(false);},420);
  };

  // Escape closes it, as it does every other dialog here.
  useEffect(()=>{
    if(!open)return;
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape')close();};
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[open]);

  if(!section)return null;
  return <>
    <div className="level-boost">
      <button type="button" className="contribution-progress level-boost-action" onClick={()=>setOpen(true)}>
        <span aria-hidden="true">↗</span><span><strong>{openLabel[locale]}</strong><small>{openHint[locale]}</small></span>
      </button>
    </div>
    {open&&<div className="dialog-backdrop" data-state={leaving?'leaving':'visible'} role="presentation" onMouseDown={close}>
      <section className="auth-dialog level-dialog" role="dialog" aria-modal="true" aria-labelledby="level-dialog-title" onMouseDown={event=>event.stopPropagation()}>
        <button className="icon-button dialog-close" onClick={close} aria-label={closeLabel[locale]}><X/></button>
        <h2 id="level-dialog-title">{section.heading}</h2>
        {section.blocks.map((block,index)=>{
          if('p' in block)return <p key={index}>{block.p}</p>;
          if('table' in block)return <div className="level-table-wrap" key={index}><table>
            <thead><tr>{block.table.head.map(cell=><th key={cell}>{cell}</th>)}</tr></thead>
            <tbody>{block.table.rows.map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody>
          </table></div>;
          return null;
        })}
      </section>
    </div>}
  </>;
}
