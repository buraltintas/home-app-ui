'use client';

import {TriangleAlert,X} from 'lucide-react';
import {useCallback,useEffect,useRef,useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import type {LocationFailure} from '@/lib/location';

// Where the address bar keeps its lock, drawn rather than screenshotted. A screenshot of
// Chrome stops being true the next time Chrome moves something; a drawing of "the thing at
// the left of the address bar" stays true, because that is the part that does not move.
function AddressBarHint({label}:{label:string}){
  return <svg className="location-hint-art" viewBox="0 0 240 44" role="img" aria-label={label}>
    <rect x="1" y="1" width="238" height="42" rx="21" fill="var(--muted)" stroke="var(--line-strong)"/>
    <circle cx="30" cy="22" r="13" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"/>
    <path d="M26 21.5v-2.5a4 4 0 0 1 8 0v2.5" fill="none" stroke="var(--accent-ink)" strokeWidth="2" strokeLinecap="round"/>
    <rect x="25" y="21.5" width="10" height="8" rx="2" fill="var(--accent-ink)"/>
    <rect x="56" y="15" width="150" height="6" rx="3" fill="var(--line-strong)"/>
    <rect x="56" y="27" width="96" height="6" rx="3" fill="var(--line)"/>
  </svg>;
}

// A failed location used to be a strip of text under the field. It said the right thing and
// nobody read it: on a phone it arrived below the fold of a panel somebody was already
// typing in, looking like a caption rather than like an answer to what they just pressed.
//
// It is a dialog now. Not for drama -- for sequence: the reader pressed something, it did
// not work, and the next thing they do should be either trying again or typing where they
// are. Both are in here, so the dialog is the whole answer rather than a note about it.
//
// It carries its own retry precisely because it covers the control that failed. The earlier
// version dropped the retry on the grounds that the button was one line above; once the
// message is in front of that button, that reasoning stops holding.
// How long the panel takes to arrive and to leave. It is the figure the nudge already uses,
// not a new one: two things that slide onto the same screen at different speeds read as two
// different products.
const MOTION_MS=520;

export function LocationAlert({message,reason,onRetry,onDismiss}:{message:string;reason:LocationFailure|'';onRetry?:()=>void;onDismiss:()=>void}){
  const {t}=useI18n();
  const close=useRef<HTMLButtonElement>(null);
  const [leaving,setLeaving]=useState(false);
  // Leaving is a state rather than an immediate unmount, because an element removed from the
  // document cannot animate out of it. Reduced motion skips the wait rather than sitting
  // through a delay for a movement that is not going to happen.
  const dismiss=useCallback(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){onDismiss();return;}
    setLeaving(true);
    window.setTimeout(onDismiss,MOTION_MS);
  },[onDismiss]);

  useEffect(()=>{
    close.current?.focus();
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')dismiss();};
    window.addEventListener('keydown',escape);
    return()=>window.removeEventListener('keydown',escape);
  },[dismiss]);

  // The drawing only helps in the one case it describes. Offered when the browser has
  // simply not asked yet, it sends somebody hunting for a lock that will do nothing.
  const showHint=reason==='blocked';
  // Both states mean the same thing to the person in front of it: the browser is not going
  // to ask, so pressing the button again cannot help.
  const blocked=reason==='blocked'||reason==='denied';
  return <div className={`dialog-backdrop location-alert-backdrop${leaving?' is-leaving':''}`} role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)dismiss();}}>
    <div className="location-alert-dialog" role="alertdialog" aria-modal="true" aria-labelledby="location-alert-title" aria-describedby="location-alert-body">
      <header>
        <span className="location-alert-mark" aria-hidden="true"><TriangleAlert/></span>
        <h2 id="location-alert-title">{t('locationAlertTitle')}</h2>
        <button ref={close} type="button" className="icon-button" onClick={dismiss} aria-label={t('close')}><X aria-hidden="true"/></button>
      </header>
      <p id="location-alert-body">{message}</p>
      {showHint&&<AddressBarHint label={t('locationLockHint')}/>}
      {/* One button, and it is always called "try again", because that is the only thing
          anybody wants from this dialog. What trying again means differs underneath: a
          refusal will be refused again -- the request never reaches the device, and on iOS a
          permission changed in Settings does not reach a page that is already open, because
          WebKit binds the decision at load -- so there it reloads. A timeout or a device that
          could not answer just asks again. The reader should not have to know the difference.
          The way out is the cross in the corner; a second "close" underneath was a second
          control for something the dialog already had. */}
      <div className="location-alert-actions">
        <button type="button" className="button primary" onClick={()=>{
          if(blocked){window.location.reload();return;}
          dismiss();onRetry?.();
        }}>{t('locationRetry')}</button>
      </div>
    </div>
  </div>;
}
