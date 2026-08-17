import type {MetadataRoute} from 'next';

export default function sitemap():MetadataRoute.Sitemap {
  const base='https://bosagezme.com';
  return [
    {url:base,lastModified:new Date(),changeFrequency:'daily',priority:1},
    {url:`${base}/discover`,lastModified:new Date(),changeFrequency:'daily',priority:.9},
    {url:`${base}/favorites`,lastModified:new Date(),changeFrequency:'weekly',priority:.6},
    {url:`${base}/create`,lastModified:new Date(),changeFrequency:'weekly',priority:.7},
    {url:`${base}/profile`,lastModified:new Date(),changeFrequency:'weekly',priority:.5},
  ];
}
