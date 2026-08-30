'use client';

import {Heart} from 'lucide-react';
import {useState} from 'react';
import {useI18n} from '@/i18n/I18nProvider';
import {apiFetch} from '@/lib/api-client';
import {originSearchHeaders} from '@/lib/search-origin';
import {AuthDialog} from './AuthDialog';

// The compact form of the save control that the store page already offers.
//
// It sits under the community figures rather than in the corner of the row, where it was
// covering the categories, and it says what saving is for. A heart, because that is what
// the saved-stores page has always drawn and one product should not have two symbols for
// one action.
export function SaveStoreButton({storeId,initialSaved}:{storeId:string;initialSaved:boolean}){
  const {t}=useI18n();
  const [saved,setSaved]=useState(initialSaved);
  const [busy,setBusy]=useState(false);
  const [auth,setAuth]=useState(false);
  // Browsing is anonymous, so the first time this is pressed it may well be by somebody
  // with no account. What they were trying to do is held here and done for them once they
  // are signed in, rather than dropped and left for them to find and press again.
  const [pending,setPending]=useState(false);

  const toggle=async()=>{
    if(busy)return;
    const next=!saved;
    setBusy(true);setSaved(next);
    try{
      const response=await apiFetch(`/api/proxy/stores/${storeId}/favorite`,{method:next?'POST':'DELETE',headers:originSearchHeaders()});
      if(response.status===401){setSaved(!next);setPending(true);setAuth(true);return;}
      // An optimistic flip is not success. Only a 2xx keeps it.
      if(!response.ok)throw new Error();
    }catch{setSaved(!next);}
    finally{setBusy(false);}
  };

  return <>
    <span className="result-save-row">
      <span className="result-save-reason">{t('saveReason')}</span>
      <button type="button" className="result-save" onClick={()=>void toggle()} disabled={busy}
        aria-pressed={saved} aria-label={saved?t('saved'):t('save')} title={saved?t('saved'):t('save')}>
        <Heart aria-hidden="true"/>
      </button>
    </span>
    <AuthDialog open={auth} onClose={()=>{setAuth(false);setPending(false);}} onAuthenticated={()=>{const go=pending;setPending(false);if(go)void toggle();}}/>
  </>;
}
