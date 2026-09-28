'use client';

import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';
import {useI18n} from '@/i18n/I18nProvider';
import {emailFaultMessage,useEmailCheck} from '@/lib/use-email-check';
import type {Locale} from '@/lib/types';

const copy:Record<Locale,{topic:string;categories:[string,string,string,string];label:string;hint:string;email:string;emailHint:string;send:string;sending:string;thanks:string;again:string;short:string;error:string;privacy:string;prefix:string;store:string;field:string}>={
  tr:{topic:'Hatalı olduğunu düşündüğün bilgi hangisi?',categories:['Kategori','Konum','Telefon','Diğer'],label:'Doğrusu nedir?',hint:'Doğru bilginin ne olması gerektiğini mümkün olduğunca açık yaz.',email:'E-posta adresin (isteğe bağlı)',emailHint:'Yalnızca ayrıntı sormamız gerekirse sana ulaşmak için.',send:'Öneriyi gönder',sending:'Gönderiliyor…',thanks:'Teşekkürler. Önerin en kısa sürede incelenecektir.',again:'Başka bir düzeltme öner',short:'Birkaç kelime daha yazar mısın?',error:'Öneri gönderilemedi. Tekrar dener misin?',privacy:'Önerin yalnızca Boşa Gezme! ekibine ulaşır.',prefix:'Mağaza bilgisi düzeltme önerisi',store:'Mağaza adı',field:'Alan'},
  en:{topic:'Which information do you think is incorrect?',categories:['Category','Location','Phone','Other'],label:'What is correct?',hint:'Describe the correct information as clearly as possible.',email:'Your email (optional)',emailHint:'Only so we can reach you if we need more detail.',send:'Send suggestion',sending:'Sending…',thanks:'Thank you. Your suggestion will be reviewed as soon as possible.',again:'Suggest another correction',short:'Could you write a few more words?',error:'The suggestion could not be sent. Try again.',privacy:'Your suggestion is visible only to the Boşa Gezme! team.',prefix:'Store information correction',store:'Store name',field:'Field'},
  de:{topic:'Welche Information ist deiner Meinung nach falsch?',categories:['Kategorie','Standort','Telefon','Sonstiges'],label:'Wie lautet die richtige Angabe?',hint:'Beschreibe die richtige Information so klar wie möglich.',email:'Deine E-Mail-Adresse (optional)',emailHint:'Nur falls wir weitere Einzelheiten benötigen.',send:'Hinweis senden',sending:'Wird gesendet…',thanks:'Danke. Dein Hinweis wird so bald wie möglich geprüft.',again:'Weitere Korrektur vorschlagen',short:'Magst du noch ein paar Worte schreiben?',error:'Der Hinweis konnte nicht gesendet werden. Versuche es erneut.',privacy:'Dein Hinweis ist nur für das Boşa Gezme!-Team sichtbar.',prefix:'Korrektur der Geschäftsinformationen',store:'Geschäftsname',field:'Feld'},
  ru:{topic:'Какие данные, по-вашему, указаны неверно?',categories:['Категория','Местоположение','Телефон','Другое'],label:'Как правильно?',hint:'Укажите правильную информацию как можно точнее.',email:'Ваш адрес эл. почты (необязательно)',emailHint:'Только если нам понадобится уточнить детали.',send:'Отправить предложение',sending:'Отправляем…',thanks:'Спасибо. Предложение будет рассмотрено в ближайшее время.',again:'Предложить ещё одно исправление',short:'Напишите, пожалуйста, чуть подробнее.',error:'Не удалось отправить предложение. Попробуйте ещё раз.',privacy:'Предложение увидит только команда Boşa Gezme!.',prefix:'Исправление данных магазина',store:'Название магазина',field:'Поле'},
};

// The heading and the sentence under it, kept beside the form rather than in the page that
// happened to hold it first. Two places open this form now -- a page, for a link somebody
// was sent, and a sheet on the store itself -- and an explanation that lives in one of them
// is an explanation the other has to copy.

export function StoreCorrectionForm({locale,storeName}:{locale:Locale;storeId:string;storeName:string}){
  const t=copy[locale];
  // What is wrong with an address is worded once for the whole product, so this reads it
  // from the shared dictionary rather than keeping a fourth copy in the record above.
  const {t:translate}=useI18n();
  const [topic,setTopic]=useState(0);
  const [message,setMessage]=useState('');
  const [email,setEmail]=useState('');
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);
  const [error,setError]=useState('');
  const {fault:emailFault,shown:emailShown,reveal:revealEmailFault,field:emailField}=useEmailCheck(email);

  const submit=async(event:React.FormEvent)=>{
    event.preventDefault();
    const correction=message.trim();
    setError('');
    if(correction.length<5){setError(t.short);return;}
    // Pressing send is a way of saying the address is finished, so the answer to it is
    // owed here as surely as it is when the field is left. Refusing quietly -- which is
    // what a button that greys itself out does -- leaves somebody pressing a control that
    // does nothing and never says why.
    if(emailFault){revealEmailFault();return;}
    setSending(true);
    try{
      // Store context is attached only to the private operator message. The visitor sees
      // and edits only their own words, while the admin can still resolve the exact store.
      const internalMessage=`${t.prefix}\n${t.store}: ${storeName}\n${t.field}: ${t.categories[topic]}\n\n${correction}`;
      const response=await apiFetch('/api/proxy/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({kind:'problem',message:internalMessage,contact_email:email.trim()})});
      if(!response.ok)throw new Error();
      setSent(true);setMessage('');setEmail('');
    }catch{setError(t.error);}
    finally{setSending(false);}
  };

  if(sent)return <div className="feedback-done"><p role="status">{t.thanks}</p><button className="button secondary" onClick={()=>setSent(false)}>{t.again}</button></div>;

  return <form className="feedback-form store-correction-form" onSubmit={event=>void submit(event)}>
    <fieldset className="feedback-kinds"><legend>{t.topic}</legend>{t.categories.map((category,index)=><label key={category} className="feedback-kind" data-selected={topic===index}><input type="radio" name="correction-topic" checked={topic===index} onChange={()=>setTopic(index)}/><span>{category}</span></label>)}</fieldset>
    <label className="feedback-field"><span>{t.label}</span><textarea value={message} maxLength={3600} rows={3} required onChange={event=>setMessage(event.target.value)}/><small>{t.hint}</small></label>
    {/* Optional, and checked all the same: an address given here is the only way back to
        whoever reported the mistake, so a mistyped one is worse than none at all. */}
    <label className="feedback-field"><span>{t.email}</span><input type="email" value={email} maxLength={320} aria-invalid={emailShown?true:undefined} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={event=>setEmail(event.target.value)} {...emailField}/>
      {emailShown&&<small className="feedback-email-fault" role="alert">{emailFaultMessage(emailShown,translate)}</small>}
      <small>{t.emailHint}</small></label>
    <div className="feedback-actions"><button className="button primary" type="submit" disabled={sending}>{sending?t.sending:t.send}</button><small>{t.privacy}</small></div>
    {error&&<p className="form-error" role="alert">{error}</p>}
  </form>;
}
