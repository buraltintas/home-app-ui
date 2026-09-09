'use client';

import Image from 'next/image';
import {Heart,Star} from 'lucide-react';
import {useEffect,useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import type {Locale} from '@/lib/types';

type Kind='discovery'|'favorites'|'review'|'profile';
const copy:Record<Locale,Record<Kind,string>>={
  tr:{discovery:'Mağaza mağaza Boşa Gezme!\nBize sor!',favorites:'Mağazalar değerlendirmeni bekliyor.',review:'Değerlendirmen kaydedildi.',profile:'Güncel rozetini takip et.'},
  en:{discovery:'Do not wander store to store.\nAsk us!',favorites:'Stores are waiting for your review.',review:'Your review was saved.',profile:'Follow your current badge.'},
  de:{discovery:'Nicht von Laden zu Laden irren.\nFrag uns!',favorites:'Geschäfte warten auf deine Bewertung.',review:'Deine Bewertung wurde gespeichert.',profile:'Verfolge dein aktuelles Abzeichen.'},
  ru:{discovery:'Не ходите по магазинам зря.\nСпросите нас!',favorites:'Магазины ждут вашей оценки.',review:'Ваш отзыв сохранён.',profile:'Следите за своим текущим значком.'},
};

export function TimedNudge({kind,requireReviewFlag=false}:{kind:Kind;requireReviewFlag?:boolean}){
  const {locale}=useI18n();
  const [visible,setVisible]=useState(false);
  const [leaving,setLeaving]=useState(false);
  useEffect(()=>{
    if(requireReviewFlag&&sessionStorage.getItem('bosagezme:review-nudge')!=='1')return;
    if(requireReviewFlag)sessionStorage.removeItem('bosagezme:review-nudge');
    let dismissed=false;
    const timer=window.setTimeout(()=>{if(!dismissed)setVisible(true);},kind==='review'?0:2000);
    let exitTimer:number|undefined;
    let lifeTimer:number|undefined;
    const dismiss=()=>{dismissed=true;window.clearTimeout(timer);setLeaving(true);exitTimer=window.setTimeout(()=>setVisible(false),240);};
    // An invitation waits until the reader moves on; a receipt for something they just did
    // has said everything it has to say, so it takes itself off after three seconds.
    if(kind==='review')lifeTimer=window.setTimeout(dismiss,3000);
    window.addEventListener('scroll',dismiss,{passive:true,once:true});
    return()=>{window.clearTimeout(timer);if(exitTimer!==undefined)window.clearTimeout(exitTimer);if(lifeTimer!==undefined)window.clearTimeout(lifeTimer);window.removeEventListener('scroll',dismiss);};
  },[kind,requireReviewFlag]);
  if(!visible)return null;
  return <aside className="timed-nudge" data-state={leaving?'leaving':'visible'} aria-live="polite">
    <span className="timed-nudge-icon" aria-hidden="true">{kind==='discovery'?<Image src="/brand/brand-mark.png" width={46} height={46} alt=""/>:kind==='favorites'?<Heart/>:<Star/>}</span>
    <span>{copy[locale][kind].split('\n').map((line,index)=><span key={line}>{index>0&&<br/>}{line}</span>)}</span>
  </aside>;
}
