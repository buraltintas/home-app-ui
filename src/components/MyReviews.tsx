'use client';

import {useEffect,useState} from 'react';
import {PostCard} from '@/components/PostCard';
import {apiFetch} from '@/lib/api-client';
import type {Locale,Post} from '@/lib/types';

const LIMIT=200;

const copy:Record<Locale,{empty:string;error:string;capped:(n:number)=>string}>={
  tr:{empty:'Henüz bir değerlendirme paylaşmadın.',error:'Değerlendirmelerin yüklenemedi. Tekrar deneyebilirsin.',capped:n=>`En son ${n} değerlendirmen gösteriliyor.`},
  en:{empty:'You have not shared a review yet.',error:'Your reviews could not be loaded. Try again.',capped:n=>`Showing your most recent ${n} reviews.`},
  de:{empty:'Du hast noch keine Bewertung geteilt.',error:'Deine Bewertungen konnten nicht geladen werden. Versuche es erneut.',capped:n=>`Es werden deine letzten ${n} Bewertungen angezeigt.`},
  ru:{empty:'Вы ещё не публиковали отзывов.',error:'Не удалось загрузить ваши отзывы. Попробуйте ещё раз.',capped:n=>`Показаны ваши последние ${n} отзывов.`},
};

export function MyReviews({userId,locale}:{userId:string;locale:Locale}){
  const [posts,setPosts]=useState<Post[]>();
  const [failed,setFailed]=useState(false);

  useEffect(()=>{
    let active=true;
    void(async()=>{
      try{
        // All of them, not the first twenty. The page above this says how many there are, so
        // showing fewer than that number is the page contradicting itself. Two hundred is the
        // endpoint's ceiling; a reader past it is told rather than quietly shown a prefix.
        const response=await apiFetch(`/api/proxy/users/${userId}/posts?limit=${LIMIT}`,{cache:'no-store'});
        if(!response.ok)throw new Error();
        const body=await response.json() as {items?:Post[]};
        if(active)setPosts(body.items??[]);
      }catch{if(active)setFailed(true);}
    })();
    return()=>{active=false;};
  },[userId]);

  if(failed)return <p className="form-error" role="alert">{copy[locale].error}</p>;
  if(!posts)return <div className="profile-review-skeleton" aria-busy="true"><span/><span/><span/></div>;
  if(!posts.length)return <p className="profile-reviews-empty">{copy[locale].empty}</p>;
  // Removing it from the list is the honest acknowledgement: the server has already
  // deleted it, so leaving it on screen would be showing something that no longer exists.
  return <div className="profile-review-list">
    {posts.length>=LIMIT&&<p className="profile-reviews-capped" role="note">{copy[locale].capped(LIMIT)}</p>}
    {posts.map(post=>
    <PostCard key={post.id} post={post} owned onDeleted={()=>setPosts(current=>(current??[]).filter(p=>p.id!==post.id))}/>)}</div>;
}
