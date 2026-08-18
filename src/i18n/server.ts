import {cookies} from 'next/headers';
import type {Locale} from '@/lib/types';
import {getDictionary} from './dictionaries';

export async function getServerI18n(){
  const value=(await cookies()).get('bosagezme_locale')?.value;
  const locale=(['tr','en','de','ru'].includes(value??'')?value:'tr') as Locale;
  return {locale,t:getDictionary(locale)};
}
