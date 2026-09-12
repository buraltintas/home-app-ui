import type {Metadata} from 'next';
import {JsonLd} from '@/components/JsonLd';
import {LegalDocument} from '@/components/LegalDocument';
import {kvkkAydinlatma} from '@/content/legal/kvkk-aydinlatma';
import {getServerI18n} from '@/i18n/server';
import {legalJsonLd,legalMetadata} from '@/lib/legal-page';

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=getServerI18n((await params).locale);
  return legalMetadata(kvkkAydinlatma,locale);
}

export default async function Page({params}:{params:Promise<{locale:string}>}){
  const {locale}=getServerI18n((await params).locale);
  return <>
    <JsonLd data={legalJsonLd(kvkkAydinlatma,locale)}/>
    <LegalDocument doc={kvkkAydinlatma} locale={locale}/>
  </>;
}
