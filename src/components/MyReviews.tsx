'use client';

import {useEffect,useState} from 'react';
import {PostCard} from '@/components/PostCard';
import {apiFetch} from '@/lib/api-client';
import type {Locale,Post} from '@/lib/types';

const copy:Record<Locale,{empty:string;error:string}>={
  tr:{empty:'Henüz bir değerlendirme paylaşmadın.',error:'Değerlendirmelerin yüklenemedi. Tekrar deneyebilirsin.'},
  en:{empty:'You have not shared a review yet.',error:'Your reviews could not be loaded. Try again.'},
  de:{empty:'Du hast noch keine Bewertung geteilt.',error:'Deine Bewertungen konnten nicht geladen werden. Versuche es erneut.'},
  ru:{empty:'Вы ещё не публиковали отзывов.',error:'Не удалось загрузить ваши отзывы. Попробуйте ещё раз.'},
};

export function MyReviews({userId,locale}:{userId:string;locale:Locale}){
  const [posts,setPosts]=useState<Post[]>();
  const [failed,setFailed]=useState(false);

  useEffect(()=>{
    let active=true;
    void(async()=>{
      try{
        const response=await apiFetch(`/api/proxy/users/${userId}/posts?limit=20`,{cache:'no-store'});
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
  return <div className="profile-review-list">{posts.map(post=><PostCard key={post.id} post={post}/>)}</div>;
}
