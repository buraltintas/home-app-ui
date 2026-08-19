import type {Metadata} from 'next';
import type {LegalDoc} from '@/content/legal/types';
import {legalDocumentsArePublishable} from './legal-facts';
import {absolute,canonicalFor} from './site';
import type {Locale} from './types';

// A document that is not yet in force must not be indexed. Search results are where most
// people would meet it, and a policy found in search reads as the operative one no matter
// what banner sits on the page.
export function legalMetadata(doc:LegalDoc,locale:Locale):Metadata{
  const content=doc.content[locale];
  const path=`/${doc.slug}`;
  const pending=doc.requiresEntity&&!legalDocumentsArePublishable;
  return {
    title:content.title,
    description:content.summary.slice(0,200),
    alternates:canonicalFor(locale,path),
    openGraph:{type:'article',url:path,title:content.title,description:content.summary.slice(0,200),modifiedTime:doc.updated},
    ...(pending?{robots:{index:false,follow:true}}:{}),
  };
}

// WebPage rather than anything richer: these are documents, and claiming FAQPage or
// similar for prose that is not a real question and answer list is exactly the invented
// markup that earns a manual action.
export function legalJsonLd(doc:LegalDoc,locale:Locale){
  const content=doc.content[locale];
  return {
    '@context':'https://schema.org','@type':'WebPage',
    name:content.title,description:content.summary,
    url:absolute(`/${doc.slug}`),
    inLanguage:locale,
    dateModified:doc.updated,
    isPartOf:{'@id':`${absolute('/')}#website`},
  };
}
