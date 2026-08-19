'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

// The panel needs its own way in. Reaching /admin and being told you cannot be here, with
// no field to prove otherwise, is a dead end -- the visitor had to know to sign in on the
// public site first.
//
// It reuses the ordinary email code endpoints; there is no separate admin credential. An
// address that is not on the allowlist can complete this form and still see nothing, and
// the message never distinguishes the two cases: telling somebody "that address exists but
// is not an administrator" hands them half the answer.
export function AdminSignIn(){
  const router=useRouter();
  const [email,setEmail]=useState('');
  const [code,setCode]=useState('');
  const [sent,setSent]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [failed,setFailed]=useState(false);

  const submit=async(event:React.FormEvent)=>{
    event.preventDefault();
    setBusy(true);setError('');
    try{
      if(!sent){
        // Whatever session the browser is already holding is dropped before an
        // administrator signs in. The two are not meant to be held at once: entering the
        // panel should not silently inherit whoever was browsing the site on this machine,
        // and leaving it should not leave an elevated session behind.
        await fetch('/api/auth/logout',{method:'POST'});
        const response=await fetch('/api/auth/request-code',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim()})});
        if(!response.ok)throw new Error();
        setSent(true);
      }else{
        const response=await fetch('/api/auth/verify-code',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),code:code.trim()})});
        if(!response.ok)throw new Error();
        router.refresh();
      }
    }catch{setError(sent?'Kod doğrulanamadı. Süresi dolmuş olabilir.':'Kod gönderilemedi.');setFailed(true);}
    finally{setBusy(false);}
  };

  return <form className="admin-signin" onSubmit={submit}>
    <label>
      <span>E-posta adresi</span>
      <input type="email" value={email} required autoComplete="email" disabled={sent||busy}
        onChange={event=>setEmail(event.target.value)}/>
    </label>
    {sent&&<label>
      <span>E-postana gelen 6 haneli kod</span>
      <input inputMode="numeric" value={code} required autoComplete="one-time-code" disabled={busy}
        onChange={event=>setCode(event.target.value)}/>
    </label>}
    <button type="submit" disabled={busy}>{busy?'…':sent?'Giriş yap':'Kod gönder'}</button>
    {sent&&<button type="button" className="admin-signin-back" onClick={()=>{setSent(false);setCode('');setError('');}}>Adresi değiştir</button>}
    {error&&<p className="admin-note" role="alert">{error}</p>}
    {/* A stale session used to block signing in, because the browser sent a dead token to a
        route that needs none. That is fixed at the source, and this stays as the way out of
        any session state that still gets in the way -- it clears everything and reloads,
        which is what somebody would otherwise be told to do by hand. */}
    {failed&&<button type="button" className="admin-signin-back" onClick={async()=>{
      await fetch('/api/auth/logout',{method:'POST'});
      window.location.reload();
    }}>Oturumu temizleyip yeniden dene</button>}
  </form>;
}
