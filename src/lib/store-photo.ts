import type {StoredPhoto} from './types';

// The backend resolves the business rule; clients only turn the effective photo into a
// same-origin URL. This keeps search, store detail and feed from choosing different sources.
export function storePhotoURL(photo:StoredPhoto|undefined,width=1200):string|undefined{
  if(photo?.source==='admin'&&photo.media_id)return `/api/media/${photo.media_id}`;
  if(photo?.source==='google'&&photo.name)return `/api/places/photo?name=${encodeURIComponent(photo.name)}&w=${width}`;
}
