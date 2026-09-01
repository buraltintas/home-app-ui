import type {Metadata} from 'next';
import {mapsLink} from '@/lib/maps';
import Image from 'next/image';
import Link from 'next/link';
import {permanentRedirect} from 'next/navigation';
import {PostCard} from '@/components/PostCard';
import {Rating} from '@/components/Rating';
import {StoreActions} from '@/components/StoreActions';
import {JsonLd} from '@/components/JsonLd';
import {ScrollTop} from '@/components/ScrollTop';
import {getStore} from '@/lib/server-api';
import {getServerI18n} from '@/i18n/server';
import {canonicalFor,localePath,storePath} from '@/lib/site';
import {breadcrumbJsonLd,storeJsonLd} from '@/lib/structured-data';
import type {Locale,Store} from '@/lib/types';
import {storePhotoURL} from '@/lib/store-photo';
import {storeStatusCopy} from '@/i18n/dictionaries';

type Props={params:Promise<{id:string}>};

const contributionCopy:Record<Locale,{title:string;body:string;action:string;progress:string;levels:string;correction:string}>={
  tr:{title:'Bu mağazaya gittin mi?',body:'Deneyimin bir sonraki kişinin doğru mağazayı seçmesine yardım eder. Doğrulanmış her değerlendirme katkı seviyeni de yükseltir.',action:'Değerlendirme yap',progress:'Katkı seviyeni yükselt',levels:'Katkı seviyeleri ne işe yarar?',correction:'Mağaza bilgilerinde düzenleme öner.'},
  en:{title:'Have you visited this store?',body:'Your experience helps the next person choose the right store. Every verified review also raises your contributor level.',action:'Write a review',progress:'Raise your contributor level',levels:'What are contributor levels for?',correction:'Suggest an edit to store information'},
  de:{title:'Warst du in diesem Geschäft?',body:'Deine Erfahrung hilft der nächsten Person, das passende Geschäft zu wählen. Jede bestätigte Bewertung erhöht auch deine Beitragsstufe.',action:'Bewertung abgeben',progress:'Beitragsstufe erhöhen',levels:'Wozu dienen Beitragsstufen?',correction:'Änderung der Geschäftsinformationen vorschlagen'},
  ru:{title:'Вы были в этом магазине?',body:'Ваш опыт поможет следующему человеку выбрать подходящий магазин. Каждый подтверждённый отзыв также повышает ваш уровень участника.',action:'Оставить оценку',progress:'Повысить уровень участника',levels:'Для чего нужны уровни участника?',correction:'Предложить исправление данных магазина'},
};
const externalNote:Record<Locale,string>={
  tr:'Google verileri Boşa Gezme! topluluk puanlarından bağımsızdır. Bu nedenle ayrı olarak gösterilir.',
  en:'Google data is independent of Boşa Gezme! community ratings. It is therefore shown separately.',
  de:'Google-Daten sind unabhängig von den Community-Bewertungen auf Boşa Gezme! und werden deshalb separat angezeigt.',
  ru:'Данные Google не зависят от оценок сообщества Boşa Gezme!, поэтому показываются отдельно.',
};

// Everything Google gives us for a store lives in the external source attribution
// jsonb. Nothing here is invented: a missing field is simply not rendered.
type GoogleSource={place_id?:string;photo_name?:string;photo_attributions?:string[];attributions?:string[];rating?:number;rating_count?:number;business_status?:string;refreshed_at?:string};
function googleSource(store:Store):GoogleSource|undefined{
  const source=store.external_sources?.find(entry=>entry.provider==='google');
  if(!source)return undefined;
  const attribution=source.attribution as Record<string,unknown>;
  const placeID=typeof source.external_id==='string'?source.external_id:undefined;
  const list=(value:unknown)=>Array.isArray(value)?value.filter((entry):entry is string=>typeof entry==='string'):undefined;
  return {
    place_id:placeID,
    photo_name:typeof attribution.photo_name==='string'?attribution.photo_name:undefined,
    photo_attributions:list(attribution.photo_attributions),
    attributions:list(attribution.attributions),
    rating:typeof attribution.rating==='number'?attribution.rating:undefined,
    rating_count:typeof attribution.rating_count==='number'?attribution.rating_count:undefined,
    business_status:typeof attribution.business_status==='string'?attribution.business_status:undefined,
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
  const image=storePhotoURL(store.photo,1200);
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
  const photo=storePhotoURL(store.photo,1200);
  const photoCredit=store.photo?.attributions?.length?`${t.photoBy}: ${store.photo.attributions.join(' · ')}`:t.photoByGoogle;
  const contribution=contributionCopy[locale];
  const correctionPath=localePath(locale,`/store-correction?store=${encodeURIComponent(store.id)}&name=${encodeURIComponent(store.name)}`);
  const trail=[{name:t.discover??'',path:'/discover'},...(store.city?[{name:store.city,path:'/discover'}]:[]),{name:store.name,path:storePath(store)}].filter(entry=>entry.name);
  return <main className="store-page">
    <ScrollTop/>
    <JsonLd data={[storeJsonLd(store,recent_posts),breadcrumbJsonLd(trail)]}/>
    <section className="store-hero">
      {/* Roughly one store in twelve has no photograph, and not because we failed to fetch
          one: Google Maps shows pictures from sources the Places API does not hand out, so
          for those there is nothing to fetch. A blank grey block states that fact and does
          nothing about it, and the only thing that fixes it is somebody going there and
          taking a picture -- so the space asks for exactly that. */}
      {photo
        ?<figure className="store-hero-photo"><Image src={photo} fill style={{objectFit:'cover'}} sizes="100vw" priority unoptimized alt=""/>{store.photo?.source==='google'&&<figcaption>{photoCredit}</figcaption>}</figure>
        :<div className="store-hero-photo store-hero-empty"><span className="store-hero-initial" aria-hidden="true">{store.name.trim().charAt(0)}</span><p>{t.noPhotoYet}</p><Link className="button secondary" href={localePath(locale,`/create?store=${store.id}`)}>{t.addFirstPhoto}</Link></div>}
    </section>
    <section className="store-overview">
      {store.is_catalog_store&&<p className="store-catalog-label">{t.catalogStore}</p>}
      <div className="store-copy">
        <p className="eyebrow">{store.category_labels.join(' · ')}</p>
        <h1>{store.name}</h1>
        <p>{[store.district,store.city].filter(Boolean).join(', ')}{store.distance_meters!==undefined&&` · ${(store.distance_meters/1000).toLocaleString(locale,{maximumFractionDigits:1})} km`}</p>
      </div>
      <div className="store-score"><span>{t.communityRating}</span><strong>{store.platform.review_count?<Rating value={store.platform.average_rating}/>:'—'}</strong><small>{store.platform.review_count} {t.profileRatings.toLocaleLowerCase(locale)}</small></div>
      <div className="store-score"><span>{t.savedBy}</span><strong>{store.platform.favorite_count}</strong><small>{t.people}</small></div>
      <StoreActions storeId={store.id} name={store.name} latitude={store.latitude} longitude={store.longitude} initialFavorited={store.viewer_has_favorited} phone={store.phone}/>
    </section>
    <section className="store-contribution" aria-label={contribution.title}>
      <aside className="review-invitation">
        <div className="review-invitation-copy"><h2>{contribution.title}</h2><p>{contribution.body}</p></div>
        <div className="review-invitation-actions">
          <Link className="button store-contribution-action" href={localePath(locale,`/create?store=${store.id}`)}>{contribution.action}</Link>
          <Link className="contribution-progress" href={localePath(locale,'/about#katki')}><span aria-hidden="true">↗</span><span><strong>{contribution.progress}</strong><small>{contribution.levels}</small></span></Link>
        </div>
      </aside>
    </section>
    <section className="store-body">
      <div className="store-description">
        <p className="eyebrow store-section-title">{t.about}</p>
        {store.localized_description&&<p>{store.localized_description}</p>}
        <address>{[store.address,[store.district,store.city].filter(Boolean).join('/')].filter(Boolean).join(', ')}</address>
        <Link className="store-correction-link" href={correctionPath}>{contribution.correction}</Link>
        {google&&<aside className="external-panel" aria-label={t.googleData}>
          <p className="eyebrow">{t.googleData}</p>
          {(google.business_status==='CLOSED_TEMPORARILY'||google.business_status==='CLOSED_PERMANENTLY')&&<p className="store-status-warning">{storeStatusCopy[locale]}</p>}
          {google.rating_count!==undefined&&<p className="external-rating"><Rating value={google.rating??0}/> <span>{google.rating_count} {t.reviews}</span></p>}
          <p className="external-note">{externalNote[locale]}</p>
          {google.attributions?.length?<p className="external-attribution">{google.attributions.join(' · ')}</p>:null}
          {google.refreshed_at&&<small>{t.googleUpdated}: {new Date(google.refreshed_at).toLocaleDateString(locale)}</small>}
          {/* Deliberately a link of its own rather than making the rating clickable. A
              clickable rating gets pressed by accident -- somebody reading a number ends
              up on another site without meaning to. This gets pressed on purpose, and a
              product confident enough to show what Google says reads as more trustworthy
              than one that hides it. */}
          {google.place_id&&<a className="external-link" href={mapsLink(store.latitude,store.longitude,google.place_id)} target="_blank" rel="noopener noreferrer">{t.seeOnGoogleMaps}</a>}
          {/* The store's own site, where it has one. Not a social account: Google does not
              publish those, and guessing a handle from a name would put somebody else's
              Instagram on this page. This is the store speaking for itself. */}
          {store.website&&<a className="external-link" href={store.website} target="_blank" rel="noopener noreferrer">{t.storeWebsite}</a>}
        </aside>}
      </div>
      <div className="store-reviews">
        <p className="eyebrow store-section-title">{t.community}</p>
        {recent_posts.length?recent_posts.map(post=><PostCard post={post} showStoreName={false} showStoreFallbackPhoto={false} key={post.id}/>):<div className="empty-state"><h2>{t.noCommunity}</h2><p>{t.noReviewsBody}</p></div>}
      </div>
    </section>
  </main>;
}
