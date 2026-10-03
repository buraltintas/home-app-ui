import {sitemapParts} from '@/lib/sitemap';
import {siteUrl} from '@/lib/site';

// The catalogue outgrew one sitemap, so the stores are split across several files and this
// is the index that names them.
//
// The parts (/sitemap/0.xml, /sitemap/1.xml and so on) are written and gzipped by
// app/sitemap/[part]; this writes the index that names them. /sitemap.xml is the address
// Search Console was given and robots.txt advertised at launch, so next.config redirects it
// here rather than letting it 404 -- which would withdraw the whole catalogue from the one
// crawler already watching it.
// Per request, for the reason written on the sitemap itself: the catalogue is not reachable
// from the container this is built in, and a count taken there would be zero.
export const dynamic='force-dynamic';

export async function GET(){
  // Each part says when it last changed, and that comes from the shops inside it. It used
  // to be `new Date()`, so every part claimed to have changed at the instant the index was
  // asked for -- six files, one timestamp, a different one on every fetch. A crawler that
  // finds lastmod unreliable stops using it, and then nothing tells it which of the six
  // files is worth re-reading.
  const parts=(await sitemapParts()).map(({id,lastModified})=>
    `<sitemap><loc>${siteUrl}/sitemap/${id}.xml</loc>${
      lastModified?`<lastmod>${lastModified.toISOString()}</lastmod>`:''
    }</sitemap>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${parts}\n</sitemapindex>\n`,
    {headers:{'Content-Type':'application/xml','Cache-Control':'public, max-age=0, s-maxage=3600'}},
  );
}
