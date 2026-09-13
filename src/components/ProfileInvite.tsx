'use client';

import {Share2} from 'lucide-react';
import {useState} from 'react';
import type {Locale} from '@/lib/types';

const copy:Record<Locale,{title:string;body:string;share:string;shared:string;failed:string}>={
  tr:{title:'Topluluğu güçlendir',body:'Gerçek ev ve yaşam mağazalarını birlikte keşfedin',share:'Site bağlantısını paylaş',shared:'Bağlantı kopyalandı',failed:'Bağlantı kopyalanamadı'},
  en:{title:'Strengthen the community',body:'Discover real home and living stores together',share:'Share the website',shared:'Link copied',failed:'Could not copy the link'},
  de:{title:'Die Community stärken',body:'Entdeckt gemeinsam echte Wohn- und Haushaltsgeschäfte',share:'Website teilen',shared:'Link kopiert',failed:'Link konnte nicht kopiert werden'},
  ru:{title:'Укрепите сообщество',body:'Открывайте настоящие магазины для дома вместе',share:'Поделиться сайтом',shared:'Ссылка скопирована',failed:'Не удалось скопировать ссылку'},
};

// The share sheet takes the address as a field of its own and prints it under the text.
// Carrying it inside the sentence as well put the same link in the message twice.
const SITE='https://bosagezme.com';
const message:Record<Locale,string>={
  tr:'Gerçek ev ve yaşam mağazalarını birlikte keşfedelim:',
  en:'Let’s discover real home and living stores together:',
  de:'Lass uns gemeinsam echte Wohn- und Haushaltsgeschäfte entdecken:',
  ru:'Давайте вместе находить настоящие магазины товаров для дома:',
};

export function ProfileInvite({locale}:{locale:Locale}){
  const text=copy[locale];
  const [status,setStatus]=useState('');
  const share=async()=>{
    setStatus('');
    if(navigator.share){
      try{await navigator.share({title:'Boşa Gezme!',text:message[locale],url:SITE});return;}catch(error){if((error as DOMException).name==='AbortError')return;}
    }
    try{await navigator.clipboard.writeText(SITE);setStatus(text.shared);}catch{setStatus(text.failed);}
  };
  return <section className="profile-invite" aria-labelledby="profile-invite-title">
    <div><h2 id="profile-invite-title">{text.title}</h2><p>{text.body}</p></div>
    {/* One way to pass it on. The share sheet already offers mail among everything else the
        phone can do with a link, so a second button for mail alone was the same action
        wearing a narrower hat. */}
    <div className="profile-invite-actions"><button className="button primary" onClick={()=>void share()}><Share2 aria-hidden="true"/>{text.share}</button></div>
    {status&&<p className="profile-invite-status" role="status">{status}</p>}
  </section>;
}
