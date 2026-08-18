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
      {src:'/brand/app-icon-mascot.png',sizes:'1254x1254',type:'image/png',purpose:'any'},
      {src:'/brand/brand-logo-square.png',sizes:'1254x1254',type:'image/png',purpose:'any'},
    ],
  };
}
