import {NextResponse,type NextRequest} from 'next/server';

// Locale used to live only in a cookie. Googlebot sends no cookies, so every crawl saw
// Turkish, `<html lang>` was always `tr`, and the fully translated English, German and
// Russian dictionaries were unreachable to search engines entirely. hreflang was also
// impossible in principle, because one URL cannot declare four alternates of itself.
//
// Turkish stays unprefixed so existing links keep working and stay canonical; the other
// three get real URLs. The prefix is rewritten, not redirected, so `/discover` serves
// Turkish without a round trip.
const LOCALES=['tr','en','de','ru'] as const;
const DEFAULT_LOCALE='tr';
const COOKIE='bosagezme_locale';

type Locale=typeof LOCALES[number];
const isLocale=(value:string):value is Locale=>(LOCALES as readonly string[]).includes(value);

// A visitor who has chosen a language keeps it; otherwise the browser's own preference
// decides, and Turkish is the floor. A crawler sends neither, so it gets the default and
// reaches the other languages through hreflang rather than through negotiation.
function preferredLocale(request:NextRequest):Locale{
  const chosen=request.cookies.get(COOKIE)?.value;
  if(chosen&&isLocale(chosen))return chosen;
  for(const part of (request.headers.get('accept-language')??'').split(',')){
    const tag=part.split(';')[0]?.trim().slice(0,2).toLowerCase();
    if(tag&&isLocale(tag))return tag;
  }
  return DEFAULT_LOCALE;
}


// The access token lives 15 minutes; its cookie lives as long as the refresh token, so a
// stale token keeps being sent long after it died. Server components cannot write cookies,
// so serverApi could only degrade to an anonymous read -- which is why a signed-in visitor
// would suddenly see logged-out pages until they refreshed, and why refreshing fixed it.
//
// Proxy runs before rendering and *can* write cookies, so this is the one place the token
// can be renewed in time for the render that needs it.
//
// The payload is decoded, never trusted: it only decides whether to attempt a refresh. The
// API still verifies the signature on every call.
function accessTokenExpiresSoon(token:string|undefined):boolean{
  if(!token)return false;
  const payload=token.split('.')[1];
  if(!payload)return true;
  try{
    const decoded=JSON.parse(Buffer.from(payload.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString()) as {exp?:number};
    if(typeof decoded.exp!=='number')return true;
    // Refresh a little early, so a render that starts just before expiry does not finish
    // just after it.
    return decoded.exp*1000-Date.now()<60_000;
  }catch{return true;}
}

async function renewSession(request:NextRequest):Promise<string[]>{
  const access=request.cookies.get('bosagezme_access')?.value;
  const refresh=request.cookies.get('bosagezme_refresh')?.value;
  if(!refresh||!accessTokenExpiresSoon(access))return [];
  try{
    const renewed=await fetch(new URL('/api/auth/refresh',request.nextUrl.origin),{
      method:'POST',
      headers:{cookie:request.headers.get('cookie')??''},
    });
    const cookies=renewed.headers.getSetCookie();
    // Update the incoming request too, so the render happening on this very request is
    // built as the signed-in visitor rather than one render behind.
    const updated=cookies.find(value=>value.startsWith('bosagezme_access='));
    const value=updated?.split(';')[0]?.split('=')[1];
    if(value)request.cookies.set('bosagezme_access',value);
    return cookies;
  }catch{return [];/* a failed renewal leaves the request exactly as it arrived */}
}

export async function proxy(request:NextRequest){
  // Renewal happens before routing, so the response it produces already reflects the
  // refreshed session, and the new cookies ride out on whatever that response turns out
  // to be -- rewrite or redirect alike.
  const refreshed=await renewSession(request);
  const response=route(request);
  for(const cookie of refreshed)response.headers.append('set-cookie',cookie);
  return response;
}

function route(request:NextRequest):NextResponse{
  const {pathname}=request.nextUrl;
  const segment=pathname.split('/')[1]??'';

  // An explicitly prefixed URL is authoritative: it is what was linked, shared or
  // crawled, and it must not be renegotiated away from under the visitor.
  if(isLocale(segment)){
    // /tr/... is a duplicate of the unprefixed Turkish URL, so it is redirected rather
    // than served, leaving one address per page.
    if(segment===DEFAULT_LOCALE){
      const url=request.nextUrl.clone();
      url.pathname=pathname.slice(3)||'/';
      return NextResponse.redirect(url,308);
    }
    return withLocale(request,segment);
  }
  const locale=preferredLocale(request);
  const url=request.nextUrl.clone();
  // Turkish is served in place. Anything else moves to its own URL so that the language
  // a person reads is the language the address describes.
  if(locale!==DEFAULT_LOCALE){
    url.pathname=`/${locale}${pathname}`;
    return NextResponse.redirect(url,307);
  }
  url.pathname=`/${DEFAULT_LOCALE}${pathname}`;
  return withLocale(NextResponse.rewrite(url,{request:localeHeaders(request,DEFAULT_LOCALE)}),DEFAULT_LOCALE);
}

function localeHeaders(request:NextRequest,locale:Locale){
  const headers=new Headers(request.headers);
  headers.set('x-locale',locale);
  return {headers};
}

// Server components read the locale from this header rather than from params, so no page
// has to thread it down by hand.
function withLocale(input:NextRequest|NextResponse,locale:Locale):NextResponse{
  const response=input instanceof NextResponse?input:NextResponse.next({request:localeHeaders(input,locale)});
  response.headers.set('x-locale',locale);
  return response;
}

export const config={
  // Route handlers, build assets and the metadata files are served untouched: the BFF
  // boundary, robots.txt/sitemap.xml, the share image and the admin surface have no locale
  // and must not gain a prefix. /og and /admin have no file extension, so they need naming
  // here or they get rewritten to /tr/... and 404.
  matcher:['/((?!api|og|admin|_next|.*\\..*).*)'],
};
