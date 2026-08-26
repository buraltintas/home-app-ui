import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {StoreCorrectionForm} from '@/components/StoreCorrectionForm';
import {getServerI18n} from '@/i18n/server';
import {canonicalFor,localePath} from '@/lib/site';
import type {Locale} from '@/lib/types';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const copy:Record<Locale,{title:string;intro:string;store:string}>={
  tr:{title:'Mağaza bilgilerinde hata mı var?',intro:'Yanlış adresi, kategoriyi veya kapanmış bir mağazayı bize bildir. Önerini inceleyip doğruladıktan sonra gerekli düzeltmeyi yapacağız.',store:'Düzenleme önerdiğin mağaza'},
  en:{title:'Is something wrong with the store information?',intro:'Tell us about an incorrect address, category, or a store that has closed. We will review and verify your suggestion before making the correction.',store:'Store you are suggesting an edit for'},
  de:{title:'Stimmt etwas mit den Geschäftsinformationen nicht?',intro:'Melde uns eine falsche Adresse, Kategorie oder ein geschlossenes Geschäft. Wir prüfen deinen Hinweis und nehmen die Korrektur nach der Bestätigung vor.',store:'Geschäft, für das du eine Änderung vorschlägst'},
  ru:{title:'В данных магазина есть ошибка?',intro:'Сообщите о неверном адресе, категории или закрытом магазине. Мы проверим предложение и внесём исправление после подтверждения.',store:'Магазин, данные которого вы предлагаете изменить'},
};

export async function generateMetadata():Promise<Metadata>{
  const {locale}=await getServerI18n();
  return {title:copy[locale].title,description:copy[locale].intro,alternates:canonicalFor(locale,'/store-correction')};
}

export default async function Page({searchParams}:{searchParams:Promise<{store?:string;name?:string}>}){
  const [{locale},query]=await Promise.all([getServerI18n(),searchParams]);
  const storeId=UUID.test(query.store??'')?query.store??'':'';
  const storeName=(query.name??'').trim().slice(0,160);
  if(!storeId||!storeName)redirect(localePath(locale,'/feedback'));
  const t=copy[locale];
  return <main className="feedback-page store-correction-page">
    <p className="eyebrow">Boşa Gezme!</p>
    <h1>{t.title}</h1>
    <p className="feedback-intro">{t.intro}</p>
    <p className="store-correction-context"><span>{t.store}</span><strong>{storeName}</strong></p>
    <StoreCorrectionForm locale={locale} storeId={storeId} storeName={storeName}/>
  </main>;
}
