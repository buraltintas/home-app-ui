import type {Locale} from '@/lib/types';

type HomeBannerCopy={
  title:string;
  steps:{title:string;body:string}[];
};

export const homeBannerCopy:Record<Locale,HomeBannerCopy>={
  tr:{title:'Alışverişinize bizimle başlayın!',steps:[
    {title:'Keşfedin.',body:'Gelişmiş arama optimizasyonu ile'},
    {title:'Gidin.',body:'Doğrulanmış gerçek ziyaret'},
    {title:'Değerlendirin.',body:'Gerçek kriterler ile'},
  ]},
  en:{title:'Start your shopping trip with us!',steps:[
    {title:'Discover.',body:'With advanced search optimisation'},
    {title:'Visit.',body:'A real, verified visit'},
    {title:'Review.',body:'Using criteria that matter'},
  ]},
  de:{title:'Starte deinen Einkauf mit uns!',steps:[
    {title:'Entdecken.',body:'Mit optimierter, intelligenter Suche'},
    {title:'Hingehen.',body:'Ein echter, bestätigter Besuch'},
    {title:'Bewerten.',body:'Nach Kriterien, die wirklich zählen'},
  ]},
  ru:{title:'Начните покупки вместе с нами!',steps:[
    {title:'Найдите.',body:'С помощью улучшенного поиска'},
    {title:'Посетите.',body:'Настоящий подтверждённый визит'},
    {title:'Оцените.',body:'По критериям, которые действительно важны'},
  ]},
};
