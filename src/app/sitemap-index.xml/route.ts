import {sitemapCount} from '../sitemap';
import {siteUrl} from '@/lib/site';

// The catalogue outgrew one sitemap, so the stores are split across several files and this
// is the index that names them.
//
// It is written by hand because Next generates the parts and not the index: with
// generateSitemaps it serves /sitemap/0.xml, /sitemap/1.xml and so on, and reserves the
// name /sitemap.xml without putting anything there. That is the address Search Console was
// given and the address robots.txt has always advertised, so it is redirected here in
// next.config rather than left to 404 -- which would have withdrawn the whole catalogue
// from the one crawler already watching it.
export const revalidate=3600;

export async function GET(){
  const count=await sitemapCount();
  const now=new Date().toISOString();
  const parts=Array.from({length:count},(_,id)=>
    `<sitemap><loc>${siteUrl}/sitemap/${id}.xml</loc><lastmod>${now}</lastmod></sitemap>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${parts}\n</sitemapindex>\n`,
    {headers:{'Content-Type':'application/xml','Cache-Control':'public, max-age=0, s-maxage=3600'}},
  );
}
