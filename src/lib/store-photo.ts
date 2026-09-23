import brandLogos from '../../public/brands/manifest.json';
import brandCategories from '../../public/brands/categories.json';
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

// Two tables, because they are two different strengths of evidence.
//
// A shop whose whole name is a chain's whole name has said who it is: "Enza Home" is Enza
// Home and there is nothing else it could be. A shop whose name is only the chain's *first*
// word has said much less -- "Cam" is a word before it is Cam Halı -- and that one needs
// something else to agree before it is allowed to wear the mark.
//
// A name two chains answer to is given to neither.
function table(pick:(whole:string)=>string){
  const claimed=new Map<string,string|null>();
  for(const slug of Object.keys(logos)){
    const key=pick(compact(slug.replace(/-/g,' ')));
    if(!key)continue;
    claimed.set(key,claimed.has(key)&&claimed.get(key)!==slug?null:slug);
  }
  return claimed;
}
const exactNames=table(whole=>whole);
const headWords=table(whole=>whole.split(' ')[0]);

// What each chain sells, so a name can be checked against more than itself.
const categories=brandCategories as Record<string,string[]>;

// The first word of a shop's name, matched against the first word of a chain's -- but only
// where the two sell the same kind of thing.
//
// The first word alone is not enough and the catalogue says so: "Cam Balkon" would take Cam
// Halı's mark, "Tepe Halı" would take Tepe Home's, "Konfor Mobilya" would take Konfor Yatak's.
// Those are four different companies that happen to open with a word somebody else also uses,
// and cam, tepe, mutlu and konfor are ordinary Turkish words before they are anybody's brand.
//
// What separates them is what they sell. A shop sharing a chain's first word *and* a category
// with it is that chain's; a glass-balcony fitter shares the word with a carpet maker and
// nothing else. The categories come from the same registry the marks do.
export function brandMarkForName(name:string|undefined,storeCategories?:string[]):string|undefined{
  if(!name)return undefined;
  const compacted=compact(name);
  const slug=exactNames.get(compacted)??corroborated(compacted,storeCategories);
  const file=slug?logos[slug]:undefined;
  return file?`/brands/${file}`:undefined;
}

// A first-word match, allowed only where the shop sells something the chain sells.
//
// This is the whole guard, and the catalogue is what decided its shape: "Cam" sells glassware
// and accessories while Cam Halı makes carpets, "Konfor Mobilya" sells furniture while Konfor
// Yatak makes beds, "Tepe Halı" is not Tepe Home. Each of those shares one ordinary Turkish
// word with a chain and nothing else, and each would have been handed somebody's trademark on
// the strength of that coincidence.
//
// Where a screen does not know what a shop sells, there is no corroboration to be had and the
// shop keeps its initial -- which is what it had before, and is the safe way to be wrong.
function corroborated(compacted:string,storeCategories:string[]|undefined):string|undefined{
  if(!storeCategories?.length)return undefined;
  const slug=headWords.get(compacted.split(' ')[0]);
  if(!slug)return undefined;
  const sells=categories[slug]??[];
  return storeCategories.some(category=>sells.includes(category))?slug:undefined;
}

export function storePhotoURL(photo:StoredPhoto|undefined,width=1200,name?:string,storeCategories?:string[]):string|undefined{
  if(photo?.source==='admin'&&photo.media_id)return `/api/media/${photo.media_id}`;
  if(photo?.source==='brand'&&photo.brand_slug){
    const file=logos[photo.brand_slug];
    if(file)return `/brands/${file}`;
  }
  if(photo?.source==='google'&&photo.name)return `/api/places/photo?name=${encodeURIComponent(photo.name)}&w=${width}`;
  return brandMarkForName(name,storeCategories);
}

// Whether the effective image is a chain's mark rather than a photograph of the shop. A
// mark is drawn contained and on a plain ground; a photograph fills its frame. Rendering
// one as the other is what makes a logo look like a mistake.
export function isBrandMark(photo:StoredPhoto|undefined,name?:string,storeCategories?:string[]):boolean{
  if(photo?.source==='brand')return true;
  // The picture only came from the name if nothing else supplied one.
  return !photo&&Boolean(brandMarkForName(name,storeCategories));
}
