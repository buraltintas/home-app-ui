'use client';

import {Search,X} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {localePath} from '@/lib/site';

// The homepage is the first thing anyone sees and it opened on somebody else's review of
// somebody else's curtain shop. The thing people come here to do -- ask where to buy
// something -- had no way in from the front door.
//
// It hands the query to the discovery page rather than searching in place: a search needs
// a location before it means anything, and that whole conversation already lives there.
// Typing here is not wasted, it arrives with the person.
export function HomeSearchBar(){
  const {t,locale}=useI18n();
  const router=useRouter();
  const [query,setQuery]=useState('');
  const field=useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{
    const element=field.current;if(!element)return;
    element.style.height='auto';element.style.height=`${element.scrollHeight+2}px`;
  },[query]);
  const go=(event:FormEvent)=>{
    event.preventDefault();
    const text=query.trim();
    router.push(localePath(locale,text?`/discover?q=${encodeURIComponent(text)}`:'/discover'));
  };
  return <form className="home-search" onSubmit={go} role="search">
    <Search aria-hidden="true"/>
    <div className="home-search-field"><textarea
      ref={field}
      rows={1}
      value={query}
      onChange={event=>setQuery(event.target.value)}
      onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();event.currentTarget.form?.requestSubmit();}}}
      placeholder={t('searchHint')}
      aria-label={t('searchAction')}
      enterKeyHint="search"
    />{query&&<button type="button" className="home-search-clear" onClick={()=>{setQuery('');field.current?.focus();}} aria-label={t('clearSearch')}><X aria-hidden="true"/></button>}</div>
    <button type="submit">{t('searchAction')}</button>
  </form>;
}
