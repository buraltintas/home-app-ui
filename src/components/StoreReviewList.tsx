'use client';

import {useMemo,useState} from 'react';
import {ArrowDownWideNarrow,Check,ChevronDown,ClipboardCheck} from 'lucide-react';
import {PostCard} from '@/components/PostCard';
import {ViewerLikes} from '@/components/ViewerLikes';
import type {Locale,Post} from '@/lib/types';

type Order='newest'|'oldest'|'highest'|'lowest'|'purchased';
const ORDERS:Order[]=['newest','oldest','highest','lowest','purchased'];

const copy:Record<Locale,{total:string;sort:string;orders:Record<Order,string>;purchased:(n:number)=>string;nonePurchased:string;capped:(n:number)=>string}>={
  tr:{total:'Toplam değerlendirme',sort:'Sıralama ölçütü',orders:{newest:'En yeni',oldest:'En eski',highest:'En yüksek puanlı',lowest:'En düşük puanlı',purchased:'Alışveriş yapanlar'},purchased:n=>`Alışveriş yaptığını belirten ${n} değerlendirme gösteriliyor.`,nonePurchased:'Bu mağazada alışveriş yaptığını belirten bir değerlendirme henüz yok.',capped:n=>`En son ${n} değerlendirme gösteriliyor.`},
  en:{total:'Reviews in total',sort:'Sorted by',orders:{newest:'Newest',oldest:'Oldest',highest:'Highest rated',lowest:'Lowest rated',purchased:'Made a purchase'},purchased:n=>`Showing ${n} reviews from people who made a purchase.`,nonePurchased:'Nobody has said they made a purchase in a review of this store yet.',capped:n=>`Showing the most recent ${n} reviews.`},
  de:{total:'Bewertungen insgesamt',sort:'Sortiert nach',orders:{newest:'Neueste',oldest:'Älteste',highest:'Beste Bewertung',lowest:'Schlechteste Bewertung',purchased:'Mit Einkauf'},purchased:n=>`${n} Bewertungen von Personen mit Einkauf werden angezeigt.`,nonePurchased:'In keiner Bewertung dieses Geschäfts wurde bisher ein Einkauf angegeben.',capped:n=>`Es werden die letzten ${n} Bewertungen angezeigt.`},
  ru:{total:'Всего отзывов',sort:'Сортировка',orders:{newest:'Сначала новые',oldest:'Сначала старые',highest:'С высокой оценкой',lowest:'С низкой оценкой',purchased:'С покупкой'},purchased:n=>`Показаны отзывы с покупкой: ${n}.`,nonePurchased:'В отзывах об этом магазине пока никто не указал покупку.',capped:n=>`Показаны последние ${n} отзывов.`},
};

const time=(post:Post)=>Date.parse(post.created_at);

// The order a reader asked for. Between two reviews with the same score the newer one comes
// first, because it says more about the shop as it is now.
function arrange(posts:Post[],order:Order):Post[]{
  const list=order==='purchased'?posts.filter(post=>post.purchased):[...posts];
  if(order==='oldest')return list.sort((a,b)=>time(a)-time(b));
  if(order==='highest')return list.sort((a,b)=>b.rating-a.rating||time(b)-time(a));
  if(order==='lowest')return list.sort((a,b)=>a.rating-b.rating||time(b)-time(a));
  return list.sort((a,b)=>time(b)-time(a));
}

// R83: every review of one shop, in the order the reader picks. The two tiles at the top are
// the listing page's own pair -- how many, and in what order -- and the second is a button
// here because the order can be changed. Its choices open in place, under the tiles, rather
// than floating over the page: a list that pushes the reviews down needs no layer of its
// own and cannot end up under anything.
export function StoreReviewList({posts,locale,capped}:{posts:Post[];locale:Locale;capped?:number}){
  const text=copy[locale];
  const [order,setOrder]=useState<Order>('newest');
  const [open,setOpen]=useState(false);
  const shown=useMemo(()=>arrange(posts,order),[posts,order]);
  return <>
    <div className="result-count store-review-summary">
      <div className="result-count-total"><span className="result-count-mark" aria-hidden="true"><ClipboardCheck/></span><dl><dt>{text.total}</dt><dd>{posts.length}</dd></dl></div>
      <button type="button" className="result-count-sort store-review-sort" aria-expanded={open} aria-controls="store-review-orders" onClick={()=>setOpen(value=>!value)}>
        <span className="result-count-mark" aria-hidden="true"><ArrowDownWideNarrow/></span>
        <span className="store-review-sort-copy"><span className="result-count-label">{text.sort}</span><span className="result-count-value">{text.orders[order]}</span></span>
        <ChevronDown className="store-review-sort-caret" aria-hidden="true"/>
      </button>
    </div>
    {open&&<div id="store-review-orders" className="store-review-orders" role="radiogroup" aria-label={text.sort}>
      {ORDERS.map(option=><button key={option} type="button" role="radio" aria-checked={option===order} onClick={()=>{setOrder(option);setOpen(false);}}>
        <span>{text.orders[option]}</span>{option===order&&<Check aria-hidden="true"/>}
      </button>)}
    </div>}
    {capped&&posts.length>=capped&&<p className="store-review-note" role="note">{text.capped(capped)}</p>}
    {order==='purchased'&&<p className="store-review-note">{shown.length?text.purchased(shown.length):text.nonePurchased}</p>}
    {shown.length>0&&<ViewerLikes postIds={shown.map(post=>post.id)}>
      <div className="store-review-rail is-stacked">{shown.map(post=><PostCard post={post} surface="store" key={post.id}/>)}</div>
    </ViewerLikes>}
  </>;
}
