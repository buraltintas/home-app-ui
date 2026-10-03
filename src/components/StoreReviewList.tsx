'use client';

import {useMemo,useState} from 'react';
import {ArrowDownWideNarrow,Check,ChevronDown,ClipboardCheck,ShoppingBag} from 'lucide-react';
import {PostCard} from '@/components/PostCard';
import {useI18n} from '@/i18n/I18nProvider';
import {ViewerLikes} from '@/components/ViewerLikes';
import type {Locale,Post} from '@/lib/types';

type Order='newest'|'oldest'|'highest'|'lowest';
const ORDERS:Order[]=['newest','oldest','highest','lowest'];

const copy:Record<Locale,{total:string;sort:string;orders:Record<Order,string>;purchasedOnly:string;nonePurchased:string;capped:(n:number)=>string}>={
  tr:{total:'Toplam değerlendirme',sort:'Sıralama ölçütü',orders:{newest:'En yeni',oldest:'En eski',highest:'En yüksek puanlı',lowest:'En düşük puanlı'},purchasedOnly:'Alışveriş yapanları göster',nonePurchased:'Bu mağazada alışveriş yaptığını belirten bir değerlendirme henüz yok.',capped:n=>`En son ${n} değerlendirme gösteriliyor.`},
  en:{total:'Reviews in total',sort:'Sorted by',orders:{newest:'Newest',oldest:'Oldest',highest:'Highest rated',lowest:'Lowest rated'},purchasedOnly:'Show those who made a purchase',nonePurchased:'Nobody has said they made a purchase in a review of this store yet.',capped:n=>`Showing the most recent ${n} reviews.`},
  de:{total:'Bewertungen insgesamt',sort:'Sortiert nach',orders:{newest:'Neueste',oldest:'Älteste',highest:'Beste Bewertung',lowest:'Schlechteste Bewertung'},purchasedOnly:'Nur mit Einkauf anzeigen',nonePurchased:'In keiner Bewertung dieses Geschäfts wurde bisher ein Einkauf angegeben.',capped:n=>`Es werden die letzten ${n} Bewertungen angezeigt.`},
  ru:{total:'Всего отзывов',sort:'Сортировка',orders:{newest:'Сначала новые',oldest:'Сначала старые',highest:'С высокой оценкой',lowest:'С низкой оценкой'},purchasedOnly:'Показать отзывы с покупкой',nonePurchased:'В отзывах об этом магазине пока никто не указал покупку.',capped:n=>`Показаны последние ${n} отзывов.`},
};

const time=(post:Post)=>Date.parse(post.created_at);

// The order a reader asked for. Between two reviews with the same score the newer one comes
// first, because it says more about the shop as it is now.
function arrange(posts:Post[],order:Order,purchasedOnly:boolean):Post[]{
  const list=purchasedOnly?posts.filter(post=>post.purchased):[...posts];
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
  const {t}=useI18n();
  const [order,setOrder]=useState<Order>('newest');
  const [open,setOpen]=useState(false);
  const [purchasedOnly,setPurchasedOnly]=useState(false);
  const purchasedCount=useMemo(()=>posts.filter(post=>post.purchased).length,[posts]);
  const shown=useMemo(()=>arrange(posts,order,purchasedOnly),[posts,order,purchasedOnly]);
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
    {capped&&posts.length>=capped&&!purchasedOnly&&<p className="store-review-note" role="note">{text.capped(capped)}</p>}
    {/* R87: who bought something is a filter, not an order, so it left the order's list and
        stands over the reviews as a choice of its own -- the messages page's buttons, class
        for class, with how many it would show. Pressed again, it lets go. It applies on top
        of whichever order is chosen. */}
    {posts.length===0&&<div className="empty-state"><h2>{t('noCommunity')}</h2><p>{t('noReviewsBody')}</p></div>}
    {posts.length>0&&<div className="favorites-summary profile-message-filters store-review-filters">
      <button type="button" className={purchasedOnly?'is-showing':undefined} aria-pressed={purchasedOnly} onClick={()=>setPurchasedOnly(value=>!value)}>
        <span className="favorites-summary-mark" aria-hidden="true"><ShoppingBag/></span>
        <span className="favorites-summary-copy"><span>{text.purchasedOnly}</span><strong>{purchasedCount}</strong></span>
      </button>
    </div>}
    {purchasedOnly&&!shown.length&&<p className="store-review-note" role="status">{text.nonePurchased}</p>}
    {shown.length>0&&<ViewerLikes postIds={posts.map(post=>post.id)}>
      <div className="store-review-rail is-stacked">{shown.map(post=><PostCard post={post} surface="store" key={post.id}/>)}</div>
    </ViewerLikes>}
  </>;
}
