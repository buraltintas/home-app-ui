import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {RatingStars} from './Rating';
import {localePath,storePath} from '@/lib/site';
import {isBrandMark,storePhotoURL} from '@/lib/store-photo';
import type {NearbyStore} from '@/lib/server-api';
import type {Locale} from '@/lib/types';

// A store page used to end at its own reviews. Somebody who had read it and decided this
// was not the shop had the back button and nothing else, and a crawler had even less: the
// home page linked to no store page and no store page linked to another, so eleven
// thousand pages sat with nothing at all pointing at them.
//
// Rendered on the server, because a block that exists to be followed has to be in the
// document rather than fetched after it.
const copy:Record<Locale,{title:string;intro:string;away:string;noReviews:string}>={
  tr:{title:'Yakındaki benzer mağazalar',intro:'Aynı kategorilerde, buraya en yakın olanlar.',away:'uzakta',noReviews:'Henüz değerlendirilmemiş'},
  en:{title:'Similar stores nearby',intro:'The closest shops in the same categories.',away:'away',noReviews:'Not reviewed yet'},
  de:{title:'Ähnliche Geschäfte in der Nähe',intro:'Die nächstgelegenen Geschäfte derselben Kategorien.',away:'entfernt',noReviews:'Noch nicht bewertet'},
  ru:{title:'Похожие магазины рядом',intro:'Ближайшие магазины тех же категорий.',away:'от вас',noReviews:'Пока без оценок'},
};

// Metres up close, kilometres once metres stop being a number anybody pictures. The same
// rule the distance shown on a search result follows, so one shop is not described two
// ways on two screens.
function distance(meters:number,locale:Locale):string{
  return meters<1000
    ?`${Math.round(meters)} m`
    :`${(meters/1000).toLocaleString(locale,{maximumFractionDigits:1})} km`;
}

export function StoreNeighbours({stores,locale,reviewWord}:{stores:NearbyStore[];locale:Locale;reviewWord:string}){
  // No neighbours is an answer, not an empty shelf. A shop with nothing similar around it
  // renders nothing rather than a heading over a blank row.
  if(!stores.length)return null;
  const words=copy[locale];
  return <section className="store-neighbours" aria-labelledby="store-neighbours-title">
    <header><h2 id="store-neighbours-title">{words.title}</h2><p>{words.intro}</p></header>
    <ul>{stores.map(store=>{
      const photo=storePhotoURL(store.photo,160,store.name);
      return <li key={store.id}><Link href={localePath(locale,storePath(store))}>
        {photo
          ?<Image className={`store-neighbour-mark${isBrandMark(store.photo,store.name)?' is-brand-mark':''}`} src={photo} width={48} height={48} alt="" unoptimized/>
          :<span className="store-neighbour-mark is-empty" aria-hidden="true">{store.name.trim().charAt(0)}</span>}
        <span className="store-neighbour-copy">
          <strong>{store.name}</strong>
          <small>{[store.district,store.city].filter(Boolean).join(', ')} · {distance(store.distance_meters,locale)} {words.away}</small>
          {store.review_count
            ?<span className="store-neighbour-score"><RatingStars value={store.average_rating}/><small>{store.review_count} {reviewWord}</small></span>
            :<small className="store-neighbour-none">{words.noReviews}</small>}
        </span>
        <ArrowRight aria-hidden="true"/>
      </Link></li>;
    })}</ul>
  </section>;
}
