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
    {title:'Visit.',body:'Real, verified visits'},
    {title:'Review.',body:'Outcome-focused criteria'},
  ]},
  de:{title:'Starte deinen Einkauf mit uns!',steps:[
    {title:'Entdecken.',body:'Optimierte, intelligente Suche'},
    {title:'Hingehen.',body:'Echte, bestätigte Besuche'},
    {title:'Bewerten.',body:'Ergebnisorientierte Kriterien'},
  ]},
  ru:{title:'Начните покупки вместе с нами!',steps:[
    {title:'Найдите.',body:'Улучшенный поиск'},
    {title:'Посетите.',body:'Настоящие подтверждённые визиты'},
    {title:'Оцените.',body:'Критерии, ориентированные на результат'},
  ]},
};

// `recent` names a list that is not a ranking, so the words must not imply one: "recently
// reviewed" is a fact about time, while anything like "best" or "top" would be a claim the
// data cannot carry while every reviewed shop has exactly one reviewer.
type HomeSignalsCopy={title:string;intro:string;cities:string;categories:string;searches:string;recent:string;recentIntro:string;people:string;onePerson:string};

export const homeSignalsCopy:Record<Locale,HomeSignalsCopy>={
  tr:{title:'Neler keşfediliyor?',intro:'Son 30 gündeki aramalar ve topluluk değerlendirmelerini incele.',cities:'En çok arama yapılan şehirler',categories:'En çok aranan kategoriler',searches:'arama',recent:'Son değerlendirilen mağazalar',recentIntro:'Topluluğun en son yazdığı yerler.',people:'kişi',onePerson:'1 kişi'},
  en:{title:'What is being discovered?',intro:'Look through the searches and community reviews from the last 30 days.',cities:'Most searched cities',categories:'Most searched categories',searches:'searches',recent:'Recently reviewed stores',recentIntro:'The places the community wrote about most recently.',people:'people',onePerson:'1 person'},
  de:{title:'Was wird entdeckt?',intro:'Sieh dir die Suchen und Community-Bewertungen der letzten 30 Tage an.',cities:'Meistgesuchte Städte',categories:'Meistgesuchte Kategorien',searches:'Suchen',recent:'Zuletzt bewertete Geschäfte',recentIntro:'Die Orte, über die zuletzt geschrieben wurde.',people:'Personen',onePerson:'1 Person'},
  ru:{title:'Что ищут?',intro:'Посмотрите поиски и отзывы сообщества за последние 30 дней.',cities:'Популярные города',categories:'Популярные категории',searches:'поисков',recent:'Недавно оценённые магазины',recentIntro:'Места, о которых сообщество написало последними.',people:'чел.',onePerson:'1 человек'},
};
