import Link from 'next/link';
import {groupLabels,legalHubLabel,legalLinks,type LegalGroup} from '@/lib/legal-links';
import {localePath,slogan} from '@/lib/site';
import type {Locale} from '@/lib/types';

// Only routes that exist are listed. A footer that links to pages still waiting on the
// company details would hand every visitor a 404 and every crawler a dead end.
const note:Record<Locale,string>={
  tr:'Boşa Gezme! ürün satmaz. Herhangi bir mağazanın listelenmiş olması iş ortaklığı anlamına gelmez.',
  en:'Boşa Gezme! does not sell products. A store being listed does not mean it is a partner.',
  de:'Boşa Gezme! verkauft keine Produkte. Die Listung eines Geschäfts bedeutet keine Partnerschaft.',
  ru:'Boşa Gezme! не продаёт товары. Наличие магазина в списке не означает партнёрства.',
};


// The accounts as they were opened. Only the ones with a public profile URL we are sure
// of are linked -- a footer link that lands on the wrong handle is worse than no link.
const social:{label:string;href:string}[]=[
  {label:'Instagram',href:'https://www.instagram.com/bosagezme'},
  {label:'X',href:'https://x.com/Bosagezme'},
  {label:'TikTok',href:'https://www.tiktok.com/@bosagezme'},
  {label:'Threads',href:'https://www.threads.net/@bosagezme'},
  {label:'Facebook',href:'https://www.facebook.com/Bosagezme'},
  {label:'LinkedIn',href:'https://www.linkedin.com/in/bo%C5%9Fa-gezme-91a8b142a'},
  {label:'Reddit',href:'https://www.reddit.com/user/Bosagezme'},
];

const followLabel:Record<Locale,string>={tr:'Bizi takip edin',en:'Follow us',de:'Folge uns',ru:'Мы в соцсетях'};

const order:LegalGroup[]=['product','privacy','legal','community'];

export function SiteFooter({locale}:{locale:Locale}){
  return <footer className="site-footer">
    <div className="site-footer-inner">
      {order.map(group=>{
        const links=legalLinks.filter(link=>link.live&&link.group===group);
        if(!links.length)return null;
        return <nav key={group} aria-label={groupLabels[group][locale]}>
          <h2>{groupLabels[group][locale]}</h2>
          <ul>
            {links.map(link=><li key={link.slug}><Link href={localePath(locale,`/${link.slug}`)}>{link.label[locale]}</Link></li>)}
            {group==='legal'&&<li><Link href={localePath(locale,'/legal')}>{legalHubLabel[locale]}</Link></li>}
          </ul>
        </nav>;
      })}
      <nav aria-label={followLabel[locale]} className="site-footer-social">
        <h2>{followLabel[locale]}</h2>
        <ul>{social.map(account=><li key={account.label}><a href={account.href} target="_blank" rel="me noopener noreferrer">{account.label}</a></li>)}</ul>
      </nav>
      <p className="site-footer-slogan" lang="tr">{slogan}</p>
      <p className="site-footer-note">{note[locale]}</p>
    </div>
  </footer>;
}
