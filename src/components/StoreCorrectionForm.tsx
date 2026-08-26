'use client';

import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';
import type {Locale} from '@/lib/types';

const copy:Record<Locale,{topic:string;categories:[string,string,string,string];label:string;hint:string;email:string;emailHint:string;send:string;sending:string;thanks:string;again:string;short:string;error:string;privacy:string;prefix:string;field:string}>={
  tr:{topic:'Hatalı olduğunu düşündüğün bilgi hangisi?',categories:['Kategori','Konum','Telefon','Diğer'],label:'Doğrusu nedir?',hint:'Doğru bilginin ne olması gerektiğini mümkün olduğunca açık yaz.',email:'E-posta adresin (isteğe bağlı)',emailHint:'Yalnızca ayrıntı sormamız gerekirse sana ulaşmak için.',send:'Öneriyi gönder',sending:'Gönderiliyor…',thanks:'Teşekkürler. Önerin inceleme sıramıza eklendi.',again:'Başka bir düzeltme öner',short:'Birkaç kelime daha yazar mısın?',error:'Öneri gönderilemedi. Tekrar dener misin?',privacy:'Önerin yalnızca Boşa Gezme! ekibine ulaşır.',prefix:'Mağaza bilgisi düzeltme önerisi',field:'Alan'},
  en:{topic:'Which information do you think is incorrect?',categories:['Category','Location','Phone','Other'],label:'What is correct?',hint:'Describe the correct information as clearly as possible.',email:'Your email (optional)',emailHint:'Only so we can reach you if we need more detail.',send:'Send suggestion',sending:'Sending…',thanks:'Thank you. Your suggestion has been added to our review queue.',again:'Suggest another correction',short:'Could you write a few more words?',error:'The suggestion could not be sent. Try again.',privacy:'Your suggestion is visible only to the Boşa Gezme! team.',prefix:'Store information correction',field:'Field'},
  de:{topic:'Welche Information ist deiner Meinung nach falsch?',categories:['Kategorie','Standort','Telefon','Sonstiges'],label:'Wie lautet die richtige Angabe?',hint:'Beschreibe die richtige Information so klar wie möglich.',email:'Deine E-Mail-Adresse (optional)',emailHint:'Nur falls wir weitere Einzelheiten benötigen.',send:'Hinweis senden',sending:'Wird gesendet…',thanks:'Danke. Dein Hinweis wurde zur Prüfung aufgenommen.',again:'Weitere Korrektur vorschlagen',short:'Magst du noch ein paar Worte schreiben?',error:'Der Hinweis konnte nicht gesendet werden. Versuche es erneut.',privacy:'Dein Hinweis ist nur für das Boşa Gezme!-Team sichtbar.',prefix:'Korrektur der Geschäftsinformationen',field:'Feld'},
  ru:{topic:'Какие данные, по-вашему, указаны неверно?',categories:['Категория','Местоположение','Телефон','Другое'],label:'Как правильно?',hint:'Укажите правильную информацию как можно точнее.',email:'Ваш адрес эл. почты (необязательно)',emailHint:'Только если нам понадобится уточнить детали.',send:'Отправить предложение',sending:'Отправляем…',thanks:'Спасибо. Предложение добавлено в очередь на проверку.',again:'Предложить ещё одно исправление',short:'Напишите, пожалуйста, чуть подробнее.',error:'Не удалось отправить предложение. Попробуйте ещё раз.',privacy:'Предложение увидит только команда Boşa Gezme!.',prefix:'Исправление данных магазина',field:'Поле'},
};

export function StoreCorrectionForm({locale,storeId,storeName}:{locale:Locale;storeId:string;storeName:string}){
  const t=copy[locale];
  const [topic,setTopic]=useState(0);
  const [message,setMessage]=useState('');
  const [email,setEmail]=useState('');
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);
  const [error,setError]=useState('');

  const submit=async(event:React.FormEvent)=>{
    event.preventDefault();
    const correction=message.trim();
    setError('');
    if(correction.length<5){setError(t.short);return;}
    setSending(true);
    try{
      // Store context is attached only to the private operator message. The visitor sees
      // and edits only their own words, while the admin can still resolve the exact store.
      const internalMessage=`${t.prefix}\nStore: ${storeName}\nStore ID: ${storeId}\n${t.field}: ${t.categories[topic]}\n\n${correction}`;
      const response=await apiFetch('/api/proxy/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({kind:'problem',message:internalMessage,contact_email:email.trim()})});
      if(!response.ok)throw new Error();
      setSent(true);setMessage('');setEmail('');
    }catch{setError(t.error);}
    finally{setSending(false);}
  };

  if(sent)return <div className="feedback-done"><p role="status">{t.thanks}</p><button className="button secondary" onClick={()=>setSent(false)}>{t.again}</button></div>;

  return <form className="feedback-form store-correction-form" onSubmit={event=>void submit(event)}>
    <fieldset className="feedback-kinds"><legend>{t.topic}</legend>{t.categories.map((category,index)=><label key={category} className="feedback-kind" data-selected={topic===index}><input type="radio" name="correction-topic" checked={topic===index} onChange={()=>setTopic(index)}/><span>{category}</span></label>)}</fieldset>
    <label className="feedback-field"><span>{t.label}</span><textarea value={message} maxLength={3600} rows={7} required onChange={event=>setMessage(event.target.value)}/><small>{t.hint}</small></label>
    <label className="feedback-field"><span>{t.email}</span><input type="email" value={email} maxLength={320} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={event=>setEmail(event.target.value)}/><small>{t.emailHint}</small></label>
    <div className="feedback-actions"><button className="button primary" type="submit" disabled={sending}>{sending?t.sending:t.send}</button><small>{t.privacy}</small></div>
    {error&&<p className="form-error" role="alert">{error}</p>}
  </form>;
}
