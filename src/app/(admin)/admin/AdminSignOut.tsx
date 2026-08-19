'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

// The admin panel has no locale provider, so it carries its own button rather than the
// product's. Leaving an administrator signed in with no way out is how a session ends up
// on a machine somebody else uses.
export function AdminSignOut(){
  const router=useRouter();
  const [busy,setBusy]=useState(false);
  return <button className="admin-signout" disabled={busy} onClick={async()=>{
    setBusy(true);
    try{await fetch('/api/auth/logout',{method:'POST'});router.refresh();}
    finally{setBusy(false);}
  }}>{busy?'…':'Çıkış yap'}</button>;
}
