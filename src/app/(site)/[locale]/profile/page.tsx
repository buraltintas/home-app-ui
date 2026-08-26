'use client';

import {useEffect,useState} from 'react';
import {AuthDialog} from '@/components/AuthDialog';
import {SignOutButton} from '@/components/SignOutButton';
import {ContributorLevel} from '@/components/ContributorLevel';
import {MascotLoader} from '@/components/MascotLoader';
import {MyReviews} from '@/components/MyReviews';
import {PastSearches} from '@/components/PastSearches';
import {ProfileEditor} from '@/components/ProfileEditor';
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
const reviewCopy:Record<Locale,{title:string;hint:string}>={tr:{title:'Değerlendirmelerim',hint:'Daha önce paylaştığın mağaza deneyimleri'},en:{title:'My reviews',hint:'Store experiences you shared before'},de:{title:'Meine Bewertungen',hint:'Deine bisherigen Erfahrungen mit Geschäften'},ru:{title:'Мои отзывы',hint:'Ваши опубликованные впечатления о магазинах'}};
const profileEditorHint:Record<Locale,string>={tr:'Görünen adın ve profil bilgilerin',en:'Your display name and profile details',de:'Dein Anzeigename und deine Profilangaben',ru:'Ваше отображаемое имя и данные профиля'};

// One panel of the profile. Everything below the identity card is collapsed by default:
// the page was a single column of unrelated blocks -- search history, language, account
// deletion -- with nothing saying which was which, so the one thing somebody came to do
// was buried among the others.
function Panel({title,hint,children}:{title:string;hint:string;children:React.ReactNode}){
  return <details className="profile-panel">
    <summary><span>{title}</span><small>{hint}</small></summary>
    <div className="profile-panel-body">{children}</div>
  </details>;
}

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

  if(checking)return <main className="profile-page"><p className="eyebrow">{t('profile')}</p><h1>{t('profileTitle')}</h1><MascotLoader/></main>;

  if(!signedIn||!me)return <main className="profile-page profile-page-out">
    <p className="eyebrow">{t('profile')}</p><h1>{t('profileTitle')}</h1>
    <p>{copy.body}</p>
    <button className="button primary" onClick={()=>setOpen(true)}>{t('signIn')}</button>
    <AuthDialog open={open} onClose={()=>setOpen(false)}/>
  </main>;

  return <main className="profile-page">
    <p className="eyebrow">{t('profile')}</p>
    <h1>{t('profileTitle')}</h1>
    <section className="profile-summary">
      <div className="profile-avatar">{(me.display_name||me.email).slice(0,1).toLocaleUpperCase(locale)}</div>
      <div className="profile-summary-identity"><strong>{me.display_name||me.email}<ContributorLevel level={me.level}/></strong><span>{me.email}</span></div>
      <dl>
        <div><dd>{me.post_count}</dd><dt>{t('profileRatings')}</dt></div>
        <div><dd>{me.favorite_count}</dd><dt>{t('savedStores')}</dt></div>
      </dl>
      <SignOutButton className="button secondary profile-signout"/>
    </section>
    <Panel title={t('editProfile')} hint={profileEditorHint[locale]}>
      <ProfileEditor me={me} onSaved={setMe}/>
    </Panel>
    <Panel title={reviewCopy[locale].title} hint={reviewCopy[locale].hint}>
      <MyReviews userId={me.id} locale={locale}/>
    </Panel>
    <Panel title={t('pastSearches')} hint={t('pastSearchesHint')}>
      <PastSearches heading={false}/>
    </Panel>
    <Panel title={t('accountSection')} hint={t('accountHint')}>
      <div className="danger-zone">
        <h2>{copy.danger}</h2>
        <p>{deleteBody[locale]}</p>
        <button className="button secondary danger-button" disabled={deleting} onClick={()=>void remove()}>{copy.confirm}</button>
      </div>
    </Panel>
    <AuthDialog open={open} onClose={()=>setOpen(false)}/>
  </main>;
}
