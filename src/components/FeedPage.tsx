'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import type {Post} from '@/lib/types';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch,SESSION_REFRESHED} from '@/lib/api-client';
import {PostCard} from './PostCard';

type FeedResponse={items:Post[];next_cursor?:string};
const PAGE=20;

// The server already read the feed and passed it in, so the first paint has real
// reviews in it. The effect below still runs on every later locale or session change; it
// only skips the very first pass, which would otherwise refetch what we already have.
export function FeedPage({initialPosts,initialCursor}:{initialPosts?:Post[];initialCursor?:string}){
  const {t,locale}=useI18n();
  const [posts,setPosts]=useState<Post[]|null>(initialPosts??null);
  const [cursor,setCursor]=useState(initialCursor??'');
  const [error,setError]=useState(false);
  const [request,setRequest]=useState(0);
  const [loadingMore,setLoadingMore]=useState(false);
  const serverRendered=useRef(initialPosts!==undefined);

  // Whose feed this is decides which hearts are filled, so it is read again whenever the
  // session changes rather than left showing a visitor's view to a signed-in person.
  useEffect(()=>{
    const again=()=>setRequest(value=>value+1);
    window.addEventListener('bosagezme:authenticated',again);
    window.addEventListener(SESSION_REFRESHED,again);
    return()=>{window.removeEventListener('bosagezme:authenticated',again);window.removeEventListener(SESSION_REFRESHED,again);};
  },[]);

  useEffect(()=>{
    if(serverRendered.current){serverRendered.current=false;return;}
    let active=true;
    apiFetch(`/api/proxy/feed?limit=${PAGE}`,{cache:'no-store',headers:{'X-Locale':locale},signal:AbortSignal.timeout(10000)})
      .then(async response=>{if(!response.ok)throw new Error();return response.json() as Promise<FeedResponse>;})
      .then(data=>{if(active){setError(false);setPosts(data.items);setCursor(data.next_cursor??'');}})
      .catch(()=>{if(active){setPosts(null);setError(true);}});
    return()=>{active=false;};
  },[locale,request]);

  // Reading past the first page keeps what is already on screen. A failure here leaves
  // the cursor untouched, so the button stays and the same page can be tried again --
  // it must never wipe out reviews the reader is in the middle of.
  const loadMore=useCallback(()=>{
    if(!cursor||loadingMore)return;
    setLoadingMore(true);
    apiFetch(`/api/proxy/feed?limit=${PAGE}&cursor=${encodeURIComponent(cursor)}`,{cache:'no-store',headers:{'X-Locale':locale},signal:AbortSignal.timeout(10000)})
      .then(async response=>{if(!response.ok)throw new Error();return response.json() as Promise<FeedResponse>;})
      .then(data=>{
        const next=data.items??[];
        setPosts(current=>{
          const seen=new Set((current??[]).map(post=>post.id));
          return [...(current??[]),...next.filter(post=>!seen.has(post.id))];
        });
        setCursor(data.next_cursor??'');
      })
      .catch(()=>undefined)
      .finally(()=>setLoadingMore(false));
  },[cursor,loadingMore,locale]);

  // The button is its own sentinel: reaching it loads the next page without a tap, and
  // it stays a real button so a keyboard, a screen reader and a stalled observer all
  // still have a way through.
  const sentinel=useRef<HTMLButtonElement|null>(null);
  useEffect(()=>{
    const node=sentinel.current;
    if(!node||!cursor||typeof IntersectionObserver==='undefined')return;
    const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))loadMore();},{rootMargin:'600px 0px'});
    observer.observe(node);
    return()=>observer.disconnect();
  },[cursor,loadMore]);

  const retry=()=>{setPosts(null);setError(false);setCursor('');setRequest(value=>value+1);};

  return <main className="feed-layout"><section className="feed-main">
    <header className="feed-intro">
      <div className="intro-copy"><h1>{t('feedTitle')}</h1><p>{t('feedIntro')}</p></div>
      <div className="intro-stamp" aria-hidden="true"><span className="intro-stamp-image"><Image src="/brand/mascot-magnifier.png" width={92} height={92} alt=""/></span><span>{t('discover')}</span></div>
    </header>
    {posts===null&&!error&&<div className="feed-state" aria-live="polite"><div className="feed-skeleton"/><p>{t('feedLoading')}</p></div>}
    {error&&<div className="feed-state" role="alert"><h2>{t('feedErrorTitle')}</h2><p>{t('feedErrorBody')}</p><button className="button secondary" onClick={retry}>{t('retry')}</button></div>}
    {posts?.length===0&&<div className="feed-state"><Image src="/brand/brand-mark.png" width={84} height={84} alt=""/><h2>{t('feedEmptyTitle')}</h2><p>{t('feedEmptyBody')}</p></div>}
    {posts?.map(post=><PostCard post={post} key={post.id}/>)}
    {!!posts?.length&&(cursor
      ?<div className="feed-more"><button ref={sentinel} className="button secondary" onClick={loadMore} disabled={loadingMore}>{loadingMore?t('feedMoreLoading'):t('feedMore')}</button></div>
      :<p className="feed-end">{t('feedEnd')}</p>)}
  </section></main>;
}
