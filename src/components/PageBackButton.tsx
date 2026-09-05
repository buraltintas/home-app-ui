'use client';

import {ArrowLeft} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useI18n} from '@/i18n/I18nProvider';
import {localePath} from '@/lib/site';

export function PageBackButton(){
  const router=useRouter();
  const {locale,t}=useI18n();
  const back=()=>{if(window.history.length>1)router.back();else router.push(localePath(locale,'/discover'));};
  return <button type="button" className="page-back-button" onClick={back} aria-label={t('back')} title={t('back')}><ArrowLeft aria-hidden="true"/></button>;
}
