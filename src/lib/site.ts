import type {Locale} from './types';

// One place owns every public URL the site claims to live at. Canonical tags, the
// sitemap, OpenGraph, hreflang and structured data all have to agree exactly, and they
// only stayed in agreement while each of them built its own strings by hand.
export const siteUrl=process.env.NEXT_PUBLIC_SITE_URL??'https://bosagezme.com';
export const locales:Locale[]=['tr','en','de','ru'];
export const defaultLocale:Locale='tr';

export function absolute(path:string):string{return new URL(path,siteUrl).toString()}

// Turkish is served unprefixed, so links written before locale routing existed are still
// the canonical Turkish URLs. The other three languages get an address of their own.
export function localePath(locale:Locale,path:string):string{
  if(locale===defaultLocale)return path;
  return path==='/'?`/${locale}`:`/${locale}${path}`;
}

// The locale segment is stripped before a path is re-prefixed, so switching language on
// /en/stores/x lands on /de/stores/x rather than /de/en/stores/x.
export function stripLocale(path:string):string{
  const segment=path.split('/')[1];
  if(segment&&(locales as string[]).includes(segment))return path.slice(segment.length+1)||'/';
  return path||'/';
}

// A store is addressed by its slug so the URL carries the store's name and city, and
// falls back to the id for a store imported before it had one.
export function storePath(store:{slug?:string;id:string}):string{return `/stores/${store.slug||store.id}`}
export function reviewPath(id:string):string{return `/reviews/${id}`}
export function userPath(id:string):string{return `/users/${id}`}

// Every page states its own canonical. The root layout used to set `canonical:'/'`,
// and because metadata cascades, every store, review and profile page inherited it and
// told Google it was a duplicate of the homepage.
//
// hreflang can finally be emitted now that each language has a distinct URL. x-default
// points at the unprefixed Turkish address, which is the one a visitor with no stated
// preference is served.
export function canonicalFor(locale:Locale,path:string){
  const bare=stripLocale(path);
  return {
    canonical:localePath(locale,bare),
    languages:{
      ...Object.fromEntries(locales.map(entry=>[entry,localePath(entry,bare)])),
      'x-default':bare,
    },
  };
}

// A dynamic segment reaches a layout as a plain string. Narrowing it in one place keeps
// every caller from either casting or re-deriving the fallback.
export function asLocale(value:string|undefined):Locale{
  return (locales as string[]).includes(value??'')?value as Locale:defaultLocale;
}
