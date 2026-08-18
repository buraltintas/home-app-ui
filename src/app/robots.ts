import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/site';

// Personal and transactional routes are kept out of the index. They need a session to
// render anything, so a crawler only ever sees an empty shell, and every one of them
// spent crawl budget that belongs to store pages.
export default function robots():MetadataRoute.Robots {
  return {
    rules:{userAgent:'*',allow:'/',disallow:['/api/','/profile','/favorites','/create']},
    sitemap:`${siteUrl}/sitemap.xml`,
    host:siteUrl,
  };
}
