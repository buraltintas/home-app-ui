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

export function storePhotoURL(photo:StoredPhoto|undefined,width=1200):string|undefined{
  if(photo?.source==='admin'&&photo.media_id)return `/api/media/${photo.media_id}`;
  if(photo?.source==='brand'&&photo.brand_slug){
    const file=logos[photo.brand_slug];
    return file?`/brands/${file}`:undefined;
  }
  if(photo?.source==='google'&&photo.name)return `/api/places/photo?name=${encodeURIComponent(photo.name)}&w=${width}`;
}

// Whether the effective image is a chain's mark rather than a photograph of the shop. A
// mark is drawn contained and on a plain ground; a photograph fills its frame. Rendering
// one as the other is what makes a logo look like a mistake.
export function isBrandMark(photo:StoredPhoto|undefined):boolean{
  return photo?.source==='brand';
}
