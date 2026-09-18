import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {CityCategoryView,cityCategoryCopy,cityCategoryPath,pagesFor,resolveCityCategory,type CityCategoryParams} from '@/components/CityCategoryView';
import {CityBrandView,brandPagesFor,cityBrandCopy,cityBrandPath,resolveCityBrand} from '@/components/CityBrandView';
import {asLocale,canonicalFor} from '@/lib/site';

// Pages two and up, for either kind of list.
//
// A path segment rather than ?sayfa=2 for one reason that decides it: reading a query
// parameter makes a route dynamic in this framework, so every one of these pages would be
// rebuilt on every request -- including every crawler's -- instead of being rendered once
// and cached for an hour. The address reads the same either way; the cost does not.
export const revalidate=3600;
export function generateStaticParams(){return [] as {city:string;category:string;page:string}[];}

type Params=CityCategoryParams&{page:string};

// Page one lives at the bare address and has no number, so a "/1" is not a second address
// for it -- it is a 404. Two addresses for one page is the thing canonical tags exist to
// clean up after, and not creating them is cheaper than declaring them away.
function pageNumber(raw:string):number|undefined{
  if(!/^[2-9]\d*$/.test(raw))return undefined;
  const value=Number(raw);
  return Number.isSafeInteger(value)?value:undefined;
}

export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata>{
  const resolved=await params;
  const locale=asLocale(resolved.locale);
  const page=pageNumber(resolved.page);
  if(!page)return {};
  const pair=await resolveCityCategory(resolved,locale);
  if(pair&&page<=pagesFor(pair.store_count)){
    const words=cityCategoryCopy[locale];
    // The number is in the title because without it every page of a long list claims the
    // same name, and a search engine reading twenty-three identical titles keeps one.
    const title=`${words.title(pair.city,pair.category_name)} — ${words.page(page,pagesFor(pair.store_count))}`;
    return {title,description:words.intro(pair.store_count,pair.city,pair.category_name),
      alternates:canonicalFor(locale,cityCategoryPath(pair,page)),openGraph:{url:cityCategoryPath(pair,page),title}};
  }
  const brand=await resolveCityBrand(resolved,locale);
  if(!brand||page>brandPagesFor(brand.store_count))return {};
  const words=cityBrandCopy[locale];
  const title=`${words.title(brand.city,brand.brand_name)} — ${words.page(page,brandPagesFor(brand.store_count))}`;
  return {title,description:words.intro(brand.store_count,brand.city,brand.brand_name),
    alternates:canonicalFor(locale,cityBrandPath(brand,page)),openGraph:{url:cityBrandPath(brand,page),title}};
}

export default async function Page({params}:{params:Promise<Params>}){
  const resolved=await params;
  const locale=asLocale(resolved.locale);
  const page=pageNumber(resolved.page);
  if(!page)notFound();
  const pair=await resolveCityCategory(resolved,locale);
  // Past the end is a 404 rather than an empty list. An address that answers with nothing
  // is worse than one that says it does not exist: a crawler keeps the first and asks again.
  if(pair&&page<=pagesFor(pair.store_count)){
    const view=await CityCategoryView({pair,locale,page});
    if(view)return view;
  }
  const brand=await resolveCityBrand(resolved,locale);
  if(brand&&page<=brandPagesFor(brand.store_count)){
    const view=await CityBrandView({pair:brand,locale,page});
    if(view)return view;
  }
  notFound();
}
