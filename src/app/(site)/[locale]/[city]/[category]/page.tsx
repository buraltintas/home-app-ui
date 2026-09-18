import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {CityCategoryView,cityCategoryCopy,cityCategoryPath,resolveCityCategory,type CityCategoryParams} from '@/components/CityCategoryView';
import {CityBrandView,cityBrandCopy,cityBrandPath,resolveCityBrand} from '@/components/CityBrandView';
import {asLocale,canonicalFor} from '@/lib/site';

// One address shape, two kinds of page behind it: /antalya/yatak-magazalari is a trade in a
// city, /antalya/yatas-bedding-magazalari is a chain in a city. They answer different
// questions and are written differently, but a reader typing either has the same shape in
// mind, so they share the shape.
//
// Category is tried first and wins any tie. There is no tie today -- the forty-five brand
// slugs and the fifteen category slugs do not overlap -- and if one ever appears, the trade
// is the more general answer and the brand can be reached by its own name.
//
// Published only where the catalogue can fill it: ten shops for a trade, three branches for
// a chain. The floors differ because the questions do.
export const revalidate=3600;

export function generateStaticParams(){return [] as {city:string;category:string}[];}

export async function generateMetadata({params}:{params:Promise<CityCategoryParams>}):Promise<Metadata>{
  const resolved=await params;
  const locale=asLocale(resolved.locale);
  const pair=await resolveCityCategory(resolved,locale);
  if(pair){
    const words=cityCategoryCopy[locale];
    const title=words.title(pair.city,pair.category_name);
    return {title,description:words.intro(pair.store_count,pair.city,pair.category_name),
      alternates:canonicalFor(locale,cityCategoryPath(pair)),openGraph:{url:cityCategoryPath(pair),title}};
  }
  const brand=await resolveCityBrand(resolved,locale);
  if(!brand)return {};
  const words=cityBrandCopy[locale];
  const title=words.title(brand.city,brand.brand_name);
  return {title,description:words.intro(brand.store_count,brand.city,brand.brand_name),
    alternates:canonicalFor(locale,cityBrandPath(brand)),openGraph:{url:cityBrandPath(brand),title}};
}

export default async function Page({params}:{params:Promise<CityCategoryParams>}){
  const resolved=await params;
  const locale=asLocale(resolved.locale);
  const pair=await resolveCityCategory(resolved,locale);
  if(pair){
    const view=await CityCategoryView({pair,locale,page:1});
    if(view)return view;
  }
  const brand=await resolveCityBrand(resolved,locale);
  if(brand){
    const view=await CityBrandView({pair:brand,locale,page:1});
    if(view)return view;
  }
  notFound();
}
