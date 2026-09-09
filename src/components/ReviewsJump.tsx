'use client';

// The score and the reviews it is made of are at opposite ends of a long page. This is the
// way between them: it moves the reader to the reviews rather than describing where they
// are. Reduced-motion preferences are honoured by `scroll-behavior` in the stylesheet.
export function ReviewsJump({label}:{label:string}){
  const go=()=>{
    const target=document.getElementById('store-reviews-title');
    if(!target)return;
    target.scrollIntoView({behavior:'smooth',block:'start'});
    // Moving the page is not the same as moving the reading position. Anybody on a keyboard
    // or a screen reader has to arrive there too, so the heading takes focus.
    target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
  };
  return <button type="button" className="store-rating-jump" onClick={go}>{label}</button>;
}
