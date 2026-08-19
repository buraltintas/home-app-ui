import Link from 'next/link';
import {AdminSignOut} from './AdminSignOut';

// Rendered only by a page that has already confirmed access. Before signing in there is
// nothing to navigate: showing every section link to somebody who cannot open any of them
// both looks broken and maps out the surface for anyone probing it.
const tabs=[
  {href:'/admin',label:'Genel bakış'},
  {href:'/admin/searches',label:'Aramalar'},
  {href:'/admin/stores',label:'Mağazalar'},
  {href:'/admin/users',label:'Kullanıcılar'},
  {href:'/admin/reviews',label:'Değerlendirmeler'},
  {href:'/admin/feedback',label:'Görüşler'},
  {href:'/admin/audit',label:'İşlem kayıtları'},
];

export function AdminNav(){
  return <nav className="admin-nav" aria-label="Yönetim bölümleri">
    {tabs.map(tab=><Link key={tab.href} href={tab.href}>{tab.label}</Link>)}
    <AdminSignOut/>
  </nav>;
}
