'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';

// One button for every privileged action. It refuses to report success on anything but a
// successful response: a local state flip is not a backend change, and on this surface a
// button that looks like it worked when it did not is worse than no button.
export function AdminAction({path,method='POST',body,label,confirm,tone}:{
  path:string;method?:'POST'|'DELETE';body?:unknown;label:string;confirm?:string;tone?:'danger';
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
      router.refresh();
    }catch{setError('İşlem tamamlanamadı.');}
    finally{setBusy(false);}
  };
  return <>
    <button className="admin-action" data-tone={tone} disabled={busy} onClick={()=>void run()}>{busy?'…':label}</button>
    {error&&<p className="admin-note" role="alert">{error}</p>}
  </>;
}
