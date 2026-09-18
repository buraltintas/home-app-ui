import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {permanentRedirect} from 'next/navigation';
import {PostCard} from '@/components/PostCard';
import {ReviewsJump} from '@/components/ReviewsJump';
import {StoreNeighbours} from '@/components/StoreNeighbours';
import {Rating,RatingStars} from '@/components/Rating';
import {StoreActions} from '@/components/StoreActions';
import {JsonLd} from '@/components/JsonLd';
import {PencilLine} from 'lucide-react';
import {ScrollTop} from '@/components/ScrollTop';
import {getCityCategories,getNearbyStores,getPublicStore} from '@/lib/server-api';
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
// A store page is the same page for everybody, so it is built once and served for an hour
// rather than assembled from two backend round trips on every view.
//
// Three things had to be true first, and now are. The locale comes from the address rather
// than from a request header -- the header the proxy used to add made every page in the
// application dynamic, which is what defeated the first attempt at this. The store is read
// anonymously: touching cookies is the other thing that makes a page dynamic, and what it
// would have read is one reader's view. And everything that does differ per reader is read
// in the browser after the page arrives -- whether this reader saved the shop, and which of
// its reviews they liked.
export const revalidate=3600;

// Nothing is prebuilt: eight and a half thousand shops in four languages is a build nobody
// wants to wait for, and the pages people open are a small fraction of them. What this
// declares is that the route may be cached at all -- the first visitor to a shop pays for
// rendering it and everybody after them, for the next hour, does not.
export function generateStaticParams(){return [] as {id:string}[];}

// The page's own name, said the same way here as on the page itself: a link that renames
// where it goes is a link somebody does not recognise when they arrive.
const cityCategoryName:Record<Locale,(city:string,category:string)=>string>={
  tr:(city,category)=>`${city} ${category.toLocaleLowerCase('tr')} mağazaları`,
  en:(city,category)=>`${category} stores in ${city}`,
  de:(city,category)=>`${category}-Geschäfte in ${city}`,
  ru:(city,category)=>`${category}: магазины в городе ${city}`,
};

const contributionCopy:Record<Locale,{title:string;body:string;action:string;progress:string;levels:string;correction:string}>={
  tr:{title:'Bu mağazaya gittin mi?',body:'Deneyimin bir sonraki kişinin doğru mağazayı seçmesine yardım eder. Doğrulanmış her değerlendirme katkı seviyeni de yükseltir.',action:'Değerlendirme yap',progress:'Katkı seviyeni yükselt',levels:'Katkı seviyeleri ne işe yarar?',correction:'Mağaza bilgilerinde düzenleme öner.'},
  en:{title:'Have you visited this store?',body:'Your experience helps the next person choose the right store. Every verified review also raises your contributor level.',action:'Write a review',progress:'Raise your contributor level',levels:'What are contributor levels for?',correction:'Suggest an edit to store information'},
  de:{title:'Warst du in diesem Geschäft?',body:'Deine Erfahrung hilft der nächsten Person, das passende Geschäft zu wählen. Jede bestätigte Bewertung erhöht auch deine Beitragsstufe.',action:'Bewertung abgeben',progress:'Beitragsstufe erhöhen',levels:'Wozu dienen Beitragsstufen?',correction:'Änderung der Geschäftsinformationen vorschlagen'},
  ru:{title:'Вы были в этом магазине?',body:'Ваш опыт поможет следующему человеку выбрать подходящий магазин. Каждый подтверждённый отзыв также повышает ваш уровень участника.',action:'Оставить оценку',progress:'Повысить уровень участника',levels:'Для чего нужны уровни участника?',correction:'Предложить исправление данных магазина'},
};
// Two sentences that say different kinds of thing: the first explains how the number is
// worked out, the second is why it can be trusted. They are held apart because the second
// is the claim the whole rating rests on, and buried in a paragraph nobody reads it.
const scoreCopy:Record<Locale,{title:string;intro:string;seeReviews:string;empty:string}>={
  tr:{title:'Değerlendirme',intro:'Mağaza puanı, sekiz değerlendirme puanının ortalamasından oluşur.',seeReviews:'Değerlendirmeleri gör',empty:'Henüz ölçüt puanı yok'},
  en:{title:'Rating',intro:'The store rating is the average of eight review scores.',seeReviews:'See the reviews',empty:'No criteria scores yet'},
  de:{title:'Bewertung',intro:'Die Ladenbewertung ist der Durchschnitt aus acht Bewertungspunkten.',seeReviews:'Bewertungen ansehen',empty:'Noch keine Kriterienbewertungen'},
  ru:{title:'Оценка',intro:'Оценка магазина — среднее восьми оценок отзыва.',seeReviews:'Смотреть отзывы',empty:'Оценок по критериям пока нет'},
};

// What a search result says under the blue line, and it had been saying nothing.
//
// The most-seen page on the site is a store page with 101 impressions and 2 clicks -- 2%,
// against a site average of 10.4%. Its description read "Pasha Perde Tasarım Stüdyosu,
// Muratpaşa, Antalya — Topluluk deneyimleri", which repeats the title and then names a
// section heading. Nothing in it answers the question somebody typing a shop's name has,
// which is whether it is worth the trip.
//
// So it says what we actually know, in the order it matters: what the shop sells, where it
// is, and what the community found -- and where the community has found nothing yet, it
// says that plainly rather than dressing up the silence. A store's own description, when it
// has one, still wins: that is the shop speaking for itself.
//
// The count here is reviews, and it is called reviews. The store endpoint returns
// review_count, not how many different people wrote them -- and those stop being the same
// number the moment somebody visits twice. Calling four reviews "four people" in a search
// result would be the same overstatement the home page was just corrected for, printed
// somewhere it cannot be taken back.
const snippetCopy:Record<Locale,{scored:(score:string,reviews:number)=>string;unscored:string;visit:string}>={
  tr:{scored:(score,reviews)=>`Topluluk puanı ${score}/5 (${reviews} değerlendirme).`,unscored:'Henüz değerlendirilmemiş.',visit:'Adres, kategoriler ve gerçek ziyaretçi deneyimleri.'},
  en:{scored:(score,reviews)=>`Community rating ${score}/5 from ${reviews} ${reviews===1?'review':'reviews'}.`,unscored:'No reviews yet.',visit:'Address, categories and experiences from real visits.'},
  de:{scored:(score,reviews)=>`Community-Bewertung ${score}/5 aus ${reviews} ${reviews===1?'Bewertung':'Bewertungen'}.`,unscored:'Noch nicht bewertet.',visit:'Adresse, Kategorien und Erfahrungen aus echten Besuchen.'},
  ru:{scored:(score,reviews)=>`Оценка сообщества ${score}/5 (${reviews} оценок).`,unscored:'Пока без оценок.',visit:'Адрес, категории и впечатления от реальных визитов.'},
};

// Everything Google gives us for a store lives in the external source attribution
// jsonb. Nothing here is invented: a missing field is simply not rendered.

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {id,locale:raw}=await params;
  const locale=asLocale(raw);
  const {store}=await getPublicStore(id,locale,revalidate);
  const place=[store.district,store.city].filter(Boolean).join(', ');
  const title=place?`${store.name} — ${place}`:store.name;
  const snippet=snippetCopy[locale];
  const categories=store.category_labels.slice(0,3).join(', ');
  const description=store.localized_description??[
    categories?`${store.name} — ${categories}${place?`, ${place}`:''}.`:`${store.name}${place?`, ${place}`:''}.`,
    store.platform.review_count
      ?snippet.scored(store.platform.average_rating.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:1}),store.platform.review_count)
      :snippet.unscored,
    snippet.visit,
  ].join(' ');
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
  // Fetched after the store rather than beside it: the id in the URL can be a slug, and
  // asking for neighbours of a slug that turns out not to exist is a wasted round trip on
  // a page that is about to be a 404 anyway.
  const neighbours=await getNearbyStores(store.id);
  // The page this shop belongs to, when there is one: its city and one of its categories.
  // The breadcrumb used to point the city at /discover, which is a search box rather than a
  // place -- it told a reader nothing and gave a crawler nowhere to go. The link is only
  // offered where the catalogue can fill the page behind it.
  const pairs=await getCityCategories(locale);
  // Every page this shop belongs to, up to three -- not one page picked as "the" category.
  //
  // Two rules were tried for picking a single one and both were guesses wearing a rule's
  // clothes. First match gave a bed shop "ev aksesuarları", a page of 436 shops that says
  // nothing about it. Smallest match was worse: İşbir Yatak went to "ev gereçleri" and
  // English Home to "banyo", because smallest is a fact about that city's stock rather than
  // about this shop. There is no field in the catalogue that says which category a shop is
  // mainly in, so choosing one means inventing the answer.
  //
  // A shop really does belong to several, so it says several. Largest first, because the
  // broadest name is the one a reader recognises; three, because a row of links stops being
  // a sentence after that.
  const belongsTo=(store.city
    ?pairs.filter(pair=>pair.city===store.city&&store.categories.includes(pair.category_slug))
      .sort((a,b)=>b.store_count-a.store_count)
    :[]).slice(0,3).map(pair=>({
      path:`/${pair.city_slug}/${pair.category_url_slug}-magazalari`,
      name:cityCategoryName[locale](pair.city,pair.category_name),
    }));
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
  // Two decimals where there are two, one where there is one. This number is the average of
  // eight scores, so a reader can and does check the arithmetic: ten stars across eight
  // questions is 1.25, and rounding that to 1.3 on the page makes the sum look wrong. A
  // round 4.5 is still shown as 4.5, not 4.50.
  const formatScore=(value:number|undefined)=>value===undefined?'—':value.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:2});
  const correctionPath=localePath(locale,`/store-correction?store=${encodeURIComponent(store.id)}&name=${encodeURIComponent(store.name)}`);
  const trail=[{name:t.discover??'',path:'/discover'},...(belongsTo.length?[belongsTo[0]]:store.city?[{name:store.city,path:'/discover'}]:[]),{name:store.name,path:storePath(store)}].filter(entry=>entry.name);
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
        {belongsTo.length>0&&<p className="store-belongs-to">{belongsTo.map(page=><Link key={page.path} href={localePath(locale,page.path)}>{page.name}</Link>)}</p>}
      </div>
      <div className="store-score"><span>{t.communityRating}</span><strong>{store.platform.review_count?<Rating value={store.platform.average_rating}/>:'—'}</strong><small>{store.platform.review_count} {t.profileRatings.toLocaleLowerCase(locale)}</small></div>
      <div className="store-score"><span>{t.savedBy}</span><strong>{store.platform.favorite_count}</strong><small>{t.people}</small></div>
      <StoreActions storeId={store.id} name={store.name} latitude={store.latitude} longitude={store.longitude} initialFavorited={store.viewer_has_favorited} phone={store.phone}/>
      <section className="store-rating-breakdown" aria-labelledby="store-rating-title">
        <header><div><h2 id="store-rating-title">{scores.title}</h2><p>{scores.intro}</p></div><div className="store-rating-overall"><strong>{store.platform.review_count?formatScore(store.platform.average_rating):'—'}</strong>{store.platform.review_count?<><span className="store-rating-count">{store.platform.review_count} {t.reviewWord}</span><ReviewsJump label={scores.seeReviews}/></>:<small>{scores.empty}</small>}</div></header>
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
        {/* Said out loud, because the map pin and the distance look exactly as certain
            either way. A shop whose chain publishes no coordinate stands at the centre of
            the smallest place its address names -- right to a few hundred metres, not to
            the doorway -- and a reader who is not told that reads it as exact. */}
        {/* The store's own site belongs with the address: both say where the shop is, one on
            the ground and one online. A link, not a panel -- the frame around it made one
            line of text look like a section of its own. */}
        {store.website&&<a className="store-correction-link store-website-link" href={store.website} target="_blank" rel="noopener noreferrer">{t.storeWebsite}</a>}
        {store.location_approximate&&<p className="store-location-approximate">{t.approximateLocation}</p>}
        {/* ODbL, and it is a condition rather than a courtesy: a row read from the open map
            may be shown only where OpenStreetMap is credited. Attribution sits on the store
            itself, beside the address it describes, so it travels with the data. */}
        {store.external_sources?.some(source=>source.provider==='osm')&&<p className="store-location-approximate">{t.openMapCredit} <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">{t.openMapCreditLink}</a></p>}
        {/* Not the same kind of thing as the shop's own website above it: that opens a page to
            read, this opens a form to fill in. Drawn as the action it is, with the mark of
            editing on it. */}
        <Link className="store-correction-link" href={correctionPath}><PencilLine aria-hidden="true"/>{contribution.correction}</Link>
      </div>
      <div className="store-reviews" id="store-reviews-title" aria-label={t.community}>
        {/* No heading of its own. What is under here is plainly a row of reviews, and the
            score above already says how many there are; the sentence about verified visits
            that used to sit here went with it. The jump from the score needs something to
            land on, so the id moved to the section. */}
        {recent_posts.length?<ViewerLikes postIds={recent_posts.map(post=>post.id)}><div className="store-review-rail">{recent_posts.map(post=><PostCard post={post} surface="store" key={post.id}/>)}</div></ViewerLikes>:<div className="empty-state"><h3>{t.noCommunity}</h3><p>{t.noReviewsBody}</p></div>}
      </div>
    </section>
    <StoreNeighbours stores={neighbours} locale={locale} reviewWord={t.reviewWord}/>
    <TimedNudge kind="review" requireReviewFlag/>
  </main>;
}
