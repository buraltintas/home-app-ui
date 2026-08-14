'use client';import {useI18n} from '@/i18n/I18nProvider';import type {Locale} from '@/lib/types';
export function LocaleSwitcher(){const {locale,setLocale,t}=useI18n();return <label className="locale-switcher"><span>{t('language')}</span><select value={locale} onChange={e=>setLocale(e.target.value as Locale)}><option value="tr">Türkçe</option><option value="en">English</option><option value="de">Deutsch</option><option value="ru">Русский</option></select></label>}

