'use client';

import {Store} from 'lucide-react';
import {useI18n} from '@/i18n/I18nProvider';

// Not the same page as not-found, and that distinction is the whole point. "This store is
// no longer in our list" was being shown for a store that was plainly still there, because
// every failure -- a timeout, a 500 -- was read as absence. Worse, the router caches a
// not-found answer, so the page kept refusing until the visitor reloaded.
//
// A failure to read says so, and offers the one thing that helps: asking again.
export default function StoreError({reset}:{error:Error;reset:()=>void}){
  const {t}=useI18n();
  return <main className="empty-page">
    <Store aria-hidden="true"/>
    <h1>{t('storeLoadFailed')}</h1>
    <p>{t('storeLoadFailedBody')}</p>
    <button className="button primary" onClick={reset}>{t('retry')}</button>
  </main>;
}
