'use client';

import {useState} from 'react';
import {RatingStars} from './Rating';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import type {CriteriaAverages} from '@/lib/types';

// What a score in the results list is made of: the same eight questions the review form
// asks, in the same order, named by the same dictionary keys the store page uses. One list,
// so a criterion can never be called one thing here and another there.
const rows=(c:CriteriaAverages)=>[
  ['criterionAvailability',c.availability],
  ['criterionValue',c.value],
  ['criterionLayout',c.layout],
  ['criterionStaffCare',c.staff_care],
  ['criterionStaffKnowledge',c.staff_knowledge],
  ['criterionCheckout',c.checkout],
  ['criterionReturns',c.returns],
  ['criterionCleanliness',c.cleanliness],
] as const;

// Read when it is asked for, not before. A results page carries up to thirty stores and the
// reader opens the breakdown of one of them, or none; fetching eight numbers for all thirty
// to answer a question nobody asked is what made the first version of this list slow.
export function ResultCriteria({storeId}:{storeId:string}){
  const {t}=useI18n();
  const [open,setOpen]=useState(false);
  const [criteria,setCriteria]=useState<CriteriaAverages>();
  const [state,setState]=useState<'idle'|'loading'|'failed'|'none'>('idle');

  const load=async()=>{
    if(criteria||state==='loading')return;
    setState('loading');
    try{
      const response=await apiFetch(`/api/proxy/stores/${storeId}`,{cache:'no-store'});
      if(!response.ok)throw new Error();
      const body=await response.json() as {store?:{criteria_averages?:CriteriaAverages}};
      const averages=body.store?.criteria_averages;
      // Reviews written before the eight criteria existed have nothing to break down. That
      // is an answer, and it is said rather than left as an empty panel.
      if(!averages){setState('none');return;}
      setCriteria(averages);setState('idle');
    }catch{setState('failed');}
  };

  return <details className="result-criteria" open={open} onToggle={event=>{
    const isOpen=(event.currentTarget as HTMLDetailsElement).open;
    setOpen(isOpen);
    if(isOpen)void load();
  }}>
    <summary>{t('seeScoreDetail')}</summary>
    {state==='loading'&&<p className="result-criteria-state">{t('loading')}</p>}
    {state==='failed'&&<p className="result-criteria-state">{t('searchError')}</p>}
    {state==='none'&&<p className="result-criteria-state">{t('noCriteriaYet')}</p>}
    {criteria&&<dl>{rows(criteria).map(([key,value])=><div key={key}>
      <dt>{t(key)}</dt>
      <dd><RatingStars value={value} showValue={false}/><span>{value.toFixed(1)}</span></dd>
    </div>)}</dl>}
  </details>;
}
