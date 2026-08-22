import type {Metadata} from 'next';
import Image from 'next/image';
import {permanentRedirect} from 'next/navigation';
import {PostCard} from '@/components/PostCard';
import {Rating} from '@/components/Rating';
import {StoreActions} from '@/components/StoreActions';
import {JsonLd} from '@/components/JsonLd';
import {getStore} from '@/lib/server-api';
import {getServerI18n} from '@/i18n/server';
import {canonicalFor,storePath} from '@/lib/site';
import {breadcrumbJsonLd,storeJsonLd} from '@/lib/structured-data';
import type {Store} from '@/lib/types';

type Props={params:Promise<{id:string}>};

// Everything Google gives us for a store lives in the external source attribution
// jsonb. Nothing here is invented: a missing field is simply not rendered.
type GoogleSource={photo_name?:string;photo_attributions?:string[];attributions?:string[];rating?:number;rating_count?:number;refreshed_at?:string};
function googleSource(store:Store):GoogleSource|undefined{
  const source=store.external_sources?.find(entry=>entry.provider==='google');
  if(!source)return undefined;
  const attribution=source.attribution as Record<string,unknown>;
  const list=(value:unknown)=>Array.isArray(value)?value.filter((entry):entry is string=>typeof entry==='string'):undefined;
  return {
    photo_name:typeof attribution.photo_name==='string'?attribution.photo_name:undefined,
    photo_attributions:list(attribution.photo_attributions),
    attributions:list(attribution.attributions),
    rating:typeof attribution.rating==='number'?attribution.rating:undefined,
    rating_count:typeof attribution.rating_count==='number'?attribution.rating_count:undefined,
    refreshed_at:source.refreshed_at,
  };
}

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const [{id},{t,locale}]=await Promise.all([params,getServerI18n()]);
  const {store}=await getStore(id);
  const place=[store.district,store.city].filter(Boolean).join(', ');
  const title=place?`${store.name} — ${place}`:store.name;
  const description=store.localized_description??`${store.name}${place?`, ${place}`:''} — ${t.community}`;
  // Every store link shared anywhere previewed as the generic homepage card, because
  // this page set no openGraph of its own and inherited the root layout's.
  const google=googleSource(store);
  const image=google?.photo_name?`/api/places/photo?name=${encodeURIComponent(google.photo_name)}&w=1200`:undefined;
  return {title,description,
    alternates:canonicalFor(locale,storePath(store)),
    openGraph:{type:'website',url:storePath(store),title,description,...(image?{images:[{url:image,width:1200,height:630,alt:store.name}]}:{})},
    twitter:{card:image?'summary_large_image':'summary',title,description,...(image?{images:[image]}:{})}};
}

export default async function Page({params}:Props){
  const [{id},{locale,t}]=await Promise.all([params,getServerI18n()]);
  const {store,recent_posts}=await getStore(id);
  // One store, one address. Links created before slugs existed still resolve, they just
  // do not stay on a second URL competing with the canonical one.
  if(store.slug&&id!==store.slug)permanentRedirect(storePath(store));
  const google=googleSource(store);
  // A bare personal name under a photograph of a shop reads as the shop's name, so the
  // credit says what it is. The provider requires it to be shown either way.
  const photoCredit=google?.photo_attributions?.length?`${t.photoBy}: ${google.photo_attributions.join(' · ')}`:t.photoByGoogle;
  const trail=[{name:t.discover??'',path:'/discover'},...(store.city?[{name:store.city,path:'/discover'}]:[]),{name:store.name,path:storePath(store)}].filter(entry=>entry.name);
  return <main className="store-page">
    <JsonLd data={[storeJsonLd(store,recent_posts),breadcrumbJsonLd(trail)]}/>
    <section className="store-hero">
      {google?.photo_name
        ?<figure className="store-hero-photo"><Image src={`/api/places/photo?name=${encodeURIComponent(google.photo_name)}&w=1200`} fill style={{objectFit:'cover'}} sizes="100vw" priority unoptimized alt=""/><figcaption>{photoCredit}</figcaption></figure>
        :<div className="store-hero-photo store-hero-empty"><span aria-hidden="true">{store.name.trim().charAt(0)}</span><small>{t.noPhoto}</small></div>}
    </section>
    <section className="store-overview">
      <div className="store-copy">
        <p className="eyebrow">{store.category_labels.join(' · ')}</p>
        <h1>{store.name}</h1>
        <p>{[store.district,store.city].filter(Boolean).join(', ')}{store.distance_meters!==undefined&&` · ${(store.distance_meters/1000).toLocaleString(locale,{maximumFractionDigits:1})} km`}</p>
      </div>
      <div className="store-score"><span>{t.communityRating}</span><strong>{store.platform.review_count?<Rating value={store.platform.average_rating}/>:'—'}</strong><small>{store.platform.review_count} {t.reviews}</small></div>
      <div className="store-score"><span>{t.savedBy}</span><strong>{store.platform.favorite_count}</strong><small>{t.people}</small></div>
      <StoreActions storeId={store.id} name={store.name} latitude={store.latitude} longitude={store.longitude} initialFavorited={store.viewer_has_favorited} phone={store.phone}/>
    </section>
    <section className="store-body">
      <div className="store-description">
        <p className="eyebrow">{t.about}</p>
        <h2>{t.storeQuestion}</h2>
        {store.localized_description&&<p>{store.localized_description}</p>}
        <address>{[store.address,[store.district,store.city].filter(Boolean).join('/')].filter(Boolean).join(', ')}</address>
        {google&&<aside className="external-panel" aria-label={t.googleData}>
          <p className="eyebrow">{t.googleData}</p>
          {google.rating_count!==undefined&&<p className="external-rating"><Rating value={google.rating??0}/> <span>{google.rating_count} {t.reviews}</span></p>}
          <p className="external-note">{t.externalSeparation}</p>
          {google.attributions?.length?<p className="external-attribution">{google.attributions.join(' · ')}</p>:null}
          {google.refreshed_at&&<small>{t.googleUpdated}: {new Date(google.refreshed_at).toLocaleDateString(locale)}</small>}
        </aside>}
      </div>
      <div className="store-reviews">
        <p className="eyebrow">{t.community}</p>
        {recent_posts.length?recent_posts.map(post=><PostCard post={post} showStoreName={false} key={post.id}/>):<div className="empty-state"><h2>{t.noCommunity}</h2><p>{t.noReviewsBody}</p></div>}
      </div>
    </section>
  </main>;
}
