'use client';

import {Mail,Share2} from 'lucide-react';
import {useState} from 'react';
import type {Locale} from '@/lib/types';

const copy:Record<Locale,{title:string;body:string;share:string;email:string;shared:string;failed:string;subject:string;message:string}>={
  tr:{title:'Arkadaşını davet et',body:'Birlikte keşfettiğiniz mağazaları karşılaştırın.',share:'Site bağlantısını paylaş',email:'E-posta ile davet et',shared:'Bağlantı kopyalandı',failed:'Bağlantı kopyalanamadı',subject:'Boşa Gezme!’ye davet',message:'Gerçek ev ve yaşam mağazalarını birlikte keşfedelim: https://bosagezme.com'},
  en:{title:'Invite a friend',body:'Compare the real stores you discover together.',share:'Share the website',email:'Invite by email',shared:'Link copied',failed:'Could not copy the link',subject:'An invitation to Boşa Gezme!',message:'Let’s discover real home and living stores together: https://bosagezme.com'},
  de:{title:'Freunde einladen',body:'Vergleicht gemeinsam entdeckte Geschäfte.',share:'Website teilen',email:'Per E-Mail einladen',shared:'Link kopiert',failed:'Link konnte nicht kopiert werden',subject:'Einladung zu Boşa Gezme!',message:'Lass uns gemeinsam echte Wohn- und Haushaltsgeschäfte entdecken: https://bosagezme.com'},
  ru:{title:'Пригласить друга',body:'Сравнивайте магазины, которые вы нашли вместе.',share:'Поделиться сайтом',email:'Пригласить по почте',shared:'Ссылка скопирована',failed:'Не удалось скопировать ссылку',subject:'Приглашение в Boşa Gezme!',message:'Давайте вместе находить настоящие магазины товаров для дома: https://bosagezme.com'},
};

export function ProfileInvite({locale}:{locale:Locale}){
  const text=copy[locale];
  const [status,setStatus]=useState('');
  const share=async()=>{
    setStatus('');
    if(navigator.share){
      try{await navigator.share({title:'Boşa Gezme!',text:text.message,url:'https://bosagezme.com'});return;}catch(error){if((error as DOMException).name==='AbortError')return;}
    }
    try{await navigator.clipboard.writeText('https://bosagezme.com');setStatus(text.shared);}catch{setStatus(text.failed);}
  };
  const mailto=`mailto:?subject=${encodeURIComponent(text.subject)}&body=${encodeURIComponent(text.message)}`;
  return <section className="profile-invite" aria-labelledby="profile-invite-title">
    <div><h2 id="profile-invite-title">{text.title}</h2><p>{text.body}</p></div>
    <div className="profile-invite-actions"><button className="button primary" onClick={()=>void share()}><Share2 aria-hidden="true"/>{text.share}</button><a className="button secondary" href={mailto}><Mail aria-hidden="true"/>{text.email}</a></div>
    {status&&<p className="profile-invite-status" role="status">{status}</p>}
  </section>;
}
