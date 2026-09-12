'use client';

import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {apiFetch} from '@/lib/api-client';

// Which of the reviews on this page the reader has liked.
//
// A page that is cached and served to everybody alike cannot carry that in its markup:
// whoever's state was rendered into it would be shown to the next reader, and a review
// somebody liked would come back to them un-liked. So the page renders the reviews and the
// reader's own state arrives afterwards -- one request for all of them, not one each.
//
// Nothing is undone by this. It only turns a card on: a card the reader has liked and the
// markup rendered cold. A failure, including the ordinary one of not being signed in,
// leaves every card exactly as the page rendered it.
const Liked=createContext<Set<string>|undefined>(undefined);

export function useViewerLiked(postId:string){
  const liked=useContext(Liked);
  return liked?.has(postId)??false;
}

export function ViewerLikes({postIds,children}:{postIds:string[];children:ReactNode}){
  const [liked,setLiked]=useState<Set<string>>(()=>new Set());
  const key=postIds.join(',');
  useEffect(()=>{
    if(key==='')return;
    let active=true;
    void(async()=>{
      try{
        const response=await apiFetch(`/api/proxy/me/likes?posts=${encodeURIComponent(key)}`,{cache:'no-store'});
        if(!response.ok)return;
        const body=await response.json() as {liked?:string[]};
        if(active&&(body.liked??[]).length>0)setLiked(new Set(body.liked));
      }catch{/* leave every card as the page rendered it */}
    })();
    return()=>{active=false;};
  },[key]);
  return <Liked.Provider value={liked}>{children}</Liked.Provider>;
}
