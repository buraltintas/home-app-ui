'use server';

import {updateTag} from 'next/cache';
import {storeTag} from './server-api';

// Drop one shop's page from the cache the moment somebody changes what it says.
//
// A store page is cached for a day, which is right for a page that is mostly an address and
// mostly does not change -- and wrong for the moment a review lands on it. The day is only
// affordable because of this: every change to a store page that this application can see
// drops it here, so the expiry is a backstop rather than the mechanism. The reviewer
// was sent back to the shop and could not see what they had just written: the page they
// arrived at had been rendered before they wrote it, and stayed that way until it expired.
// The count beside the rating was one short for the same reason.
//
// updateTag rather than revalidateTag, and that is the whole point: revalidateTag marks the
// entry stale and serves the stale copy while fetching a fresh one in the background, so the
// reviewer would still land on a page without their review on it. updateTag expires it, and
// the next request waits for the real thing. This is the read-your-own-writes case that
// distinction exists for.
//
// One shop, not the route. Revalidating `/stores/[id]` as a pattern would clear eleven
// thousand prerendered pages every time anybody reviewed anything.
const REF=/^[a-z0-9][a-z0-9-]{2,120}$/i;

export async function refreshStorePage(...refs:(string|undefined)[]){
  // The route answers to either the id or the slug, and they are two cache entries, so both
  // are dropped. A reference that is not one of those shapes is ignored rather than refused:
  // failing to refresh a page must never be able to fail the review that was just written.
  for(const ref of refs){
    const value=(ref??'').trim();
    if(REF.test(value))updateTag(storeTag(value));
  }
}
