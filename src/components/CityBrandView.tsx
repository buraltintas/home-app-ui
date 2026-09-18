import Link from 'next/link';
import {JsonLd} from './JsonLd';
import {PageBackButton} from './PageBackButton';
import {ScrollTop} from './ScrollTop';
import {CatalogList,CatalogPagination} from './CatalogList';
import {type CityBrand,getCityBrandPage,getCityBrands} from '@/lib/server-api';
import {getDictionary} from '@/i18n/dictionaries';
import {localePath,siteUrl,storePath} from '@/lib/site';
import {breadcrumbJsonLd} from '@/lib/structured-data';
import {locative} from '@/lib/turkish-locative';
import type {Locale} from '@/lib/types';

export const BRAND_SUFFIX='-magazalari';
export const BRAND_PER_PAGE=60;

export const brandPagesFor=(storeCount:number)=>Math.max(1,Math.ceil(storeCount/BRAND_PER_PAGE));
export const cityBrandPath=(pair:CityBrand,page=1)=>
  `/${pair.city_slug}/${pair.brand_slug}${BRAND_SUFFIX}${page>1?`/${page}`:''}`;

export async function resolveCityBrand(params:{city:string;category:string},locale:Locale):Promise<CityBrand|undefined>{
  if(!params.category?.endsWith(BRAND_SUFFIX))return undefined;
  const wanted=params.category.slice(0,-BRAND_SUFFIX.length);
  const pairs=await getCityBrands(locale);
  return pairs.find(pair=>pair.city_slug===params.city&&pair.brand_slug===wanted);
}

type Copy={
  title:(city:string,brand:string)=>string;
  intro:(count:number,city:string,brand:string)=>string;
  page:(n:number,of:number)=>string;
  others:string;elsewhere:string;reviews:string;none:string;all:string;
  previous:string;next:string;pagination:string;
};

// What the page says it is. A chain's page is not a guide to a trade, it is a list of
// addresses, and the words say that: how many branches, in which city, in district order.
// Nothing here promises an opinion the catalogue does not have.
export const cityBrandCopy:Record<Locale,Copy>={
  tr:{
    title:(city,brand)=>`${brand} ${city} mağazaları`,
    intro:(count,city,brand)=>`${locative(city)} ${count.toLocaleString('tr')} ${brand} mağazası var. İlçe ilçe sıralı; en yakınını seçmen için adresleri ve topluluk puanları burada.`,
    page:(n,of)=>`${n}. sayfa / ${of}`,
    others:'Bu şehirdeki diğer markalar',elsewhere:`Diğer şehirlerde`,reviews:'değerlendirme',
    none:'Henüz değerlendirilmemiş',all:'mağaza',
    previous:'Önceki',next:'Sonraki',pagination:'Sayfalar',
  },
  en:{
    title:(city,brand)=>`${brand} stores in ${city}`,
    intro:(count,city,brand)=>`There are ${count.toLocaleString('en')} ${brand} stores in ${city}, listed by district, with addresses and community ratings so you can pick the nearest.`,
    page:(n,of)=>`Page ${n} of ${of}`,
    others:'Other brands in this city',elsewhere:'In other cities',reviews:'reviews',
    none:'Not reviewed yet',all:'stores',
    previous:'Previous',next:'Next',pagination:'Pages',
  },
  de:{
    title:(city,brand)=>`${brand}-Filialen in ${city}`,
    intro:(count,city,brand)=>`In ${city} gibt es ${count.toLocaleString('de')} ${brand}-Filialen, nach Stadtteil sortiert, mit Adressen und Community-Bewertungen.`,
    page:(n,of)=>`Seite ${n} von ${of}`,
    others:'Weitere Marken in dieser Stadt',elsewhere:'In anderen Städten',reviews:'Bewertungen',
    none:'Noch nicht bewertet',all:'Geschäfte',
    previous:'Zurück',next:'Weiter',pagination:'Seiten',
  },
  ru:{
    title:(city,brand)=>`${brand}: магазины в городе ${city}`,
    intro:(count,city,brand)=>`В городе ${city} ${count.toLocaleString('ru')} магазинов ${brand} — по районам, с адресами и оценками сообщества.`,
    page:(n,of)=>`Страница ${n} из ${of}`,
    others:'Другие бренды в этом городе',elsewhere:'В других городах',reviews:'оценок',
    none:'Пока без оценок',all:'магазинов',
    previous:'Назад',next:'Вперёд',pagination:'Страницы',
  },
};

// One chain, one city.
//
// Built because Search Console said so rather than because it seemed like a good idea: every
// branded query reaching this site in twenty-nine days was this shape -- "yataş antalya",
// "antalya yataş mağazaları", "yataş konyaaltı", "en yakın yataş bayi" -- and there was no
// page with that name to answer any of them.
export async function CityBrandView({pair,locale,page}:{pair:CityBrand;locale:Locale;page:number}){
  const data=await getCityBrandPage(pair.city_slug,pair.brand_slug,locale,BRAND_PER_PAGE,(page-1)*BRAND_PER_PAGE);
  if(!data||!data.items.length)return null;
  const t=getDictionary(locale);
  const words=cityBrandCopy[locale];
  const pages=brandPagesFor(data.total);
  const pairs=await getCityBrands(locale);
  const sameCity=pairs.filter(x=>x.city_slug===pair.city_slug&&x.brand_slug!==pair.brand_slug).slice(0,12);
  const sameBrand=pairs.filter(x=>x.brand_slug===pair.brand_slug&&x.city_slug!==pair.city_slug).slice(0,12);
  const title=words.title(pair.city,pair.brand_name);
  const trail=[{name:t.discover??'',path:'/discover'},{name:pair.city,path:cityBrandPath(pair)},{name:title,path:cityBrandPath(pair,page)}];

  return <main className="catalog-page">
    <ScrollTop/>
    <PageBackButton/>
    <JsonLd data={[breadcrumbJsonLd(trail),{
      '@context':'https://schema.org','@type':'ItemList',
      name:title,
      numberOfItems:data.items.length,
      itemListElement:data.items.map((store,index)=>({
        '@type':'ListItem',position:(page-1)*BRAND_PER_PAGE+index+1,name:store.name,
        url:`${siteUrl}${localePath(locale,storePath(store))}`,
      })),
    }]}/>
    <header className="catalog-head">
      <h1>{title}</h1>
      <p>{words.intro(data.total,pair.city,pair.brand_name)}</p>
      {pages>1&&<p className="catalog-page-of">{words.page(page,pages)}</p>}
    </header>
    <CatalogList items={data.items} locale={locale} reviews={words.reviews} none={words.none}/>
    <CatalogPagination page={page} pages={pages} locale={locale} words={words} pathFor={n=>cityBrandPath(pair,n)}/>
    {(sameCity.length>0||sameBrand.length>0)&&<nav className="catalog-links" aria-label={words.others}>
      {sameCity.length>0&&<section>
        <h2>{words.others}</h2>
        <ul>{sameCity.map(other=><li key={other.brand_slug}><Link href={localePath(locale,cityBrandPath(other))}>{other.brand_name}<small>{other.store_count.toLocaleString(locale)} {words.all}</small></Link></li>)}</ul>
      </section>}
      {sameBrand.length>0&&<section>
        <h2>{words.elsewhere}</h2>
        <ul>{sameBrand.map(other=><li key={other.city_slug}><Link href={localePath(locale,cityBrandPath(other))}>{other.city}<small>{other.store_count.toLocaleString(locale)} {words.all}</small></Link></li>)}</ul>
      </section>}
    </nav>}
  </main>;
}
