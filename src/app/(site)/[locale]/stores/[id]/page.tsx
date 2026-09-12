import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {permanentRedirect} from 'next/navigation';
import {PostCard} from '@/components/PostCard';
import {ReviewsJump} from '@/components/ReviewsJump';
import {Rating,RatingStars} from '@/components/Rating';
import {StoreActions} from '@/components/StoreActions';
import {JsonLd} from '@/components/JsonLd';
import {ScrollTop} from '@/components/ScrollTop';
import {getPublicStore} from '@/lib/server-api';
import {getDictionary} from '@/i18n/dictionaries';
import {asLocale} from '@/lib/site';
import {canonicalFor,localePath,storePath} from '@/lib/site';
import {breadcrumbJsonLd,storeJsonLd} from '@/lib/structured-data';
import type {Locale} from '@/lib/types';
import {isBrandMark,storePhotoURL} from '@/lib/store-photo';
import {TimedNudge} from '@/components/TimedNudge';
import {PageBackButton} from '@/components/PageBackButton';
import {ViewerLikes} from '@/components/ViewerLikes';

type Props={params:Promise<{id:string;locale:string}>};

// A store page is the same page for everybody, so it is built once and served from the
// edge for an hour rather than assembled from two backend round trips on every view.
//
// Two things had to be true first, and now are. The locale comes from the address rather
// than from a request header, and the store is read anonymously -- touching cookies or
// headers is what makes a page dynamic, and what it would have read is one reader's view.
// Everything that does differ per reader is read in the browser after the page arrives:
// whether this reader saved the shop, and which of its reviews they liked.
// Caching is off, and what is in the way is not on this page.
//
// The proxy rewrites every request with an added `x-locale` header so that a server
// component can read the locale without threading it down, and mutating a request's headers
// in middleware is exactly what makes a page dynamic. Declared static, this page answered
// "changed from static to dynamic at runtime, reason: headers" on every view in production --
// and so would any other page, including an empty one, which is how it was found.
//
// Turning it on is one line here, after the locale stops travelling as a request header: the
// address already carries it, in this route's own [locale] segment, and 62 calls to
// getServerI18n across 23 files would read it from params instead. Everything else this page
// needed is already done -- the store is read anonymously, and the reader's own state arrives
// in the browser after the page.
export const revalidate=0;

const contributionCopy:Record<Locale,{title:string;body:string;action:string;progress:string;levels:string;correction:string}>={
  tr:{title:'Bu mağazaya gittin mi?',body:'Deneyimin bir sonraki kişinin doğru mağazayı seçmesine yardım eder. Doğrulanmış her değerlendirme katkı seviyeni de yükseltir.',action:'Değerlendirme yap',progress:'Katkı seviyeni yükselt',levels:'Katkı seviyeleri ne işe yarar?',correction:'Mağaza bilgilerinde düzenleme öner.'},
  en:{title:'Have you visited this store?',body:'Your experience helps the next person choose the right store. Every verified review also raises your contributor level.',action:'Write a review',progress:'Raise your contributor level',levels:'What are contributor levels for?',correction:'Suggest an edit to store information'},
  de:{title:'Warst du in diesem Geschäft?',body:'Deine Erfahrung hilft der nächsten Person, das passende Geschäft zu wählen. Jede bestätigte Bewertung erhöht auch deine Beitragsstufe.',action:'Bewertung abgeben',progress:'Beitragsstufe erhöhen',levels:'Wozu dienen Beitragsstufen?',correction:'Änderung der Geschäftsinformationen vorschlagen'},
  ru:{title:'Вы были в этом магазине?',body:'Ваш опыт поможет следующему человеку выбрать подходящий магазин. Каждый подтверждённый отзыв также повышает ваш уровень участника.',action:'Оставить оценку',progress:'Повысить уровень участника',levels:'Для чего нужны уровни участника?',correction:'Предложить исправление данных магазина'},
};
// Two sentences that say different kinds of thing: the first explains how the number is
// worked out, the second is why it can be trusted. They are held apart because the second
// is the claim the whole rating rests on, and buried in a paragraph nobody reads it.
const scoreCopy:Record<Locale,{title:string;intro:string;trust:string;seeReviews:string;empty:string}>={
  tr:{title:'Değerlendirme',intro:'Mağaza puanı, sekiz değerlendirme puanının ortalamasından oluşur.',trust:'Mağazanın yanındayken yazılan değerlendirmeler “Doğrulanmış ziyaret” rozetiyle işaretlenir ve önce gösterilir.',seeReviews:'Değerlendirmeleri gör',empty:'Henüz ölçüt puanı yok'},
  en:{title:'Rating',intro:'The store rating is the average of eight review scores.',trust:'A review written next to the store carries a “Verified visit” badge and is shown first.',seeReviews:'See the reviews',empty:'No criteria scores yet'},
  de:{title:'Bewertung',intro:'Die Ladenbewertung ist der Durchschnitt aus acht Bewertungspunkten.',trust:'Eine Bewertung, die direkt beim Geschäft geschrieben wird, trägt das Abzeichen „Bestätigter Besuch“ und wird zuerst gezeigt.',seeReviews:'Bewertungen ansehen',empty:'Noch keine Kriterienbewertungen'},
  ru:{title:'Оценка',intro:'Оценка магазина — среднее восьми оценок отзыва.',trust:'Отзыв, написанный рядом с магазином, помечается значком «Подтверждённое посещение» и показывается первым.',seeReviews:'Смотреть отзывы',empty:'Оценок по критериям пока нет'},
};

// Everything Google gives us for a store lives in the external source attribution
// jsonb. Nothing here is invented: a missing field is simply not rendered.

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {id,locale:raw}=await params;
  const locale=asLocale(raw);
  const t=getDictionary(locale);
  const {store}=await getPublicStore(id,locale,revalidate);
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
  const {id,locale:raw}=await params;
  const locale=asLocale(raw);
  const t=getDictionary(locale);
  const {store,recent_posts}=await getPublicStore(id,locale,revalidate);
  // One store, one address. Links created before slugs existed still resolve, they just
  // do not stay on a second URL competing with the canonical one.
  if(store.slug&&id!==store.slug)permanentRedirect(storePath(store));
  // A bare personal name under a photograph of a shop reads as the shop's name, so the
  // credit says what it is. The provider requires it to be shown either way.
  const photo=storePhotoURL(store.photo,1200);
  const contribution=contributionCopy[locale];
  const scores=scoreCopy[locale];
  const criteria=store.criteria_averages;
  const criteriaRows=[
    [t.criterionAvailability,criteria?.availability],[t.criterionValue,criteria?.value],
    [t.criterionLayout,criteria?.layout],[t.criterionStaffCare,criteria?.staff_care],
    [t.criterionStaffKnowledge,criteria?.staff_knowledge],[t.criterionCheckout,criteria?.checkout],
    [t.criterionReturns,criteria?.returns],[t.criterionCleanliness,criteria?.cleanliness],
  ] as const;
  const formatScore=(value:number|undefined)=>value===undefined?'—':value.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:1});
  const correctionPath=localePath(locale,`/store-correction?store=${encodeURIComponent(store.id)}&name=${encodeURIComponent(store.name)}`);
  const trail=[{name:t.discover??'',path:'/discover'},...(store.city?[{name:store.city,path:'/discover'}]:[]),{name:store.name,path:storePath(store)}].filter(entry=>entry.name);
  return <main className="store-page">
    <ScrollTop/>
    <PageBackButton/>
    <JsonLd data={[storeJsonLd(store,recent_posts),breadcrumbJsonLd(trail)]}/>
    <section className="store-hero">
      {/* Roughly one store in twelve has no photograph, and not because we failed to fetch
          one: Google Maps shows pictures from sources the Places API does not hand out, so
          for those there is nothing to fetch. A blank grey block states that fact and does
          nothing about it, and the only thing that fixes it is somebody going there and
          taking a picture -- so the space asks for exactly that. */}
      {photo
        ?<figure className={`store-hero-photo${isBrandMark(store.photo)?' is-brand-mark':''}`}><Image src={photo} fill style={{objectFit:isBrandMark(store.photo)?'contain':'cover'}} sizes="100vw" priority unoptimized alt=""/></figure>
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
      <section className="store-rating-breakdown" aria-labelledby="store-rating-title">
        <header><div><h2 id="store-rating-title">{scores.title}</h2><p>{scores.intro}</p><p className="store-rating-trust">{scores.trust}</p></div><div className="store-rating-overall"><strong>{store.platform.review_count?formatScore(store.platform.average_rating):'—'}</strong>{store.platform.review_count?<><span className="store-rating-count">{store.platform.review_count} {t.reviewWord}</span><ReviewsJump label={scores.seeReviews}/></>:<small>{scores.empty}</small>}</div></header>
        <dl>{criteriaRows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value!==undefined?<RatingStars value={value}/>:'—'}</dd></div>)}</dl>
      </section>
      {/* Directly under save, directions, call and share, because it belongs with them: they
          are the four things you can do about this store and reviewing it is the fifth. It
          used to live only in the panel below, where it read as an advertisement for
          contributing rather than an action available here. */}
      <Link className="button store-contribution-action store-review-action" href={localePath(locale,`/create?store=${store.id}`)}>{contribution.action}</Link>
    </section>
    <section className="store-contribution" aria-label={contribution.title}>
      <aside className="review-invitation">
        <div className="review-invitation-copy"><h2>{contribution.title}</h2><p>{contribution.body}</p></div>
        <div className="review-invitation-actions">
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
        {store.website&&<aside className="external-panel" aria-label={t.storeWebsite}>
          {/* The store's own site, where it has one. This is the store speaking for
              itself, which is the only outside source this page carries now. */}
          <a className="external-link" href={store.website} target="_blank" rel="noopener noreferrer">{t.storeWebsite}</a>
        </aside>}
      </div>
      <div className="store-reviews" aria-labelledby="store-reviews-title">
        <h2 className="store-section-title" id="store-reviews-title">{t.community}</h2>
        {recent_posts.length?<ViewerLikes postIds={recent_posts.map(post=>post.id)}><div className="store-review-rail">{recent_posts.map(post=><PostCard post={post} surface="store" key={post.id}/>)}</div></ViewerLikes>:<div className="empty-state"><h3>{t.noCommunity}</h3><p>{t.noReviewsBody}</p></div>}
      </div>
    </section>
    <TimedNudge kind="review" requireReviewFlag/>
  </main>;
}
