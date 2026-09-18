import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/site';

// Personal and transactional routes are kept out of the index. They need a session to
// render anything, so a crawler only ever sees an empty shell, and every one of them
// spent crawl budget that belongs to store pages.
export default function robots():MetadataRoute.Robots {
  return {
    // The locale prefixes were missing, and that was not cosmetic. Turkish is served
    // unprefixed, so "/create" covered one address in four: /en/create, /de/create and
    // /ru/create stayed open. Every store page links to /create?store=<id> to start a
    // review, so with eleven thousand stores that is up to thirty-three thousand crawlable
    // addresses that exist only to be refused -- each one carrying noindex, each one costing
    // a fetch that the eight thousand store pages waiting to be crawled are not getting.
    //
    // A wildcard rather than three more lines naming each language: a fourth language should
    // not have to remember to come back here.
    rules:{userAgent:'*',allow:'/',disallow:['/api/','/admin','/profile','/favorites','/create','/*/profile','/*/favorites','/*/create']},
    // One address, which happens to be an index over several files. Naming the index rather
    // than every part means adding stores never needs this file touched. The old
    // /sitemap.xml redirects here, so nothing that already holds that address breaks.
    sitemap:`${siteUrl}/sitemap-index.xml`,
    host:siteUrl,
  };
}
