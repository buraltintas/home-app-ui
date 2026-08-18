'use client';

import {ArrowRight,Trash2} from 'lucide-react';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import type {SearchHistory} from '@/lib/types';

// The stored results carry a store id, so a past search replays entirely from our
// own database. Opening one never calls Google again.
export function PastSearches(){
  const {t,locale}=useI18n();
  const [searches,setSearches]=useState<SearchHistory[]>([]);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);

  // State is only ever set from the response callback, never synchronously on mount, and
  // the request is abandoned if the section unmounts first.
  useEffect(()=>{
    const controller=new AbortController();
    apiFetch('/api/proxy/me/searches?limit=20',{cache:'no-store',signal:controller.signal})
      .then(async response=>{
        if(!response.ok)throw new Error();
        return (await response.json() as {items:SearchHistory[]}).items??[];
      })
      .then(items=>{setSearches(items);setError('');})
      .catch(()=>{if(!controller.signal.aborted)setError(t('pastSearchesError'));});
    return()=>controller.abort();
  },[t]);

  const removeOne=async(id:string)=>{
    setBusy(true);
    try{
      const response=await apiFetch(`/api/proxy/me/searches/${id}`,{method:'DELETE'});
      if(!response.ok)throw new Error();
      setSearches(current=>current.filter(entry=>entry.id!==id));
    }catch{setError(t('pastSearchesError'));}
    finally{setBusy(false);}
  };

  const clearAll=async()=>{
    if(!window.confirm(t('confirmClearSearches')))return;
    setBusy(true);
    try{
      const response=await apiFetch('/api/proxy/me/searches',{method:'DELETE'});
      if(!response.ok)throw new Error();
      setSearches([]);
    }catch{setError(t('pastSearchesError'));}
    finally{setBusy(false);}
  };

  return <section className="past-searches">
    <div className="past-searches-head">
      <h2>{t('pastSearches')}</h2>
      {searches.length>0&&<button className="button quiet" onClick={()=>void clearAll()} disabled={busy}>{t('clearSearches')}</button>}
    </div>
    {error&&<p className="form-error" role="alert">{error}</p>}
    {searches.length===0&&!error?<p>{t('pastSearchesEmpty')}</p>:<ul>{searches.map(search=><li key={search.id}>
      <div className="past-search-head">
        <div><strong>{search.raw_query}</strong><small>{new Date(search.created_at).toLocaleDateString(locale)} · {search.result_count} {t('results')}</small></div>
        <button className="icon-button" onClick={()=>void removeOne(search.id)} aria-label={t('deleteSearch')} disabled={busy}><Trash2/></button>
      </div>
      {search.results?.length>0&&<ul className="past-search-results">{search.results.map(result=><li key={`${search.id}:${result.store_id}`}>
        <Link href={`/stores/${result.store_id}`}><span>{result.name}</span><small>{[result.district,result.city].filter(Boolean).join(', ')}</small><ArrowRight aria-hidden="true"/></Link>
      </li>)}</ul>}
    </li>)}</ul>}
  </section>;
}
