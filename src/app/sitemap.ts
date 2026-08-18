import type {MetadataRoute} from 'next';
import {getStoreIndex} from '@/lib/server-api';
import {siteUrl,storePath} from '@/lib/site';

// The sitemap listed five hard coded URLs and not one store, so the only pages capable
// of ranking were never offered to a crawler. Three of those five were /favorites,
// /create and /profile -- personal, sign-in-only pages that a crawler cannot read and
// should not be asked to.
export const revalidate=3600;

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const now=new Date();
  const stores=await getStoreIndex();
  return [
    {url:siteUrl,lastModified:now,changeFrequency:'daily',priority:1},
    {url:`${siteUrl}/discover`,lastModified:now,changeFrequency:'daily',priority:.9},
    ...stores.map(store=>({
      url:`${siteUrl}${storePath(store)}`,
      lastModified:new Date(store.updated_at),
      changeFrequency:'weekly' as const,
      // A store the community has already reviewed is a page with something to say, and
      // is worth more of a limited crawl budget than an empty one.
      priority:store.review_count>0?.8:.5,
    })),
  ];
}
