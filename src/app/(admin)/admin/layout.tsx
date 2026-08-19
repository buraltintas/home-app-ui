import type {Metadata} from 'next';
import {Onest} from 'next/font/google';
import '../../globals.css';
import './admin.css';
import {SessionKeeper} from '@/components/SessionKeeper';

const sans=Onest({variable:'--font-sans',subsets:['latin','latin-ext'],display:'swap'});

// The operator surface has its own root layout, reached through a route group so the URL
// is still /admin. It deliberately shares nothing with the product shell: no site header,
// no footer, no locale provider. Administration is a different job from browsing, and
// mixing the two chrome sets makes it easy to forget which one you are looking at.
//
// Kept out of the index in three places, because one is easy to undo by accident: this
// metadata, the disallow in robots.ts, and the proxy matcher that never locale-rewrites it.
export const metadata:Metadata={title:'Yönetim · Boşa Gezme!',robots:{index:false,follow:false,nocache:true}};

export default function AdminLayout({children}:{children:React.ReactNode}){
  return <html lang="tr" className={sans.variable}><body className="admin-body">
    <header className="admin-header">
      <strong>Boşa Gezme! yönetim</strong>
    </header>
    {/* The panel renders on the server from the access cookie, so a token that dies while
        a report is open drops the whole page to the sign-in screen. Renewed here for the
        same reason as on the product side. */}
    <SessionKeeper/>
    <main className="admin-main">{children}</main>
  </body></html>;
}
