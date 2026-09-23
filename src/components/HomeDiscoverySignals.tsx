import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {RatingStars} from './Rating';
import {getHomeSignals} from '@/lib/server-api';
import {getDictionary} from '@/i18n/dictionaries';
import {localePath,storePath} from '@/lib/site';
import {isBrandMark,storePhotoURL} from '@/lib/store-photo';
import type {Locale,StoreHighlight} from '@/lib/types';
import {homeSignalsCopy} from '@/content/home';

// This block was a client component that fetched in an effect, and the cost was invisible
// until somebody counted: the home page shipped zero links to any store page. The links
// were written, they simply were not in the document -- so the strongest page on the site
// passed its standing to nothing, and eleven thousand store pages had nothing pointing at
// them but a sitemap. Reading on the server puts them in the HTML.

function HighlightLink({item,locale,label,metric}:{item:StoreHighlight;locale:Locale;label:string;metric:string}){
  const place=[item.district,item.city].filter(Boolean).join(', ');
  const photo=storePhotoURL(item.photo,520,item.name,item.categories);
  return <Link className="store-highlight" href={localePath(locale,storePath(item))}>
    {photo
      ?<Image className={`store-highlight-photo${isBrandMark(item.photo,item.name,item.categories)?' is-brand-mark':''}`} src={photo} width={72} height={72} alt="" unoptimized/>
      :<span className="store-highlight-photo store-highlight-photo-empty" aria-hidden="true">{item.name.trim().charAt(0)}</span>}
    <span className="store-highlight-copy">
      <span>{label}</span>
      <strong>{item.name}</strong>
      {place&&<small className="store-highlight-place">{place}</small>}
      <small className="store-highlight-metric">{metric}</small>
    </span>
    <ArrowRight aria-hidden="true"/>
  </Link>;
}

export async function HomeDiscoverySignals({locale}:{locale:Locale}){
  const t=getDictionary(locale);
  const copy=homeSignalsCopy[locale];
  const {highlights,cities,categories}=await getHomeSignals(locale);
  const recent=highlights.recent??[];
  const standouts=[
    highlights.rating_gainer&&<HighlightLink key="rating" locale={locale} item={highlights.rating_gainer} label={t.mostImproved} metric={`+${(highlights.rating_gainer.rating_increase??0).toLocaleString(locale,{maximumFractionDigits:2})} ${t.ratingIncrease}`}/>,
    highlights.most_reviewed&&<HighlightLink key="reviews" locale={locale} item={highlights.most_reviewed} label={t.mostReviewed} metric={`${highlights.most_reviewed.recent_review_count.toLocaleString(locale)} ${t.reviewsThisMonth}`}/>,
  ].filter(Boolean);
  if(!standouts.length&&!recent.length&&!cities.length&&!categories.length)return null;

  return <section className="home-signals" aria-labelledby="home-signals-title">
    <header><h2 id="home-signals-title">{copy.title}</h2><p>{copy.intro}</p></header>
    {standouts.length>0&&<div className="home-signal-stores"><h3>{t.monthlyStandouts} <small>{t.lastMonth}</small></h3><div>{standouts}</div></div>}
    {/* Recently reviewed, which is a fact about time rather than a ranking. It is here so
        the page has somewhere true to point on a day when no shop has crossed the standout
        threshold -- which, while every reviewed shop has exactly one reviewer, is every day. */}
    {recent.length>0&&<div className="home-signal-recent">
      <h3>{copy.recent} <small>{copy.recentIntro}</small></h3>
      <ul>{recent.map(store=>{
        const photo=storePhotoURL(store.photo,160,store.name,store.categories);
        // How many people, not how many reviews. One person who wrote fourteen times is
        // one opinion, and the page says so rather than counting to fourteen.
        const people=store.reviewer_count??0;
        return <li key={store.id}><Link href={localePath(locale,storePath(store))}>
          {photo
            ?<Image className={`home-recent-mark${isBrandMark(store.photo,store.name,store.categories)?' is-brand-mark':''}`} src={photo} width={40} height={40} alt="" unoptimized/>
            :<span className="home-recent-mark is-empty" aria-hidden="true">{store.name.trim().charAt(0)}</span>}
          <span className="home-recent-copy">
            <strong>{store.name}</strong>
            <small>{[store.district,store.city].filter(Boolean).join(', ')}</small>
          </span>
          <span className="home-recent-score">
            <RatingStars value={store.average_rating}/>
            <small>{people===1?copy.onePerson:`${people.toLocaleString(locale)} ${copy.people}`}</small>
          </span>
        </Link></li>;
      })}</ul>
    </div>}
    <div className="home-signal-rankings">
      {cities.length>0&&<section><h3>{copy.cities}</h3><ol>{cities.map((item,index)=><li key={item.name}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.name}</strong><small>{item.search_count.toLocaleString(locale)} {copy.searches}</small></li>)}</ol></section>}
      {categories.length>0&&<section><h3>{copy.categories}</h3><ol>{categories.map((item,index)=><li key={item.slug}><span>{String(index+1).padStart(2,'0')}</span><Link href={`${localePath(locale,'/discover')}?q=${encodeURIComponent(item.name)}`}>{item.name}</Link><small>{item.search_count.toLocaleString(locale)} {copy.searches}</small></li>)}</ol></section>}
    </div>
  </section>;
}
