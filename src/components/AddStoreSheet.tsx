'use client';

import {CircleAlert,Plus,X} from 'lucide-react';
import Image from 'next/image';
import {useCallback,useEffect,useRef,useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';

// A shop nobody can find here is a gap in the catalogue, and the person looking at the empty
// end of a list is the one who knows about it. They are asked for the one thing that
// identifies a shop without ambiguity and that they already have to hand: its place on the
// map. A name and an address arrive spelled four different ways; a Maps link is a place.
//
// It goes in as an ordinary suggestion, through the feedback the product already has, rather
// than into a second inbox nobody would remember to read.
const MAPS=/^https?:\/\/([a-z0-9-]+\.)*(google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)\//i;

export function AddStoreSheet({query}:{query:string}){
  const {t}=useI18n();
  const [open,setOpen]=useState(false);
  const [link,setLink]=useState('');
  const [state,setState]=useState<'idle'|'sending'|'done'|'invalid'|'failed'>('idle');
  const field=useRef<HTMLInputElement>(null);
  const opener=useRef<HTMLButtonElement>(null);

  const close=useCallback(()=>{setOpen(false);setState('idle');opener.current?.focus();},[]);

  useEffect(()=>{
    if(!open)return;
    field.current?.focus();
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')close();};
    window.addEventListener('keydown',escape);
    return()=>window.removeEventListener('keydown',escape);
  },[open,close]);

  const send=async()=>{
    const value=link.trim();
    if(!MAPS.test(value)){setState('invalid');return;}
    setState('sending');
    try{
      // The search that came up short is part of the suggestion: it says which shop, in
      // which words, somebody expected to find and did not.
      const message=`Mağaza önerisi (arama: ${query||'—'})\n${value}`;
      const response=await apiFetch('/api/proxy/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({kind:'suggestion',message})});
      if(!response.ok)throw new Error();
      setState('done');setLink('');
    }catch{setState('failed');}
  };

  return <section className="add-store">
    {/* The end of the list is not another result, and it is not decoration either: it is the
        one place where a reader can tell us the catalogue is missing something. It is marked
        as a notice so it reads as a different kind of thing from the shops above it. */}
    <h2><CircleAlert aria-hidden="true"/>{t('notFoundTitle')}</h2>
    <p>{t('notFoundBody')}</p>
    <div className="add-store-action">
      <Image src="/illustrations/add-store.png" width={72} height={72} alt="" aria-hidden="true"/>
      <button ref={opener} type="button" className="button primary add-store-open" onClick={()=>setOpen(true)}><Plus aria-hidden="true"/>{t('addStore')}</button>
    </div>
    {open&&<div className="dialog-backdrop add-store-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)close();}}>
      <div className="add-store-sheet" role="dialog" aria-modal="true" aria-labelledby="add-store-title">
        <header><h3 id="add-store-title">{t('addStoreTitle')}</h3><button type="button" className="icon-button" aria-label={t('close')} onClick={close}><X aria-hidden="true"/></button></header>
        {state==='done'
          ?<p className="add-store-done" role="status">{t('addStoreDone')}</p>
          :<>
            <p>{t('addStoreIntro')}</p>
            <label htmlFor="add-store-link">{t('addStoreLabel')}</label>
            <input ref={field} id="add-store-link" type="url" inputMode="url" autoComplete="off" placeholder="https://maps.app.goo.gl/…" value={link}
              onChange={event=>{setLink(event.target.value);if(state==='invalid'||state==='failed')setState('idle');}}
              onKeyDown={event=>{if(event.key==='Enter')void send();}}/>
            {state==='invalid'&&<p className="form-error" role="alert">{t('addStoreInvalid')}</p>}
            {state==='failed'&&<p className="form-error" role="alert">{t('addStoreFailed')}</p>}
            <button type="button" className="button primary" disabled={state==='sending'} onClick={()=>void send()}>{state==='sending'?t('addStoreSending'):t('addStoreSend')}</button>
          </>}
      </div>
    </div>}
  </section>;
}
