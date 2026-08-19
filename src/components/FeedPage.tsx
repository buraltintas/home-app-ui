'use client';

import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import type {Post} from '@/lib/types';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch,SESSION_REFRESHED} from '@/lib/api-client';
import {PostCard} from './PostCard';

type FeedResponse={items:Post[];next_cursor:string};

// The server already read the feed and passed it in, so the first paint has real
// reviews in it. The effect below still runs on every later locale or session change; it
// only skips the very first pass, which would otherwise refetch what we already have.
export function FeedPage({initialPosts}:{initialPosts?:Post[]}){
  const {t,locale}=useI18n();const [posts,setPosts]=useState<Post[]|null>(initialPosts??null);const [error,setError]=useState(false);const [request,setRequest]=useState(0);
  const serverRendered=useRef(initialPosts!==undefined);
  // Whose feed this is decides which hearts are filled, so it is read again whenever the
  // session changes rather than left showing a visitor's view to a signed-in person.
  useEffect(()=>{
    const again=()=>setRequest(value=>value+1);
    window.addEventListener('bosagezme:authenticated',again);
    window.addEventListener(SESSION_REFRESHED,again);
    return()=>{window.removeEventListener('bosagezme:authenticated',again);window.removeEventListener(SESSION_REFRESHED,again);};
  },[]);
  useEffect(()=>{if(serverRendered.current){serverRendered.current=false;return;}let active=true;apiFetch('/api/proxy/feed?limit=20',{cache:'no-store',headers:{'X-Locale':locale},signal:AbortSignal.timeout(10000)}).then(async response=>{if(!response.ok)throw new Error();return response.json() as Promise<FeedResponse>;}).then(data=>{if(active){setError(false);setPosts(data.items);}}).catch(()=>{if(active){setPosts(null);setError(true);}});return()=>{active=false;};},[locale,request]);
  const retry=()=>{setPosts(null);setError(false);setRequest(value=>value+1);};
  return <main className="feed-layout"><section className="feed-main"><header className="feed-intro"><div className="intro-copy"><h1>{t('feedTitle')}</h1><p>{t('feedIntro')}</p></div><div className="intro-stamp" aria-hidden="true"><span className="intro-stamp-image"><Image src="/brand/mascot-magnifier.png" width={92} height={92} alt=""/></span><span>{t('discover')}</span></div></header>{posts===null&&!error&&<div className="feed-state" aria-live="polite"><div className="feed-skeleton"/><p>{t('feedLoading')}</p></div>}{error&&<div className="feed-state" role="alert"><h2>{t('feedErrorTitle')}</h2><p>{t('feedErrorBody')}</p><button className="button secondary" onClick={retry}>{t('retry')}</button></div>}{posts?.length===0&&<div className="feed-state"><Image src="/brand/brand-mark.png" width={84} height={84} alt=""/><h2>{t('feedEmptyTitle')}</h2><p>{t('feedEmptyBody')}</p></div>}{posts?.map(post=><PostCard post={post} key={post.id}/>)}</section></main>;
}
