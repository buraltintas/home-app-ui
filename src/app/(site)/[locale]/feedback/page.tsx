import type {Metadata} from 'next';
import {FeedbackForm} from '@/components/FeedbackForm';
import {getServerI18n} from '@/i18n/server';
import {canonicalFor} from '@/lib/site';

export async function generateMetadata():Promise<Metadata>{
  const {locale,t}=await getServerI18n();
  return {title:t.feedbackTitle,description:t.feedbackIntro,alternates:canonicalFor(locale,'/feedback')};
}

export default async function Page(){
  const {t}=await getServerI18n();
  return <main className="feedback-page">
    <p className="eyebrow">Boşa Gezme!</p>
    <h1>{t.feedbackTitle}</h1>
    <p className="feedback-intro">{t.feedbackIntro}</p>
    <FeedbackForm/>
  </main>;
}
