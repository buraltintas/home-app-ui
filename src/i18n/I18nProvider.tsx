'use client';
import { createContext,useContext,useMemo,useState } from 'react';
import { dictionaries,feedStateCopy,googleAuthCopy,hardeningCopy,TranslationKey } from './dictionaries'; import { apiFetch } from '@/lib/api-client'; import type { Locale } from '@/lib/types';
type Value={locale:Locale;setLocale:(l:Locale)=>Promise<void>;t:(k:TranslationKey)=>string}; const Context=createContext<Value|null>(null);
// Switching language does three things. The document language has to follow the
// switcher because CSS uppercasing is locale aware, so English copy left under
// lang="tr" renders "DISCOVER" as "DİSCOVER". The cookie carries the choice into
// server rendering. And a signed-in account stores the language itself, so it
// survives a new device and reaches email and the mobile app as well. Anonymous
// visitors have no account to write to, which is why 401 is not treated as a
// failure; any other status means the account still holds the old language.
export function I18nProvider({children,initialLocale='tr'}:{children:React.ReactNode;initialLocale?:Locale}){const [locale,setLocaleState]=useState<Locale>(initialLocale);const setLocale=async(l:Locale)=>{setLocaleState(l);document.documentElement.lang=l;document.cookie=`bosagezme_locale=${l};path=/;max-age=31536000;samesite=lax`;const response=await apiFetch('/api/proxy/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({preferred_locale:l})});if(!response.ok&&response.status!==401)throw new Error('preferred locale not saved')};const value=useMemo(()=>{const dictionary={...dictionaries[locale],...feedStateCopy[locale],...hardeningCopy[locale],...googleAuthCopy[locale]} as Record<TranslationKey,string>;return{locale,setLocale,t:(k:TranslationKey)=>dictionary[k]}},[locale]);return <Context.Provider value={value}>{children}</Context.Provider>}
export function useI18n(){const value=useContext(Context);if(!value)throw new Error('I18nProvider missing');return value}
