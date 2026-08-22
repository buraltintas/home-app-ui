'use client';

import {Bookmark,Check,Map,PenLine,Phone,Share2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import {originSearchHeaders} from '@/lib/search-origin';
import {AuthDialog} from './AuthDialog';

type Props={storeId:string;name:string;latitude:number;longitude:number;initialFavorited:boolean;phone?:string};

export function StoreActions({storeId,name,latitude,longitude,initialFavorited,phone}:Props){
  const {t,locale}=useI18n();
  const router=useRouter();
  const [favorited,setFavorited]=useState(initialFavorited);
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState('');
  const [auth,setAuth]=useState(false);
  // What the user was trying to do when the sign-in dialog opened, so the intent is
  // resumed afterwards instead of silently dropped.
  const [pending,setPending]=useState<'favorite'|'review'>();

  const toggleFavorite=async()=>{
    if(busy)return;
    const next=!favorited;
    setBusy(true);setStatus('');setFavorited(next);
    try{
      const response=await apiFetch(`/api/proxy/stores/${storeId}/favorite`,{method:next?'POST':'DELETE',headers:originSearchHeaders()});
      if(response.status===401){setFavorited(!next);setPending('favorite');setAuth(true);return;}
      // An optimistic flip is not success. Only a 2xx keeps it.
      if(!response.ok)throw new Error();
      setStatus(next?t('saved'):'');
    }catch{setFavorited(!next);setStatus(t('saveError'));}
    finally{setBusy(false);}
  };

  const review=async()=>{
    setStatus('');
    try{
      const response=await apiFetch('/api/proxy/me',{cache:'no-store'});
      if(!response.ok){setPending('review');setAuth(true);return;}
    }catch{setPending('review');setAuth(true);return;}
    router.push(localePath(locale,`/create?store=${storeId}`));
  };

  const directions=()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,'_blank','noopener,noreferrer');

  const share=async()=>{
    const url=window.location.href;
    try{
      if(navigator.share){await navigator.share({title:name,url});return;}
      await navigator.clipboard.writeText(url);
      setStatus(t('copied'));
    }catch{}
  };

  const resume=()=>{
    const intent=pending;setPending(undefined);
    if(intent==='favorite')void toggleFavorite();
    if(intent==='review')router.push(localePath(locale,`/create?store=${storeId}`));
  };

  return <><div className="store-actions">
    <button onClick={()=>void toggleFavorite()} disabled={busy} aria-pressed={favorited}>{favorited?<Check/>:<Bookmark/>}{favorited?t('saved'):t('save')}</button>
    <button onClick={directions}><Map/>{t('directions')}</button>
    {phone&&<a href={`tel:${phone.replace(/[^\d+]/g,'')}`}><Phone/>{t('callStore')}</a>}
    <button onClick={()=>void review()}><PenLine/>{t('review')}</button>
    <button onClick={()=>void share()}><Share2/>{t('share')}</button>
  </div>
  {status&&<p className="action-status" role="status">{status}</p>}
  <AuthDialog open={auth} onClose={()=>{setAuth(false);setPending(undefined);}} onAuthenticated={resume}/></>;
}
