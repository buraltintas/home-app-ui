import type {Metadata} from 'next';
import type {LegalDoc} from '@/content/legal/types';
import {legalDocumentsArePublishable} from './legal-facts';
import {absolute,canonicalFor,shareImage} from './site';
import type {Locale} from './types';

// A raw slice cuts mid-word, which is what a share preview then renders: "...her belge
// kendi surumunu ve" followed by nothing. Cutting at the last sentence that fits keeps the
// description a complete thought, and falling back to a word boundary keeps it readable
// when a single sentence is longer than the budget.
export function metaDescription(text:string,max=160):string{
  const clean=text.replace(/\s+/g,' ').trim();
  if(clean.length<=max)return clean;
  const window=clean.slice(0,max+1);
  const sentenceEnd=Math.max(window.lastIndexOf('. '),window.lastIndexOf('? '),window.lastIndexOf('! '));
  if(sentenceEnd>max*0.5)return clean.slice(0,sentenceEnd+1);
  const wordEnd=window.lastIndexOf(' ');
  return `${clean.slice(0,wordEnd>0?wordEnd:max).replace(/[.,;:]$/,'')}…`;
}

// A document that is not yet in force must not be indexed. Search results are where most
// people would meet it, and a policy found in search reads as the operative one no matter
// what banner sits on the page.
export function legalMetadata(doc:LegalDoc,locale:Locale):Metadata{
  const content=doc.content[locale];
  const path=`/${doc.slug}`;
  const pending=doc.requiresEntity&&!legalDocumentsArePublishable;
  return {
    title:content.title,
    description:metaDescription(content.summary),
    alternates:canonicalFor(locale,path),
    openGraph:{type:'article',url:path,title:content.title,description:metaDescription(content.summary),modifiedTime:doc.updated,images:[shareImage]},
    twitter:{card:'summary_large_image',title:content.title,description:metaDescription(content.summary),images:[shareImage.url]},
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
