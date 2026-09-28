import 'server-only';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';

const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';

/** The header the API reads the person's own address from. It is believed there only
 *  because this request also carries the shared secret, so nothing but this file and the
 *  proxy beside it may set it. */
const CLIENT_IP='X-Client-IP';

/** Everything the backend is told about who is asking.
 *
 *  One function rather than two, because there were two and they had drifted into being
 *  the same rule written twice: the auth routes use this directly and the catch-all proxy
 *  imports it. The second copy is the one that goes stale, and here that would mean one
 *  route forwarding an address and the other not. */
export function backendHeaders({request,cookieStore,accessToken}:{
  request: NextRequest;
  cookieStore: Awaited<ReturnType<typeof cookies>>;
  accessToken?: string;
}): Headers {
  const headers=new Headers();
  headers.set('X-BFF-Secret',process.env.BFF_SECRET??'');
  // Only an explicit choice is forwarded as X-Locale. Defaulting it to Turkish overrode
  // the backend's own resolution order, so a German browser signing up for the first time
  // was recorded as Turkish and received Turkish mail.
  const chosenLocale=request.headers.get('x-locale')??cookieStore.get('bosagezme_locale')?.value;
  if(chosenLocale)headers.set('X-Locale',chosenLocale);
  headers.set('Accept-Language',request.headers.get('accept-language')??'tr');
  if(accessToken)headers.set('Authorization',`Bearer ${accessToken}`);

  // The cookie and nothing else. This used to read a header of the same name first, which
  // no code in this application has ever sent -- so the only party who could send one was
  // somebody who wanted a fresh rate-limit allowance on every request, and every limiter
  // counted against exactly that value. The cookie is httpOnly, so it cannot be chosen.
  const visitorSessionId=cookieStore.get('bosagezme_visitor')?.value;
  if(visitorSessionId)headers.set('X-Visitor-Session-ID',visitorSessionId);

  // Who the request is for. Without this the API sees only this server's address for every
  // visitor at once, which made the per-address cap on sign-in codes a cap on the whole
  // website. The first entry is the client; the rest are proxies that added themselves.
  // The last entry, and this is the whole of it: the edge appends the address it saw, and
  // a caller cannot append after it. Anything earlier in the chain is whatever the caller
  // sent, so reading the first entry -- which this did for one commit -- hands the choice
  // of address straight back to the person being limited, and lets them pin the blame on
  // somebody else's address while they are at it.
  //
  // Measured against the live site rather than reasoned about, because the shape of this
  // chain is a property of the edge and not of the code: a plain request arrived with one
  // entry, and the same request sent with a forged header arrived with the forged value
  // first and the real one still last.
  const forwarded=request.headers.get('x-forwarded-for')?.split(',') ?? [];
  const clientIP=forwarded[forwarded.length-1]?.trim();
  if(clientIP)headers.set(CLIENT_IP,clientIP);

  for(const key of ['content-type','x-origin-search-id','x-origin-search-result-id']){
    const value=request.headers.get(key);
    if(value)headers.set(key,value);
  }
  return headers;
}

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

  // Signing in must not depend on the credential you are trying to replace. The backend
  // rejects an invalid bearer token outright, even on routes that need no authentication,
  // so forwarding a stale access cookie to request-code answered INVALID_TOKEN and left
  // somebody unable to sign in again until they cleared their cookies by hand. A dead
  // token is exactly the state you are in when you need to sign in.
  const accessToken=anonymous?undefined:bearer??cookieStore.get('bosagezme_access')?.value;
  const headers=backendHeaders({request,cookieStore,accessToken});

  return fetch(target,{method,headers,body:['GET','HEAD'].includes(method)?undefined:body ?? undefined,duplex:body!==undefined&&![ 'GET','HEAD' ].includes(method)?'half':undefined} as RequestInit & { duplex?: 'half' });
}
