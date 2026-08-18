import type {Locale} from './types';

// One place owns every public URL the site claims to live at. Canonical tags, the
// sitemap, OpenGraph and structured data all have to agree exactly, and they only
// stayed in agreement while each of them built its own strings by hand.
export const siteUrl=process.env.NEXT_PUBLIC_SITE_URL??'https://bosagezme.com';
export const locales:Locale[]=['tr','en','de','ru'];
export const defaultLocale:Locale='tr';

export function absolute(path:string):string{return new URL(path,siteUrl).toString()}

// A store is addressed by its slug so the URL carries the store's name and city, and
// falls back to the id for a store imported before it had one.
export function storePath(store:{slug?:string;id:string}):string{return `/stores/${store.slug||store.id}`}
export function reviewPath(id:string):string{return `/reviews/${id}`}
export function userPath(id:string):string{return `/users/${id}`}

// Every page states its own canonical. The root layout used to set `canonical:'/'`,
// and because metadata cascades, every store, review and profile page inherited it and
// told Google it was a duplicate of the homepage.
//
// No `languages` map is emitted yet. Locale still lives in a cookie rather than the URL,
// so there is no second URL to point an hreflang at, and inventing one would advertise
// pages that return 404.
export function canonicalFor(path:string){return {canonical:path}}
