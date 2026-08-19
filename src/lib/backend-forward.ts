import 'server-only';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';

const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';

export async function forwardToBackend({
  request,
  path,
  method='GET',
  body,
  anonymous=false,
  bearer,
}: {
  request: NextRequest;
  path: string;
  method?: string;
  body?: BodyInit | null;
  /** Send no credentials. Used by the sign-in routes, which must work while holding a dead one. */
  anonymous?: boolean;
  /** Use this token instead of the cookie. Signing out needs a live one to revoke with. */
  bearer?: string;
}): Promise<Response>{
  const cookieStore=await cookies();
  const target=new URL(`/v1/${path.replace(/^\/+/, '')}`,API_ORIGIN);
  request.nextUrl.searchParams.forEach((value,key)=>target.searchParams.append(key,value));

  const headers=new Headers();
  headers.set('X-BFF-Secret',process.env.BFF_SECRET??'');
  // Only an explicit choice is forwarded as X-Locale. Defaulting it to Turkish overrode
  // the backend's own resolution order, so a German browser signing up for the first time
  // was recorded as Turkish and received Turkish mail.
  const chosenLocale=request.headers.get('x-locale')??cookieStore.get('bosagezme_locale')?.value;
  if(chosenLocale)headers.set('X-Locale',chosenLocale);
  headers.set('Accept-Language',request.headers.get('accept-language')??'tr');

  // Signing in must not depend on the credential you are trying to replace. The backend
  // rejects an invalid bearer token outright, even on routes that need no authentication,
  // so forwarding a stale access cookie to request-code answered INVALID_TOKEN and left
  // somebody unable to sign in again until they cleared their cookies by hand. A dead
  // token is exactly the state you are in when you need to sign in.
  const accessToken=anonymous?undefined:bearer??cookieStore.get('bosagezme_access')?.value;
  if(accessToken)headers.set('Authorization',`Bearer ${accessToken}`);

  const visitorSessionId=request.headers.get('x-visitor-session-id')??cookieStore.get('bosagezme_visitor')?.value;
  if(visitorSessionId)headers.set('X-Visitor-Session-ID',visitorSessionId);

  for(const key of ['content-type','x-origin-search-id','x-origin-search-result-id']){
    const value=request.headers.get(key);
    if(value)headers.set(key,value);
  }

  return fetch(target,{method,headers,body:['GET','HEAD'].includes(method)?undefined:body ?? undefined,duplex:body!==undefined&&![ 'GET','HEAD' ].includes(method)?'half':undefined} as RequestInit & { duplex?: 'half' });
}
