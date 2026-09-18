import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {RatingStars} from './Rating';
import {localePath,storePath} from '@/lib/site';
import {isBrandMark,storePhotoURL} from '@/lib/store-photo';
import type {CatalogEntry} from '@/lib/server-api';
import type {Locale} from '@/lib/types';

// The row shared by every catalogue listing. A city-and-category page and a city-and-brand
// page ask different questions and say different things above the list, but the list itself
// is the same shop described the same way -- and a shop that looks like two different things
// on two pages of the same site is the kind of difference nobody intends and everybody sees.
export function CatalogList({items,locale,reviews,none}:{items:CatalogEntry[];locale:Locale;reviews:string;none:string}){
  return <ul className="catalog-list">{items.map(store=>{
    const photo=storePhotoURL(store.photo,160);
    return <li key={store.id}><Link href={localePath(locale,storePath(store))}>
      {photo
        ?<Image className={`catalog-mark${isBrandMark(store.photo)?' is-brand-mark':''}`} src={photo} width={56} height={56} alt="" unoptimized/>
        :<span className="catalog-mark is-empty" aria-hidden="true">{store.name.trim().charAt(0)}</span>}
      <span className="catalog-copy">
        <strong>{store.name}</strong>
        <small>{[store.district,store.city].filter(Boolean).join(', ')}</small>
        {store.category_labels.length>0&&<small className="catalog-categories">{store.category_labels.join(' · ')}</small>}
      </span>
      <span className="catalog-score">
        {store.review_count
          ?<><RatingStars value={store.average_rating}/><small>{store.review_count} {reviews}</small></>
          :<small className="catalog-none">{none}</small>}
      </span>
      <ArrowRight aria-hidden="true"/>
    </Link></li>;
  })}</ul>;
}

// Which page numbers to draw. Twenty-three links in a row is a wall; the first, the last,
// and a window around where the reader is says the same thing and can be read. The ellipsis
// is a gap in the numbers, not a control -- there is nothing to press, because everything
// worth pressing is already named.
function windowed(current:number,total:number):(number|'gap')[]{
  if(total<=7)return Array.from({length:total},(_,i)=>i+1);
  const near=[current-1,current,current+1].filter(n=>n>1&&n<total);
  const out:(number|'gap')[]=[1];
  if(near[0]>2)out.push('gap');
  out.push(...near);
  if(near[near.length-1]<total-1)out.push('gap');
  out.push(total);
  return out;
}

export function CatalogPagination({page,pages,locale,pathFor,words}:{
  page:number;pages:number;locale:Locale;pathFor:(page:number)=>string;
  words:{previous:string;next:string;pagination:string};
}){
  if(pages<2)return null;
  return <nav className="catalog-pages" aria-label={words.pagination}>
    {page>1&&<Link className="catalog-page-step" rel="prev" href={localePath(locale,pathFor(page-1))}>{words.previous}</Link>}
    <ol>{windowed(page,pages).map((entry,index)=>entry==='gap'
      ?<li key={`gap-${index}`} className="catalog-page-gap" aria-hidden="true">…</li>
      :<li key={entry}>{entry===page
        ?<span aria-current="page">{entry}</span>
        :<Link href={localePath(locale,pathFor(entry))}>{entry}</Link>}</li>)}</ol>
    {page<pages&&<Link className="catalog-page-step" rel="next" href={localePath(locale,pathFor(page+1))}>{words.next}</Link>}
  </nav>;
}
