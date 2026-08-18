import {headers} from 'next/headers';
import type {Locale} from '@/lib/types';
import {getDictionary} from './dictionaries';

// The locale now comes from the URL, which middleware resolves once and passes down as a
// header. Reading it from a cookie meant Googlebot -- which sends no cookies -- saw
// Turkish on every page, and the English, German and Russian dictionaries were
// unreachable to search engines no matter how complete they were.
export async function getServerI18n(){
  const value=(await headers()).get('x-locale');
  const locale=(['tr','en','de','ru'].includes(value??'')?value:'tr') as Locale;
  return {locale,t:getDictionary(locale)};
}
