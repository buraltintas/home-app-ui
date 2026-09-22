'use client';

import {Share2} from 'lucide-react';
import Image from 'next/image';
import {useState} from 'react';
import type {Locale} from '@/lib/types';

const copy:Record<Locale,{title:string;body:string;share:string;shared:string;failed:string}>={
  tr:{title:'Topluluğu güçlendir',body:'Gerçek ev ve yaşam mağazalarını birlikte keşfedin',share:'Boşa Gezme!’yi Paylaş',shared:'Bağlantı kopyalandı',failed:'Bağlantı kopyalanamadı'},
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
    <div className="profile-invite-copy">
      {/* Three people and the light coming off them. Drawn rather than picked: the icon set
          has a group, and it has a spark, but not a group that is worth something -- and the
          rays are the half of this mark that says "this is the good bit". */}
      <svg className="profile-invite-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="13" r="2.6"/><path d="M8 20.5a4.2 4.2 0 0 1 8 0"/>
        <circle cx="5" cy="15" r="2.1"/><path d="M1.8 20.8a3.6 3.6 0 0 1 4.6-2.6"/>
        <circle cx="19" cy="15" r="2.1"/><path d="M22.2 20.8a3.6 3.6 0 0 0-4.6-2.6"/>
        <path d="M12 6.4V4.2"/><path d="m7.6 8-1.4-1.6"/><path d="m16.4 8 1.4-1.6"/>
      </svg>
      <h2 id="profile-invite-title">{text.title}</h2>
      <p>{text.body}</p>
    </div>
    {/* One way to pass it on. The share sheet already offers mail among everything else the
        phone can do with a link, so a second button for mail alone was the same action
        wearing a narrower hat. */}
    <div className="profile-invite-actions"><button type="button" className="button primary profile-invite-share" onClick={()=>void share()}><Share2 aria-hidden="true"/>{text.share}</button></div>
    {/* The picture that was asked for, used as it was given: a phone in somebody's hand with
        the site passed on in a message, which is exactly what the button under it does. It
        replaces a phone drawn in CSS -- a drawing of the idea rather than the thing. */}
    <Image className="profile-invite-phone" src="/illustrations/share-phone.png" width={256} height={320} alt="" aria-hidden="true"/>
    {status&&<p className="profile-invite-status" role="status">{status}</p>}
  </section>;
}
