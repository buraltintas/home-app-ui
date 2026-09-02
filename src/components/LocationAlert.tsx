'use client';

import {TriangleAlert} from 'lucide-react';
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

// The alert sits directly under the box it is about, and says only what went wrong. It
// carried its own retry button for a while; the control that failed is one line above it,
// so the second one was a second way to press the same thing.
export function LocationAlert({message,reason}:{message:string;reason:LocationFailure|''}){
  const {t}=useI18n();
  // The drawing only helps in the one case it describes. Offered when the browser has
  // simply not asked yet, it sends somebody hunting for a lock that will do nothing.
  const showHint=reason==='blocked';
  return <div className="location-alert" role="alert">
    <TriangleAlert aria-hidden="true"/>
    <div>
      <p>{message}</p>
      {showHint&&<AddressBarHint label={t('locationLockHint')}/>}
    </div>
  </div>;
}
