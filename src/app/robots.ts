import type {MetadataRoute} from 'next';
import {UNWELCOME_CRAWLERS} from '@/lib/crawlers';
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
    // /profile and /favorites are not listed here, and that is deliberate.
    //
    // Disallow stops a crawler reading a page; it does not stop the address being indexed.
    // Google found /profile through links, could not fetch it, and so never saw the noindex
    // that page has carried all along -- the one signal that would have taken it out. It sat
    // in the index as a bare URL with no description. The two instructions were cancelling
    // each other: one said "do not look", the other said "look, then forget".
    //
    // Letting them be crawled is what makes the noindex work. It costs a handful of fetches:
    // these are four fixed addresses per language, not a fan-out.
    //
    // /create stays, and the difference is the fan-out. Every store page links to
    // /create?store=<id>, so eleven thousand shops make up to thirty-three thousand crawlable
    // addresses across the locales, each one existing only to be refused. That is worth
    // blocking even at the price of the address itself being indexable.
    rules:[
      {userAgent:'*',allow:'/',disallow:['/api/','/admin','/create','/*/create']},
      // A crawler that sends no readers still costs a rendered page and a database that
      // cannot go back to sleep. Ours suspends itself after five quiet minutes and is
      // billed by the hour it stays awake; measured over a full day it never got five
      // quiet minutes, because these agents alone made 9,400 of 18,266 requests and 4,141
      // of the 6,647 store pages rendered. Removing them opened eight gaps in three and a
      // half night hours.
      //
      // The line is what a crawl is for, not how heavy it is: search engines and the
      // agents that quote a source to a reader are how a shop gets found, and they stay.
      // Backlink and rank-tracking tools sell our pages back to us as a report, and the
      // rest index for marketplaces and assistants with no readers here. None of them can
      // send anybody to a shop, so none of them is worth a night of compute.
      //
      // Naming agents is unavoidable -- robots.txt has no other vocabulary -- but the
      // membership test is not a list of companies: does this crawl put the store in front
      // of somebody who might visit it.
      {userAgent:UNWELCOME_CRAWLERS,disallow:'/'},
    ],
    // One address, which happens to be an index over several files. Naming the index rather
    // than every part means adding stores never needs this file touched. The old
    // /sitemap.xml redirects here, so nothing that already holds that address breaks.
    sitemap:`${siteUrl}/sitemap-index.xml`,
    host:siteUrl,
  };
}
