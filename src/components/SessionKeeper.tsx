'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {SESSION_REFRESHED,renewSession} from '@/lib/api-client';

// An access token lives fifteen minutes and was only ever replaced after something had
// already failed with it. Server components read the cookie directly and cannot repair
// anything: with a dead token they simply render the signed-out variant of the page and
// return 200, so no 401 ever reached the client. That is the "I was logged in, the avatar
// vanished, I reloaded and it came back" report, and it had several faces.
//
// This renews the session shortly before it expires, and again whenever a backgrounded
// tab comes back to a token that died while it was away.
//
// Refresh tokens rotate and a second presentation of one revokes the whole session
// family, so two tabs must never refresh at once. The renewal runs inside a cross-tab
// Web Lock, and re-reads the expiry after taking it: whichever tab arrives second finds
// the timestamp already moved forward and does nothing.
const SESSION_EXPIRES_COOKIE='bosagezme_session_expires';
// Renew this long before the token dies. Comfortably longer than a slow request, so a
// page load never overlaps the moment of expiry.
const LEAD_MS=90_000;
const MIN_DELAY_MS=1_000;
const MAX_DELAY_MS=10*60_000;

function expiresAt():number|null{
  const match=document.cookie.match(new RegExp(`(?:^|; )${SESSION_EXPIRES_COOKIE}=([^;]*)`));
  if(!match)return null;
  const value=Date.parse(decodeURIComponent(match[1]));
  return Number.isNaN(value)?null:value;
}

export function SessionKeeper(){
  const router=useRouter();
  useEffect(()=>{
    let active=true;
    let timer:ReturnType<typeof setTimeout>|undefined;

    const renew=async()=>{
      // Re-read under the lock. Another tab may have renewed while this one waited, and
      // presenting the rotated-away token is what revokes the family.
      if(!active)return;
      const expiry=expiresAt();
      if(expiry===null||expiry-Date.now()>LEAD_MS)return;
      if(await renewSession())router.refresh();
    };

    const guarded=async()=>{
      if(typeof navigator!=='undefined'&&navigator.locks)await navigator.locks.request('bosagezme:session-renewal',renew);
      else await renew();
    };

    const schedule=()=>{
      if(timer)clearTimeout(timer);
      const expiry=expiresAt();
      if(expiry===null)return;
      const delay=Math.min(Math.max(expiry-Date.now()-LEAD_MS,MIN_DELAY_MS),MAX_DELAY_MS);
      timer=setTimeout(()=>{void guarded().finally(()=>{if(active)schedule();});},delay);
    };

    // A tab that slept through the expiry has to repair itself on the way back rather
    // than waiting for the next scheduled tick.
    const onVisible=()=>{if(document.visibilityState==='visible'){void guarded().finally(()=>{if(active)schedule();});}};

    schedule();
    document.addEventListener('visibilitychange',onVisible);
    window.addEventListener('bosagezme:authenticated',schedule);
    window.addEventListener(SESSION_REFRESHED,schedule);
    return()=>{
      active=false;
      if(timer)clearTimeout(timer);
      document.removeEventListener('visibilitychange',onVisible);
      window.removeEventListener('bosagezme:authenticated',schedule);
      window.removeEventListener(SESSION_REFRESHED,schedule);
    };
  },[router]);
  return null;
}
