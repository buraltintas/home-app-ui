'use client';

import {useEffect,useState} from 'react';
import {apiFetch} from '@/lib/api-client';
import type {FeedbackMessage,Locale} from '@/lib/types';

const copy:Record<Locale,{answered:string;empty:string;error:string;pending:string;reply:string;sent:string}>={
  tr:{answered:'Yanıtlandı',empty:'Henüz bize gönderdiğin bir mesaj yok.',error:'Mesajların yüklenemedi. Tekrar dener misin?',pending:'Yanıt bekliyor',reply:'Boşa Gezme! yanıtı',sent:'Gönderdiğin mesaj'},
  en:{answered:'Answered',empty:'You have not sent us a message yet.',error:'Your messages could not be loaded. Please try again.',pending:'Awaiting a reply',reply:'Boşa Gezme! reply',sent:'Your message'},
  de:{answered:'Beantwortet',empty:'Du hast uns noch keine Nachricht gesendet.',error:'Deine Nachrichten konnten nicht geladen werden.',pending:'Wartet auf Antwort',reply:'Antwort von Boşa Gezme!',sent:'Deine Nachricht'},
  ru:{answered:'Получен ответ',empty:'Вы ещё не отправляли нам сообщений.',error:'Не удалось загрузить сообщения.',pending:'Ожидает ответа',reply:'Ответ Boşa Gezme!',sent:'Ваше сообщение'},
};

export function ProfileMessages({locale}:{locale:Locale}){
  const [items,setItems]=useState<FeedbackMessage[]|null>(null);
  const [error,setError]=useState('');
  const text=copy[locale];
  useEffect(()=>{
    let active=true;
    void apiFetch('/api/proxy/me/messages?limit=50',{cache:'no-store'})
      .then(async response=>{if(!response.ok)throw new Error();return response.json() as Promise<{items:FeedbackMessage[]}>;})
      .then(result=>{if(active)setItems(result.items??[]);})
      .catch(()=>{if(active)setError(text.error);});
    return()=>{active=false;};
  },[text.error]);
  if(error)return <p className="form-error" role="alert">{error}</p>;
  if(items===null)return <div className="profile-list-skeleton" aria-label={text.sent}/>;
  if(items.length===0)return <p className="profile-empty">{text.empty}</p>;
  return <div className="profile-messages">{items.map(item=>{const [title,...body]=item.message.split('\n');return <article key={item.id} className="profile-message">
    <header><strong>{text.sent}</strong><time dateTime={item.created_at}>{new Intl.DateTimeFormat(locale,{dateStyle:'medium'}).format(new Date(item.created_at))}</time></header>
    <p>{body.length?<><strong className="profile-message-kind">{title}</strong>{body.join('\n')}</>:item.message}</p>
    {item.reply?<div className="profile-message-reply"><strong>{text.reply}</strong><p>{item.reply}</p>{item.replied_at&&<time dateTime={item.replied_at}>{new Intl.DateTimeFormat(locale,{dateStyle:'medium'}).format(new Date(item.replied_at))}</time>}</div>:<small className="profile-message-status">{text.pending}</small>}
  </article>})}</div>;
}
