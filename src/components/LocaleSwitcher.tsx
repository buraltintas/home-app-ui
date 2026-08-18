'use client';import {useState} from 'react';import {useI18n} from '@/i18n/I18nProvider';import type {Locale} from '@/lib/types';
export function LocaleSwitcher(){
  const {locale,setLocale,t}=useI18n();
  const [failed,setFailed]=useState(false);
  const [saving,setSaving]=useState(false);
  const change=async(value:Locale)=>{setFailed(false);setSaving(true);try{await setLocale(value);}catch{setFailed(true);}finally{setSaving(false);}};
  return <div className="locale-field">
    <label className="locale-switcher"><span>{t('language')}</span>
      <select value={locale} onChange={event=>void change(event.target.value as Locale)} disabled={saving}>
        <option value="tr">Türkçe</option><option value="en">English</option><option value="de">Deutsch</option><option value="ru">Русский</option>
      </select>
    </label>
    {failed&&<p className="form-error" role="alert">{t('languageSaveError')}</p>}
  </div>;
}
