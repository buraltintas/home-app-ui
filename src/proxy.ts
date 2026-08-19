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

export function proxy(request:NextRequest){
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
