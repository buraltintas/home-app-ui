import type {Metadata} from 'next';
import {FeedPage} from '@/components/FeedPage';
import {JsonLd} from '@/components/JsonLd';
import {getServerI18n} from '@/i18n/server';
import {getFeed} from '@/lib/server-api';
import {canonicalFor} from '@/lib/site';
import {organizationJsonLd,websiteJsonLd} from '@/lib/structured-data';

export async function generateMetadata():Promise<Metadata>{
  const {t,locale}=await getServerI18n();
  return {alternates:canonicalFor(locale,'/'),openGraph:{url:'/',type:'website'},description:t.feedIntro};
}

// The feed is read here rather than in an effect, so the homepage arrives with real
// reviews in the HTML. As a client component fetching on mount, the server response was
// an empty shell -- nothing for a crawler to read and nothing for a slow connection to
// show. FeedPage still refetches when the session changes; it just no longer starts empty.
export default async function Page(){
  const [{t,locale},posts]=await Promise.all([getServerI18n(),getFeed()]);
  return <>
    <JsonLd data={[organizationJsonLd(t.feedIntro),websiteJsonLd(t.feedIntro,locale)]}/>
    <FeedPage initialPosts={posts}/>
  </>;
}
