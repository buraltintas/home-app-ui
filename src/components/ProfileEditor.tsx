'use client';

import {useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import type {Locale,Me} from '@/lib/types';

// The API has accepted profile edits from the start and nothing in the web app ever sent
// one, so a name chosen at sign-up could never be changed. Only the public fields are
// offered here: the private household questions belong to the survey that asks them, not
// to a settings form.
const USERNAME=/^[A-Za-z0-9_]+$/;

export function ProfileEditor({me,onSaved}:{me:Me;onSaved:(next:Me)=>void}){
  const {t}=useI18n();
  const [displayName,setDisplayName]=useState(me.display_name??'');
  const [username,setUsername]=useState(me.username??'');
  const [city,setCity]=useState(me.city??'');
  const [bio,setBio]=useState(me.bio??'');
  const [bioLanguage,setBioLanguage]=useState<Locale>(me.bio_language??'tr');
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [saved,setSaved]=useState('');

  const submit=async(event:React.FormEvent)=>{
    event.preventDefault();
    setError('');setSaved('');
    const next:Record<string,string>={};
    if(displayName.trim()!==(me.display_name??''))next.display_name=displayName.trim();
    if(username.trim()!==(me.username??''))next.username=username.trim();
    if(city.trim()!==(me.city??''))next.city=city.trim();
    if(bio.trim()!==(me.bio??''))next.bio=bio.trim();
    if(next.bio!==undefined||bioLanguage!==(me.bio_language??'tr'))next.bio_language=bioLanguage;
    if(Object.keys(next).length===0){setSaved(t('nothingToSave'));return;}
    // The same rule the API enforces, checked here so a rejected name is explained rather
    // than returned as a bare failure.
    if(next.username!==undefined&&(next.username.length<3||next.username.length>30||!USERNAME.test(next.username))){
      setError(t('usernameInvalid'));return;
    }
    setSaving(true);
    try{
      const response=await apiFetch('/api/proxy/me',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify(next)});
      if(response.status===409){setError(t('usernameTaken'));return;}
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
    <label><span>{t('usernameLabel')}</span>
      <input value={username} maxLength={30} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={event=>setUsername(event.target.value)}/>
      <small>{t('usernameHint')}</small>
    </label>
    <label><span>{t('cityLabel')}</span>
      <input value={city} maxLength={100} onChange={event=>setCity(event.target.value)}/>
      <small>{t('cityHint')}</small>
    </label>
    <label><span>{t('bioLabel')}</span>
      <textarea value={bio} maxLength={500} rows={4} onChange={event=>setBio(event.target.value)}/>
      <small>{bio.length}/500 · {t('bioHint')}</small>
    </label>
    <label><span>{t('bioLanguageLabel')}</span>
      <select value={bioLanguage} onChange={event=>setBioLanguage(event.target.value as Locale)}>
        <option value="tr">Türkçe</option><option value="en">English</option><option value="de">Deutsch</option><option value="ru">Русский</option>
      </select>
    </label>
    <div className="profile-form-actions">
      <button className="button primary" type="submit" disabled={saving}>{saving?'…':t('saveProfile')}</button>
      {saved&&<p role="status">{saved}</p>}
    </div>
    {error&&<p className="form-error" role="alert">{error}</p>}
  </form>;
}
