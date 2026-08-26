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

  return <form className="profile-form" onSubmit={event=>void submit(event)}>
    <label><span>{t('displayNameLabel')}</span>
      <input value={displayName} maxLength={100} onChange={event=>setDisplayName(event.target.value)}/>
    </label>
    <div className="profile-form-actions">
      <button className="button primary" type="submit" disabled={saving}>{saving?'…':t('saveProfile')}</button>
      {saved&&<p role="status">{saved}</p>}
    </div>
    {error&&<p className="form-error" role="alert">{error}</p>}
  </form>;
}
