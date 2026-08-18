import Link from 'next/link';
import {Store} from 'lucide-react';
import {getServerI18n} from '@/i18n/server';
import {localePath} from '@/lib/site';

export default async function NotFound(){
  const {t,locale}=await getServerI18n();
  return <main className="empty-page"><Store/><h1>{t.storeUnavailable}</h1><p>{t.storeNotFoundBody}</p><Link className="button primary" href={localePath(locale,"/discover")}>{t.discover}</Link></main>;
}
