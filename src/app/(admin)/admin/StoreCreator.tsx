'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {apiFetch} from '@/lib/api-client';
import type {CategoryOption} from '@/lib/admin-api';

// Adding a shop by hand, with the neighbours shown before it is added.
//
// The duplicate check is a step in the form rather than a rule in the backend, and that is
// deliberate. The importer has to decide alone, with nobody watching, so it needs thresholds
// and a review queue. An operator adding one shop can see that the row seven metres away is
// the same shop under its old name -- a judgement no similarity score got right -- and can
// also see that the row seven metres away is a different chain on the next unit of the same
// mall floor. Showing is the useful half; refusing would only be wrong half the time.
type Nearby={id:string;name:string;address:string;city:string;district:string;distance_meters:number;name_similarity:number;source_kind:string};

export function StoreCreator({categories}:{categories:CategoryOption[]}){
  const router=useRouter();
  const [open,setOpen]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [checked,setChecked]=useState(false);
  const [nearby,setNearby]=useState<Nearby[]>([]);
  const [form,setForm]=useState({name:'',city:'',district:'',address:'',phone:'',website:'',latitude:'',longitude:''});
  const [slugs,setSlugs]=useState<string[]>([]);

  const set=(key:keyof typeof form)=>(event:React.ChangeEvent<HTMLInputElement>)=>{
    setForm(current=>({...current,[key]:event.target.value}));
    // Any edit to what identifies the shop invalidates the check: the neighbours of the
    // point you just changed are not the neighbours you were shown.
    if(key==='name'||key==='latitude'||key==='longitude')setChecked(false);
  };

  const look=async()=>{
    setBusy(true);setError('');
    try{
      const query=new URLSearchParams({name:form.name.trim(),latitude:form.latitude.trim(),longitude:form.longitude.trim()});
      const response=await apiFetch(`/api/proxy/admin/stores/nearby?${query}`);
      if(!response.ok)throw new Error(String(response.status));
      const body=await response.json() as {items:Nearby[]};
      setNearby(body.items??[]);setChecked(true);
    }catch{setError('Yakındaki mağazalar getirilemedi. Koordinatları kontrol et.');}
    finally{setBusy(false);}
  };

  const create=async()=>{
    setBusy(true);setError('');
    try{
      const response=await apiFetch('/api/proxy/admin/stores',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:form.name.trim(),city:form.city.trim(),district:form.district.trim(),
          address:form.address.trim(),phone:form.phone.trim(),website:form.website.trim(),
          latitude:Number(form.latitude),longitude:Number(form.longitude),categories:slugs,
        }),
      });
      if(!response.ok)throw new Error(String(response.status));
      setOpen(false);setChecked(false);setNearby([]);
      setForm({name:'',city:'',district:'',address:'',phone:'',website:'',latitude:'',longitude:''});
      setSlugs([]);
      router.refresh();
    }catch{setError('Mağaza eklenemedi.');}
    finally{setBusy(false);}
  };

  const ready=form.name.trim()!==''&&form.city.trim()!==''&&form.latitude.trim()!==''&&form.longitude.trim()!=='';

  if(!open)return <button className="admin-action" onClick={()=>setOpen(true)}>Mağaza ekle</button>;

  return <section className="admin-form">
    <h2>Mağaza ekle</h2>
    <p className="admin-note">
      Elle eklenen mağaza &ldquo;yönetici&rdquo; kaynaklı sayılır ve doğrulanmış olarak
      işaretlenir; marka içe aktarımı onun üzerine yazmaz.
    </p>
    <div className="admin-fields">
      <label><span>Ad</span><input value={form.name} onChange={set('name')} required/></label>
      <label><span>İl</span><input value={form.city} onChange={set('city')} required/></label>
      <label><span>İlçe</span><input value={form.district} onChange={set('district')}/></label>
      <label><span>Adres</span><input value={form.address} onChange={set('address')}/></label>
      <label><span>Enlem</span><input value={form.latitude} onChange={set('latitude')} inputMode="decimal" required/></label>
      <label><span>Boylam</span><input value={form.longitude} onChange={set('longitude')} inputMode="decimal" required/></label>
      <label><span>Telefon</span><input value={form.phone} onChange={set('phone')}/></label>
      <label><span>Web sitesi</span><input value={form.website} onChange={set('website')}/></label>
    </div>
    <div className="admin-cats">
      {categories.map(option=>{
        const on=slugs.includes(option.slug);
        return <button key={option.slug} type="button" className="admin-cat" data-on={on}
          onClick={()=>setSlugs(current=>on?current.filter(s=>s!==option.slug):[...current,option.slug])}>{option.name}</button>;
      })}
    </div>

    {checked&&<div className="admin-nearby">
      <h3>{nearby.length===0?'Yakında kayıtlı mağaza yok.':`Bu noktanın 400 metresinde ${nearby.length} mağaza var:`}</h3>
      {nearby.map(store=><p key={store.id}>
        <strong>{store.name}</strong> — {Math.round(store.distance_meters)} m
        {store.name_similarity>=0.4&&<> · ad benzerliği {store.name_similarity.toFixed(2)}</>}
        <br/><small>{store.address||`${store.district} ${store.city}`}</small>
      </p>)}
    </div>}

    <div className="admin-form-actions">
      <button className="admin-action" disabled={!ready||busy} onClick={()=>void look()}>
        {busy?'…':checked?'Yeniden bak':'Yakındakilere bak'}
      </button>
      {/* Adding is unavailable until the neighbours have been looked at. Not because the
          answer is binding -- it is not -- but because the mistake this prevents is the one
          nobody makes on purpose: adding a shop that is already there without ever asking. */}
      <button className="admin-action" data-tone="primary" disabled={!ready||!checked||busy} onClick={()=>void create()}>
        {busy?'…':nearby.length>0?'Yine de ekle':'Ekle'}
      </button>
      <button className="admin-action" onClick={()=>{setOpen(false);setChecked(false);}}>Vazgeç</button>
    </div>
    {error&&<p className="admin-note" role="alert">{error}</p>}
  </section>;
}
