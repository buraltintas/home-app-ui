'use client';

import Image from 'next/image';
import {Star} from 'lucide-react';
import {useEffect,useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import type {Locale} from '@/lib/types';

type Kind='discovery'|'search'|'favorites'|'review'|'profile';

// The discovery dock says two things and only one of them is the point: everything before
// "Bize sor!" is the situation, and "Bize sor!" is what to do about it. So it is held apart
// as its own piece rather than split on a line break -- the lead can then be quiet and the
// call can carry the weight, the colour and the shine.
const lead:Record<Locale,string>={
  tr:'Mağaza mağaza Boşa Gezme!',
  en:'Do not wander store to store.',
  de:'Nicht von Laden zu Laden irren.',
  ru:'Не ходите по магазинам зря.',
};
const call:Record<Locale,string>={tr:'Bize sor!',en:'Ask us!',de:'Frag uns!',ru:'Спросите нас!'};

const copy:Record<Locale,Record<Exclude<Kind,'discovery'>,string>>={
  tr:{search:'İster mağaza ismi, ister kategori ismi ile arama yap',favorites:'Mağazalar değerlendirmeni bekliyor.',review:'Değerlendirmen kaydedildi.',profile:'Güncel seviyeni takip et.'},
  en:{search:'Search by store name or by category',favorites:'Stores are waiting for your review.',review:'Your review was saved.',profile:'Follow your current level.'},
  de:{search:'Suche nach Geschäftsname oder nach Kategorie',favorites:'Geschäfte warten auf deine Bewertung.',review:'Deine Bewertung wurde gespeichert.',profile:'Verfolge deine aktuelle Stufe.'},
  ru:{search:'Ищите по названию магазина или по категории',favorites:'Магазины ждут вашей оценки.',review:'Ваш отзыв сохранён.',profile:'Следите за своим текущим уровнем.'},
};
export function TimedNudge({kind,requireReviewFlag=false}:{kind:Kind;requireReviewFlag?:boolean}){
  const {locale}=useI18n();
  const [visible,setVisible]=useState(false);
  const [leaving,setLeaving]=useState(false);
  useEffect(()=>{
    if(requireReviewFlag&&sessionStorage.getItem('bosagezme:review-nudge')!=='1')return;
    let dismissed=false;
    const timer=window.setTimeout(()=>{if(!dismissed)setVisible(true);},kind==='review'?0:2000);
    let exitTimer:number|undefined;
    let lifeTimer:number|undefined;
    // The flag is spent when the receipt has been shown, not when the effect first reads
    // it. Clearing it up front meant the effect could consume it on one pass and find
    // nothing on the next -- and then nothing was ever drawn.
    const dismiss=()=>{dismissed=true;window.clearTimeout(timer);if(requireReviewFlag)sessionStorage.removeItem('bosagezme:review-nudge');setLeaving(true);exitTimer=window.setTimeout(()=>setVisible(false),420);};
    // An invitation waits until the reader moves on; a receipt for something they just did
    // has said everything it has to say, so it takes itself off after three seconds.
    //
    // And a receipt is not dismissed by scrolling. It arrives on a page that scrolls itself
    // to the top on arrival, and that programmatic scroll fired the listener in the same
    // instant the receipt appeared -- so "it must stay three seconds" was implemented and
    // still never seen. On a phone any stray touch did the same. Its life is the timer and
    // nothing else.
    if(kind==='review')lifeTimer=window.setTimeout(dismiss,3000);
    else window.addEventListener('scroll',dismiss,{passive:true,once:true});
    return()=>{window.clearTimeout(timer);if(exitTimer!==undefined)window.clearTimeout(exitTimer);if(lifeTimer!==undefined)window.clearTimeout(lifeTimer);window.removeEventListener('scroll',dismiss);};
  },[kind,requireReviewFlag]);
  if(!visible)return null;
  // The mascot is the brand's own face and belongs on the two docks that invite somebody to
  // search; the others are receipts and notices, and a mascot on those would be the brand
  // talking about itself while somebody is being told something.
  const mark=kind==='discovery'||kind==='search'
    ?<Image src="/brand/brand-mark.png" width={48} height={48} alt=""/>
    // Favourites are kept in order to be reviewed, so this dock carries the mark this
    // product uses for a review everywhere else -- the same one the receipt carries. A heart
    // said "saved", which is the thing already done rather than the thing being asked for.
    :<Star/>;
  return <aside className="timed-nudge" data-state={leaving?'leaving':'visible'} aria-live="polite">
    <span className="timed-nudge-icon" aria-hidden="true">{mark}</span>
    {kind==='discovery'
      ?<span className="timed-nudge-copy"><span className="timed-nudge-lead">{lead[locale]}</span><span className="timed-nudge-call">{call[locale]}</span></span>
      :<span>{copy[locale][kind]}</span>}
  </aside>;
}
