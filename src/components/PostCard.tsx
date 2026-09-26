'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Bookmark,ChevronRight,Heart,Info,MessageCircle,Package,Send,ShoppingBag,X} from 'lucide-react';
import {useState} from 'react';
import type {Post,ReviewCriteriaScores} from '@/lib/types';
import {useI18n} from '@/i18n/I18nProvider';
import { localePath } from '@/lib/site';
import {apiFetch} from '@/lib/api-client';
import {RatingStars,Verified} from './Rating';
import {AuthDialog} from './AuthDialog';
import {ContributorLevel} from './ContributorLevel';
import {useViewerLiked} from './ViewerLikes';
import {storePhotoURL} from '@/lib/store-photo';

// `owned` is the profile's view of your own reviews. Saving a store you have already
// reviewed is not an action anybody needs there, and deleting what you wrote is -- so the
// control in that corner changes rather than being added beside a useless one.
// Where the card is standing. On a store's own page the store is the page, so the card
// drops everything that repeats it -- the store's name, the store's photo -- and everything
// that sends the reader somewhere else: saving the review, opening its comments, the
// written text. What is left is the judgement: who, what they scored it, when.
// The eight questions in the order the review form asks them, paired with the dictionary
// key that names each one. One list, so the review and the form can never disagree.
// Each row carries the name the API files a note under as well as the name the dictionary
// reads, because the two are different and the note has to find its own heading.
const criteriaRows=(c:ReviewCriteriaScores)=>[
  ['criterionAvailability',c.availability,'availability'],
  ['criterionValue',c.value,'value'],
  ['criterionLayout',c.layout,'layout'],
  ['criterionStaffCare',c.staff_care,'staff_care'],
  ['criterionStaffKnowledge',c.staff_knowledge,'staff_knowledge'],
  ['criterionCheckout',c.checkout,'checkout'],
  ['criterionReturns',c.returns,'returns'],
  ['criterionCleanliness',c.cleanliness,'cleanliness'],
] as const;

// A one or a two is the score the reader most wants explained, so it is marked and its
// explanation is one tap away rather than folded into a paragraph somewhere else.
const LOW_SCORE=2;

type PostSurface='feed'|'store';
type PostCardProps={post:Post;surface?:PostSurface;owned?:boolean;onDeleted?:()=>void};

export function PostCard({post,surface='feed',owned=false,onDeleted}:PostCardProps){
  const onStorePage=surface==='store';
  const {t,locale}=useI18n();
  const [auth,setAuth]=useState(false);
  // The markup says whether this reader liked it only on a page rendered for this reader.
  // On a cached one it cannot, so the reader's own answer arrives after the page does and
  // turns the card on; until then, and whenever nobody is signed in, the rendered state
  // stands.
  const own=useViewerLiked(post.id);
  const [liked,setLiked]=useState(post.viewer_has_liked);
  const [touched,setTouched]=useState(false);
  const showLiked=touched?liked:liked||own;
  const [saved,setSaved]=useState(post.viewer_has_favorited_store);
  const [busy,setBusy]=useState<'like'|'save'|null>(null);
  const [shared,setShared]=useState(false);
  const [removing,setRemoving]=useState(false);
  const [removeFailed,setRemoveFailed]=useState(false);
  // Which low score is showing its reason. One at a time: the rows are narrow and a card
  // with every note open is a wall of text where a table was.
  // A set, not one field. Each low score can carry its own explanation, and a reader
  // weighing two of them against each other had to close the first to see the second.
  const [openNotes,setOpenNotes]=useState<ReadonlySet<string>>(()=>new Set());
  const toggleNote=(field:string)=>setOpenNotes(current=>{
    const next=new Set(current);
    if(!next.delete(field))next.add(field);
    return next;
  });
  // Why a heading is marked, opened from the mark itself. It arrives and leaves on the same
  // curve and at the same 0.52s as every other sheet in this product; three panels at three
  // speeds read as three products.
  const [ruleOpen,setRuleOpen]=useState(false);
  const [ruleLeaving,setRuleLeaving]=useState(false);
  const closeRule=()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setRuleOpen(false);return;}
    setRuleLeaving(true);
    window.setTimeout(()=>{setRuleOpen(false);setRuleLeaving(false);},520);
  };

  // The shop answers to its slug and to its uuid, and its page names the slug as canonical.
  // Linking by uuid pointed every review on the site at the copy rather than the original.
  const storeRef=post.store_slug||post.store_id;

  const remove=async()=>{
    if(removing||!window.confirm(t('confirmDeleteReview')))return;
    setRemoving(true);setRemoveFailed(false);
    try{
      const response=await apiFetch(`/api/proxy/posts/${post.id}`,{method:'DELETE'});
      if(!response.ok)throw new Error();
      onDeleted?.();
    }catch{
      // A failure used to reset the button and say nothing, which from the outside is
      // indistinguishable from a button that does nothing at all -- and that is how it was
      // reported. Whatever went wrong, the person now sees that something did.
      setRemoveFailed(true);setRemoving(false);
    }
  };

  const mutate=async(kind:'like'|'save')=>{
    const active=kind==='like'?showLiked:saved;
    setBusy(kind);
    try{
      const path=kind==='like'?`/api/proxy/posts/${post.id}/like`:`/api/proxy/stores/${post.store_id}/favorite`;
      const response=await apiFetch(path,{method:active?'DELETE':'POST'});
      if(response.status===401){setAuth(true);return;}
      if(!response.ok)throw new Error();
      // Once the reader has pressed it, what they pressed is the answer -- the state that
      // arrived from the server a moment ago must not turn it back on.
      if(kind==='like'){setLiked(!active);setTouched(true);}else setSaved(!active);
    }finally{setBusy(null);}
  };

  // Feed shares lead to the store, not to a person's review. This keeps private-looking
  // review copy and the author's name out of messaging previews and matches store sharing.
  const share=async()=>{
    const url=new URL(localePath(locale,`/stores/${storeRef}`),window.location.origin).toString();
    const payload={title:post.store_name,text:'Boşa Gezme! Bize Sor.',url};
    try{
      if(navigator.share){await navigator.share(payload);return;}
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(()=>setShared(false),2000);
    }catch{/* the person dismissed the sheet, which is not a failure */}
  };

  const place=[post.store_district,post.store_city].filter(Boolean).join(', ');
  // Authored review media remains primary. Without it, the card uses the exact same store
  // cover as search and detail; that fallback opens the store, where Google credit is shown.
  const storePhoto=storePhotoURL(post.store_photo,960,post.store_name);
  // The same mark the search results and the saved list draw, at the same size. Small, because
  // it identifies the shop rather than showing it.
  const storeMark=storePhotoURL(post.store_photo,320,post.store_name);
  const hasPhoto=Boolean(!onStorePage&&!owned&&storePhoto);
  // A date without its year answers "which day" and not "which year", and a review list
  // that goes back further than twelve months needs both.
  const written=new Intl.DateTimeFormat(locale,{day:'numeric',month:'short',year:'numeric'}).format(new Date(post.created_at));
  const likes=post.like_count+(showLiked&&!post.viewer_has_liked?1:!showLiked&&post.viewer_has_liked?-1:0);

  return <article className={`post-card${owned?' is-owned':''}${hasPhoto?'':' is-photo-free'}`}>
    <div className="post-number" aria-hidden="true">BG/{new Intl.DateTimeFormat(locale,{month:'2-digit',day:'2-digit'}).format(new Date(post.created_at)).replace(/\D/g,'')}</div>
    <div className="post-heading">
      {!owned&&<header className="post-author">
        <div className="avatar">{post.display_name.slice(0,1).toLocaleUpperCase(locale)}</div>
        {/* One line, and both halves have to survive it. The name is cut with an ellipsis
            rather than pushing the badge it earned off the end of the card; the badge drops
            its "3. Seviye" caption in the store page's narrow cards, where the badge's own
            name already says which level it is and the caption was eating the name. */}
        <div><strong><span className="post-author-name">{post.display_name}</span>{!onStorePage&&<ContributorLevel level={post.author_level} withNumber/>}</strong>{onStorePage?<ContributorLevel level={post.author_level} withNumber/>:<span>{written}</span>}</div>
        {!onStorePage&&<button className="icon-button" disabled={busy==='save'} aria-label={t('save')} aria-pressed={saved} onClick={()=>void mutate('save')}><Bookmark className={saved?'active-icon':''}/></button>}
      </header>}
      {/* The shop's mark beside its name, in the frame the listing uses. On your own reviews
          the name was the only thing identifying the shop, and a name is what you read second
          -- the mark is what you recognise. A shop that is nobody's branch shows its initial
          in the same frame, so the list keeps one shape down its length. */}
      {!onStorePage&&<Link href={localePath(locale,`/stores/${storeRef}`)} className="post-store">
        <span className="post-store-mark">{storeMark
          ?<Image className="result-photo-mark is-brand-mark" src={storeMark} width={184} height={184} alt="" unoptimized/>
          :<span className="result-photo-empty" aria-hidden="true"><span>{post.store_name.trim().charAt(0).toLocaleUpperCase(locale)}</span></span>}</span>
        <span className="post-store-identity"><h2>{post.store_name}</h2>{place&&<p>{place}</p>}</span>
        <ChevronRight className="post-store-go" aria-hidden="true"/>
      </Link>}
    </div>

    {storePhoto&&!onStorePage&&!owned
      ?<Link href={localePath(locale,`/stores/${storeRef}`)} className="post-photo"><Image src={storePhoto} fill sizes="(max-width: 760px) 100vw, 760px" alt={post.store_name} unoptimized/></Link>
      :!onStorePage&&!owned?<Link href={localePath(locale,`/reviews/${post.id}`)} className="post-photo is-empty"><span aria-hidden="true">{post.store_name.slice(0,2).toLocaleUpperCase(locale)}</span><small>{t('noPhoto')}</small></Link>:null}

    <div className="post-details">
      {/* The date rides with the score, and the badges stand under it. They were the other
          way round, which put a green claim about the visit level with the figure and left
          the date -- the thing a reader checks first on a review -- on a line of its own
          below. What the review is worth is a stack of claims; when it was written is not
          one of them, it is a label on the whole thing. */}
      <div className="post-meta"><RatingStars value={post.rating}/><span className="post-written">{written}</span></div>
      {owned&&<button type="button" className="post-delete" disabled={removing} onClick={()=>void remove()}>{t('deleteReview')}</button>}
      <div className="post-claims">
        <Verified label={t('verified')}/>
        {/* Only where the shopper answered yes and named what they bought. "Yes" on its own
            is a claim with nothing behind it, and the product is what makes it checkable --
            so the badge and the thing bought arrive together or not at all. */}
        {post.purchased&&post.purchased_item&&<>
          <span className="post-purchased"><ShoppingBag aria-hidden="true"/>{t('purchaseMade')}</span>
          {/* "Bought:" is the claim, so it is the badge; what was bought is the shopper's own
              words and stays in the page's own ink. Colouring both would have made the
              product name look like a second claim we were standing behind. */}
          <span className="post-purchased-item"><span className="post-purchased-tag"><Package aria-hidden="true"/>{t('purchasedLabel')}:</span> <strong>{post.purchased_item}</strong></span>
        </>}
      </div>
      {/* The score is an average of eight answers, and the eight are what somebody reading
          a review actually wants: a four out of five means one thing when the staff carried
          it and another when the prices did. Reviews written before the criteria existed
          have nothing to open, so they show nothing rather than a row of dashes. */}
      {post.criteria&&<details className="post-criteria">
        <summary>{t('seeScoreDetail')}</summary>
        <dl>{criteriaRows(post.criteria).map(([key,value,field])=>{
          const label=t(key);
          const split=key==='criterionValue'?label.split('/'):[];
          const low=value<=LOW_SCORE;
          // Written at the time, against this heading. Reviews from before the form asked
          // for one are marked but have nothing to open, which is honest: the score was low
          // and nobody was asked why.
          const note=post.criterion_notes?.[field];
          const shown=openNotes.has(field);
          return <div key={key} className={low?'is-low':undefined}>
            <dt><span className="criterion-name">{split.length===2?<>{split[0]}/<span>{split[1]}</span></>:label}</span></dt>
            <dd><RatingStars value={value} showValue={false}/><span>{value}</span></dd>
            {low&&<div className="criterion-detail">
              {/* The mark sits beside the way out rather than beside the heading: it is a
                  note about this score, and the reader meets it at the moment they are
                  deciding whether to open the reason. It answers for itself now -- a sign
                  nobody can ask about is a sign that has to be guessed at. */}
              {note&&<button type="button" className="criterion-detail-open" aria-expanded={shown} onClick={()=>toggleNote(field)}>{shown?t('hideDetail'):t('seeDetail')}</button>}
              <button type="button" className="criterion-warn-button" aria-label={t('whyWarning')} onClick={()=>setRuleOpen(true)}><Info aria-hidden="true"/></button>
              {shown&&note&&<p>{note}</p>}
            </div>}
          </div>;
        })}</dl>
      </details>}
      {/* A review is eight scores now. The written text and the photographs people uploaded
          are still in the database, untouched -- they are simply no longer shown. One line
          brings them back if that decision changes. */}
      {/* On the store's own page these go: liking and sharing a single review are things
          you do in the feed, and in a row of narrow cards under the score table they read
          as chrome on top of the one thing the card is there to say. */}
      {/* R47: on your own reviews there is one action and it is not liking or sharing your
          own writing. Liking and commenting are things other people do with it; sharing is
          a thing the shop's page already offers. What is left is the one thing only you
          can do, spelled out rather than drawn, under the date it belongs to. */}
      {!onStorePage&&!owned&&<footer className="post-actions">
        <button disabled={busy==='like'} aria-pressed={showLiked} onClick={()=>void mutate('like')}><Heart className={showLiked?'active-icon':''}/>{likes}</button>
        <Link href={localePath(locale,`/reviews/${post.id}`)} className="post-action-link"><MessageCircle/>{post.comment_count}</Link>
        <button onClick={()=>void share()}><Send/>{shared?t('copied'):t('share')}</button>
      </footer>}
      {removeFailed&&<p className="form-error" role="alert">{t('deleteReviewFailed')}</p>}
    </div>
    <AuthDialog open={auth} onClose={()=>setAuth(false)}/>
    {ruleOpen&&<div className="dialog-backdrop add-store-backdrop" data-state={ruleLeaving?'leaving':'visible'} role="presentation"
      onMouseDown={event=>{if(event.target===event.currentTarget)closeRule();}}>
      <div className="add-store-sheet criterion-rule-sheet" role="dialog" aria-modal="true" aria-labelledby={`criterion-rule-${post.id}`}>
        <header>
          <h3 id={`criterion-rule-${post.id}`}>{t('lowScoreRuleTitle')}</h3>
          <button type="button" className="icon-button" aria-label={t('close')} onClick={closeRule}><X aria-hidden="true"/></button>
        </header>
        <p>{t('lowScoreRule')}</p>
      </div>
    </div>}
  </article>;
}
