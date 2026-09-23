import brandLogos from '../../public/brands/manifest.json';
import type {StoredPhoto} from './types';

// The backend resolves the business rule; clients only turn the effective photo into a
// same-origin URL. This keeps search, store detail and feed from choosing different sources.
//
// A brand mark is a static file rather than an upload: it is public, it identifies the
// chain, and it never changes, so it needs no media row, no signed URL and no storage bill.
// The manifest is written by the tool that collects the marks and lists what is actually on
// disk -- a brand whose mark turned out to be a banner and was deleted disappears from here
// too, and its stores fall back to their initial.
const logos=brandLogos as Record<string,string>;

// A shop that calls itself by a chain's name wears that chain's mark.
//
// The mark normally arrives with the shop, because the shop came out of a chain's own
// published list and is therefore one of its branches. A dealer is not on that list -- chains
// publish their branches, not the shops that stock them -- so it arrived some other way, has
// no chain attached, and had nothing to show but its initial. Two shops trading under the
// same sign, one with the sign and one without.
//
// Wearing a mark and being a branch are different claims, and this is deliberately only the
// first: nothing here touches the chain the shop belongs to, so a dealer still does not
// appear on that chain's pages or in its count. It only stops the picture being missing.
//
// The match has to be the shop's *whole* name, against the chain's name or the first word of
// it. That is the line between "this shop is called Yataş" and "this shop has the word yataş
// somewhere in a long title" -- and the second is not evidence of anything. Anything looser
// puts somebody else's trademark on a shop that merely shares a word, which is a mistake this
// product has already made once.
const TURKISH=new Map(Object.entries({'ı':'i','İ':'i','ş':'s','Ş':'s','ğ':'g','Ğ':'g','ü':'u','Ü':'u','ö':'o','Ö':'o','ç':'c','Ç':'c','â':'a','î':'i','û':'u'}));

function compact(value:string):string{
  return [...value.toLowerCase()].map(character=>TURKISH.get(character)??character).join('')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,' ').trim();
}

// Built once from the marks that are actually on disk: a chain with no mark has nothing to
// lend, and a name that two chains answer to is given to neither.
const marksByName=(()=>{
  const claimed=new Map<string,string|null>();
  const claim=(name:string,slug:string)=>{
    if(!name)return;
    claimed.set(name,claimed.has(name)&&claimed.get(name)!==slug?null:slug);
  };
  for(const slug of Object.keys(logos)){
    const whole=compact(slug.replace(/-/g,' '));
    claim(whole,slug);
    claim(whole.split(' ')[0],slug);
  }
  return claimed;
})();

export function brandMarkForName(name:string|undefined):string|undefined{
  const slug=name?marksByName.get(compact(name)):undefined;
  const file=slug?logos[slug]:undefined;
  return file?`/brands/${file}`:undefined;
}

export function storePhotoURL(photo:StoredPhoto|undefined,width=1200,name?:string):string|undefined{
  if(photo?.source==='admin'&&photo.media_id)return `/api/media/${photo.media_id}`;
  if(photo?.source==='brand'&&photo.brand_slug){
    const file=logos[photo.brand_slug];
    if(file)return `/brands/${file}`;
  }
  if(photo?.source==='google'&&photo.name)return `/api/places/photo?name=${encodeURIComponent(photo.name)}&w=${width}`;
  return brandMarkForName(name);
}

// Whether the effective image is a chain's mark rather than a photograph of the shop. A
// mark is drawn contained and on a plain ground; a photograph fills its frame. Rendering
// one as the other is what makes a logo look like a mistake.
export function isBrandMark(photo:StoredPhoto|undefined,name?:string):boolean{
  if(photo?.source==='brand')return true;
  // The picture only came from the name if nothing else supplied one.
  return !photo&&Boolean(brandMarkForName(name));
}
