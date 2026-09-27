'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';
import {refreshStorePage} from '@/lib/store-cache';

// One button for every privileged action. It refuses to report success on anything but a
// successful response: a local state flip is not a backend change, and on this surface a
// button that looks like it worked when it did not is worse than no button.
// storeRefs names the shop page an action changes. A shop's page is cached for a day and is
// only honest because every change to it drops it; an administrator deleting or publishing
// a review is a change to it, and until now nothing dropped it -- a deleted review stayed on
// the shop's page for up to a day. The response's own store_id and store_slug are used too,
// when it returns them.
export function AdminAction({path,method='POST',body,label,confirm,tone,storeRefs}:{
  path:string;method?:'POST'|'DELETE';body?:unknown;label:string;confirm?:string;tone?:'danger';storeRefs?:(string|undefined)[];
}){
  const router=useRouter();
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const run=async()=>{
    if(confirm&&!window.confirm(confirm))return;
    setBusy(true);setError('');
    try{
      const response=await apiFetch(`/api/proxy/admin/${path}`,{
        method,
        ...(body!==undefined?{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{}),
      });
      if(!response.ok)throw new Error(String(response.status));
      const answer=response.status===204?null:await response.json().catch(()=>null) as {store_id?:string;store_slug?:string}|null;
      const refs=[...(storeRefs??[]),answer?.store_id,answer?.store_slug].filter(Boolean);
      if(refs.length)await refreshStorePage(...refs).catch(()=>undefined);
      router.refresh();
    }catch{setError('İşlem tamamlanamadı.');}
    finally{setBusy(false);}
  };
  return <>
    <button className="admin-action" data-tone={tone} disabled={busy} onClick={()=>void run()}>{busy?'…':label}</button>
    {error&&<p className="admin-note" role="alert">{error}</p>}
  </>;
}
