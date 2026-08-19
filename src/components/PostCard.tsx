'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Bookmark,Heart,MessageCircle,Send} from 'lucide-react';
import {useState} from 'react';
import type {Post} from '@/lib/types';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import {Rating,Verified} from './Rating';
import {AuthDialog} from './AuthDialog';
import {ContributorLevel} from './ContributorLevel';

type PostCardProps={post:Post;showStoreName?:boolean};

export function PostCard({post,showStoreName=true}:PostCardProps){
  const {t,locale}=useI18n();
  const [auth,setAuth]=useState(false);
  const [liked,setLiked]=useState(post.viewer_has_liked);
  const [saved,setSaved]=useState(post.viewer_has_favorited_store);
  const [busy,setBusy]=useState<'like'|'save'|null>(null);
  const [shared,setShared]=useState(false);

  const mutate=async(kind:'like'|'save')=>{
    const active=kind==='like'?liked:saved;
    setBusy(kind);
    try{
      const path=kind==='like'?`/api/proxy/posts/${post.id}/like`:`/api/proxy/stores/${post.store_id}/favorite`;
      const response=await apiFetch(path,{method:active?'DELETE':'POST'});
      if(response.status===401){setAuth(true);return;}
      if(!response.ok)throw new Error();
      if(kind==='like')setLiked(!active);else setSaved(!active);
    }finally{setBusy(null);}
  };

  // Sharing a review means sharing its page. Where the platform has no share sheet the
  // link goes to the clipboard instead, so the button always does something.
  const share=async()=>{
    const url=new URL(`/reviews/${post.id}`,window.location.origin).toString();
    const payload={title:post.store_name,text:post.text.slice(0,140),url};
    try{
      if(navigator.share){await navigator.share(payload);return;}
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(()=>setShared(false),2000);
    }catch{/* the person dismissed the sheet, which is not a failure */}
  };

  const place=[post.store_district,post.store_city].filter(Boolean).join(', ');
  // A review card carries its author's own photographs. When there are none the card
  // says so rather than borrowing a stock interior that was never this store.
  const media=post.media[0];
  const likes=post.like_count+(liked&&!post.viewer_has_liked?1:!liked&&post.viewer_has_liked?-1:0);

  return <article className="post-card">
    <div className="post-number" aria-hidden="true">BG/{new Intl.DateTimeFormat(locale,{month:'2-digit',day:'2-digit'}).format(new Date(post.created_at)).replace(/\D/g,'')}</div>
    <div className="post-heading">
      <header className="post-author">
        <div className="avatar">{post.display_name.slice(0,1).toLocaleUpperCase(locale)}</div>
        <div><strong>{post.display_name}<ContributorLevel level={post.author_level}/></strong><span>@{post.username} · {new Intl.DateTimeFormat(locale,{day:'numeric',month:'short'}).format(new Date(post.created_at))}</span></div>
        <button className="icon-button" disabled={busy==='save'} aria-label={t('save')} aria-pressed={saved} onClick={()=>void mutate('save')}><Bookmark className={saved?'active-icon':''}/></button>
      </header>
      {showStoreName&&<Link href={localePath(locale,`/stores/${post.store_id}`)} className="post-store"><h2>{post.store_name}</h2>{place&&<p>{place}</p>}</Link>}
    </div>

    {media
      ?<Link href={localePath(locale,`/reviews/${post.id}`)} className="post-photo"><Image src={`/api/media/${media.id}`} fill sizes="(max-width: 760px) 100vw, 760px" alt={post.store_name} priority/></Link>
      :<Link href={localePath(locale,`/reviews/${post.id}`)} className="post-photo is-empty"><span aria-hidden="true">{post.store_name.slice(0,2).toLocaleUpperCase(locale)}</span><small>{t('noPhoto')}</small></Link>}

    <div className="post-details">
      <div className="post-meta"><Rating value={post.rating}/><Verified label={t('verified')}/></div>
      <p className="post-copy">{post.text}</p>
      <footer className="post-actions">
        <button disabled={busy==='like'} aria-pressed={liked} onClick={()=>void mutate('like')}><Heart className={liked?'active-icon':''}/>{likes}</button>
        <Link href={localePath(locale,`/reviews/${post.id}`)} className="post-action-link"><MessageCircle/>{post.comment_count}</Link>
        <button onClick={()=>void share()}><Send/>{shared?t('copied'):t('share')}</button>
      </footer>
    </div>
    <AuthDialog open={auth} onClose={()=>setAuth(false)}/>
  </article>;
}
