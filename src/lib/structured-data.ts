import {absolute,siteUrl,storePath} from './site';
import type {Post,Store} from './types';
import {storePhotoURL} from './store-photo';

// Google permits a third-party platform to mark up reviews that its users wrote about
// other businesses -- the self-serving restriction covers a business publishing reviews
// of itself, which is not what this is. Two rules constrain everything below:
//
//   1. Only Boşa Gezme! community reviews may appear. Google-derived ratings are another
//      site's ratings, and republishing them as our own aggregate is exactly the
//      "aggregating reviews from other websites" that carries a manual action.
//   2. A store nobody has reviewed gets no aggregateRating at all. Emitting 0.0 would be
//      both an invalid rich result and a fabricated rating for a real business.
export type JsonLd=Record<string,unknown>;

const BEST_RATING=5;

export function organizationJsonLd(description:string):JsonLd{
  return {
    '@context':'https://schema.org','@type':'Organization','@id':`${siteUrl}#organization`,
    name:'Boşa Gezme!',url:siteUrl,description,logo:absolute('/brand/brand-mark.png'),
  };
}

export function websiteJsonLd(description:string,locale:string):JsonLd{
  return {
    '@context':'https://schema.org','@type':'WebSite','@id':`${siteUrl}#website`,
    name:'Boşa Gezme!',url:siteUrl,description,inLanguage:locale,
    publisher:{'@id':`${siteUrl}#organization`},
  };
}

export function breadcrumbJsonLd(trail:{name:string;path:string}[]):JsonLd{
  return {
    '@context':'https://schema.org','@type':'BreadcrumbList',
    itemListElement:trail.map((entry,index)=>({'@type':'ListItem',position:index+1,name:entry.name,item:absolute(entry.path)})),
  };
}

function reviewJsonLd(post:Post):JsonLd{
  return {
    '@type':'Review',
    author:{'@type':'Person',name:post.display_name},
    datePublished:post.created_at,
    reviewRating:{'@type':'Rating',ratingValue:post.rating,bestRating:BEST_RATING,worstRating:1},
    reviewBody:post.text,
  };
}

// The provider publishes opening hours as periods, and schema.org wants a day name and
// two clock times. Google's week starts on Sunday; the vocabulary wants the English day
// name. A period that closes on a later day than it opens ran past midnight, and is
// written against the day it started, which is how the vocabulary reads it too.
const SCHEMA_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const clock=(minutes:number)=>`${String(Math.floor(minutes/60)%24).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;

function openingHoursSpecification(store:Store):JsonLd[]{
  const google=store.external_sources?.find(source=>source.provider==='google');
  const raw=(google?.attribution as {opening_hours?:{periods?:{open_day:number;open_minute:number;close_day:number;close_minute:number}[]}}|undefined)?.opening_hours;
  return (raw?.periods??[]).flatMap(period=>{
    const day=SCHEMA_DAYS[period.open_day];
    if(!day)return [];
    return [{'@type':'OpeningHoursSpecification',dayOfWeek:`https://schema.org/${day}`,opens:clock(period.open_minute),closes:clock(period.close_minute)}];
  });
}

export function storeJsonLd(store:Store,posts:Post[]):JsonLd{
  const data:JsonLd={
    '@context':'https://schema.org','@type':'Store',
    '@id':absolute(storePath(store))+'#store',
    name:store.name,url:absolute(storePath(store)),
    address:{
      '@type':'PostalAddress',
      ...(store.address?{streetAddress:store.address}:{}),
      addressLocality:store.city,
      ...(store.district?{addressRegion:store.district}:{}),
      addressCountry:'TR',
    },
    geo:{'@type':'GeoCoordinates',latitude:store.latitude,longitude:store.longitude},
  };
  // Everything true about this shop that a search engine understands. A store page is one
  // of a few thousand near-identical pages as far as a crawler is concerned, and what
  // separates it from the others is the facts on it -- a telephone number, a photograph,
  // the hours it is open. All of these were already on the page for a reader; only the
  // machine-readable copy was missing them.
  if(store.phone)data.telephone=store.phone;
  if(store.website)data.sameAs=[store.website];
  const image=storePhotoURL(store.photo);
  if(image)data.image=[image];
  const hours=openingHoursSpecification(store);
  if(hours.length)data.openingHoursSpecification=hours;
  if(store.brand_name)data.brand={'@type':'Brand',name:store.brand_name};
  if(store.localized_description)data.description=store.localized_description;
  if(store.category_labels.length)data.knowsAbout=store.category_labels;

  // Community reviews only, and only once at least one exists.
  if(store.platform.review_count>0&&store.platform.average_rating>0){
    data.aggregateRating={
      '@type':'AggregateRating',
      ratingValue:store.platform.average_rating,
      reviewCount:store.platform.review_count,
      bestRating:BEST_RATING,worstRating:1,
      itemReviewed:{'@type':'Store',name:store.name},
    };
  }
  const written=posts.filter(post=>post.text.trim().length>0);
  if(written.length)data.review=written.map(reviewJsonLd);
  return data;
}

export function reviewPageJsonLd(post:Post):JsonLd{
  return {
    '@context':'https://schema.org','@type':'Review',
    author:{'@type':'Person',name:post.display_name},
    datePublished:post.created_at,
    reviewRating:{'@type':'Rating',ratingValue:post.rating,bestRating:BEST_RATING,worstRating:1},
    reviewBody:post.text,
    itemReviewed:{
      '@type':'Store',name:post.store_name,
      url:absolute(`/stores/${post.store_id}`),
      address:{'@type':'PostalAddress',addressLocality:post.store_city,...(post.store_district?{addressRegion:post.store_district}:{}),addressCountry:'TR'},
    },
  };
}
