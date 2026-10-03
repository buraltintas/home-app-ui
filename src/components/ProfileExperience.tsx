'use client';

import Image from 'next/image';
import {type ReactNode,useCallback,useEffect,useState} from 'react';
import {ArrowDownWideNarrow,CircleHelp,ClipboardCheck,Gift,MessageCircle,PenLine,ShieldCheck,Star} from 'lucide-react';
import {AuthDialog} from '@/components/AuthDialog';
import {emphasisedTitle} from '@/lib/emphasis';
import {SignOutButton} from '@/components/SignOutButton';
import Link from 'next/link';
import {localePath} from '@/lib/site';
import {AccountPageSkeleton} from '@/components/AccountPageSkeleton';
import {PageBackButton} from '@/components/PageBackButton';
import {TimedNudge} from '@/components/TimedNudge';
import {useScrollTopWhenReady} from '@/lib/scroll-top';
import {MyReviews} from '@/components/MyReviews';
import {ProfileMessages} from '@/components/ProfileMessages';
import {ProfileEditor} from '@/components/ProfileEditor';
import {ContributorLevelsDialog} from '@/components/ContributorLevelsDialog';
import {ProfileInvite} from '@/components/ProfileInvite';
import {LevelMedal} from '@/components/LevelMedal';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch,sessionExpiresAt} from '@/lib/api-client';
import type {Locale,Me} from '@/lib/types';

// R71: the words that ask for the sign-in are in brackets and drawn in clay, the colour of
// the button they lead to. They are not in the same place in every language -- they end the
// Turkish sentence and open the others -- so they are marked in the string rather than found
// by position.
const accountCopy:Record<Locale,{body:string;danger:string;title:string;confirm:string;cancel:string;failed:string}>={
  tr:{body:'Hesabını yönetmek ve özel tercihlerini [görmek için giriş yap].',danger:'Hesap işlemleri',title:'Hesabınızı silmek istiyor musunuz?',confirm:'Hesabımı sil',cancel:'Vazgeç',failed:'Hesap silinemedi. Tekrar dene.'},
  en:{body:'[Sign in] to manage your account and private preferences.',danger:'Account actions',title:'Delete your account?',confirm:'Delete my account',cancel:'Cancel',failed:'The account could not be deleted. Try again.'},
  de:{body:'[Melde dich an], um dein Konto und deine privaten Einstellungen zu verwalten.',danger:'Kontoaktionen',title:'Konto löschen?',confirm:'Mein Konto löschen',cancel:'Abbrechen',failed:'Das Konto konnte nicht gelöscht werden.'},
  ru:{body:'[Войдите], чтобы управлять аккаунтом и личными настройками.',danger:'Действия с аккаунтом',title:'Удалить аккаунт?',confirm:'Удалить аккаунт',cancel:'Отмена',failed:'Не удалось удалить аккаунт.'},
};
// The second line of the signed-out page: what you get, rather than what you are missing.
// The heading above it already says "sign in"; this says why it is worth it.
// Broken by hand at the comma rather than left to the column width: the two halves are a
// condition and a promise, and a line that ends mid-condition reads as one long clause.
const signedOutLead:Record<Locale,string>={
  tr:'Daha kişisel bir deneyimle,\nkeşfetmeye devam et.',
  en:'Carry on exploring,\nwith an experience that knows you.',
  de:'Entdecke weiter –\nmit einem Erlebnis, das dich kennt.',
  ru:'Продолжайте искать —\nс опытом, который знает вас.',
};

// Signing out is the reversible one and deleting is not, but on a page that offers both,
// the quiet button is the one people hesitate over. Said before the button rather than after
// it, because it is what somebody wants to know while deciding.
const signOutNote:Record<Locale,string>={
  tr:'Hesabınızdan çıkış yapmak, oturumunuzu kapatmanız anlamına gelir. Yapmış olduğunuz değerlendirmeler ve kaydettikleriniz silinmez.',
  en:'Signing out only ends your session. The reviews you wrote and the stores you saved are not deleted.',
  de:'Beim Abmelden wird nur deine Sitzung beendet. Deine Bewertungen und gespeicherten Geschäfte werden nicht gelöscht.',
  ru:'Выход из аккаунта завершает только сеанс. Ваши отзывы и сохранённые магазины не удаляются.',
};

const deleteBody:Record<Locale,string>={tr:'Yorumlarınız, arama geçmişiniz, profil bilgileriniz ve sosyal bağlantılarınız kaldırılır. Daha sonra aynı e-postayla giriş yapabilirsiniz ancak silinen veriler geri gelmez.',en:'Your reviews, search history, profile information, and social connections will be removed. You can sign in later with the same email, but deleted data cannot be restored.',de:'Deine Bewertungen, dein Suchverlauf, deine Profilangaben und deine sozialen Verbindungen werden entfernt. Du kannst dich später mit derselben E-Mail-Adresse anmelden, gelöschte Daten werden jedoch nicht wiederhergestellt.',ru:'Ваши отзывы, история поиска, данные профиля и социальные связи будут удалены. Позже вы сможете войти с тем же адресом электронной почты, но удалённые данные нельзя восстановить.'};
// R57: one line. "Daha önce" said nothing the word "paylaştığın" does not already say, and it
// was the half that pushed the line onto a second one.
const reviewCopy:Record<Locale,{title:string;hint:string}>={tr:{title:'Değerlendirmelerim',hint:'Paylaştığın mağaza deneyimleri'},en:{title:'My reviews',hint:'Store experiences you shared'},de:{title:'Meine Bewertungen',hint:'Deine Erfahrungen mit Geschäften'},ru:{title:'Мои отзывы',hint:'Ваши впечатления о магазинах'}};
// The set's medal, minus the numeral on its face. Every other stroke is the same one the
// icon set draws; only the "1" is gone, because a badge for level three and a badge for
// level four were both stamped with it.
// R66: the fifth card, and the page it opens. The card says what it is for; the page says
// what is on it.
const helpCopy:Record<Locale,{card:string;hint:string;title:string}>={
  tr:{card:'Yardım',hint:'Çok sorulan soruların cevapları',title:'Çok sorulanlar'},
  en:{card:'Help',hint:'Answers to common questions',title:'Frequently asked'},
  de:{card:'Hilfe',hint:'Antworten auf häufige Fragen',title:'Häufig gefragt'},
  ru:{card:'Помощь',hint:'Ответы на частые вопросы',title:'Частые вопросы'},
};
const messageCopy:Record<Locale,{title:string;hint:string}>={tr:{title:'Mesajlarım',hint:'Bize gönderdiklerin ve yanıtlarımız'},en:{title:'My messages',hint:'What you sent us and our replies'},de:{title:'Meine Nachrichten',hint:'Deine Nachrichten und unsere Antworten'},ru:{title:'Мои сообщения',hint:'Ваши сообщения и наши ответы'}};
const levelNote:Record<Locale,string>={tr:'Doğrulanmış her değerlendirme katkı seviyeni yükseltir.',en:'Every verified review raises your contributor level.',de:'Jede bestätigte Bewertung erhöht deine Beitragsstufe.',ru:'Каждый подтверждённый отзыв повышает ваш уровень участника.'};
const profileEditorHint:Record<Locale,string>={tr:'Görünen adın ve profil bilgilerin',en:'Your display name and profile details',de:'Dein Anzeigename und deine Profilangaben',ru:'Ваше отображаемое имя и данные профиля'};
const progressionCopy:Record<Locale,{next:(level:number,count:number)=>string;reward:string;top:string}>={
  tr:{next:(level,count)=>`${level}. seviyeye geçmene ${count} değerlendirme kaldı.`,reward:'Bir sonraki seviye ödülün',top:'En yüksek katkı seviyesindesin.'},
  en:{next:(level,count)=>`${count} reviews until level ${level}.`,reward:'Your next level reward',top:'You reached the highest contribution level.'},
  de:{next:(level,count)=>`Noch ${count} Bewertungen bis Stufe ${level}.`,reward:'Deine Belohnung für die nächste Stufe',top:'Du hast die höchste Beitragsstufe erreicht.'},
  ru:{next:(level,count)=>`До уровня ${level} осталось отзывов: ${count}.`,reward:'Награда за следующий уровень',top:'Вы достигли высшего уровня участника.'},
};

// The ladder, shown as a ladder. A badge on its own says where somebody is; it does not say
// where they are going or how far off it is, and that is the part that makes a level worth
// having. Current rung on the left, next rung on the right, the distance between them drawn
// between them.
//
// The two counts under the badges are the only honest scale available here: the API reports
// how many reviews this person has written and how many are still needed, so the next rung's
// number is the sum of those two. Nothing here is a threshold table copied into the browser
// -- a second copy of the ladder would drift from the one the backend actually applies.
const ladderCopy:Record<Locale,{current:string;next:string;level:(n:number)=>string;reviews:(n:number)=>string}>={
  tr:{current:'Mevcut Seviye',next:'Sonraki Seviye',level:n=>`${n}. Seviye`,reviews:n=>`${n} değerlendirme`},
  en:{current:'Current level',next:'Next level',level:n=>`Level ${n}`,reviews:n=>`${n} reviews`},
  de:{current:'Aktuelle Stufe',next:'Nächste Stufe',level:n=>`Stufe ${n}`,reviews:n=>`${n} Bewertungen`},
  ru:{current:'Текущий уровень',next:'Следующий уровень',level:n=>`Уровень ${n}`,reviews:n=>`Отзывов: ${n}`},
};
// The two things a list of reviews has to say before the list itself: how many there are,
// and what order they are in. Said in the same pair of tiles the search results use, because
// they are the same two questions and a reader who has met them once should not have to learn
// a second shape for them.
const reviewSummaryCopy:Record<Locale,{total:string;sort:string;sortValue:string}>={
  tr:{total:'Toplam değerlendirme',sort:'Sıralama ölçütü',sortValue:'Değerlendirme tarihi'},
  en:{total:'Reviews in total',sort:'Sorted by',sortValue:'Review date'},
  de:{total:'Bewertungen insgesamt',sort:'Sortiert nach',sortValue:'Bewertungsdatum'},
  ru:{total:'Всего отзывов',sort:'Сортировка',sortValue:'Дата отзыва'},
};

// R68: the profile this tab last read, kept between the profile's own pages.
//
// Each of those pages is a route of its own, so each one mounted with nothing and asked the
// server who is signed in before it drew a thing: a tap on "Mesajlarım" was followed by an
// empty page for as long as that question took, and only then by the page. Somebody who was
// signed in a moment ago, on the page they tapped from, still is -- so the page is drawn at
// once from what was last read, and the question is still asked, behind it, to catch a
// session that has since ended.
//
// It lives in this tab's memory only and starts empty on every full load, so a server render
// and the first client render always agree. It is only ever drawn for the session it was read
// in: it is kept beside the session cookie's value at that moment, and any change to that
// cookie -- signing out here or in another tab, a refresh that failed anywhere in the app and
// cleared it, a new sign-in, a renewed token -- sets it aside, so the page waits for the
// server as it used to. Signing in or out in this tab drops it outright, mounted or not.
let remembered:{profile:Me;session:number}|null=null;
function rememberedProfile():Me|null{
  const session=sessionExpiresAt();
  if(remembered&&remembered.session!==session)remembered=null;
  return remembered?.profile??null;
}
function remember(profile:Me|null){
  const session=sessionExpiresAt();
  remembered=profile&&session!==null?{profile,session}:null;
}
if(typeof window!=='undefined')window.addEventListener('bosagezme:authenticated',()=>{remembered=null;});

export function ProfileExperience({section,help}:{section?:'edit'|'reviews'|'messages'|'account'|'help';help?:ReactNode}){
  const {t,locale}=useI18n();const copy=accountCopy[locale];const [open,setOpen]=useState(false);const [me,setMeState]=useState<Me|null>(rememberedProfile);const [signedIn,setSignedIn]=useState(me!==null);const [checking,setChecking]=useState(me===null);const [deleting,setDeleting]=useState(false);
  // Whether this page has heard from the server itself, rather than drawn from memory. The
  // form for editing the profile waits for it: it takes its starting values once, and a form
  // seeded from a name changed since -- in the app, or in another tab -- would save the old
  // name back over the new one.
  const [verified,setVerified]=useState(false);
  const setMe=useCallback((profile:Me|null)=>{remember(profile);setMeState(profile);},[]);
  useEffect(()=>{
    let active=true;let requestSequence=0;
    // With a remembered profile on screen, a failed read is not taken as proof of being
    // signed out -- only a 401 is, as in the header. Without one there is nothing to keep,
    // and the page says what it always said.
    const checkSession=async()=>{const sequence=++requestSequence;if(!rememberedProfile())setChecking(true);try{const response=await apiFetch('/api/proxy/me',{cache:'no-store'});const profile=response.ok?await response.json() as Me:null;if(active&&sequence===requestSequence){if(profile){setSignedIn(true);setMe(profile);setVerified(true);}else if(response.status===401||!rememberedProfile()){setSignedIn(false);setMe(null);}}}catch{if(active&&sequence===requestSequence&&!rememberedProfile()){setSignedIn(false);setMe(null);}}finally{if(active&&sequence===requestSequence)setChecking(false)}};
    // Signing in or out here: whatever was remembered belongs to the session that just ended,
    // so the page waits for the answer instead of showing it -- the account page does not
    // stay live under a session that is already gone.
    const handleAuthentication=()=>{remembered=null;void checkSession();};
    void checkSession();window.addEventListener('bosagezme:authenticated',handleAuthentication);
    return()=>{active=false;window.removeEventListener('bosagezme:authenticated',handleAuthentication)};
  },[setMe]);
  const remove=async()=>{if(!window.confirm(`${copy.title}\n\n${deleteBody[locale]}`))return;setDeleting(true);try{const response=await apiFetch('/api/proxy/me',{method:'DELETE'});if(!response.ok)throw new Error();await fetch('/api/auth/logout',{method:'POST'});setSignedIn(false);setMe(null);}catch{window.alert(copy.failed);}finally{setDeleting(false);}};

  useScrollTopWhenReady(!checking);
  if(checking)return <AccountPageSkeleton className="profile-page" eyebrow="" title={t('profileTitle')}/>;

  // Signed out, this page has one thing to say and one thing to offer, and it says them the
  // way the favourites page says its own (R64): the same centred column, in the same order --
  // the drawing, the clay word, the heading, the sentence, the button -- from the same rules.
  // The two pages are the same moment: something is behind a sign-in, and this is what.
  //
  // The drawing is this page's own: the three places it leads to once you are in, with the
  // marks they carry there, so the invitation is about what you get rather than about what
  // you have not done.
  if(!signedIn||!me)return <main className="empty-page profile-page-out">
    <div className="profile-out-art" aria-hidden="true">
      {/* R71: a person cut from the disc rather than drawn on it in a line -- the figure keeps
          the pale fill it had, the disc around it takes the clay of the button below, and the
          shoulders run on to the disc's edge, the way a profile picture is framed. */}
      <span className="profile-out-avatar"><svg viewBox="0 0 64 64" focusable="false"><circle cx="32" cy="25" r="11"/><path d="M9 64c0-13.3 10.3-23 23-23s23 9.7 23 23z"/></svg></span>
      <ul className="profile-out-peek">
        <li><span className="is-gold"><PenLine/></span>{t('editProfile')}</li>
        <li><span className="is-clay"><Star/></span>{reviewCopy[locale].title}</li>
        <li><span className="is-sky"><ShieldCheck/></span>{t('accountSection')}</li>
      </ul>
    </div>
    <p className="eyebrow">{t('profile')}</p>
    <h1>{emphasisedTitle(copy.body,'profile-out-mark')}</h1>
    <p className="profile-out-lead">{signedOutLead[locale]}</p>
    <button type="button" className="button primary" onClick={()=>setOpen(true)}>{t('signIn')}</button>
    <AuthDialog open={open} onClose={()=>setOpen(false)}/>
  </main>;

  const progression=progressionCopy[locale];
  const ladder=ladderCopy[locale];
  // How many reviews the next rung asks for: what has been written plus what is still owed.
  // Both numbers come from the backend, so the ladder here can never disagree with the one
  // being applied there.
  const nextTarget=me.next_level!==undefined?me.post_count+(me.reviews_to_next_level??0):undefined;
  // Each destination its own mark and its own ground. The colour is named on the row rather
  // than worked out from its position, so reordering the list cannot silently repaint it.
  // R67: the account has a ground of its own, a pale sky that no other row uses; until then it
  // shared the neutral with help, and two rows in one colour read as one kind of thing.
  const sectionLinks=[
    ['edit',t('editProfile'),profileEditorHint[locale],PenLine,'gold'],
    ['reviews',reviewCopy[locale].title,reviewCopy[locale].hint,Star,'clay'],
    ['messages',messageCopy[locale].title,messageCopy[locale].hint,MessageCircle,'green'],
    ['account',t('accountSection'),t('accountHint'),ShieldCheck,'sky'],
    // The neutral: help is a drawer of answers rather than a themed place.
    ['help',helpCopy[locale].card,helpCopy[locale].hint,CircleHelp,'plain'],
  ] as const;

  // A sub-page has no title of its own above the back arrow, so the page's opening margin
  // -- sized for a heading -- became empty room at the top of four screens.
  return <main className={`profile-page${section?' is-section':''}`}>
    {!section&&<h1>{t('profileTitle')}</h1>}
    {!section&&<section className="profile-summary">
      <div className="profile-avatar">{me.avatar_url?<Image src={me.avatar_url} width={64} height={64} unoptimized alt=""/>:(me.display_name||me.email).slice(0,1).toLocaleUpperCase(locale)}</div>
      <div className="profile-summary-identity"><strong>{me.display_name||me.email}</strong><span>{me.email}</span></div>
      <div className={`level-ladder${me.next_level===undefined?' is-top':''}`}>
        <div className="level-ladder-step">
          <span className="level-ladder-badge" aria-hidden="true"><LevelMedal/></span>
          <small>{ladder.current}</small>
          <strong>{ladder.level(Math.min(me.level,5))}</strong>
          <span className="level-ladder-name">{t(`level${Math.min(Math.max(me.level,1),5)}` as 'level1')}</span>
          <span className="level-ladder-count">{ladder.reviews(me.post_count)}</span>
        </div>
        {/* The rail is the distance, so at the top of the ladder it is simply covered: there
            is no next rung to travel to and an empty rail would read as one. */}
        <span className="level-ladder-rail" aria-hidden="true"><span style={{width:`${nextTarget?Math.min(100,Math.round(me.post_count/nextTarget*100)):100}%`}}/></span>
        {me.next_level!==undefined&&<div className="level-ladder-step is-next">
          <span className="level-ladder-badge" aria-hidden="true"><LevelMedal/></span>
          <small>{ladder.next}</small>
          <strong>{ladder.level(me.next_level)}</strong>
          <span className="level-ladder-name">{t(`level${Math.min(Math.max(me.next_level,1),5)}` as 'level1')}</span>
          <span className="level-ladder-count">{ladder.reviews(nextTarget??me.post_count)}</span>
        </div>}
      </div>
      {(me.next_level!==undefined||me.level>=5)&&<div className="profile-progression"><p>{me.next_level!==undefined?progression.next(me.next_level,me.reviews_to_next_level??0):progression.top}</p>{me.next_level!==undefined&&<span className="profile-reward"><Gift aria-hidden="true"/>{progression.reward}</span>}</div>}
    </section>}
    {/* R49: the same card the store page carries, question first. The profile had its own
        "raise your level" frame, which is an instruction that assumes the reader knows what
        a level is -- and it was a second drawing of a thing that already existed. */}
    {!section&&<ContributorLevelsDialog locale={locale} note={levelNote[locale]}/>}
    {!section&&<ProfileInvite locale={locale}/>}
    {!section?<nav className="profile-sections">
      {/* No arrow on the right. It was a third column taking 48px with the gap, and the
          line under each title was being cut off with an ellipsis to fit beside it -- the
          arrow was decoration and the sentence was the content. */}
      {sectionLinks.map(([path,title,hint,Icon,tone])=><Link key={path} href={localePath(locale,`/profile/${path}`)}>
        <span className={`profile-section-icon is-${tone}`} aria-hidden="true"><Icon/></span>
        <span className="profile-section-copy"><strong>{title}</strong><small>{hint}</small></span>
      </Link>)}
    </nav>:<section className="profile-section-content">
      <PageBackButton/>
      <h2>{section==='edit'?t('editProfile'):section==='reviews'?reviewCopy[locale].title:section==='messages'?messageCopy[locale].title:section==='help'?helpCopy[locale].title:t('accountSection')}</h2>
      {/* The search page's own tiles, class for class: the green one counts what is on the
          screen, the amber one names the order. Newest first is what this list has always
          been; it simply never said so. */}
      {section==='reviews'&&<dl className="result-count profile-review-count">
        <div className="result-count-total"><span className="result-count-mark" aria-hidden="true"><ClipboardCheck/></span><div><dt>{reviewSummaryCopy[locale].total}</dt><dd>{me.post_count}</dd></div></div>
        <div className="result-count-sort"><span className="result-count-mark" aria-hidden="true"><ArrowDownWideNarrow/></span><div><dt>{reviewSummaryCopy[locale].sort}</dt><dd>{reviewSummaryCopy[locale].sortValue}</dd></div></div>
      </dl>}
      {section==='edit'&&verified&&<ProfileEditor key={me.id} me={me} onSaved={setMe}/>}
      {section==='reviews'&&<MyReviews key={me.id} userId={me.id} locale={locale}/>}
      {section==='messages'&&<ProfileMessages locale={locale}/>}
      {section==='help'&&help}
      {/* Both notes are plain page text rather than boxed warnings. A red frame around the
          sentence that explains what deleting removes made the explanation read as the alarm;
          the frame belongs to the act, and the sentence belongs to the reader. */}
      {/* Both notes sit above the button they are about, which is where somebody reads
          them -- after the button they are an explanation of something already done. The
          heading no longer carries a frame of its own: it names the section, and a box
          around a heading on a page that has no other boxes reads as a warning about the
          heading. */}
      {section==='account'&&<>
        <p className="profile-form-hint account-note">{signOutNote[locale]}</p>
        <SignOutButton className="button secondary account-signout"/>
        <div className="danger-zone">
          <h3>{copy.danger}</h3>
          <p className="profile-form-hint account-note">{deleteBody[locale]}</p>
          <button className="button secondary danger-button" disabled={deleting} onClick={()=>void remove()}>{copy.confirm}</button>
        </div>
      </>}
    </section>}
    {!section&&<TimedNudge kind="profile"/>}
    <AuthDialog open={open} onClose={()=>setOpen(false)}/>
  </main>;
}
