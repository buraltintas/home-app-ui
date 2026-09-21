import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {ScrollTop} from '@/components/ScrollTop';
import {StoreCorrectionForm,storeCorrectionIntro} from '@/components/StoreCorrectionForm';
import {getServerI18n} from '@/i18n/server';
import {canonicalFor,localePath} from '@/lib/site';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// One copy of the heading and the sentence, shared with the sheet the store page opens.
const copy=storeCorrectionIntro;

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=getServerI18n((await params).locale);
  return {title:copy[locale].title,description:copy[locale].intro,alternates:canonicalFor(locale,'/store-correction')};
}

export default async function Page({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{store?:string;name?:string}>}){
  const [{locale},query]=await Promise.all([params.then(p=>getServerI18n(p.locale)),searchParams]);
  const storeId=UUID.test(query.store??'')?query.store??'':'';
  const storeName=(query.name??'').trim().slice(0,160);
  if(!storeId||!storeName)redirect(localePath(locale,'/feedback'));
  const t=copy[locale];
  // Opened from low down a store page, it used to start where that page had been left --
  // with its own title above the fold and out of sight.
  return <main className="feedback-page store-correction-page"><ScrollTop/>
    <p className="eyebrow">Boşa Gezme!</p>
    <h1>{t.title}</h1>
    <p className="feedback-intro">{t.intro}</p>
    <p className="store-correction-context"><span>{t.store}</span><strong>{storeName}</strong></p>
    <StoreCorrectionForm locale={locale} storeId={storeId} storeName={storeName}/>
  </main>;
}
