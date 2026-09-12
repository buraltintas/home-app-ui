import type {Locale} from '@/lib/types';
import {asLocale} from '@/lib/site';
import {getDictionary} from './dictionaries';

// The locale comes from the address, and only from the address.
//
// It used to come from a cookie, which meant Googlebot -- which sends no cookies -- saw
// Turkish on every page and the other three dictionaries were unreachable to search engines
// however complete they were. It then came from a header the proxy added to each request,
// which fixed that and cost something nobody saw: rewriting a request's headers in
// middleware makes every page in the application dynamic, so no page could be cached, and
// declaring one static answered 500 on every view.
//
// Every route that renders text has its own [locale] segment, so each page hands its own
// locale down. The parameter is required rather than optional on purpose: a page that
// forgets it is a compile error rather than a page that silently reads the request again.
export function getServerI18n(locale:string):{locale:Locale;t:ReturnType<typeof getDictionary>}{
  const resolved=asLocale(locale);
  return {locale:resolved,t:getDictionary(resolved)};
}
