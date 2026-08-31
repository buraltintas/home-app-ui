'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';

export function AdminFeedbackReply({id,initialReply}:{id:string;initialReply?:string}){
  const router=useRouter();
  const [message,setMessage]=useState(initialReply??'');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const submit=async(event:React.FormEvent)=>{
    event.preventDefault();setBusy(true);setError('');
    try{
      const response=await apiFetch(`/api/proxy/admin/feedback/${id}/reply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
      if(!response.ok)throw new Error();
      router.refresh();
    }catch{setError('Yanıt kaydedilemedi.');}
    finally{setBusy(false);}
  };
  return <form className="admin-feedback-reply" onSubmit={event=>void submit(event)}>
    <label htmlFor={`reply-${id}`}>Kullanıcıya yanıt</label>
    <textarea id={`reply-${id}`} value={message} onChange={event=>setMessage(event.target.value)} minLength={1} maxLength={4000} required/>
    <button className="admin-action" disabled={busy||message.trim().length===0}>{busy?'…':initialReply?'Yanıtı güncelle':'Yanıtla'}</button>
    {error&&<p className="admin-note" role="alert">{error}</p>}
  </form>;
}
