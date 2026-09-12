'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';

// Joining two rows that are one shop.
//
// The matcher is deliberately cautious about joining rows on its own -- a wrong merge is
// silent and permanent in a way a duplicate is not -- so the ones it declines have to be
// joinable here. What it will not do is let somebody type an id: the neighbours are fetched
// and shown with their distance and how alike their names are, and the merge button sits
// next to the one being merged away. A shop 400 m off with a similar name is exactly the
// case this exists for, and it is also exactly the case where reading the two rows side by
// side is what stops the wrong one being pressed.
//
// The row this opens from is the one that survives, because its id is what reviews,
// favourites and ratings already point at.
type Nearby={id:string;name:string;address:string;city:string;district:string;distance_meters:number;name_similarity:number;source_kind:string};

export function StoreMerge({storeId,name,latitude,longitude}:{storeId:string;name:string;latitude:number;longitude:number}){
  const router=useRouter();
  const [open,setOpen]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [neighbours,setNeighbours]=useState<Nearby[]>();

  const look=async()=>{
    setOpen(true);setBusy(true);setError('');
    try{
      const query=new URLSearchParams({name,latitude:String(latitude),longitude:String(longitude)});
      const response=await apiFetch(`/api/proxy/admin/stores/nearby?${query}`);
      if(!response.ok)throw new Error(String(response.status));
      const body=await response.json() as {items:Nearby[]};
      setNeighbours((body.items??[]).filter(item=>item.id!==storeId));
    }catch{setError('Yakındaki mağazalar getirilemedi.');}
    finally{setBusy(false);}
  };

  const merge=async(other:Nearby)=>{
    if(!window.confirm(`"${other.name}" kaydı "${name}" ile birleştirilsin mi?\n\nYorumlar, favoriler ve kaynak kimlikleri "${name}" üzerine taşınır. Birleştirilen kaydın adresi çalışmaya devam eder ve buraya yönlenir. Geri alınamaz.`))return;
    setBusy(true);setError('');
    try{
      const response=await apiFetch(`/api/proxy/admin/stores/${storeId}/merge`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({merge:other.id}),
      });
      if(!response.ok)throw new Error(String(response.status));
      setOpen(false);setNeighbours(undefined);
      router.refresh();
    }catch{setError('Birleştirme tamamlanamadı.');}
    finally{setBusy(false);}
  };

  if(!open)return <button className="admin-action" onClick={()=>void look()}>Birleştir</button>;

  return <div className="admin-merge">
    <p className="admin-merge-keep">Kalan kayıt: <strong>{name}</strong></p>
    {busy&&<p>…</p>}
    {!busy&&neighbours?.length===0&&<p>400 metre içinde başka kayıt yok.</p>}
    {neighbours?.map(other=><div key={other.id} className="admin-merge-row">
      <div>
        <strong>{other.name}</strong>
        <span>{Math.round(other.distance_meters)} m{other.name_similarity>=0.3&&<> · ad benzerliği {other.name_similarity.toFixed(2)}</>} · {other.source_kind}</span>
        <small>{other.address||`${other.district} ${other.city}`}</small>
      </div>
      <button className="admin-action" data-tone="danger" disabled={busy} onClick={()=>void merge(other)}>Buna birleştir</button>
    </div>)}
    {error&&<p className="admin-note" role="alert">{error}</p>}
    <button className="admin-action" onClick={()=>{setOpen(false);setNeighbours(undefined);}}>Kapat</button>
  </div>;
}
