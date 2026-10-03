import {gzipSync} from 'node:zlib';
import {SITEMAP_PARTS,sitemapEntries,urlset} from '@/lib/sitemap';

// One part of the sitemap, at the address the index has always published: /sitemap/0.xml,
// /sitemap/1.xml and so on.
//
// Search Console read the index and not one of its parts: "processed successfully", zero
// sitemaps read, zero pages discovered, for two weeks. Each part was arriving as plain XML --
// 4.5 to 10 MB, two to ten seconds -- because Next does not compress its metadata sitemap
// routes, though it compresses every page. Written out here instead, a part is gzipped
// whenever the reader accepts it, which is every crawler; measured on the live catalogue the
// largest part goes from 10.2 MB to 237 KB, and an eight-thousand-URL part from 5.8 MB to
// 159 KB.
//
// Per request, because the catalogue is not reachable from the container the site is built
// in (see lib/sitemap.ts).
export const dynamic='force-dynamic';

const PART=/^(\d{1,3})\.xml$/;

// Whether the reader accepts gzip, by the header's own rules: a coding listed with q=0 is
// one it has refused, and "*" stands for every coding it did not name.
function acceptsGzip(header:string|null):boolean{
  let gzip:number|undefined;
  let any:number|undefined;
  for(const part of (header??'').split(',')){
    const [name,...params]=part.trim().toLowerCase().split(';').map(piece=>piece.trim());
    const weight=params.find(param=>param.startsWith('q='));
    const q=weight===undefined?1:Number(weight.slice(2));
    const value=Number.isFinite(q)?q:0;
    if(name==='gzip'||name==='x-gzip')gzip=Math.max(gzip??0,value);
    else if(name==='*')any=value;
  }
  return (gzip??any??0)>0;
}

export async function GET(request:Request,{params}:{params:Promise<{part:string}>}){
  const found=PART.exec((await params).part);
  const index=found?Number(found[1]):-1;
  if(index<0||index>=SITEMAP_PARTS)return new Response('Not found',{status:404,headers:{'content-type':'text/plain; charset=utf-8'}});
  const body=urlset(await sitemapEntries(index));
  const headers:Record<string,string>={
    'Content-Type':'application/xml; charset=utf-8',
    // An hour at the edge and a day served stale while the next one is built, as before:
    // the documents change once an hour at most.
    'Cache-Control':'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    // A cache in between must not hand the gzipped copy to a reader that did not ask for it.
    Vary:'Accept-Encoding',
  };
  if(acceptsGzip(request.headers.get('accept-encoding'))){
    return new Response(new Uint8Array(gzipSync(body)),{headers:{...headers,'Content-Encoding':'gzip'}});
  }
  return new Response(body,{headers});
}
