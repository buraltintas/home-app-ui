import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {CityCategoryView,cityCategoryCopy,cityCategoryPath,resolveCityCategory,type CityCategoryParams} from '@/components/CityCategoryView';
import {asLocale,canonicalFor} from '@/lib/site';

// A city and a category, which between them is the question people actually arrive with:
// "carpet shops in Izmir". The site had no page that answered it. Somebody had to know to
// type it into the search, and a crawler had nothing to follow at all -- every store page
// was reachable only from the sitemap, which gets a page crawled and passes it nothing.
//
// Published only where the catalogue can fill it. The backend keeps the floor at ten shops;
// below that the page is a list of two things dressed up as a guide, and a reader who taps
// it learns not to tap the next one.
//
// This is the first page of one. The rest live at /2, /3 and so on, in the sibling route.
export const revalidate=3600;

// Empty on purpose, and not pointless: declaring it is what puts this route on the static
// path, so a page is rendered once on first request and then served from cache for an hour
// rather than rebuilt for every reader. The same trick the store pages use. Listing the 427
// pairs here instead would tie every deploy to the catalogue being reachable at build time.
export function generateStaticParams(){return [] as {city:string;category:string}[];}

export async function generateMetadata({params}:{params:Promise<CityCategoryParams>}):Promise<Metadata>{
  const resolved=await params;
  const locale=asLocale(resolved.locale);
  const pair=await resolveCityCategory(resolved,locale);
  if(!pair)return {};
  const words=cityCategoryCopy[locale];
  const title=words.title(pair.city,pair.category_name);
  return {
    title,
    description:words.intro(pair.store_count,pair.city,pair.category_name),
    alternates:canonicalFor(locale,cityCategoryPath(pair)),
    openGraph:{url:cityCategoryPath(pair),title},
  };
}

export default async function Page({params}:{params:Promise<CityCategoryParams>}){
  const resolved=await params;
  const locale=asLocale(resolved.locale);
  const pair=await resolveCityCategory(resolved,locale);
  if(!pair)notFound();
  const view=await CityCategoryView({pair,locale,page:1});
  if(!view)notFound();
  return view;
}
