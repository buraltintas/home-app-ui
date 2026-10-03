import {NextResponse,type NextRequest} from 'next/server';
import {isUnwelcomeCrawler} from '@/lib/crawlers';

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

// A store addressed by its id is sent to the address it is published under, here, before
// anything is rendered.
//
// The store page did this itself, with permanentRedirect -- but that page has a loading
// state, so by the time it knew the slug the response had already begun as a 200, and the
// redirect went out as a <meta http-equiv="refresh"> inside it. Search Console filed those
// URLs as "moved (other)", kept them as pages of their own, and showed one in results at
// position 35 beside the real one. A 308 sent from here is a redirect a crawler believes.
//
// Ids still reach crawlers from places that have only the id: a search result, a past
// search, a link somebody shared. The lookup is the store's own public record; its answer
// is remembered for a day, so a link followed twice costs one read. If the backend cannot
// say, the request goes on to the page, which still redirects the way it used to.
//
// The same goes for a store address written with capitals: slugs and ids are lower case,
// the backend matches either regardless, and the page would answer the capitalised copy with
// the same meta refresh. That one needs no lookup -- it is lower-cased here.
const STORE_PATH=/^\/(?:(en|de|ru)\/)?stores\/([^/]+)(\/reviews)?\/?$/i;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';
const SLUG_TTL=24*60*60*1000;
// A store the backend says does not exist is remembered as such for ten minutes, so a crawler
// working through an old list of deleted ids costs one read per id, not one per request.
const MISS_TTL=10*60*1000;
const SLUG_MEMORY=5000;
const slugs=new Map<string,{slug:string|null;at:number}>();
const asking=new Map<string,Promise<string|undefined>>();

function remember(id:string,slug:string|null){
  // The oldest entry goes first when the memory is full; a Map keeps insertion order.
  if(slugs.size>=SLUG_MEMORY)slugs.delete(slugs.keys().next().value as string);
  slugs.set(id,{slug,at:Date.now()});
}

async function slugFor(id:string):Promise<string|undefined>{
  const known=slugs.get(id);
  if(known&&Date.now()-known.at<(known.slug?SLUG_TTL:MISS_TTL))return known.slug??undefined;
  // Requests for the same id that arrive together share one read.
  const pending=asking.get(id);
  if(pending)return pending;
  const read=(async()=>{
    try{
      const response=await fetch(`${API_ORIGIN}/v1/stores/${id}`,{
        headers:{'Content-Type':'application/json','X-BFF-Secret':process.env.BFF_SECRET??'','X-Locale':DEFAULT_LOCALE},
        signal:AbortSignal.timeout(3000),
      });
      if(response.status===404){remember(id,null);return undefined;}
      if(!response.ok)return undefined;
      const slug=(await response.json() as {store?:{slug?:string}}).store?.slug;
      if(!slug||slug.toLowerCase()===id){remember(id,null);return undefined;}
      remember(id,slug);
      return slug;
    }catch{return undefined;}
    finally{asking.delete(id);}
  })();
  asking.set(id,read);
  return read;
}



// Renewing the token here was tried and removed. The browser already refreshes once, in a
// single flight, and the backend treats a second presentation of the same refresh token as
// theft: it revokes the whole session family. Proxy has no way to know a refresh is
// already in progress in the tab, so racing it did not just fail -- it signed people out
// for real, which is worse than the stale render it was meant to avoid.
export async function proxy(request:NextRequest){
  const {pathname}=request.nextUrl;
  const segment=pathname.split('/')[1]??'';

  // robots.txt asks these agents not to crawl the site. Some of them read it and stopped --
  // one that was making 4,685 requests a day now makes four. Others carried on regardless,
  // and a request that is refused here costs a header: the page is never rendered, so the
  // backend is never called and the database is never woken. Measured, that is the whole
  // point of doing it at the door rather than deeper in.
  //
  // 403 rather than a quiet 404: they are not being told the page is missing, they are
  // being told they may not have it. The rules are published at /robots.txt, which stays
  // readable to everyone including them.
  if(pathname!=='/robots.txt'&&isUnwelcomeCrawler(request.headers.get('user-agent'))){
    return new NextResponse('Disallowed by /robots.txt',{status:403,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}});
  }

  const store=STORE_PATH.exec(pathname);
  if(store){
    const [,prefix,ref,rest]=store;
    const lower=ref.toLowerCase();
    const slug=UUID.test(ref)?await slugFor(lower):undefined;
    const target=slug??lower;
    if(target!==ref||(prefix&&prefix!==prefix.toLowerCase())){
      const url=request.nextUrl.clone();
      url.pathname=`${prefix?`/${prefix.toLowerCase()}`:''}/stores/${target}${rest??''}`;
      return NextResponse.redirect(url,308);
    }
  }

  // An explicitly prefixed URL is authoritative: it is what was linked, shared or
  // crawled, and it must not be renegotiated away from under the visitor.
  if(isLocale(segment)){
    // /tr/... is a duplicate of the unprefixed Turkish URL, so it is redirected rather
    // than served, leaving one address per page.
    if(segment===DEFAULT_LOCALE){
      const url=request.nextUrl.clone();
      url.pathname=pathname.slice(3)||'/';
      // The address the visitor asked for is dropped here to keep one URL per page, and
      // the unprefixed address is negotiated -- so a /tr link opened in an English browser
      // was answered in English, which is the one thing the prefix was asking for. The
      // choice is carried into the negotiation through the cookie it already reads.
      //
      // Temporary rather than permanent, because a permanent redirect is answered from the
      // browser's own cache on every later visit: the hop would stop reaching the server,
      // and the header that carries the choice would never be sent again. The canonical
      // link and hreflang on the page itself are what consolidate the two addresses.
      const response=NextResponse.redirect(url,307);
      // It holds a language and nothing else, so losing it costs nothing -- but there is
      // no reason for it to travel over a plain connection either.
      response.cookies.set(COOKIE,DEFAULT_LOCALE,{path:'/',maxAge:31536000,sameSite:'lax',secure:process.env.NODE_ENV==='production'});
      return response;
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
  return withLocale(NextResponse.rewrite(url),DEFAULT_LOCALE);
}

// The locale is announced on the way out and never written onto the way in.
//
// Server components used to read it from a request header this added, which saved threading
// it down by hand and cost something nobody saw: rewriting a request's headers in middleware
// makes every page in the application dynamic, so nothing could be cached and declaring a
// page static answered 500 on every view. Every route that renders text has its own [locale]
// segment, so each page reads it from there now.
//
// The response header stays. It costs nothing, it does not touch the request, and a proxy or
// a log downstream can still see which language was served.
function withLocale(input:NextRequest|NextResponse,locale:Locale):NextResponse{
  const response=input instanceof NextResponse?input:NextResponse.next();
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
