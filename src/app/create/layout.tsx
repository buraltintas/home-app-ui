import type {Metadata} from 'next';

// A sign-in-only route has nothing to show a crawler but an empty shell, so it is kept
// out of the index. robots.txt disallows it too; this covers URLs reached by a link.
export const metadata:Metadata={robots:{index:false,follow:false}};

export default function Layout({children}:{children:React.ReactNode}){return children}
