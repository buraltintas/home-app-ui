import type {Metadata} from 'next';
import {JsonLd} from '@/components/JsonLd';
import {LegalDocument} from '@/components/LegalDocument';
import {cookies} from '@/content/legal/trust';
import {getServerI18n} from '@/i18n/server';
import {legalJsonLd,legalMetadata} from '@/lib/legal-page';
import {legalRelated} from '@/lib/legal-links';

export async function generateMetadata():Promise<Metadata>{
  const {locale}=await getServerI18n();
  return legalMetadata(cookies,locale);
}

export default async function Page(){
  const {locale}=await getServerI18n();
  return <>
    <JsonLd data={legalJsonLd(cookies,locale)}/>
    <LegalDocument doc={cookies} locale={locale} related={legalRelated(locale,'cookies')}/>
  </>;
}
