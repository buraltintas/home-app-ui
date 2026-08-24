import type {Metadata} from 'next';
import {FeedbackForm} from '@/components/FeedbackForm';
import {getServerI18n} from '@/i18n/server';
import {canonicalFor} from '@/lib/site';
import type {Locale} from '@/lib/types';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const correctionCopy:Record<Locale,{title:string;intro:string;message:(name:string,id:string)=>string}>={
  tr:{title:'Mağaza bilgisinde hata mı var?',intro:'Yanlış adresi, kategoriyi veya kapanmış bir mağazayı bize bildir. Öneriyi inceleyip kaynağından doğrulayacağız.',message:(name,id)=>`Mağaza bilgisi düzeltme önerisi\nMağaza: ${name}\nMağaza kimliği: ${id}\n\nDüzeltilmesi gereken bilgi: `},
  en:{title:'Is something wrong with this store?',intro:'Tell us about an incorrect address, category, or a store that has closed. We will review the suggestion and verify it at the source.',message:(name,id)=>`Store information correction\nStore: ${name}\nStore ID: ${id}\n\nInformation to correct: `},
  de:{title:'Stimmt etwas mit diesem Geschäft nicht?',intro:'Melde uns eine falsche Adresse, Kategorie oder ein geschlossenes Geschäft. Wir prüfen den Hinweis und gleichen ihn mit der Quelle ab.',message:(name,id)=>`Korrektur der Geschäftsinformationen\nGeschäft: ${name}\nGeschäfts-ID: ${id}\n\nZu korrigierende Angabe: `},
  ru:{title:'В данных магазина есть ошибка?',intro:'Сообщите о неверном адресе, категории или закрытом магазине. Мы проверим предложение по источнику.',message:(name,id)=>`Исправление данных магазина\nМагазин: ${name}\nID магазина: ${id}\n\nЧто нужно исправить: `},
};

export async function generateMetadata():Promise<Metadata>{
  const {locale,t}=await getServerI18n();
  return {title:t.feedbackTitle,description:t.feedbackIntro,alternates:canonicalFor(locale,'/feedback')};
}

export default async function Page({searchParams}:{searchParams:Promise<{store?:string;name?:string}>}){
  const [{t,locale},query]=await Promise.all([getServerI18n(),searchParams]);
  const storeId=UUID.test(query.store??'')?query.store??'':'';
  const storeName=(query.name??'').trim().slice(0,160);
  const correction=Boolean(storeId&&storeName);
  const copy=correctionCopy[locale];
  return <main className="feedback-page">
    <p className="eyebrow">Boşa Gezme!</p>
    <h1>{correction?copy.title:t.feedbackTitle}</h1>
    <p className="feedback-intro">{correction?copy.intro:t.feedbackIntro}</p>
    <FeedbackForm initialKind={correction?'problem':'suggestion'} initialMessage={correction?copy.message(storeName,storeId):''}/>
  </main>;
}
