'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Bookmark,Heart,MessageCircle,Send,Trash2} from 'lucide-react';
import {useState} from 'react';
import type {Post} from '@/lib/types';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import {Rating,Verified} from './Rating';
import {AuthDialog} from './AuthDialog';
import {ContributorLevel} from './ContributorLevel';
import {storePhotoURL} from '@/lib/store-photo';

// `owned` is the profile's view of your own reviews. Saving a store you have already
// reviewed is not an action anybody needs there, and deleting what you wrote is -- so the
// control in that corner changes rather than being added beside a useless one.
// Where the card is standing. On a store's own page the store is the page, so the card
// drops everything that repeats it -- the store's name, the store's photo -- and everything
// that sends the reader somewhere else: saving the review, opening its comments, the
// written text. What is left is the judgement: who, what they scored it, when.
type PostSurface='feed'|'store';
type PostCardProps={post:Post;surface?:PostSurface;owned?:boolean;onDeleted?:()=>void};

export function PostCard({post,surface='feed',owned=false,onDeleted}:PostCardProps){
  const onStorePage=surface==='store';
  const {t,locale}=useI18n();
  const [auth,setAuth]=useState(false);
  const [liked,setLiked]=useState(post.viewer_has_liked);
  const [saved,setSaved]=useState(post.viewer_has_favorited_store);
  const [busy,setBusy]=useState<'like'|'save'|null>(null);
  const [shared,setShared]=useState(false);
  const [removing,setRemoving]=useState(false);

  const remove=async()=>{
    if(removing||!window.confirm(t('confirmDeleteReview')))return;
    setRemoving(true);
    try{
      const response=await apiFetch(`/api/proxy/posts/${post.id}`,{method:'DELETE'});
      if(!response.ok)throw new Error();
      onDeleted?.();
    }catch{setRemoving(false);}
  };

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

  // Feed shares lead to the store, not to a person's review. This keeps private-looking
  // review copy and the author's name out of messaging previews and matches store sharing.
  const share=async()=>{
    const url=new URL(localePath(locale,`/stores/${post.store_id}`),window.location.origin).toString();
    const payload={title:post.store_name,text:'Boşa Gezme! Bize Sor.',url};
    try{
      if(navigator.share){await navigator.share(payload);return;}
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(()=>setShared(false),2000);
    }catch{/* the person dismissed the sheet, which is not a failure */}
  };

  const place=[post.store_district,post.store_city].filter(Boolean).join(', ');
  // Authored review media remains primary. Without it, the card uses the exact same store
  // cover as search and detail; that fallback opens the store, where Google credit is shown.
  const media=post.media[0];
  const storePhoto=storePhotoURL(post.store_photo,960);
  const hasPhoto=Boolean(media||(!onStorePage&&storePhoto));
  // A date without its year answers "which day" and not "which year", and a review list
  // that goes back further than twelve months needs both.
  const written=new Intl.DateTimeFormat(locale,{day:'numeric',month:'short',year:'numeric'}).format(new Date(post.created_at));
  const likes=post.like_count+(liked&&!post.viewer_has_liked?1:!liked&&post.viewer_has_liked?-1:0);

  return <article className={`post-card${owned?' is-owned':''}${hasPhoto?'':' is-photo-free'}`}>
    <div className="post-number" aria-hidden="true">BG/{new Intl.DateTimeFormat(locale,{month:'2-digit',day:'2-digit'}).format(new Date(post.created_at)).replace(/\D/g,'')}</div>
    <div className="post-heading">
      {!owned&&<header className="post-author">
        <div className="avatar">{post.display_name.slice(0,1).toLocaleUpperCase(locale)}</div>
        <div><strong>{post.display_name}<ContributorLevel level={post.author_level}/></strong>{!onStorePage&&<span>{written}</span>}</div>
        {!onStorePage&&<button className="icon-button" disabled={busy==='save'} aria-label={t('save')} aria-pressed={saved} onClick={()=>void mutate('save')}><Bookmark className={saved?'active-icon':''}/></button>}
      </header>}
      {!onStorePage&&<Link href={localePath(locale,`/stores/${post.store_id}`)} className="post-store"><h2>{post.store_name}</h2>{place&&<p>{place}</p>}</Link>}
    </div>

    {media
      ?<Link href={localePath(locale,`/reviews/${post.id}`)} className="post-photo"><Image src={`/api/media/${media.id}`} fill sizes="(max-width: 760px) 100vw, 760px" alt={post.store_name} priority/></Link>
      :storePhoto&&!onStorePage
        ?<Link href={localePath(locale,`/stores/${post.store_id}`)} className="post-photo"><Image src={storePhoto} fill sizes="(max-width: 760px) 100vw, 760px" alt={post.store_name} unoptimized/></Link>
        :!onStorePage?<Link href={localePath(locale,`/reviews/${post.id}`)} className="post-photo is-empty"><span aria-hidden="true">{post.store_name.slice(0,2).toLocaleUpperCase(locale)}</span><small>{t('noPhoto')}</small></Link>:null}

    <div className="post-details">
      <div className="post-meta"><Rating value={post.rating}/><Verified label={t('verified')}/></div>
      {(owned||onStorePage)&&<p className="post-written">{written}</p>}
      {!onStorePage&&<p className="post-copy">{post.text}</p>}
      <footer className="post-actions">
        <button disabled={busy==='like'} aria-pressed={liked} onClick={()=>void mutate('like')}><Heart className={liked?'active-icon':''}/>{likes}</button>
        {!owned&&!onStorePage&&<Link href={localePath(locale,`/reviews/${post.id}`)} className="post-action-link"><MessageCircle/>{post.comment_count}</Link>}
        <button onClick={()=>void share()}><Send/>{shared?t('copied'):t('share')}</button>
        {owned&&<button className="post-delete" disabled={removing} aria-label={t('deleteReview')} title={t('deleteReview')} onClick={()=>void remove()}><Trash2/>{t('deleteReview')}</button>}
      </footer>
    </div>
    <AuthDialog open={auth} onClose={()=>setAuth(false)}/>
  </article>;
}
