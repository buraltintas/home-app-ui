'use client';
import {useRouter,useSearchParams} from 'next/navigation';
import {useState} from 'react';

export function AdminSearch({placeholder}:{placeholder:string}){
  const router=useRouter();
  const params=useSearchParams();
  const [value,setValue]=useState(params.get('q')??'');
  return <form className="admin-search" onSubmit={event=>{
    event.preventDefault();
    // Everything else on the screen stays where it was. Searching used to drop the rest of
    // the query string, so picking a source and then searching inside it silently widened
    // the search back out to the whole table.
    const next=new URLSearchParams(params.toString());
    next.delete('page');
    if(value.trim())next.set('q',value.trim());else next.delete('q');
    const text=next.toString();
    router.push(text?`?${text}`:'?');
  }}>
    <input value={value} onChange={event=>setValue(event.target.value)} placeholder={placeholder} aria-label={placeholder}/>
    <button type="submit">Ara</button>
  </form>;
}
