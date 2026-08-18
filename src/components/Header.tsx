'use client';
import Image from 'next/image';import Link from 'next/link';import {Heart,Home,Search,UserRound} from 'lucide-react';import {usePathname,useRouter} from 'next/navigation';import {useEffect,useState} from 'react';import {useI18n} from '@/i18n/I18nProvider';import {localePath,stripLocale} from '@/lib/site';import {apiFetch,SESSION_REFRESHED} from '@/lib/api-client';import type {Me} from '@/lib/types';import {startFreshSearch} from '@/lib/search-session';
const links=[['/',Home,'home'],['/discover',Search,'discover'],['/favorites',Heart,'favorites']] as const;
export function Header(){
  const {t,locale}=useI18n();const pathname=usePathname();const router=useRouter();
  const [me,setMe]=useState<Me|null>(null);
  useEffect(()=>{
    let active=true;
    const checkSession=async()=>{try{const response=await apiFetch('/api/proxy/me',{cache:'no-store'});const profile=response.ok?await response.json() as Me:null;if(active)setMe(profile);}catch{if(active)setMe(null);}};
    const handleAuthentication=()=>void checkSession();
    // The header is on every page, so it is the one place that can ask the server to
    // re-render whatever it drew while the token was still stale.
    const handleRefreshed=()=>router.refresh();
    void checkSession();
    window.addEventListener('bosagezme:authenticated',handleAuthentication);
    window.addEventListener(SESSION_REFRESHED,handleRefreshed);
    return()=>{active=false;window.removeEventListener('bosagezme:authenticated',handleAuthentication);window.removeEventListener(SESSION_REFRESHED,handleRefreshed);};
  },[router]);
  // The locale prefix is not part of what the navigation is pointing at.
  const here=stripLocale(pathname);
  const profileActive=here.startsWith('/profile');
  return <header className="site-header"><div className="nav-wrap"><Link href={localePath(locale,'/')} className="brand-link" aria-label={t('wordmark')}><span className="brand-mark"><Image src="/brand/brand-mark.png" width={104} height={104} priority alt=""/></span><span className="brand-name">{t('wordmark')}</span></Link><nav aria-label={t('primaryNavigation')}>{links.map(([href,Icon,label])=>{const active=href==='/'?here===href:here.startsWith(href);return <Link key={href} href={localePath(locale,href)} onClick={href==='/discover'?startFreshSearch:undefined} className={active?'is-active':undefined} aria-current={active?'page':undefined}><Icon/><span>{t(label)}</span></Link>})}<Link href={localePath(locale,"/profile")} className={profileActive?'is-active':undefined} aria-current={profileActive?'page':undefined}>{me?<span className="nav-avatar" aria-hidden="true">{(me.display_name||me.username||me.email).slice(0,1).toLocaleUpperCase(locale)}</span>:<UserRound/>}<span>{t('profile')}</span></Link></nav></div></header>;
}
