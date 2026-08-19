'use client';
import { createContext,useCallback,useContext,useMemo,useState } from 'react'; import { usePathname,useRouter } from 'next/navigation';
import { getDictionary,TranslationKey } from './dictionaries'; import { apiFetch } from '@/lib/api-client'; import { localePath,stripLocale } from '@/lib/site'; import type { Locale } from '@/lib/types';
type Value={locale:Locale;setLocale:(l:Locale)=>Promise<void>;t:(k:TranslationKey)=>string}; const Context=createContext<Value|null>(null);
// Switching language does four things. The address changes, because the language a
// person reads is now part of the URL rather than a cookie only the server can see. The document language has to follow the
// switcher because CSS uppercasing is locale aware, so English copy left under
// lang="tr" renders "DISCOVER" as "DİSCOVER". The cookie carries the choice into
// server rendering. And a signed-in account stores the language itself, so it
// survives a new device and reaches email and the mobile app as well. Anonymous
// visitors have no account to write to, which is why 401 is not treated as a
// failure; any other status means the account still holds the old language.
export function I18nProvider({children,initialLocale='tr'}:{children:React.ReactNode;initialLocale?:Locale}){const [locale,setLocaleState]=useState<Locale>(initialLocale);const router=useRouter();const pathname=usePathname();const setLocale=useCallback(async(l:Locale)=>{setLocaleState(l);document.documentElement.lang=l;document.cookie=`bosagezme_locale=${l};path=/;max-age=31536000;samesite=lax`;router.push(localePath(l,stripLocale(pathname)));const response=await apiFetch('/api/proxy/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({preferred_locale:l})});if(!response.ok&&response.status!==401)throw new Error('preferred locale not saved')},[router,pathname]);const value=useMemo(()=>{/* Built by getDictionary rather than merged again here: this list drifted from the one the server uses and a whole block of copy came back blank. */const dictionary=getDictionary(locale) as Record<TranslationKey,string>;return{locale,setLocale,t:(k:TranslationKey)=>dictionary[k]}},[locale,setLocale]);return <Context.Provider value={value}>{children}</Context.Provider>}
export function useI18n(){const value=useContext(Context);if(!value)throw new Error('I18nProvider missing');return value}
