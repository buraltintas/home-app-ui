'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';

// There was no way to sign out anywhere in the product. The route existed and nothing
// called it, which on a shared or borrowed device is not a missing nicety but a way to
// leave somebody else holding your session.
export function SignOutButton({className}:{className?:string}){
  const {t}=useI18n();
  const router=useRouter();
  const [busy,setBusy]=useState(false);
  const signOut=async()=>{
    setBusy(true);
    try{
      await fetch('/api/auth/logout',{method:'POST'});
      // Announce it the same way signing in does, so the header and any open page drop the
      // session rather than showing a stale signed-in view until the next navigation.
      window.dispatchEvent(new Event('bosagezme:authenticated'));
      router.refresh();
    }finally{setBusy(false);}
  };
  return <button className={className??'button secondary'} disabled={busy} onClick={()=>void signOut()}>
    {busy?'…':t('signOut')}
  </button>;
}
