import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {notFound} from 'next/navigation';
import {JsonLd} from '@/components/JsonLd';
import {PageBackButton} from '@/components/PageBackButton';
import {RatingStars} from '@/components/Rating';
import {ScrollTop} from '@/components/ScrollTop';
import {type CityCategory,getCityCategories,getCityCategoryPage} from '@/lib/server-api';
import {getDictionary} from '@/i18n/dictionaries';
import {asLocale,canonicalFor,localePath,siteUrl,storePath} from '@/lib/site';
import {breadcrumbJsonLd} from '@/lib/structured-data';
import {locative} from '@/lib/turkish-locative';
import {isBrandMark,storePhotoURL} from '@/lib/store-photo';
import type {Locale} from '@/lib/types';

// A city and a category, which between them is the question people actually arrive with:
// "carpet shops in Izmir". The site had no page that answered it. Somebody had to know to
// type it into the search, and a crawler had nothing to follow at all -- every store page
// was reachable only from the sitemap, which gets a page crawled and passes it nothing.
//
// Published only where the catalogue can fill it. The backend keeps the floor at ten shops;
// below that the page is a list of two things dressed up as a guide, and a reader who taps
// it learns not to tap the next one.
export const revalidate=3600;

// Empty on purpose, and not pointless: declaring it is what puts this route on the static
// path, so a page is rendered once on first request and then served from cache for an hour
// rather than rebuilt for every reader. The same trick the store pages use. Listing the 427
// pairs here instead would tie every deploy to the catalogue being reachable at build time.
export function generateStaticParams(){return [] as {city:string;category:string}[];}

// The suffix is Turkish in every language, and so is the rest of the address. A shop in
// Izmir is in the same place whichever language you read about it in; four translated
// addresses for one page would be four pages competing to be the one that ranks.
const SUFFIX='-magazalari';

type Params={locale:string;city:string;category:string};

// Which pair this address names, or nothing. The list of publishable pairs is the only
// authority: an address that is not in it is not a page, however well formed it looks.
async function resolve(params:Params,locale:Locale):Promise<CityCategory|undefined>{
  if(!params.category?.endsWith(SUFFIX))return undefined;
  const wanted=params.category.slice(0,-SUFFIX.length);
  const pairs=await getCityCategories(locale);
  return pairs.find(pair=>pair.city_slug===params.city&&pair.category_url_slug===wanted);
}

const copy:Record<Locale,{title:(city:string,category:string)=>string;intro:(count:number,city:string,category:string)=>string;others:string;elsewhere:string;reviews:string;none:string;all:string}>={
  tr:{
    title:(city,category)=>`${city} ${category.toLocaleLowerCase('tr')} mağazaları`,
    intro:(count,city,category)=>`${locative(city)} kataloğumuzda ${count.toLocaleString('tr')} ${category.toLocaleLowerCase('tr')} mağazası var. Topluluğun değerlendirdiği mağazalar önce geliyor.`,
    others:'Bu şehirdeki diğer kategoriler',elsewhere:'Diğer şehirlerde',reviews:'değerlendirme',
    none:'Henüz değerlendirilmemiş',all:'mağaza',
  },
  en:{
    title:(city,category)=>`${category} stores in ${city}`,
    intro:(count,city,category)=>`Our catalogue holds ${count.toLocaleString('en')} ${category.toLowerCase()} stores in ${city}. The ones the community has reviewed come first.`,
    others:'Other categories in this city',elsewhere:'In other cities',reviews:'reviews',
    none:'Not reviewed yet',all:'stores',
  },
  de:{
    title:(city,category)=>`${category}-Geschäfte in ${city}`,
    intro:(count,city,category)=>`Unser Katalog führt ${count.toLocaleString('de')} ${category}-Geschäfte in ${city}. Die von der Community bewerteten stehen vorn.`,
    others:'Weitere Kategorien in dieser Stadt',elsewhere:'In anderen Städten',reviews:'Bewertungen',
    none:'Noch nicht bewertet',all:'Geschäfte',
  },
  ru:{
    title:(city,category)=>`${category}: магазины в городе ${city}`,
    intro:(count,city,category)=>`В нашем каталоге ${count.toLocaleString('ru')} магазинов категории «${category}» в городе ${city}. Сначала идут те, которые оценило сообщество.`,
    others:'Другие категории в этом городе',elsewhere:'В других городах',reviews:'оценок',
    none:'Пока без оценок',all:'магазинов',
  },
};

const pagePath=(pair:CityCategory)=>`/${pair.city_slug}/${pair.category_url_slug}${SUFFIX}`;

export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata>{
  const resolved=await params;
  const locale=asLocale(resolved.locale);
  const pair=await resolve(resolved,locale);
  if(!pair)return {};
  const words=copy[locale];
  const title=words.title(pair.city,pair.category_name);
  return {
    title,
    description:words.intro(pair.store_count,pair.city,pair.category_name),
    alternates:canonicalFor(locale,pagePath(pair)),
    openGraph:{url:pagePath(pair),title},
  };
}

export default async function Page({params}:{params:Promise<Params>}){
  const resolved=await params;
  const locale=asLocale(resolved.locale);
  const pair=await resolve(resolved,locale);
  if(!pair)notFound();
  const page=await getCityCategoryPage(pair.city_slug,pair.category_slug,locale);
  if(!page||!page.items.length)notFound();
  const t=getDictionary(locale);
  const words=copy[locale];
  const pairs=await getCityCategories(locale);
  // Where else to go from here, and this is most of why the page exists. Each one links to
  // ten or so others: the same city's other categories, and the same category in the cities
  // that also have enough of it. Between them the pages form a net rather than a row of
  // dead ends, which is the thing the sitemap could never do on its own.
  const sameCity=pairs.filter(x=>x.city_slug===pair.city_slug&&x.category_slug!==pair.category_slug).slice(0,12);
  const sameCategory=pairs.filter(x=>x.category_slug===pair.category_slug&&x.city_slug!==pair.city_slug).slice(0,12);
  const trail=[{name:t.discover??'',path:'/discover'},{name:pair.city,path:pagePath(pair)},{name:words.title(pair.city,pair.category_name),path:pagePath(pair)}];

  return <main className="catalog-page">
    <ScrollTop/>
    <PageBackButton/>
    <JsonLd data={[breadcrumbJsonLd(trail),{
      '@context':'https://schema.org','@type':'ItemList',
      name:words.title(pair.city,pair.category_name),
      numberOfItems:page.items.length,
      itemListElement:page.items.map((store,index)=>({
        '@type':'ListItem',position:index+1,name:store.name,
        url:`${siteUrl}${localePath(locale,storePath(store))}`,
      })),
    }]}/>
    <header className="catalog-head">
      <h1>{words.title(pair.city,pair.category_name)}</h1>
      <p>{words.intro(page.total,pair.city,pair.category_name)}</p>
    </header>
    <ul className="catalog-list">{page.items.map(store=>{
      const photo=storePhotoURL(store.photo,160);
      return <li key={store.id}><Link href={localePath(locale,storePath(store))}>
        {photo
          ?<Image className={`catalog-mark${isBrandMark(store.photo)?' is-brand-mark':''}`} src={photo} width={56} height={56} alt="" unoptimized/>
          :<span className="catalog-mark is-empty" aria-hidden="true">{store.name.trim().charAt(0)}</span>}
        <span className="catalog-copy">
          <strong>{store.name}</strong>
          <small>{[store.district,store.city].filter(Boolean).join(', ')}</small>
          {store.category_labels.length>0&&<small className="catalog-categories">{store.category_labels.join(' · ')}</small>}
        </span>
        <span className="catalog-score">
          {store.review_count
            ?<><RatingStars value={store.average_rating}/><small>{store.review_count} {words.reviews}</small></>
            :<small className="catalog-none">{words.none}</small>}
        </span>
        <ArrowRight aria-hidden="true"/>
      </Link></li>;
    })}</ul>
    {(sameCity.length>0||sameCategory.length>0)&&<nav className="catalog-links" aria-label={words.others}>
      {sameCity.length>0&&<section>
        <h2>{words.others}</h2>
        <ul>{sameCity.map(other=><li key={other.category_slug}><Link href={localePath(locale,pagePath(other))}>{other.category_name}<small>{other.store_count.toLocaleString(locale)} {words.all}</small></Link></li>)}</ul>
      </section>}
      {sameCategory.length>0&&<section>
        <h2>{words.elsewhere}</h2>
        <ul>{sameCategory.map(other=><li key={other.city_slug}><Link href={localePath(locale,pagePath(other))}>{other.city}<small>{other.store_count.toLocaleString(locale)} {words.all}</small></Link></li>)}</ul>
      </section>}
    </nav>}
  </main>;
}
