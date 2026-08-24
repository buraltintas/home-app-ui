import type {Locale} from './types';

// One list of the informational and legal routes, so the footer, the legal hub, the
// sitemap and the cross-links at the foot of each document can never drift apart.
export type LegalGroup='product'|'privacy'|'legal'|'community';
export type LegalLink={slug:string;group:LegalGroup;label:Record<Locale,string>;live:boolean};

export const legalLinks:LegalLink[]=[
  {slug:'about',group:'product',live:true,label:{tr:'Boşa Gezme! nedir?',en:'What is Boşa Gezme!?',de:'Was ist Boşa Gezme!?',ru:'Что такое Boşa Gezme!?'}},
  {slug:'contact',group:'product',live:true,label:{tr:'İletişim',en:'Contact',de:'Kontakt',ru:'Контакты'}},

  {slug:'privacy',group:'privacy',live:true,label:{tr:'Gizlilik Politikası',en:'Privacy Policy',de:'Datenschutzerklärung',ru:'Политика конфиденциальности'}},
  {slug:'kvkk/aydinlatma-metni',group:'privacy',live:true,label:{tr:'KVKK Aydınlatma Metni',en:'KVKK Disclosure Notice',de:'KVKK-Informationstext',ru:'Уведомление KVKK'}},
  {slug:'kvkk/basvuru',group:'privacy',live:true,label:{tr:'KVKK Başvuru',en:'KVKK Application',de:'KVKK-Antrag',ru:'Обращение по KVKK'}},
  {slug:'cookies',group:'privacy',live:true,label:{tr:'Çerez Politikası',en:'Cookie Policy',de:'Cookie-Richtlinie',ru:'Политика cookie'}},
  {slug:'location-privacy',group:'privacy',live:true,label:{tr:'Konum gizliliği',en:'Location privacy',de:'Standortdatenschutz',ru:'Конфиденциальность геоданных'}},
  {slug:'account-deletion',group:'privacy',live:true,label:{tr:'Hesap silme',en:'Account deletion',de:'Konto löschen',ru:'Удаление аккаунта'}},
  {slug:'children-privacy',group:'privacy',live:true,label:{tr:'Yaş ve Kullanım Koşulları',en:'Age and Terms of Use',de:'Alter und Nutzungsbedingungen',ru:'Возраст и условия использования'}},

  {slug:'terms',group:'legal',live:true,label:{tr:'Kullanım Koşulları',en:'Terms of Service',de:'Nutzungsbedingungen',ru:'Условия использования'}},
  {slug:'commercial-communications',group:'legal',live:true,label:{tr:'Ticari elektronik ileti',en:'Commercial messages',de:'Kommerzielle Nachrichten',ru:'Коммерческие сообщения'}},

  {slug:'report-content',group:'community',live:true,label:{tr:'İçerik bildirimi',en:'Report content',de:'Inhalte melden',ru:'Жалоба на контент'}},
  {slug:'feedback',group:'community',live:true,label:{tr:'Görüş ve öneri',en:'Feedback',de:'Feedback',ru:'Отзывы и предложения'}},
];

export const legalHubLabel:Record<Locale,string>={tr:'Hukuki belgeler',en:'Legal documents',de:'Rechtliche Dokumente',ru:'Правовые документы'};

export const groupLabels:Record<LegalGroup,Record<Locale,string>>={
  product:{tr:'Boşa Gezme!',en:'Boşa Gezme!',de:'Boşa Gezme!',ru:'Boşa Gezme!'},
  privacy:{tr:'Gizlilik',en:'Privacy',de:'Datenschutz',ru:'Конфиденциальность'},
  legal:{tr:'Hukuk',en:'Legal',de:'Rechtliches',ru:'Правовое'},
  community:{tr:'Topluluk',en:'Community',de:'Community',ru:'Сообщество'},
};

// Related links stay short: the three or four documents a reader of this one is most
// likely to want next, rather than the whole index repeated at the foot of every page.
