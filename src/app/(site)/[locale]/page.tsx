import type {Metadata} from 'next';
import {HomeIntro} from '@/components/HomeIntro';
import {HomeDiscoveryBanner} from '@/components/HomeDiscoveryBanner';
import {HomeQuestions} from '@/components/HomeQuestions';
import {JsonLd} from '@/components/JsonLd';
import {getServerI18n} from '@/i18n/server';
import {canonicalFor,shareImage} from '@/lib/site';
import {organizationJsonLd,websiteJsonLd} from '@/lib/structured-data';

export async function generateMetadata():Promise<Metadata>{
  const {t,locale}=await getServerI18n();
  return {alternates:canonicalFor(locale,'/'),openGraph:{url:'/',type:'website',images:[shareImage],description:t.siteSnippet},description:t.siteSnippet};
}

// The home page no longer opens with other people's reviews. Somebody arriving here has
// not chosen a store yet, so a stream of reviews of stores they have never heard of asks
// them to care before they have a reason to. What it opens with instead is the search,
// and under it the questions people actually ask before trusting a place they have not
// used -- read from the about page so there is one wording, not two.
export default async function Page(){
  const {t,locale}=await getServerI18n();
  return <>
    <JsonLd data={[organizationJsonLd(t.siteSnippet),websiteJsonLd(t.siteSnippet,locale)]}/>
    <main className="feed-layout"><section className="feed-main">
      <HomeIntro/>
      <HomeDiscoveryBanner/>
      <HomeQuestions locale={locale}/>
    </section></main>
  </>;
}
