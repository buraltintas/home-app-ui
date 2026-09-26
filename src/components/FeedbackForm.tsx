'use client';

import {useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';

// Feedback is a message to us, not a contribution to the product, so the form asks for as
// little as it can: the message, and an address only if the sender wants an answer. Signing
// in is not required for the same reason browsing is not -- somebody who cannot use the
// product is exactly who needs to be able to say so.
//
// It no longer asks what kind of message this is. Four buttons before the box made somebody
// classify a complaint before writing it, and on a phone they pushed the box itself -- the
// only thing on the page that matters -- most of the way down the screen. The kind is
// something we can read off what they wrote; asking is our work moved onto them.
export function FeedbackForm({initialKind='suggestion',initialMessage=''}:{initialKind?:string;initialMessage?:string}={}){
  const {t}=useI18n();
  const [message,setMessage]=useState(initialMessage);
  const [email,setEmail]=useState('');
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);
  const [error,setError]=useState('');

  const submit=async(event:React.FormEvent)=>{
    event.preventDefault();
    setError('');
    if(message.trim().length<5){setError(t('feedbackTooShort'));return;}
    setSending(true);
    try{
      const response=await apiFetch('/api/proxy/feedback',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({kind:initialKind,message:message.trim(),contact_email:email.trim()}),
      });
      if(!response.ok)throw new Error();
      setSent(true);setMessage(initialMessage);setEmail('');
    }catch{setError(t('feedbackError'));}
    finally{setSending(false);}
  };

  if(sent)return <div className="feedback-done">
    <p role="status">{t('feedbackThanks')}</p>
    <button className="button secondary" onClick={()=>setSent(false)}>{t('feedbackAnother')}</button>
  </div>;

  return <form className="feedback-form" onSubmit={event=>void submit(event)}>
    <label className="feedback-field"><span>{t('feedbackMessage')}</span>
      <textarea value={message} maxLength={4000} rows={4} required onChange={event=>setMessage(event.target.value)}/>
      <small>{t('feedbackMessageHint')}</small>
    </label>

    <label className="feedback-field"><span>{t('feedbackEmail')}</span>
      <input type="email" value={email} maxLength={320} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={event=>setEmail(event.target.value)}/>
      <small>{t('feedbackEmailHint')}</small>
    </label>

    <div className="feedback-actions">
      <button className="button primary" type="submit" disabled={sending}>{sending?t('feedbackSending'):t('feedbackSend')}</button>
      <small>{t('feedbackPrivacy')}</small>
    </div>
    {error&&<p className="form-error" role="alert">{error}</p>}
  </form>;
}
