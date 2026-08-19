'use client';import {useState} from 'react';import {useI18n} from '@/i18n/I18nProvider';import type {Locale} from '@/lib/types';
export function LocaleSwitcher(){
  const {locale,setLocale,t}=useI18n();
  const [failed,setFailed]=useState(false);
  const [saving,setSaving]=useState(false);
  const change=async(value:Locale)=>{setFailed(false);setSaving(true);try{await setLocale(value);}catch{setFailed(true);}finally{setSaving(false);}};
  // The label is visually hidden where a panel heading already says "Language" and the
  // control repeated it underneath. It stays in the accessibility tree: a select with no
  // name is unusable with a screen reader, whatever the heading above it says.
  return <div className="locale-field">
    <label className="locale-switcher"><span className="visually-hidden">{t('language')}</span>
      <select value={locale} onChange={event=>void change(event.target.value as Locale)} disabled={saving}>
        <option value="tr">Türkçe</option><option value="en">English</option><option value="de">Deutsch</option><option value="ru">Русский</option>
      </select>
    </label>
    {failed&&<p className="form-error" role="alert">{t('languageSaveError')}</p>}
  </div>;
}
