'use client';

import {useEffect,useState} from 'react';
import {AuthDialog} from '@/components/AuthDialog';
import {LocaleSwitcher} from '@/components/LocaleSwitcher';
import {PastSearches} from '@/components/PastSearches';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import type {Locale,Me} from '@/lib/types';

const accountCopy:Record<Locale,{body:string;danger:string;title:string;confirm:string;cancel:string;failed:string}>={
  tr:{body:'Yorumlarını yönetmek ve özel tercihlerini görmek için giriş yap.',danger:'Hesap işlemleri',title:'Hesabınızı silmek istiyor musunuz?',confirm:'Hesabımı sil',cancel:'Vazgeç',failed:'Hesap silinemedi. Tekrar dene.'},
  en:{body:'Sign in to manage your reviews and private preferences.',danger:'Account actions',title:'Delete your account?',confirm:'Delete my account',cancel:'Cancel',failed:'The account could not be deleted. Try again.'},
  de:{body:'Melde dich an, um Bewertungen und private Einstellungen zu verwalten.',danger:'Kontoaktionen',title:'Konto löschen?',confirm:'Mein Konto löschen',cancel:'Abbrechen',failed:'Das Konto konnte nicht gelöscht werden.'},
  ru:{body:'Войдите, чтобы управлять отзывами и личными настройками.',danger:'Действия с аккаунтом',title:'Удалить аккаунт?',confirm:'Удалить аккаунт',cancel:'Отмена',failed:'Не удалось удалить аккаунт.'},
};
const deleteBody:Record<Locale,string>={tr:'Yorumlarınız, arama geçmişiniz, profil bilgileriniz ve sosyal bağlantılarınız kaldırılır. Daha sonra aynı e-postayla giriş yapabilirsiniz ancak silinen veriler geri gelmez.',en:'Your reviews, search history, profile information, and social connections will be removed. You can sign in later with the same email, but deleted data cannot be restored.',de:'Deine Bewertungen, dein Suchverlauf, deine Profilangaben und deine sozialen Verbindungen werden entfernt. Du kannst dich später mit derselben E-Mail-Adresse anmelden, gelöschte Daten werden jedoch nicht wiederhergestellt.',ru:'Ваши отзывы, история поиска, данные профиля и социальные связи будут удалены. Позже вы сможете войти с тем же адресом электронной почты, но удалённые данные нельзя восстановить.'};

export default function Page(){
  const {t,locale}=useI18n();const copy=accountCopy[locale];const [open,setOpen]=useState(false);const [signedIn,setSignedIn]=useState(false);const [checking,setChecking]=useState(true);const [deleting,setDeleting]=useState(false);const [me,setMe]=useState<Me|null>(null);
  useEffect(()=>{
    let active=true;let requestSequence=0;
    const checkSession=async()=>{const sequence=++requestSequence;setChecking(true);try{const response=await apiFetch('/api/proxy/me',{cache:'no-store'});const profile=response.ok?await response.json() as Me:null;if(active&&sequence===requestSequence){setSignedIn(response.ok);setMe(profile);}}catch{if(active&&sequence===requestSequence){setSignedIn(false);setMe(null);}}finally{if(active&&sequence===requestSequence)setChecking(false)}};
    const handleAuthentication=()=>void checkSession();
    void checkSession();window.addEventListener('bosagezme:authenticated',handleAuthentication);
    return()=>{active=false;window.removeEventListener('bosagezme:authenticated',handleAuthentication)};
  },[]);
  const remove=async()=>{if(!window.confirm(`${copy.title}\n\n${deleteBody[locale]}`))return;setDeleting(true);try{const response=await apiFetch('/api/proxy/me',{method:'DELETE'});if(!response.ok)throw new Error();await fetch('/api/auth/logout',{method:'POST'});setSignedIn(false);setMe(null);}catch{window.alert(copy.failed);}finally{setDeleting(false);}};
  return <main className="empty-page"><p className="eyebrow">{t('profile')}</p><h1>{t('profileTitle')}</h1>{signedIn&&me?<section className="profile-summary"><div className="profile-avatar">{(me.display_name||me.username||me.email).slice(0,1).toLocaleUpperCase(locale)}</div><div className="profile-summary-identity"><strong>{me.display_name||me.username}</strong><span>@{me.username}</span><span>{me.email}</span></div><dl><div><dd>{me.follower_count}</dd><dt>{t('followers')}</dt></div><div><dd>{me.following_count}</dd><dt>{t('following')}</dt></div><div><dd>{me.post_count}</dd><dt>{t('profileReviews')}</dt></div><div><dd>{me.favorite_count}</dd><dt>{t('favorites')}</dt></div></dl></section>:<p>{copy.body}</p>}{!checking&&!signedIn&&<button className="button primary" onClick={()=>setOpen(true)}>{t('signIn')}</button>}{signedIn&&<PastSearches/>}<LocaleSwitcher/>{signedIn&&<section className="danger-zone"><h2>{copy.danger}</h2><p>{deleteBody[locale]}</p><button className="button secondary danger-button" disabled={deleting} onClick={()=>void remove()}>{copy.confirm}</button></section>}<AuthDialog open={open} onClose={()=>setOpen(false)}/></main>;
}
