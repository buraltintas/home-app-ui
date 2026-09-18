import type {MetadataRoute} from 'next';
import {getAllStores,getCityCategories} from '@/lib/server-api';
import {legalLinks} from '@/lib/legal-links';
import {localePath,locales,siteUrl,storePath} from '@/lib/site';
// Kept in step with the list pages themselves: one number, one place.
import {PER_PAGE as CITY_CATEGORY_PER_PAGE} from '@/components/CityCategoryView';

// The sitemap listed five hard coded URLs and not one store, so the only pages capable
// of ranking were never offered to a crawler. Three of those five were /favorites,
// /create and /profile -- personal, sign-in-only pages that a crawler cannot read and
// should not be asked to.
export const revalidate=3600;

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
async function standingPages(now:Date){
  // A city-and-category page carries ten shops or more and links to every one of them, so
  // it is worth more of a crawl than a store page with nothing written on it yet. The
  // backend decides which pairs exist; listing any others here would advertise 404s.
  const pairs=await getCityCategories('tr');
  return [
    ...entry('/',now,'daily',1),
    // The search is a tool rather than a document: rendered in the browser, it arrives at
    // a crawler as an empty shell. It was being advertised at 0.9, just under the home
    // page, which told a crawler the emptiest page on the site was the second most
    // important one. It stays listed -- it is a real page people link to -- at a priority
    // that matches what a crawler can actually read on it.
    ...entry('/discover',now,'daily',.5),
    // Informational pages change rarely but are how a search or answer engine learns what
    // this product actually is, so they belong in the index.
    ...entry('/legal',now,'weekly',.3),
    ...legalLinks.filter(link=>link.live).flatMap(link=>entry(`/${link.slug}`,now,'weekly',link.slug==='about'?.7:.4)),
    // Every page of every list, not only the first. Istanbul furniture is 1,373 shops in
    // twenty-three pages, and listing only page one would leave the other 1,313 store pages
    // reachable from nothing again -- which is the problem these pages exist to fix.
    ...pairs.flatMap(pair=>{
      const pages=Math.max(1,Math.ceil(pair.store_count/CITY_CATEGORY_PER_PAGE));
      return Array.from({length:pages},(_,index)=>entry(
        `/${pair.city_slug}/${pair.category_url_slug}-magazalari${index?`/${index+1}`:''}`,
        now,'weekly',index?.5:.7,
      )).flat();
    }),
  ];
}

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

// How many files this sitemap comes in. Read from the catalogue rather than guessed, so
// adding stores never silently drops the ones past a fixed number -- which is exactly how
// 9,252 store pages came to be missing from the previous version.
export async function sitemapCount():Promise<number>{
  const stores=await getAllStores();
  return Math.max(1,Math.ceil(stores.length/PAGES_PER_SITEMAP));
}

export async function generateSitemaps(){
  return Array.from({length:await sitemapCount()},(_,id)=>({id}));
}

export default async function sitemap({id}:{id:Promise<string>}):Promise<MetadataRoute.Sitemap>{
  const now=new Date();
  const index=Number(await id)||0;
  const stores=await getAllStores();
  const slice=stores.slice(index*PAGES_PER_SITEMAP,(index+1)*PAGES_PER_SITEMAP);
  return [
    ...(index===0?await standingPages(now):[]),
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
