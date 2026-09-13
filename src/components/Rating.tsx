import {Check,Star} from 'lucide-react';
export function Rating({value}:{value:number}){return <span className="rating"><Star aria-hidden="true"/> {value.toFixed(1)}</span>}
// A rounded star cannot say 3.5, and rounding it to four overstates the store by half a
// point on every average that lands between two whole numbers -- which most of them do.
// Each star is drawn twice: an empty one, and a filled one revealed from the left by
// exactly the fraction this star is worth. Whole, half or any part between.

// The fraction is of the star, not of the box it sits in. A star's silhouette starts two
// units into a twenty-four unit box and ends two before the other side, so revealing "20% of
// the box" showed 3.6 px of mostly empty corner and the star read as not filled at all --
// which is what was reported for a shop averaging 3.2. Measured across the ink instead, a
// fifth of a star is a fifth of the shape somebody can see.
const INK_START=2,INK_WIDTH=20,BOX=24;
const inked=(fraction:number)=>(INK_START+INK_WIDTH*fraction)/BOX;
export function RatingStars({value,showValue=true}:{value:number;showValue?:boolean}){
  const score=Math.max(0,Math.min(5,value));
  return <span className="rating-stars" aria-label={`${value.toFixed(1)} / 5`}>
    {[1,2,3,4,5].map(star=>{
      const fill=Math.max(0,Math.min(1,score-(star-1)));
      return <span className="rating-star" key={star} aria-hidden="true">
        <Star/>
        {fill>0&&<span className="rating-star-fill" style={{width:`${inked(fill)*100}%`}}><Star className="is-filled"/></span>}
      </span>;
    })}
    {showValue&&<span>{value.toFixed(1)}</span>}
  </span>;
}
export function Verified({label}:{label:string}){return <span className="verified"><Check aria-hidden="true"/> {label}</span>}
