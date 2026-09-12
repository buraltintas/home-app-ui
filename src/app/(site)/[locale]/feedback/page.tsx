import type {Metadata} from 'next';
import {FeedbackForm} from '@/components/FeedbackForm';
import {PageBackButton} from '@/components/PageBackButton';
import {ScrollTop} from '@/components/ScrollTop';
import {getServerI18n} from '@/i18n/server';
import {canonicalFor} from '@/lib/site';

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale,t}=getServerI18n((await params).locale);
  return {title:t.feedbackTitle,description:t.feedbackIntro,alternates:canonicalFor(locale,'/feedback')};
}

export default async function Page({params}:{params:Promise<{locale:string}>}){
  const {t}=getServerI18n((await params).locale);
  return <main className="feedback-page">
    <ScrollTop/>
    <PageBackButton/>
    <p className="eyebrow">Boşa Gezme!</p>
    <h1>{t.feedbackTitle}</h1>
    <p className="feedback-intro">{t.feedbackIntro}</p>
    <FeedbackForm/>
  </main>;
}
