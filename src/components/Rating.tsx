import {Check,Star} from 'lucide-react';
export function Rating({value}:{value:number}){return <span className="rating"><Star aria-hidden="true"/> {value.toFixed(1)}</span>}
export function RatingStars({value}:{value:number}){
  const filled=Math.max(0,Math.min(5,Math.round(value)));
  return <span className="rating-stars" aria-label={`${value.toFixed(1)} / 5`}>
    {[1,2,3,4,5].map(star=><Star key={star} aria-hidden="true" className={star<=filled?'is-filled':undefined}/>)}
    <span>{value.toFixed(1)}</span>
  </span>;
}
export function Verified({label}:{label:string}){return <span className="verified"><Check aria-hidden="true"/> {label}</span>}
