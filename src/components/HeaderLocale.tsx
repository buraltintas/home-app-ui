'use client';

import {useI18n} from '@/i18n/I18nProvider';
import type {Locale} from '@/lib/types';

const CODES:Locale[]=['tr','en','de','ru'];
const LABELS:Record<Locale,string>={tr:'TR',en:'EN',de:'DE',ru:'RU'};
const NAMES:Record<Locale,string>={tr:'Türkçe',en:'English',de:'Deutsch',ru:'Русский'};

// Language lived in a panel inside the profile, which asks somebody reading the site in a
// language they do not understand to find a settings screen written in it. It is in the
// header now, on every page, as two letters -- the form every site uses for this, and the
// only one that fits a compact bar without pushing the navigation off a phone.
export function HeaderLocale(){
  const {locale,setLocale}=useI18n();
  return <label className="header-locale">
    <span className="visually-hidden">{NAMES[locale]}</span>
    <select value={locale} onChange={event=>void setLocale(event.target.value as Locale).catch(()=>undefined)}>
      {CODES.map(code=><option key={code} value={code}>{LABELS[code]}</option>)}
    </select>
  </label>;
}
