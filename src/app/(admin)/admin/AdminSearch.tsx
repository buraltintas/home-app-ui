'use client';
import {useRouter,useSearchParams} from 'next/navigation';
import {useState} from 'react';

export function AdminSearch({placeholder}:{placeholder:string}){
  const router=useRouter();
  const params=useSearchParams();
  const [value,setValue]=useState(params.get('q')??'');
  return <form className="admin-search" onSubmit={event=>{
    event.preventDefault();
    router.push(value.trim()?`?q=${encodeURIComponent(value.trim())}`:'?');
  }}>
    <input value={value} onChange={event=>setValue(event.target.value)} placeholder={placeholder} aria-label={placeholder}/>
    <button type="submit">Ara</button>
  </form>;
}
