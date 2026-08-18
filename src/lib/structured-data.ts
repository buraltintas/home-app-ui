import {absolute,siteUrl,storePath} from './site';
import type {Post,Store} from './types';

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
