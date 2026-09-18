import Link from 'next/link';
import {JsonLd} from './JsonLd';
import {PageBackButton} from './PageBackButton';
import {ScrollTop} from './ScrollTop';
import {CatalogList,CatalogPagination} from './CatalogList';
import {type CityCategory,getCityCategories,getCityCategoryPage} from '@/lib/server-api';
import {getDictionary} from '@/i18n/dictionaries';
import {localePath,siteUrl,storePath} from '@/lib/site';
import {breadcrumbJsonLd} from '@/lib/structured-data';
import {locative} from '@/lib/turkish-locative';
import type {Locale} from '@/lib/types';

// The suffix is Turkish in every language, and so is the rest of the address. A shop in
// Izmir is in the same place whichever language you read about it in; four translated
// addresses for one page would be four pages competing to be the one that ranks.
export const SUFFIX='-magazalari';

// Sixty shops to a page. It is what the list was already showing, and it keeps the largest
// category -- Istanbul furniture, 1,373 shops -- to twenty-three pages rather than one
// document nobody could scroll.
export const PER_PAGE=60;

export type CityCategoryParams={locale:string;city:string;category:string};

// Which pair this address names, or nothing. The list of publishable pairs is the only
// authority: an address that is not in it is not a page, however well formed it looks.
export async function resolveCityCategory(params:CityCategoryParams,locale:Locale):Promise<CityCategory|undefined>{
  if(!params.category?.endsWith(SUFFIX))return undefined;
  const wanted=params.category.slice(0,-SUFFIX.length);
  const pairs=await getCityCategories(locale);
  return pairs.find(pair=>pair.city_slug===params.city&&pair.category_url_slug===wanted);
}

export const pagesFor=(storeCount:number)=>Math.max(1,Math.ceil(storeCount/PER_PAGE));
export const cityCategoryPath=(pair:CityCategory,page=1)=>
  `/${pair.city_slug}/${pair.category_url_slug}${SUFFIX}${page>1?`/${page}`:''}`;

type Copy={
  title:(city:string,category:string)=>string;
  intro:(count:number,city:string,category:string)=>string;
  page:(n:number,of:number)=>string;
  others:string;elsewhere:string;reviews:string;none:string;all:string;
  previous:string;next:string;pagination:string;
};

export const cityCategoryCopy:Record<Locale,Copy>={
  tr:{
    title:(city,category)=>`${city} ${category.toLocaleLowerCase('tr')} mağazaları`,
    intro:(count,city,category)=>`${locative(city)} kataloğumuzda ${count.toLocaleString('tr')} ${category.toLocaleLowerCase('tr')} mağazası var. Topluluğun değerlendirdiği mağazalar önce geliyor.`,
    page:(n,of)=>`${n}. sayfa / ${of}`,
    others:'Bu şehirdeki diğer kategoriler',elsewhere:'Diğer şehirlerde',reviews:'değerlendirme',
    none:'Henüz değerlendirilmemiş',all:'mağaza',
    previous:'Önceki',next:'Sonraki',pagination:'Sayfalar',
  },
  en:{
    title:(city,category)=>`${category} stores in ${city}`,
    intro:(count,city,category)=>`Our catalogue holds ${count.toLocaleString('en')} ${category.toLowerCase()} stores in ${city}. The ones the community has reviewed come first.`,
    page:(n,of)=>`Page ${n} of ${of}`,
    others:'Other categories in this city',elsewhere:'In other cities',reviews:'reviews',
    none:'Not reviewed yet',all:'stores',
    previous:'Previous',next:'Next',pagination:'Pages',
  },
  de:{
    title:(city,category)=>`${category}-Geschäfte in ${city}`,
    intro:(count,city,category)=>`Unser Katalog führt ${count.toLocaleString('de')} ${category}-Geschäfte in ${city}. Die von der Community bewerteten stehen vorn.`,
    page:(n,of)=>`Seite ${n} von ${of}`,
    others:'Weitere Kategorien in dieser Stadt',elsewhere:'In anderen Städten',reviews:'Bewertungen',
    none:'Noch nicht bewertet',all:'Geschäfte',
    previous:'Zurück',next:'Weiter',pagination:'Seiten',
  },
  ru:{
    title:(city,category)=>`${category}: магазины в городе ${city}`,
    intro:(count,city,category)=>`В нашем каталоге ${count.toLocaleString('ru')} магазинов категории «${category}» в городе ${city}. Сначала идут те, которые оценило сообщество.`,
    page:(n,of)=>`Страница ${n} из ${of}`,
    others:'Другие категории в этом городе',elsewhere:'В других городах',reviews:'оценок',
    none:'Пока без оценок',all:'магазинов',
    previous:'Назад',next:'Вперёд',pagination:'Страницы',
  },
};

// One city, one category, one page of it.
//
// Paginated because the first version was not, and the gap was measurable: Istanbul
// furniture said "1,373 shops" and linked sixty of them. The other 1,313 store pages had
// nothing pointing at them again -- which is the exact problem these pages were built to
// solve, reintroduced at the bottom of the list.
export async function CityCategoryView({pair,locale,page}:{pair:CityCategory;locale:Locale;page:number}){
  const data=await getCityCategoryPage(pair.city_slug,pair.category_slug,locale,PER_PAGE,(page-1)*PER_PAGE);
  if(!data||!data.items.length)return null;
  const t=getDictionary(locale);
  const words=cityCategoryCopy[locale];
  const pages=pagesFor(data.total);
  const pairs=await getCityCategories(locale);
  // Where else to go from here, and this is most of why the page exists. Each one links to
  // ten or so others: the same city's other categories, and the same category in the cities
  // that also have enough of it. Between them the pages form a net rather than a row of
  // dead ends, which is the thing the sitemap could never do on its own.
  const sameCity=pairs.filter(x=>x.city_slug===pair.city_slug&&x.category_slug!==pair.category_slug).slice(0,12);
  const sameCategory=pairs.filter(x=>x.category_slug===pair.category_slug&&x.city_slug!==pair.city_slug).slice(0,12);
  const title=words.title(pair.city,pair.category_name);
  const trail=[{name:t.discover??'',path:'/discover'},{name:pair.city,path:cityCategoryPath(pair)},{name:title,path:cityCategoryPath(pair,page)}];

  return <main className="catalog-page">
    <ScrollTop/>
    <PageBackButton/>
    <JsonLd data={[breadcrumbJsonLd(trail),{
      '@context':'https://schema.org','@type':'ItemList',
      name:title,
      numberOfItems:data.items.length,
      itemListElement:data.items.map((store,index)=>({
        '@type':'ListItem',position:(page-1)*PER_PAGE+index+1,name:store.name,
        url:`${siteUrl}${localePath(locale,storePath(store))}`,
      })),
    }]}/>
    <header className="catalog-head">
      <h1>{title}</h1>
      <p>{words.intro(data.total,pair.city,pair.category_name)}</p>
      {pages>1&&<p className="catalog-page-of">{words.page(page,pages)}</p>}
    </header>
    <CatalogList items={data.items} locale={locale} reviews={words.reviews} none={words.none}/>
    <CatalogPagination page={page} pages={pages} locale={locale} words={words} pathFor={n=>cityCategoryPath(pair,n)}/>
    {(sameCity.length>0||sameCategory.length>0)&&<nav className="catalog-links" aria-label={words.others}>
      {sameCity.length>0&&<section>
        <h2>{words.others}</h2>
        <ul>{sameCity.map(other=><li key={other.category_slug}><Link href={localePath(locale,cityCategoryPath(other))}>{other.category_name}<small>{other.store_count.toLocaleString(locale)} {words.all}</small></Link></li>)}</ul>
      </section>}
      {sameCategory.length>0&&<section>
        <h2>{words.elsewhere}</h2>
        <ul>{sameCategory.map(other=><li key={other.city_slug}><Link href={localePath(locale,cityCategoryPath(other))}>{other.city}<small>{other.store_count.toLocaleString(locale)} {words.all}</small></Link></li>)}</ul>
      </section>}
    </nav>}
  </main>;
}
