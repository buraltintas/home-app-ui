import type {MetadataRoute} from 'next';

export default function manifest():MetadataRoute.Manifest {
  return {
    name:'Boşa Gezme!',
    short_name:'Boşa Gezme!',
    description:'Discover real physical home and living stores through verified community visits.',
    start_url:'/',
    display:'standalone',
    background_color:'#F7F5F0',
    theme_color:'#A34A32',
    icons:[
      {src:'/brand/icon-512.png',sizes:'512x512',type:'image/png'},
      {src:'/brand/bosagezme-logo.png',sizes:'1254x1254',type:'image/png'},
    ],
  };
}
