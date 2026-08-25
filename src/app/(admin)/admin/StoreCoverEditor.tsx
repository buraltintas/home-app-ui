'use client';

import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {ChangeEvent,useRef,useState} from 'react';
import {apiFetch} from '@/lib/api-client';
import type {MediaUpload} from '@/lib/types';

const allowed=new Set(['image/jpeg','image/png','image/webp']);
const maxBytes=10*1024*1024;

export function StoreCoverEditor({storeId,initialMediaId}:{storeId:string;initialMediaId?:string}){
  const router=useRouter();
  const input=useRef<HTMLInputElement>(null);
  const [mediaId,setMediaId]=useState(initialMediaId);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');

  const upload=async(event:ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];
    event.target.value='';
    if(!file)return;
    if(!allowed.has(file.type)||file.size<1||file.size>maxBytes){setError('JPEG, PNG veya WebP; en fazla 10 MB.');return;}
    setBusy(true);setError('');
    try{
      const created=await apiFetch('/api/proxy/media/uploads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mime_type:file.type,size_bytes:file.size})});
      if(!created.ok)throw new Error();
      const {id,upload:target}=await created.json() as MediaUpload;
      const stored=await fetch(target.upload_url,{method:'PUT',headers:target.headers,body:file});
      if(!stored.ok)throw new Error();
      const bitmap=await createImageBitmap(file);
      const completed=await apiFetch(`/api/proxy/media/${id}/complete`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({width:bitmap.width,height:bitmap.height})});
      bitmap.close();
      if(!completed.ok)throw new Error();
      const published=await apiFetch(`/api/proxy/admin/stores/${storeId}/cover`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({media_id:id})});
      if(!published.ok)throw new Error();
      setMediaId(id);
      router.refresh();
    }catch{setError('Görsel yüklenemedi. Tekrar deneyin.');}
    finally{setBusy(false);}
  };

  const remove=async()=>{
    if(!mediaId)return;
    setBusy(true);setError('');
    try{
      const response=await apiFetch(`/api/proxy/admin/stores/${storeId}/cover`,{method:'DELETE'});
      if(!response.ok)throw new Error();
      setMediaId(undefined);
      router.refresh();
    }catch{setError('Görsel kaldırılamadı. Tekrar deneyin.');}
    finally{setBusy(false);}
  };

  return <div className="store-cover-editor">
    {mediaId
      ?<Image className="store-cover-preview" src={`/api/media/${mediaId}`} width={104} height={78} alt="Yönetici mağaza kapağı" unoptimized/>
      :<div className="store-cover-fallback"><span>Google</span><small>ilk görsel</small></div>}
    <div className="store-cover-actions">
      <input ref={input} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>void upload(event)} disabled={busy}/>
      <button className="admin-action" type="button" disabled={busy} onClick={()=>input.current?.click()}>{busy?'…':mediaId?'Değiştir':'Görsel ekle'}</button>
      {mediaId&&<button className="admin-link-action" type="button" disabled={busy} onClick={()=>void remove()}>Google’a dön</button>}
    </div>
    {error&&<p className="store-cover-error" role="alert">{error}</p>}
  </div>;
}
