'use client';
import Link from 'next/link';
import {Store} from 'lucide-react';
import {useI18n} from '@/i18n/I18nProvider';
import {localePath} from '@/lib/site';

// A not-found boundary is handed no params, so it cannot be told which language it is in the
// way every page above it now is -- and reading the request to find out would make the route
// it belongs to dynamic again, which is the whole thing this page's neighbours just stopped
// doing. It reads the locale from the provider in the layout instead, which was given it by
// the address.
export default function NotFound(){
  const {t,locale}=useI18n();
  return <main className="empty-page"><Store/><h1>{t('storeUnavailable')}</h1><p>{t('storeNotFoundBody')}</p><Link className="button primary" href={localePath(locale,"/discover")}>{t('discover')}</Link></main>;
}
