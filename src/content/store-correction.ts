import type {Locale} from '@/lib/types';

// The heading and the sentence under it, in one place.
//
// They used to live in the form, which is a client component, and the server page that also
// shows them imported them from there. A value exported from a 'use client' module is not
// that value on the server -- it is a reference the client will resolve -- so the page read
// undefined and answered 500. The store correction page has been doing that in production:
// every "Mağaza bilgilerinde hata mı var?" link led to an error.
//
// Copy is data, not behaviour, so it belongs in a module that neither side has to own.
export const storeCorrectionIntro:Record<Locale,{title:string;intro:string;store:string}>={
  tr:{title:'Mağaza bilgilerinde hata mı var?',intro:'Yanlış adresi, kategoriyi veya kapanmış bir mağazayı bize bildir. Önerini inceleyip doğruladıktan sonra gerekli düzeltmeyi yapacağız.',store:'Düzenleme önerdiğin mağaza'},
  en:{title:'Is something wrong with the store information?',intro:'Tell us about an incorrect address, category, or a store that has closed. We will review and verify your suggestion before making the correction.',store:'Store you are suggesting an edit for'},
  de:{title:'Stimmt etwas mit den Geschäftsinformationen nicht?',intro:'Melde uns eine falsche Adresse, Kategorie oder ein geschlossenes Geschäft. Wir prüfen deinen Hinweis und nehmen die Korrektur nach der Bestätigung vor.',store:'Geschäft, für das du eine Änderung vorschlägst'},
  ru:{title:'В данных магазина есть ошибка?',intro:'Сообщите о неверном адресе, категории или закрытом магазине. Мы проверим предложение и внесём исправление после подтверждения.',store:'Магазин, данные которого вы предлагаете изменить'},
};
