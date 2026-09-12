'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';

// Running one brand's import from the panel.
//
// It waits for the answer rather than reporting "started". An import that says it began and
// then fails somewhere nobody is watching is the exact shape of the mistakes this catalogue
// has already made -- and the counts are the only way to tell a run that worked from one
// that duplicated a chain, so they are what comes back.
type Report={fetched:number;inserted:number;updated:number;review:number;skipped:number};

export function BrandImport({slug,stores}:{slug:string;stores:number}){
  const router=useRouter();
  const [busy,setBusy]=useState(false);
  const [report,setReport]=useState<Report>();
  const [error,setError]=useState('');
  const run=async()=>{
    setBusy(true);setError('');setReport(undefined);
    try{
      const response=await apiFetch(`/api/proxy/admin/brands/${slug}/import`,{method:'POST'});
      if(!response.ok)throw new Error(String(response.status));
      setReport(await response.json() as Report);
      router.refresh();
    }catch{setError('İçe aktarma tamamlanamadı.');}
    finally{setBusy(false);}
  };
  // A run that added about as many shops as the brand already had has duplicated it, and
  // saying so here is cheaper than finding it in a search result later.
  const suspicious=report!==undefined&&stores>0&&report.inserted>stores/2;
  return <>
    <button className="admin-action" disabled={busy} onClick={()=>void run()}>{busy?'çekiliyor…':'Şimdi içe aktar'}</button>
    {report&&<p className="admin-note" data-warn={suspicious||undefined}>
      {report.fetched} çekildi · {report.inserted} yeni · {report.updated} güncellendi
      {report.review?` · ${report.review} inceleme`:''}{report.skipped?` · ${report.skipped} atlandı`:''}
      {suspicious&&<><br/><strong>Bu kadar yeni kayıt beklenmez — mükerrer olabilir, eşleştirme kuyruğuna bak.</strong></>}
    </p>}
    {error&&<p className="admin-note" role="alert">{error}</p>}
  </>;
}
