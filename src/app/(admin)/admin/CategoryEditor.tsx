'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';

// Imports guess a store's categories from its name and Google's types. That is right often
// enough to be worth doing and wrong often enough to need correcting: a shop that sells
// across the whole range has no single category to guess at, and one whose name says
// nothing gets none.
//
// Saving replaces the set rather than adding to it, so what is on screen is the whole
// truth and unticking something actually removes it.
export function CategoryEditor({storeId,selected,options}:{
  storeId:string;selected:string[];options:{slug:string;name:string}[];
}){
  const router=useRouter();
  const [open,setOpen]=useState(false);
  const [chosen,setChosen]=useState<string[]>(selected);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');

  const toggle=(slug:string)=>setChosen(list=>list.includes(slug)?list.filter(s=>s!==slug):[...list,slug]);

  const save=async()=>{
    setBusy(true);setError('');
    try{
      const response=await apiFetch(`/api/proxy/admin/stores/${storeId}/categories`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slugs:chosen}),
      });
      if(!response.ok)throw new Error();
      setOpen(false);
      router.refresh();
    }catch{setError('Kaydedilemedi.');}
    finally{setBusy(false);}
  };

  if(!open)return <button className="admin-action" onClick={()=>setOpen(true)}>Kategori</button>;

  return <div className="admin-categories">
    <div className="admin-categories-list">
      {options.map(option=>
        <label key={option.slug}>
          <input type="checkbox" checked={chosen.includes(option.slug)} onChange={()=>toggle(option.slug)}/>
          <span>{option.name}</span>
        </label>)}
    </div>
    <p className="admin-categories-hint">
      Hiçbiri seçilmezse mağaza sınıflandırılmamış sayılır. Öne çıkarılmış bir mağaza bu
      durumda tüm ev aramalarında görünür — burada zaten yalnızca ev ürünleri mağazaları var.
    </p>
    <div className="admin-categories-actions">
      <button className="admin-action" disabled={busy} onClick={()=>void save()}>{busy?'…':'Kaydet'}</button>
      <button className="admin-action" disabled={busy} onClick={()=>{setChosen(selected);setOpen(false);setError('');}}>Vazgeç</button>
    </div>
    {error&&<p className="admin-note" role="alert">{error}</p>}
  </div>;
}
