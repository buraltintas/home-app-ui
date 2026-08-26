'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';
import type {Comment} from '@/lib/types';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import {AuthDialog} from './AuthDialog';

// Comments are readable by anyone; only writing one needs an account. The dialog opens
// when the backend actually refuses the write, never on the mere intent to comment.
export function CommentThread({postId,comments}:{postId:string;comments:Comment[]}){
  const {t,locale}=useI18n();
  const router=useRouter();
  const [text,setText]=useState('');
  const [sending,setSending]=useState(false);
  const [error,setError]=useState('');
  const [auth,setAuth]=useState(false);

  const send=async()=>{
    const body=text.trim();
    if(body.length<1)return;
    setSending(true);setError('');
    try{
      const response=await apiFetch(`/api/proxy/posts/${postId}/comments`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:body,content_language:locale})});
      if(response.status===401){setAuth(true);return;}
      if(!response.ok)throw new Error();
      setText('');
      router.refresh();
    }catch{setError(t('commentError'));}
    finally{setSending(false);}
  };

  return <section className="comments-section">
    <p className="eyebrow">{t('comments')}</p>
    <h2>{comments.length} {t('communityComments')}</h2>
    {comments.length===0
      ?<p>{t('noComments')}</p>
      :<ul className="comment-list">{comments.map(comment=><li key={comment.id}>
        <div className="avatar" aria-hidden="true">{comment.display_name.slice(0,1).toLocaleUpperCase(locale)}</div>
        <div>
          <strong>{comment.display_name}</strong>
          <span>{new Intl.DateTimeFormat(locale,{day:'numeric',month:'short'}).format(new Date(comment.created_at))}</span>
          <p>{comment.body}</p>
        </div>
      </li>)}</ul>}
    <form className="comment-form" onSubmit={event=>{event.preventDefault();void send();}}>
      <label htmlFor="comment-text">{t('addComment')}</label>
      <textarea id="comment-text" value={text} onChange={event=>setText(event.target.value.slice(0,1000))} rows={3} maxLength={1000} placeholder={t('commentHint')}/>
      {error&&<p className="form-error" role="alert">{error}</p>}
      <button className="button primary" type="submit" disabled={sending||text.trim().length<1}>{sending?t('loading'):t('sendComment')}</button>
    </form>
    <AuthDialog open={auth} onClose={()=>setAuth(false)} onAuthenticated={()=>{setAuth(false);void send();}}/>
  </section>;
}
