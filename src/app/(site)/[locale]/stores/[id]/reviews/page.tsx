import type {Metadata} from 'next';
import Link from 'next/link';
import {PageBackButton} from '@/components/PageBackButton';
import {StoreReviewList} from '@/components/StoreReviewList';
import {getPublicStore,getStorePosts,STORE_POSTS_LIMIT} from '@/lib/server-api';
import {asLocale,localePath,storePath} from '@/lib/site';
import type {Locale} from '@/lib/types';

// The same lifetime as the store page, and dropped by the same tags: a review written or
// deleted refreshes both together.
export const revalidate=86400;

type Props={params:Promise<{locale:string;id:string}>};

const copy:Record<Locale,{eyebrow:string;title:(store:string)=>string}>={
  tr:{eyebrow:'Topluluk değerlendirmeleri',title:store=>`${store} değerlendirmeleri`},
  en:{eyebrow:'Community reviews',title:store=>`Reviews of ${store}`},
  de:{eyebrow:'Bewertungen der Community',title:store=>`Bewertungen von ${store}`},
  ru:{eyebrow:'Отзывы сообщества',title:store=>`Отзывы о ${store}`},
};

// Out of the index, followed. Every review here is already on the store page, which is the
// page that should rank for them; this is the same reviews in an order the reader picks, and
// an indexable copy would compete with the store page for its own words.
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {id,locale:raw}=await params;
  const locale=asLocale(raw);
  const {store}=await getPublicStore(id,locale,revalidate);
  return {title:copy[locale].title(store.name),robots:{index:false,follow:true}};
}

export default async function Page({params}:Props){
  const {id,locale:raw}=await params;
  const locale=asLocale(raw);
  const {store}=await getPublicStore(id,locale,revalidate);
  const posts=await getStorePosts(store.id,[id,store.slug??''],locale,revalidate);
  return <main className="store-reviews-page">
    <PageBackButton fallback={storePath(store)}/>
    <p className="eyebrow">{copy[locale].eyebrow}</p>
    <h1><Link href={localePath(locale,storePath(store))}>{store.name}</Link></h1>
    <StoreReviewList posts={posts} locale={locale} capped={STORE_POSTS_LIMIT}/>
  </main>;
}
