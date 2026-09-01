import Link from 'next/link';
import {FaFacebookF,FaInstagram,FaLinkedinIn,FaPinterestP,FaRedditAlien,FaSnapchat,FaThreads,FaTiktok,FaXTwitter} from 'react-icons/fa6';
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
const social=[
  {label:'Instagram',href:'https://www.instagram.com/bosagezme',Icon:FaInstagram},
  {label:'X',href:'https://x.com/Bosagezme',Icon:FaXTwitter},
  {label:'TikTok',href:'https://www.tiktok.com/@bosagezme',Icon:FaTiktok},
  {label:'Threads',href:'https://www.threads.net/@bosagezme',Icon:FaThreads},
  {label:'Facebook',href:'https://www.facebook.com/Bosagezme',Icon:FaFacebookF},
  {label:'LinkedIn',href:'https://www.linkedin.com/in/bo%C5%9Fa-gezme-91a8b142a',Icon:FaLinkedinIn},
  {label:'Reddit',href:'https://www.reddit.com/user/Bosagezme',Icon:FaRedditAlien},
  // The link supplied for Pinterest was a personal invite (pin.it/…, carrying an invite
  // code and the sender's id). Following it would have invited every visitor on somebody's
  // behalf, so it is the public profile the invite resolves to that is linked here.
  {label:'Pinterest',href:'https://www.pinterest.com/bosagezme/',Icon:FaPinterestP},
  {label:'Snapchat',href:'https://www.snapchat.com/explore/Bo%C5%9Fagezme',Icon:FaSnapchat},
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
        <ul>{social.map(({label,href,Icon})=><li key={label}><a href={href} target="_blank" rel="me noopener noreferrer" aria-label={label} title={label}><Icon aria-hidden="true"/></a></li>)}</ul>
      </nav>
      <p className="site-footer-slogan" lang="tr">{slogan}</p>
      <p className="site-footer-note">{note[locale]}</p>
    </div>
  </footer>;
}
