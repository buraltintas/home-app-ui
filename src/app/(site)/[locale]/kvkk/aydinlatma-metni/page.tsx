import type {Metadata} from 'next';
import {JsonLd} from '@/components/JsonLd';
import {LegalDocument} from '@/components/LegalDocument';
import {kvkkAydinlatma} from '@/content/legal/kvkk-aydinlatma';
import {getServerI18n} from '@/i18n/server';
import {legalJsonLd,legalMetadata} from '@/lib/legal-page';
import {legalRelated} from '@/lib/legal-links';

export async function generateMetadata():Promise<Metadata>{
  const {locale}=await getServerI18n();
  return legalMetadata(kvkkAydinlatma,locale);
}

export default async function Page(){
  const {locale}=await getServerI18n();
  return <>
    <JsonLd data={legalJsonLd(kvkkAydinlatma,locale)}/>
    <LegalDocument doc={kvkkAydinlatma} locale={locale} related={legalRelated(locale,'kvkk/aydinlatma-metni')}/>
  </>;
}
