'use client';

import {useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import type {Me} from '@/lib/types';

// The API has accepted profile edits from the start and nothing in the web app ever sent
// one, so a name chosen at sign-up could never be changed. Only the public fields are
// offered here: the private household questions belong to the survey that asks them, not
// to a settings form.
export function ProfileEditor({me,onSaved}:{me:Me;onSaved:(next:Me)=>void}){
  const {t}=useI18n();
  const [displayName,setDisplayName]=useState(me.display_name??'');
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [saved,setSaved]=useState('');

  const submit=async(event:React.FormEvent)=>{
    event.preventDefault();
    setError('');setSaved('');
    const next:Record<string,string>={};
    if(displayName.trim()!==(me.display_name??''))next.display_name=displayName.trim();
    if(Object.keys(next).length===0){setSaved(t('nothingToSave'));return;}
    setSaving(true);
    try{
      const response=await apiFetch('/api/proxy/me',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify(next)});
      if(!response.ok)throw new Error();
      // The handler answers with the saved profile, so what is shown next is what the
      // server actually stored rather than what was typed.
      onSaved(await response.json() as Me);
      setSaved(t('profileSaved'));
    }catch{setError(t('profileSaveError'));}
    finally{setSaving(false);}
  };

  return <>
    <form className="profile-form" onSubmit={event=>void submit(event)}>
      <label><span>{t('displayNameLabel')}</span>
        <input value={displayName} maxLength={100} onChange={event=>setDisplayName(event.target.value)}/>
      </label>
      <div className="profile-form-actions">
        <button className="button primary" type="submit" disabled={saving}>{saving?'…':t('saveProfile')}</button>
        {saved&&<p role="status">{saved}</p>}
      </div>
      {error&&<p className="form-error" role="alert">{error}</p>}
    </form>
    <EmailEditor me={me} onSaved={onSaved}/>
  </>;
}

// Changing the address this account signs in with.
//
// It sits apart from the name above it and does not save with it, because it is not the same
// kind of edit. A display name is a preference; this address is how somebody gets back into
// the account, since signing in means asking for a code and reading it. Saved on the strength
// of the session alone, a borrowed phone would own the account for good -- the person it
// belongs to would simply stop receiving the codes -- and a typo would lock somebody out of
// their own reviews with nobody to appeal to.
//
// So it asks for the same proof sign-in asks for: a code sent to the new address, read back.
// Two steps, and the second one is where anything changes.
function EmailEditor({me,onSaved}:{me:Me;onSaved:(next:Me)=>void}){
  const {t}=useI18n();
  const [email,setEmail]=useState(me.email);
  const [code,setCode]=useState('');
  const [stage,setStage]=useState<'idle'|'sent'>('idle');
  const [busy,setBusy]=useState(false);
  const [note,setNote]=useState('');
  const [problem,setProblem]=useState('');
  const changed=email.trim().toLowerCase()!==me.email.trim().toLowerCase();

  const sendCode=async()=>{
    setBusy(true);setProblem('');setNote('');
    try{
      // The same route the sign-in dialog asks through, because it is the same request: a
      // login code for an address. What makes this a change of address rather than a sign-in
      // is what the code is spent on, one step further down.
      const response=await fetch('/api/auth/request-code',{
        method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:email.trim()}),
      });
      if(!response.ok)throw new Error();
      setStage('sent');setNote(t('emailCodeSent'));
    }catch{setProblem(t('emailSendFailed'));}
    finally{setBusy(false);}
  };

  const confirm=async()=>{
    setBusy(true);setProblem('');setNote('');
    try{
      const response=await apiFetch('/api/proxy/me/email',{
        method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:email.trim(),code:code.trim()}),
      });
      if(response.status===409){setProblem(t('emailTaken'));return;}
      if(response.status===401){setProblem(t('emailCodeWrong'));return;}
      if(!response.ok)throw new Error();
      const body=await response.json() as {email:string};
      onSaved({...me,email:body.email});
      setEmail(body.email);setCode('');setStage('idle');setNote(t('emailChanged'));
    }catch{setProblem(t('emailSendFailed'));}
    finally{setBusy(false);}
  };

  return <section className="profile-form profile-email">
    <label><span>{t('emailLabel')}</span>
      <input type="email" inputMode="email" autoComplete="email" value={email} maxLength={254}
        onChange={event=>{setEmail(event.target.value);setStage('idle');setNote('');setProblem('');}}/>
    </label>
    <p className="profile-form-hint">{t('emailHint')}</p>
    {stage==='sent'&&<label><span>{t('emailCodeLabel')}</span>
      <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code}
        onChange={event=>setCode(event.target.value.replace(/\D/g,''))}/>
    </label>}
    <div className="profile-form-actions">
      {stage==='idle'
        ?<button type="button" className="button secondary" disabled={!changed||busy} onClick={()=>void sendCode()}>{busy?'…':t('emailSendCode')}</button>
        :<>
          <button type="button" className="button primary" disabled={code.length!==6||busy} onClick={()=>void confirm()}>{busy?'…':t('emailConfirm')}</button>
          <button type="button" className="button quiet" disabled={busy} onClick={()=>{setStage('idle');setCode('');setNote('');}}>{t('emailCancel')}</button>
        </>}
      {note&&<p role="status">{note}</p>}
    </div>
    {problem&&<p className="form-error" role="alert">{problem}</p>}
  </section>;
}
