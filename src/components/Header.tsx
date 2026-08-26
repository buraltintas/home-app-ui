'use client';
import Image from 'next/image';import Link from 'next/link';import {Heart,Home,Search,UserRound} from 'lucide-react';import {usePathname,useRouter} from 'next/navigation';import {useEffect,useState} from 'react';import {useI18n} from '@/i18n/I18nProvider';import {localePath,stripLocale,tagline} from '@/lib/site';import {apiFetch,SESSION_REFRESHED} from '@/lib/api-client';import {HeaderLocale} from './HeaderLocale';import type {Me} from '@/lib/types';import {startFreshSearch} from '@/lib/search-session';
const links=[['/',Home,'home'],['/discover',Search,'discover'],['/favorites',Heart,'favorites']] as const;
export function Header(){
  const {t,locale}=useI18n();const pathname=usePathname();const router=useRouter();
  // undefined means the session has not been read yet, null means signed out. Collapsing
  // the two made the header show the signed-out icon first and then swap in the avatar.
  const [me,setMe]=useState<Me|null|undefined>(undefined);
  useEffect(()=>{
    let active=true;
    // A failed read is not proof of being signed out. Only a 401 that survived apiFetch's
    // refresh-and-retry means that; a network blip or a 5xx used to blank the avatar for
    // the rest of the session, because nothing re-read it until a full page load.
    const checkSession=async()=>{try{
      const response=await apiFetch('/api/proxy/me',{cache:'no-store'});
      if(!active)return;
      if(response.ok)setMe(await response.json() as Me);
      else if(response.status===401)setMe(null);
    }catch{/* keep whatever we last knew rather than claiming the visitor signed out */}};
    const handleAuthentication=()=>void checkSession();
    // The header is on every page, so it is the one place that can ask the server to
    // re-render whatever it drew while the token was still stale.
    const handleRefreshed=()=>router.refresh();
    void checkSession();
    window.addEventListener('bosagezme:authenticated',handleAuthentication);
    window.addEventListener(SESSION_REFRESHED,handleRefreshed);
    return()=>{active=false;window.removeEventListener('bosagezme:authenticated',handleAuthentication);window.removeEventListener(SESSION_REFRESHED,handleRefreshed);};
    // Re-read on navigation as well. The header outlives every route change, so a value
    // that went stale mid-session would otherwise persist until the page was reloaded.
  },[router,pathname]);
  // The locale prefix is not part of what the navigation is pointing at.
  const here=stripLocale(pathname);
  const profileActive=here.startsWith('/profile');
  return <header className="site-header"><div className="nav-wrap"><Link href={localePath(locale,'/')} className="brand-link" aria-label={t('wordmark')}><span className="brand-mark"><Image src="/brand/brand-mark.png" width={104} height={104} priority alt=""/></span><span className="brand-lockup"><span className="brand-name">{t('wordmark')}</span><span className="brand-tagline" lang="tr">{tagline}</span></span></Link><nav aria-label={t('primaryNavigation')}>{links.map(([href,Icon,label])=>{const active=href==='/'?here===href:here.startsWith(href);return <Link key={href} href={localePath(locale,href)} onClick={href==='/discover'?startFreshSearch:undefined} className={active?'is-active':undefined} aria-current={active?'page':undefined}><Icon/><span>{t(label)}</span></Link>})}<Link href={localePath(locale,"/profile")} className={profileActive?'is-active':undefined} aria-current={profileActive?'page':undefined}>{me===undefined?<span className="nav-avatar is-loading" aria-hidden="true"/>:me?<span className="nav-avatar" aria-hidden="true">{(me.display_name||me.email).slice(0,1).toLocaleUpperCase(locale)}</span>:<UserRound/>}<span>{t('profile')}</span></Link></nav><HeaderLocale/></div></header>;
}
