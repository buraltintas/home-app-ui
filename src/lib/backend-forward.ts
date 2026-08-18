import 'server-only';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';

const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';

export async function forwardToBackend({
  request,
  path,
  method='GET',
  body,
}: {
  request: NextRequest;
  path: string;
  method?: string;
  body?: BodyInit | null;
}): Promise<Response>{
  const cookieStore=await cookies();
  const target=new URL(`/v1/${path.replace(/^\/+/, '')}`,API_ORIGIN);
  request.nextUrl.searchParams.forEach((value,key)=>target.searchParams.append(key,value));

  const headers=new Headers();
  headers.set('X-BFF-Secret',process.env.BFF_SECRET??'');
  headers.set('X-Locale',request.headers.get('x-locale')??cookieStore.get('bosagezme_locale')?.value??'tr');
  headers.set('Accept-Language',request.headers.get('accept-language')??'tr');

  const accessToken=cookieStore.get('bosagezme_access')?.value;
  if(accessToken)headers.set('Authorization',`Bearer ${accessToken}`);

  const visitorSessionId=request.headers.get('x-visitor-session-id')??cookieStore.get('bosagezme_visitor')?.value;
  if(visitorSessionId)headers.set('X-Visitor-Session-ID',visitorSessionId);

  for(const key of ['content-type','x-origin-search-id','x-origin-search-result-id']){
    const value=request.headers.get(key);
    if(value)headers.set(key,value);
  }

  return fetch(target,{method,headers,body:['GET','HEAD'].includes(method)?undefined:body ?? undefined,duplex:body!==undefined&&![ 'GET','HEAD' ].includes(method)?'half':undefined} as RequestInit & { duplex?: 'half' });
}
