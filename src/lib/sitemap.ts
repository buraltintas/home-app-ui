import type {MetadataRoute} from 'next';
import {getAllStores,getCityBrands,getCityCategories} from '@/lib/server-api';
import {legalLinks} from '@/lib/legal-links';
import {legalUpdatedBySlug,legalUpdatedNewest} from '@/content/legal/docs';
import {localePath,locales,siteUrl,storePath} from '@/lib/site';
// Kept in step with the list pages themselves: one number, one place.
import {PER_PAGE as CITY_CATEGORY_PER_PAGE} from '@/components/CityCategoryView';
import {BRAND_PER_PAGE} from '@/components/CityBrandView';

// The sitemap listed five hard coded URLs and not one store, so the only pages capable
// of ranking were never offered to a crawler. Three of those five were /favorites,
// /create and /profile -- personal, sign-in-only pages that a crawler cannot read and
// should not be asked to.
//
// Built per request, not at deploy time, and that is not a preference -- it is the only
// place the catalogue exists. The image that runs this site is built in a container with no
// route to the backend, so every call from a build step answers ECONNREFUSED. While these
// calls returned an empty list on failure that produced a sitemap with nothing in it and a
// green deploy; once they started reporting failure honestly, the same unreachable backend
// stopped the deploy instead. Neither is a sitemap. The routes that serve this
// (app/sitemap/[part] and app/sitemap-index.xml) are dynamic, so the catalogue is not asked
// for until a request arrives, and by then the backend is a network hop away. The fetches
// underneath carry their own revalidate, so asking again costs nothing.
//
// It lives here rather than as Next's metadata sitemap because the metadata route cannot be
// compressed: it served each part as plain XML, 4.5 to 10 MB apiece, taking up to ten
// seconds to arrive. The parts are written out by the route instead, and gzipped there.

// One sitemap held every store until the catalogue outgrew it. Each page is listed once
// per language and carries the full set of alternates, which is what Google asks for and
// also what makes each entry cost about 650 bytes: eleven thousand stores in four
// languages is 45,000 entries and roughly thirty megabytes in a single document, built
// from scratch every hour. Two thousand pages per file is the size the old sitemap had
// already been serving without trouble.
const PAGES_PER_SITEMAP=2000;

// Everything that is not a store: the home page, the search, the city-and-category pages,
// and the published legal and explanatory pages. They ride along in the first file rather
// than getting one of their own.
async function standingPages(catalogueUpdated:Date|undefined){
  // A city-and-category page carries ten shops or more and links to every one of them, so
  // it is worth more of a crawl than a store page with nothing written on it yet. The
  // backend decides which pairs exist; listing any others here would advertise 404s.
  const pairs=await getCityCategories('tr');
  // The chain pages as well. They answer the queries actually arriving -- brand and city --
  // and there are 621 of them; leaving them out of the sitemap would mean the pages built
  // for the demand we can see are the ones nothing points a crawler at.
  const brands=await getCityBrands('tr');
  return [
    ...entry('/',catalogueUpdated,'daily',1),
    // The search is a tool rather than a document: rendered in the browser, it arrives at
    // a crawler as an empty shell. It was being advertised at 0.9, just under the home
    // page, which told a crawler the emptiest page on the site was the second most
    // important one. It stays listed -- it is a real page people link to -- at a priority
    // that matches what a crawler can actually read on it.
    ...entry('/discover',catalogueUpdated,'daily',.5),
    // Informational pages change rarely but are how a search or answer engine learns what
    // this product actually is, so they belong in the index.
    ...entry('/legal',isoDate(legalUpdatedNewest),'weekly',.3),
    ...legalLinks.filter(link=>link.live).flatMap(link=>entry(`/${link.slug}`,isoDate(legalUpdatedBySlug[link.slug]),'weekly',link.slug==='about'?.7:.4)),
    // Every page of every list, not only the first. Istanbul furniture is 1,373 shops in
    // twenty-three pages, and listing only page one would leave the other 1,313 store pages
    // reachable from nothing again -- which is the problem these pages exist to fix.
    ...pairs.flatMap(pair=>{
      const pages=Math.max(1,Math.ceil(pair.store_count/CITY_CATEGORY_PER_PAGE));
      return Array.from({length:pages},(_,index)=>entry(
        `/${pair.city_slug}/${pair.category_url_slug}-magazalari${index?`/${index+1}`:''}`,
        catalogueUpdated,'weekly',index?.5:.7,
      )).flat();
    }),
    ...brands.flatMap(brand=>{
      const pages=Math.max(1,Math.ceil(brand.store_count/BRAND_PER_PAGE));
      return Array.from({length:pages},(_,index)=>entry(
        `/${brand.city_slug}/${brand.brand_slug}-magazalari${index?`/${index+1}`:''}`,
        catalogueUpdated,'weekly',index?.5:.7,
      )).flat();
    }),
  ];
}

// Each page is listed once per language, with the alternates declared inline. Google
// reads hreflang from the sitemap as readily as from the markup, and doing it here means
// a page never advertises a translation the sitemap does not also confirm.
function entry(path:string,lastModified:Date|undefined,changeFrequency:'daily'|'weekly',priority:number):MetadataRoute.Sitemap{
  const languages=Object.fromEntries(locales.map(locale=>[locale,`${siteUrl}${localePath(locale,path)}`]));
  return locales.map(locale=>({
    url:`${siteUrl}${localePath(locale,path)}`,
    // Left off entirely when nothing here knows the real answer. An omitted lastmod costs
    // a crawler nothing; a made-up one costs it the ability to believe any of them.
    ...(lastModified?{lastModified}:{}),
    changeFrequency,priority,
    alternates:{languages},
  }));
}

// A date we hold as an ISO string, or nothing if we do not hold one. Not every listed page
// is a document with an edit history -- the ones that are not get no lastmod rather than a
// plausible substitute.
function isoDate(value:string|undefined):Date|undefined{
  if(!value)return undefined;
  const date=new Date(value);
  return Number.isNaN(date.getTime())?undefined:date;
}

// When the catalogue itself last changed: the newest edit among the shops in it. Every page
// built out of the catalogue -- the home page, the city-and-category lists, the chain pages
// -- changes when this does and at no other time, so this is their real lastmod.
//
// It used to be `new Date()`, evaluated while answering the request. That put the current
// second on all 12,589 URLs and on the index above them, so two fetches four seconds apart
// disagreed about every page on the site. A sitemap that says everything changed just now
// says nothing: Google's documented response to lastmod it cannot rely on is to stop
// reading it, which loses the one signal telling it which pages are worth fetching again.
function catalogueUpdated(stores:{updated_at:string}[]):Date|undefined{
  let newest:number|undefined;
  for(const store of stores){
    const at=new Date(store.updated_at).getTime();
    if(!Number.isNaN(at)&&(newest===undefined||at>newest))newest=at;
  }
  return newest===undefined?undefined:new Date(newest);
}

// The files this sitemap comes in, and when each of them last changed. How many is read
// from the catalogue rather than guessed, so adding stores never silently drops the ones
// past a fixed number -- which is exactly how 9,252 store pages came to be missing from the
// previous version. This is what the index publishes, and it runs per request.
//
// Each file's date is the newest edit among the shops sliced into it, which is the newest
// lastmod the file actually contains. The first file also carries the standing pages, and
// those follow the catalogue too, so the same number covers it.
//
// Sliced here exactly as the sitemap itself slices, from the same catalogue call, so the
// index cannot describe a division different from the one being served.
export async function sitemapParts():Promise<{id:number;lastModified:Date|undefined}[]>{
  const stores=await getAllStores();
  const count=Math.max(1,Math.ceil(stores.length/PAGES_PER_SITEMAP));
  return Array.from({length:count},(_,id)=>({
    id,
    lastModified:catalogueUpdated(stores.slice(id*PAGES_PER_SITEMAP,(id+1)*PAGES_PER_SITEMAP)),
  }));
}

// Which addresses exist, which is a different question from how many have anything in them.
// A ceiling: room for sixty thousand shops, the same number the catalogue reader stops at.
// Addresses past the end of the catalogue answer with an empty sitemap and nothing points
// at them, because the index publishes the count measured at request time; addresses past
// the ceiling are not sitemaps at all.
const SITEMAP_CEILING=60000;
export const SITEMAP_PARTS=Math.ceil(SITEMAP_CEILING/PAGES_PER_SITEMAP);

export async function sitemapEntries(index:number):Promise<MetadataRoute.Sitemap>{
  const stores=await getAllStores();
  const slice=stores.slice(index*PAGES_PER_SITEMAP,(index+1)*PAGES_PER_SITEMAP);
  return [
    ...(index===0?await standingPages(catalogueUpdated(stores)):[]),
    ...slice.flatMap(store=>entry(
      storePath(store),
      new Date(store.updated_at),
      'weekly',
      // A store the community has already reviewed is a page with something to say, and
      // is worth more of a limited crawl budget than an empty one.
      store.review_count>0?.8:.5,
    )),
  ];
}

const XML_ESCAPES:Record<string,string>={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'};
const xml=(value:string)=>value.replace(/[&<>"']/g,character=>XML_ESCAPES[character]);

// One part, written out in the shape Next's metadata sitemap wrote it -- the same elements in
// the same order -- so moving the work into a route changed how it travels and nothing about
// what a crawler reads.
export function urlset(entries:MetadataRoute.Sitemap):string{
  const urls=entries.map(entry=>{
    const alternates=Object.entries(entry.alternates?.languages??{})
      .map(([language,href])=>`<xhtml:link rel="alternate" hreflang="${xml(language)}" href="${xml(String(href))}" />`);
    const lastModified=entry.lastModified?new Date(entry.lastModified).toISOString():'';
    return ['<url>',`<loc>${xml(entry.url)}</loc>`,...alternates,
      ...(lastModified?[`<lastmod>${lastModified}</lastmod>`]:[]),
      ...(entry.changeFrequency?[`<changefreq>${entry.changeFrequency}</changefreq>`]:[]),
      ...(entry.priority!==undefined?[`<priority>${entry.priority}</priority>`]:[]),
      '</url>'].join('\n');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}
