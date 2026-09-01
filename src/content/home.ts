import type {Locale} from '@/lib/types';

type HomeBannerCopy={
  title:string;
  steps:{title:string;body:string}[];
};

export const homeBannerCopy:Record<Locale,HomeBannerCopy>={
  tr:{title:'Alışverişinize bizimle başlayın!',steps:[
    {title:'Keşfedin.',body:'Gelişmiş arama optimizasyonu'},
    {title:'Gidin.',body:'Doğrulanmış gerçek ziyaretler'},
    {title:'Değerlendirin.',body:'Sonuç odaklı kriterler'},
  ]},
  en:{title:'Start your shopping trip with us!',steps:[
    {title:'Discover.',body:'Advanced search optimisation'},
    {title:'Visit.',body:'A real, verified visit'},
    {title:'Review.',body:'Outcome-focused criteria'},
  ]},
  de:{title:'Starte deinen Einkauf mit uns!',steps:[
    {title:'Entdecken.',body:'Optimierte, intelligente Suche'},
    {title:'Hingehen.',body:'Ein echter, bestätigter Besuch'},
    {title:'Bewerten.',body:'Ergebnisorientierte Kriterien'},
  ]},
  ru:{title:'Начните покупки вместе с нами!',steps:[
    {title:'Найдите.',body:'Улучшенный поиск'},
    {title:'Посетите.',body:'Настоящий подтверждённый визит'},
    {title:'Оцените.',body:'Критерии, ориентированные на результат'},
  ]},
};

type HomeSignalsCopy={title:string;intro:string;cities:string;categories:string;searches:string};

export const homeSignalsCopy:Record<Locale,HomeSignalsCopy>={
  tr:{title:'Şimdi ne keşfediliyor?',intro:'Son 30 gündeki gerçek aramalar ve topluluk değerlendirmeleri.',cities:'En çok arama yapılan şehirler',categories:'En çok aranan kategoriler',searches:'arama'},
  en:{title:'What are people discovering now?',intro:'Real searches and community reviews from the last 30 days.',cities:'Most searched cities',categories:'Most searched categories',searches:'searches'},
  de:{title:'Was wird gerade entdeckt?',intro:'Echte Suchen und Community-Bewertungen der letzten 30 Tage.',cities:'Meistgesuchte Städte',categories:'Meistgesuchte Kategorien',searches:'Suchen'},
  ru:{title:'Что сейчас ищут?',intro:'Реальные поиски и отзывы сообщества за последние 30 дней.',cities:'Популярные города',categories:'Популярные категории',searches:'поисков'},
};
