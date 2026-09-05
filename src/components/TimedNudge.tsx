'use client';

import Image from 'next/image';
import {Heart,Star} from 'lucide-react';
import {useEffect,useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import type {Locale} from '@/lib/types';

type Kind='discovery'|'favorites'|'review';
const copy:Record<Locale,Record<Kind,string>>={
  tr:{discovery:'Mağaza mağaza Boşa Gezme!\nBize sorun!',favorites:'Mağazalar değerlendirmeni bekliyor.',review:'Güncel rozetini takip et.'},
  en:{discovery:'Do not wander store to store.\nAsk us!',favorites:'Stores are waiting for your review.',review:'Follow your updated badge.'},
  de:{discovery:'Nicht von Laden zu Laden irren.\nFrag uns!',favorites:'Geschäfte warten auf deine Bewertung.',review:'Verfolge dein aktualisiertes Abzeichen.'},
  ru:{discovery:'Не ходите по магазинам зря.\nСпросите нас!',favorites:'Магазины ждут вашей оценки.',review:'Следите за обновлённым значком.'},
};

export function TimedNudge({kind,requireReviewFlag=false}:{kind:Kind;requireReviewFlag?:boolean}){
  const {locale}=useI18n();
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    if(requireReviewFlag&&sessionStorage.getItem('bosagezme:review-nudge')!=='1')return;
    if(requireReviewFlag)sessionStorage.removeItem('bosagezme:review-nudge');
    const timer=window.setTimeout(()=>setVisible(true),3000);
    const dismiss=()=>setVisible(false);
    window.addEventListener('scroll',dismiss,{passive:true,once:true});
    return()=>{window.clearTimeout(timer);window.removeEventListener('scroll',dismiss);};
  },[requireReviewFlag]);
  if(!visible)return null;
  return <aside className="timed-nudge" aria-live="polite">
    <span className="timed-nudge-icon" aria-hidden="true">{kind==='discovery'?<Image src="/brand/brand-mark.png" width={46} height={46} alt=""/>:kind==='favorites'?<Heart/>:<Star/>}</span>
    <span>{copy[locale][kind].split('\n').map((line,index)=><span key={line}>{index>0&&<br/>}{line}</span>)}</span>
  </aside>;
}
