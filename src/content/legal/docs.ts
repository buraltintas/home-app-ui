import type {LegalDoc} from './types';
import {about} from './about';
import {accountDeletion} from './account-deletion';
import {kvkkAydinlatma} from './kvkk-aydinlatma';
import {locationPrivacy} from './location-privacy';
import {privacy} from './privacy';
import {terms} from './terms';
import {childrenPrivacy,commercialCommunications,contact,cookies,kvkkBasvuru,reportContent} from './trust';

// Every legal and informational document in one list, so anything that needs to ask a
// question about all of them -- the sitemap asking when each was last edited -- does not
// have to keep its own copy of which documents exist. A copy is a list that goes stale:
// the thirteenth document would be published, indexed, and quietly missing from whatever
// the copy was feeding.
export const legalDocs:LegalDoc[]=[
  about,accountDeletion,childrenPrivacy,commercialCommunications,contact,cookies,
  kvkkAydinlatma,kvkkBasvuru,locationPrivacy,privacy,reportContent,terms,
];

// When each document was last edited, by slug. This is the real answer to the question a
// sitemap's lastmod asks, and it is the document's own record rather than anything
// derived from the deploy or the clock.
export const legalUpdatedBySlug:Record<string,string>=
  Object.fromEntries(legalDocs.map(doc=>[doc.slug,doc.updated]));

// The newest edit across the whole set: what the legal hub, which is a list of these
// documents, actually changes with.
export const legalUpdatedNewest:string=
  legalDocs.map(doc=>doc.updated).sort().at(-1)??'';
