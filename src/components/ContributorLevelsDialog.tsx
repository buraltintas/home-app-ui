'use client';

import {LevelMedal} from './LevelMedal';
import {ChevronRight,X} from 'lucide-react';
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

// Two places open the same panel, and they ask for it in different words.
//
// On somebody's own profile the invitation is the point: a button that says what it gets
// you, with the question underneath. On a store page the panel is a footnote to a claim --
// "every verified review raises your level" -- and what the reader wants there is the
// answer to "so what?", not a second call to action next to the one already on the page.
// Same panel either way, because two explanations of one thing drift apart.
export function ContributorLevelsDialog({locale,note}:{locale:Locale;note?:string}){
  const [open,setOpen]=useState(false);
  const [leaving,setLeaving]=useState(false);
  const section=about.content[locale].sections.find(entry=>entry.id==='katki');

  // It arrives and leaves at one speed, 0.52s either way on the docks' own curve. Leaving
  // faster than arriving read as the sheet being snatched away rather than put back.
  //
  // Closing waits for the animation before it unmounts, because an element removed from the
  // page cannot animate its way off it.
  const close=()=>{
    setLeaving(true);
    window.setTimeout(()=>{setOpen(false);setLeaving(false);},520);
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
    {note
      ?/* R74: the question is the heading and the claim is underneath it, in the same card
           the page's other two offers are drawn in. It was a frame inside a frame, in
           another colour and another width, saying "raise your level" above the question
           that explains what a level is. */
        <button type="button" className="offer-card level-offer" onClick={()=>setOpen(true)}>
          <span className="offer-card-mark" aria-hidden="true"><LevelMedal/></span>
          <span className="offer-card-copy"><strong>{openHint[locale]}</strong><span>{note}</span></span>
          <ChevronRight className="offer-card-go" aria-hidden="true"/>
        </button>
      :<div className="level-boost">
        <button type="button" className="contribution-progress level-boost-action" onClick={()=>setOpen(true)}>
          <span aria-hidden="true">↗</span><span><strong>{openLabel[locale]}</strong><small>{openHint[locale]}</small></span>
        </button>
      </div>}
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
