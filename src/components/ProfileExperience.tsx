'use client';

import Image from 'next/image';
import {useEffect,useState} from 'react';
import {Gift} from 'lucide-react';
import {AuthDialog} from '@/components/AuthDialog';
import {SignOutButton} from '@/components/SignOutButton';
import {ContributorLevel} from '@/components/ContributorLevel';
import Link from 'next/link';
import {localePath} from '@/lib/site';
import {AccountPageSkeleton} from '@/components/AccountPageSkeleton';
import {PageBackButton} from '@/components/PageBackButton';
import {TimedNudge} from '@/components/TimedNudge';
import {useScrollTopWhenReady} from '@/lib/scroll-top';
import {MyReviews} from '@/components/MyReviews';
import {ProfileMessages} from '@/components/ProfileMessages';
import {ProfileEditor} from '@/components/ProfileEditor';
import {ProfileInvite} from '@/components/ProfileInvite';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import type {Locale,Me} from '@/lib/types';

const accountCopy:Record<Locale,{body:string;danger:string;title:string;confirm:string;cancel:string;failed:string}>={
  tr:{body:'Hesabını yönetmek ve özel tercihlerini görmek için giriş yap.',danger:'Hesap işlemleri',title:'Hesabınızı silmek istiyor musunuz?',confirm:'Hesabımı sil',cancel:'Vazgeç',failed:'Hesap silinemedi. Tekrar dene.'},
  en:{body:'Sign in to manage your account and private preferences.',danger:'Account actions',title:'Delete your account?',confirm:'Delete my account',cancel:'Cancel',failed:'The account could not be deleted. Try again.'},
  de:{body:'Melde dich an, um dein Konto und deine privaten Einstellungen zu verwalten.',danger:'Kontoaktionen',title:'Konto löschen?',confirm:'Mein Konto löschen',cancel:'Abbrechen',failed:'Das Konto konnte nicht gelöscht werden.'},
  ru:{body:'Войдите, чтобы управлять аккаунтом и личными настройками.',danger:'Действия с аккаунтом',title:'Удалить аккаунт?',confirm:'Удалить аккаунт',cancel:'Отмена',failed:'Не удалось удалить аккаунт.'},
};
const deleteBody:Record<Locale,string>={tr:'Yorumlarınız, arama geçmişiniz, profil bilgileriniz ve sosyal bağlantılarınız kaldırılır. Daha sonra aynı e-postayla giriş yapabilirsiniz ancak silinen veriler geri gelmez.',en:'Your reviews, search history, profile information, and social connections will be removed. You can sign in later with the same email, but deleted data cannot be restored.',de:'Deine Bewertungen, dein Suchverlauf, deine Profilangaben und deine sozialen Verbindungen werden entfernt. Du kannst dich später mit derselben E-Mail-Adresse anmelden, gelöschte Daten werden jedoch nicht wiederhergestellt.',ru:'Ваши отзывы, история поиска, данные профиля и социальные связи будут удалены. Позже вы сможете войти с тем же адресом электронной почты, но удалённые данные нельзя восстановить.'};
const reviewCopy:Record<Locale,{title:string;hint:string}>={tr:{title:'Değerlendirmelerim',hint:'Daha önce paylaştığın mağaza deneyimleri'},en:{title:'My reviews',hint:'Store experiences you shared before'},de:{title:'Meine Bewertungen',hint:'Deine bisherigen Erfahrungen mit Geschäften'},ru:{title:'Мои отзывы',hint:'Ваши опубликованные впечатления о магазинах'}};
const messageCopy:Record<Locale,{title:string;hint:string}>={tr:{title:'Mesajlarım',hint:'Bize gönderdiklerin ve yanıtlarımız'},en:{title:'My messages',hint:'What you sent us and our replies'},de:{title:'Meine Nachrichten',hint:'Deine Nachrichten und unsere Antworten'},ru:{title:'Мои сообщения',hint:'Ваши сообщения и наши ответы'}};
const profileEditorHint:Record<Locale,string>={tr:'Görünen adın ve profil bilgilerin',en:'Your display name and profile details',de:'Dein Anzeigename und deine Profilangaben',ru:'Ваше отображаемое имя и данные профиля'};
const progressionCopy:Record<Locale,{next:(level:number,count:number)=>string;reward:string;top:string}>={
  tr:{next:(level,count)=>`${level}. seviyeye geçmene ${count} değerlendirme kaldı.`,reward:'Bir sonraki seviye ödülün',top:'En yüksek katkı seviyesindesin.'},
  en:{next:(level,count)=>`${count} reviews until level ${level}.`,reward:'Your next level reward',top:'You reached the highest contribution level.'},
  de:{next:(level,count)=>`Noch ${count} Bewertungen bis Stufe ${level}.`,reward:'Deine Belohnung für die nächste Stufe',top:'Du hast die höchste Beitragsstufe erreicht.'},
  ru:{next:(level,count)=>`До уровня ${level} осталось отзывов: ${count}.`,reward:'Награда за следующий уровень',top:'Вы достигли высшего уровня участника.'},
};

export function ProfileExperience({section}:{section?:'edit'|'reviews'|'messages'|'account'}){
  const {t,locale}=useI18n();const copy=accountCopy[locale];const [open,setOpen]=useState(false);const [signedIn,setSignedIn]=useState(false);const [checking,setChecking]=useState(true);const [deleting,setDeleting]=useState(false);const [me,setMe]=useState<Me|null>(null);
  useEffect(()=>{
    let active=true;let requestSequence=0;
    const checkSession=async()=>{const sequence=++requestSequence;setChecking(true);try{const response=await apiFetch('/api/proxy/me',{cache:'no-store'});const profile=response.ok?await response.json() as Me:null;if(active&&sequence===requestSequence){setSignedIn(response.ok);setMe(profile);}}catch{if(active&&sequence===requestSequence){setSignedIn(false);setMe(null);}}finally{if(active&&sequence===requestSequence)setChecking(false)}};
    const handleAuthentication=()=>void checkSession();
    void checkSession();window.addEventListener('bosagezme:authenticated',handleAuthentication);
    return()=>{active=false;window.removeEventListener('bosagezme:authenticated',handleAuthentication)};
  },[]);
  const remove=async()=>{if(!window.confirm(`${copy.title}\n\n${deleteBody[locale]}`))return;setDeleting(true);try{const response=await apiFetch('/api/proxy/me',{method:'DELETE'});if(!response.ok)throw new Error();await fetch('/api/auth/logout',{method:'POST'});setSignedIn(false);setMe(null);}catch{window.alert(copy.failed);}finally{setDeleting(false);}};

  useScrollTopWhenReady(!checking);
  if(checking)return <AccountPageSkeleton className="profile-page" eyebrow="" title={t('profileTitle')}/>;

  if(!signedIn||!me)return <main className="profile-page profile-page-out">
    <h1>{t('profileTitle')}</h1>
    <p>{copy.body}</p>
    <button className="button primary" onClick={()=>setOpen(true)}>{t('signIn')}</button>
    <AuthDialog open={open} onClose={()=>setOpen(false)}/>
  </main>;

  const progression=progressionCopy[locale];

  return <main className="profile-page">
    <h1>{t('profileTitle')}</h1>
    {!section&&<section className="profile-summary">
      <div className="profile-avatar">{me.avatar_url?<Image src={me.avatar_url} width={64} height={64} unoptimized alt=""/>:(me.display_name||me.email).slice(0,1).toLocaleUpperCase(locale)}</div>
      <div className="profile-summary-identity"><strong>{me.display_name||me.email}</strong><span>{me.email}</span></div>
      <dl><div><dd><ContributorLevel level={me.level}/></dd><dt>{t('levelTitle')}</dt></div><div><dd>{me.post_count}</dd><dt>{t('profileRatings')}</dt></div></dl>
      {(me.next_level!==undefined||me.level>=5)&&<div className="profile-progression"><ContributorLevel level={me.level}/><p>{me.next_level!==undefined?progression.next(me.next_level,me.reviews_to_next_level??0):progression.top}</p>{me.next_level!==undefined&&<span className="profile-reward"><Gift aria-hidden="true"/>{progression.reward}</span>}</div>}
    </section>}
    {!section&&<ProfileInvite locale={locale}/>}
    {!section?<nav className="profile-sections">
      {[
        ['edit',t('editProfile'),profileEditorHint[locale]],
        ['reviews',reviewCopy[locale].title,reviewCopy[locale].hint],
        ['messages',messageCopy[locale].title,messageCopy[locale].hint],
        ['account',t('accountSection'),t('accountHint')],
      ].map(([path,title,hint])=><Link key={path} href={localePath(locale,`/profile/${path}`)}><strong>{title}</strong><span>{hint}</span></Link>)}
    </nav>:<section className="profile-section-content">
      <PageBackButton/>
      <h2>{section==='edit'?t('editProfile'):section==='reviews'?reviewCopy[locale].title:section==='messages'?messageCopy[locale].title:t('accountSection')}</h2>
      {section==='edit'&&<ProfileEditor me={me} onSaved={setMe}/>}
      {section==='reviews'&&<MyReviews userId={me.id} locale={locale}/>}
      {section==='messages'&&<ProfileMessages locale={locale}/>}
      {section==='account'&&<><SignOutButton className="button secondary account-signout"/><div className="danger-zone"><h3>{copy.danger}</h3><p>{deleteBody[locale]}</p><button className="button secondary danger-button" disabled={deleting} onClick={()=>void remove()}>{copy.confirm}</button></div></>}
    </section>}
    {!section&&<TimedNudge kind="profile"/>}
    <AuthDialog open={open} onClose={()=>setOpen(false)}/>
  </main>;
}
