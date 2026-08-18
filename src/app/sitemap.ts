import type {MetadataRoute} from 'next';
import {getStoreIndex} from '@/lib/server-api';
import {localePath,locales,siteUrl,storePath} from '@/lib/site';

// The sitemap listed five hard coded URLs and not one store, so the only pages capable
// of ranking were never offered to a crawler. Three of those five were /favorites,
// /create and /profile -- personal, sign-in-only pages that a crawler cannot read and
// should not be asked to.
export const revalidate=3600;

// Each page is listed once per language, with the alternates declared inline. Google
// reads hreflang from the sitemap as readily as from the markup, and doing it here means
// a page never advertises a translation the sitemap does not also confirm.
function entry(path:string,lastModified:Date,changeFrequency:'daily'|'weekly',priority:number):MetadataRoute.Sitemap{
  const languages=Object.fromEntries(locales.map(locale=>[locale,`${siteUrl}${localePath(locale,path)}`]));
  return locales.map(locale=>({
    url:`${siteUrl}${localePath(locale,path)}`,
    lastModified,changeFrequency,priority,
    alternates:{languages},
  }));
}

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const now=new Date();
  const stores=await getStoreIndex();
  return [
    ...entry('/',now,'daily',1),
    ...entry('/discover',now,'daily',.9),
    ...stores.flatMap(store=>entry(
      storePath(store),
      new Date(store.updated_at),
      'weekly',
      // A store the community has already reviewed is a page with something to say, and
      // is worth more of a limited crawl budget than an empty one.
      store.review_count>0?.8:.5,
    )),
  ];
}
