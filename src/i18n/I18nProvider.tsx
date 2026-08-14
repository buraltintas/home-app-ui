'use client';
import { createContext,useContext,useMemo,useState } from 'react';
import { dictionaries,TranslationKey } from './dictionaries'; import type { Locale } from '@/lib/types';
type Value={locale:Locale;setLocale:(l:Locale)=>void;t:(k:TranslationKey)=>string}; const Context=createContext<Value|null>(null);
export function I18nProvider({children,initialLocale='tr'}:{children:React.ReactNode;initialLocale?:Locale}){const [locale,setLocaleState]=useState<Locale>(initialLocale);const setLocale=(l:Locale)=>{setLocaleState(l);document.cookie=`homeapp_locale=${l};path=/;max-age=31536000;samesite=lax`};const value=useMemo(()=>({locale,setLocale,t:(k:TranslationKey)=>dictionaries[locale][k]}),[locale]);return <Context.Provider value={value}>{children}</Context.Provider>}
export function useI18n(){const value=useContext(Context);if(!value)throw new Error('I18nProvider missing');return value}
