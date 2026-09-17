import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/site';

// Personal and transactional routes are kept out of the index. They need a session to
// render anything, so a crawler only ever sees an empty shell, and every one of them
// spent crawl budget that belongs to store pages.
export default function robots():MetadataRoute.Robots {
  return {
    rules:{userAgent:'*',allow:'/',disallow:['/api/','/admin','/profile','/favorites','/create']},
    // One address, which happens to be an index over several files. Naming the index rather
    // than every part means adding stores never needs this file touched. The old
    // /sitemap.xml redirects here, so nothing that already holds that address breaks.
    sitemap:`${siteUrl}/sitemap-index.xml`,
    host:siteUrl,
  };
}
