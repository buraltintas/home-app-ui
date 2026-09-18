import 'server-only'; import { cache } from 'react'; import { cookies,headers } from 'next/headers'; import { notFound } from 'next/navigation'; import type { Comment,Locale,MonthlyStoreHighlights,Post,PublicProfile,StoreDetail,StoredPhoto } from './types';
const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';
export async function serverApi<T>(path:string,init:RequestInit={}):Promise<T>{
  const cookieStore=await cookies();const requestHeaders=await headers();
  const locale=(cookieStore.get('bosagezme_locale')?.value??'tr') as Locale;
  const access=cookieStore.get('bosagezme_access')?.value;
  const visitor=cookieStore.get('bosagezme_visitor')?.value;
  const send=(authorization?:string)=>fetch(`${API_ORIGIN}${path}`,{...init,cache:'no-store',headers:{'Content-Type':'application/json','X-BFF-Secret':process.env.BFF_SECRET??'','X-Locale':locale,'Accept-Language':requestHeaders.get('accept-language')??locale,...(authorization?{Authorization:`Bearer ${authorization}`}:{}),...(visitor?{'X-Visitor-Session-ID':visitor}:{}),...(init.headers??{})}});
  let response=await send(access);
  // Rendering cannot write cookies, so a server component has no way to refresh an
  // expired token. Reading the page anonymously is the honest degradation; the browser
  // refreshes moments later and asks for this markup again.
  if(response.status===401&&access)response=await send(undefined);
  if(!response.ok){
    // The status has to survive. "The backend said this does not exist" and "the backend
    // did not answer" are different facts, and a caller that cannot tell them apart ends
    // up telling somebody their store was removed when the truth is that a request timed
    // out. The parsed body is kept for callers that read the error code.
    const body=await response.json().catch(()=>undefined);
    throw new ApiError(response.status,body);
  }
  return response.status===204?undefined as T:response.json();
}

// The same backend, asked as nobody in particular.
//
// serverApi reads cookies and request headers, which is right for anything that depends on
// who is asking -- and which also marks the route dynamic, so a page that declares
// `revalidate` silently never gets it. The sitemap was built from scratch on every single
// request for that reason: five megabytes of XML, per hit, because it wanted the visitor's
// language and never used it.
//
// This asks for the public version of a thing and lets Next cache the answer. No cookie is
// read, so nothing here can vary by reader.
export async function publicApi<T>(path:string,{locale='tr',revalidate=3600}:{locale?:Locale;revalidate?:number}={}):Promise<T>{
  const response=await fetch(`${API_ORIGIN}${path}`,{
    next:{revalidate},
    headers:{'Content-Type':'application/json','X-BFF-Secret':process.env.BFF_SECRET??'','X-Locale':locale,'Accept-Language':locale},
  });
  if(!response.ok)throw new ApiError(response.status,await response.json().catch(()=>undefined));
  return response.status===204?undefined as T:response.json();
}

// Carries the HTTP status alongside whatever the backend said.
export class ApiError extends Error{
  constructor(readonly status:number,readonly body?:unknown){
    super(`api ${status}`);
    this.name='ApiError';
  }
}
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// A store is reachable by slug as well as by id, so the URL can carry the store's name.
// The shape is still checked before it reaches the backend: anything that is neither a
// uuid nor a plausible slug is a 404 here rather than a wasted round trip.
const STORE_REF=/^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
// A store page must show that store or nothing. Falling back to sample content here
// used to render a fictional store for any unknown id, including /stores/undefined.
// A store with no reviews yet comes back with a null recent_posts, so the list is
// normalised here rather than leaving every caller to guard against it.
// Wrapped in React's request cache: a store page fetches its store twice, once for the
// page and once for generateMetadata, and those are the same store in the same request.
// Two backend round trips per view, halved by four characters of memoisation.
export const getStore=cache(async function getStore(ref:string):Promise<StoreDetail>{
  if(!STORE_REF.test(ref)&&!UUID.test(ref))notFound();
  try{
    const detail=await serverApi<StoreDetail>(`/v1/stores/${encodeURIComponent(ref)}`);
    return {...detail,recent_posts:detail.recent_posts??[]};
  }catch(reason){
    // Only a 404 means the store is gone. Everything else -- a timeout, a 500, a request
    // that never got out -- is our failure to read, and saying "this store is no longer in
    // our list" about a store that is plainly still there is worse than saying nothing.
    // It also stuck: a not-found answer is cached by the router, so the page kept refusing
    // until the visitor reloaded, which is exactly what was reported.
    if(reason instanceof ApiError&&reason.status===404)notFound();
    throw reason;
  }
});

// The same store, read the way a cached page has to read it: with nobody's credentials and
// nobody's cookies.
//
// Touching cookies() or headers() is what makes a page dynamic, so a page that wants to be
// built once and served to everybody cannot use the reader above -- and must not, because
// what it would fetch is one reader's view of the store. This asks anonymously, tells Next
// how long the answer may be reused, and leaves everything that differs per reader to be
// read in the browser afterwards.
export const getPublicStore=cache(async function getPublicStore(ref:string,locale:Locale,seconds:number):Promise<StoreDetail>{
  if(!STORE_REF.test(ref)&&!UUID.test(ref))notFound();
  const response=await fetch(`${API_ORIGIN}/v1/stores/${encodeURIComponent(ref)}`,{
    next:{revalidate:seconds},
    headers:{'Content-Type':'application/json','X-BFF-Secret':process.env.BFF_SECRET??'','X-Locale':locale,'Accept-Language':locale},
  });
  if(response.status===404)notFound();
  if(!response.ok)throw new ApiError(response.status,await response.json().catch(()=>undefined));
  const detail=await response.json() as StoreDetail;
  return {...detail,recent_posts:detail.recent_posts??[]};
});

// A review page shows that review. Comments are a separate read so a failure there
// still leaves the review itself on screen rather than turning the page into a 404.
export async function getPost(id:string):Promise<Post>{if(!UUID.test(id))notFound();try{return await serverApi<Post>(`/v1/posts/${id}`)}catch(reason){if(reason instanceof ApiError&&reason.status===404)notFound();throw reason}}
export async function getComments(id:string):Promise<Comment[]>{try{return (await serverApi<{items:Comment[]}>(`/v1/posts/${id}/comments?limit=50`)).items??[]}catch{return []}}
export async function getProfile(id:string):Promise<PublicProfile>{if(!UUID.test(id))notFound();try{return await serverApi<PublicProfile>(`/v1/users/${id}`)}catch(reason){if(reason instanceof ApiError&&reason.status===404)notFound();throw reason}}
export async function getUserPosts(id:string):Promise<Post[]>{try{return (await serverApi<{items:Post[]}>(`/v1/users/${id}/posts?limit=20`)).items??[]}catch{return []}}
// The feed is read on the server so the homepage arrives with reviews already in the
// HTML. It used to be fetched from an effect, which left the server response an empty
// shell for crawlers and for anyone on a slow connection.
// The cursor comes back with the first page so the client can continue from where the
// server stopped. Without it the feed silently ended at the first twenty reviews.

// Every published store, for the sitemap. Enumerating the catalogue is a separate
// backend concern from searching it, so this is the one endpoint that can answer it.
export type StoreIndexEntry={id:string;slug:string;name:string;city:string;updated_at:string;review_count:number};
// Throws rather than returning an empty page, and the sitemap is the reason.
//
// Paging stops when a short page comes back, so a swallowed failure ends the walk early and
// the sitemap ships truncated -- silently. It happened: a chunk that should have carried
// 2,000 stores carried none, and the published sitemap fell from 12,589 pages to 9,921 with
// nothing reporting a fault. A sitemap listing fewer pages than exist tells a search engine
// those pages are gone, which is worse than not answering at all.
export async function getStoreIndex(limit=2000,offset=0):Promise<StoreIndexEntry[]>{
  return (await publicApi<{items:StoreIndexEntry[]}>(`/v1/stores/index?limit=${limit}&offset=${offset}`)).items??[];
}

// The backend answers at most five thousand rows per call, and the catalogue passed that
// some time ago. The old single call asked for two thousand and stopped there -- a number
// chosen when the catalogue held 838 shops, which became a silent ceiling: 9,252 store
// pages existed and were offered to no crawler at all.
const INDEX_PAGE=5000;
// A ceiling that is an alarm, not a policy. Paging stops when a short page comes back; this
// only catches a backend that has started answering full pages forever, and 60,000 rows is
// far enough above the catalogue that reaching it means something is wrong rather than big.
const INDEX_CEILING=60000;

// Every published store, for the sitemap, however many there are. Ordering is stable by id
// on the backend, so paging cannot skip or repeat a row while stores are being written.
export const getAllStores=cache(async():Promise<StoreIndexEntry[]>=>{
  const all:StoreIndexEntry[]=[];
  for(let offset=0;offset<INDEX_CEILING;offset+=INDEX_PAGE){
    const page=await getStoreIndex(INDEX_PAGE,offset);
    all.push(...page);
    if(page.length<INDEX_PAGE)break;
  }
  return all;
});

// A neighbouring shop as the store page lists it. The backend decides what "nearby" and
// "similar" mean; this is only the shape it answers in.
export type NearbyStore={id:string;slug:string;name:string;district?:string;city:string;distance_meters:number;average_rating:number;review_count:number;brand_slug?:string;photo?:StoredPhoto};
export async function getNearbyStores(ref:string,limit=6):Promise<NearbyStore[]>{
  if(!UUID.test(ref)&&!STORE_REF.test(ref))return [];
  // Read as nobody in particular: which shops are near this one does not depend on who is
  // asking, so the answer is shared and cached rather than rebuilt per reader.
  //
  // A store page is worth rendering without its neighbours; it is not worth failing over
  // them. Anything that goes wrong here leaves the block out and the page stands.
  try{return (await publicApi<{items:NearbyStore[]}>(`/v1/stores/${ref}/nearby?limit=${limit}`)).items??[]}catch{return []}
}

export const backendOrigin=API_ORIGIN;


// What the home page says about the community, read on the server so it is in the document
// a crawler is given rather than fetched by a browser afterwards. It was a client effect,
// which is why the home page linked to no store page at all: the links existed, and nothing
// without JavaScript ever saw them.
export type PopularCity={name:string;search_count:number};
export type PopularCategory={slug:string;name:string;search_count:number};
export type HomeSignals={highlights:MonthlyStoreHighlights;cities:PopularCity[];categories:PopularCategory[]};
export async function getHomeSignals(locale:Locale):Promise<HomeSignals>{
  // Three independent reads, and any one of them may be missing without the other two
  // becoming untrue. A home page is worth rendering with two of its three lists.
  const [highlights,cities,categories]=await Promise.all([
    publicApi<MonthlyStoreHighlights>('/v1/search/highlights',{locale}).catch(()=>({} as MonthlyStoreHighlights)),
    publicApi<{items:PopularCity[]}>('/v1/search/popular-cities?limit=5',{locale}).then(r=>r.items??[]).catch(()=>[]),
    publicApi<{items:PopularCategory[]}>('/v1/categories',{locale}).then(r=>r.items??[]).catch(()=>[]),
  ]);
  return {highlights,cities,categories:categories.filter(item=>item.search_count>0).slice(0,5)};
}


// The pages the catalogue can actually fill: one city, one category, at least ten shops.
// The backend decides which pairs clear that line; this is only the shape it answers in.
export type CityCategory={city:string;city_slug:string;category_slug:string;category_name:string;category_url_slug:string;store_count:number};
// Deliberately not caught.
//
// An empty list here does not mean "this pair does not exist", it means "we could not find
// out" -- and the pages built on it cannot tell those apart: they call notFound(), and the
// 404 is then cached for an hour and handed to Google, which reads it as the page being
// gone. This is not hypothetical. The weekly check caught /istanbul/mobilya-magazalari and
// /izmir/hali-magazalari answering 404 during a deploy while page 2 of the same lists and
// every other city answered fine.
//
// Throwing gives a 500 instead. A crawler treats that as "come back later", which is the
// truth, and Next does not cache it.
export const getCityCategories=cache(async(locale:Locale):Promise<CityCategory[]>=>
  (await publicApi<{items:CityCategory[]}>('/v1/discovery/city-categories',{locale})).items??[]);

// The same list for callers that only decorate a page with it. A store page shows links to
// the pages its shop belongs to; not knowing them costs a few links and nothing else, so
// here the failure really is worth swallowing.
export const getCityCategoriesIfKnown=cache(async(locale:Locale):Promise<CityCategory[]>=>{
  try{return await getCityCategories(locale);}catch{return [];}
});

export type CatalogEntry={id:string;slug:string;name:string;address?:string;district?:string;city:string;average_rating:number;review_count:number;brand_name?:string;brand_slug?:string;category_labels:string[];photo?:StoredPhoto};
export type CityCategoryPage={city:string;category_slug:string;category_name:string;total:number;items:CatalogEntry[]};
export async function getCityCategoryPage(citySlug:string,categorySlug:string,locale:Locale,limit=60,offset=0):Promise<CityCategoryPage|undefined>{
  try{return await publicApi<CityCategoryPage>(`/v1/discovery/stores?city=${encodeURIComponent(citySlug)}&category=${encodeURIComponent(categorySlug)}&limit=${limit}&offset=${offset}`,{locale});}catch{return undefined;}
}


// One chain's branches in one city -- the question Search Console says people actually ask.
export type CityBrand={city:string;city_slug:string;brand_slug:string;brand_name:string;store_count:number};
// Throws, for the same reason getCityCategories throws.
export const getCityBrands=cache(async(locale:Locale):Promise<CityBrand[]>=>
  (await publicApi<{items:CityBrand[]}>('/v1/discovery/city-brands',{locale})).items??[]);

export const getCityBrandsIfKnown=cache(async(locale:Locale):Promise<CityBrand[]>=>{
  try{return await getCityBrands(locale);}catch{return [];}
});

export type CityBrandPage={city:string;brand_slug:string;brand_name:string;total:number;items:CatalogEntry[]};
export async function getCityBrandPage(citySlug:string,brandSlug:string,locale:Locale,limit=60,offset=0):Promise<CityBrandPage|undefined>{
  try{return await publicApi<CityBrandPage>(`/v1/discovery/brand-stores?city=${encodeURIComponent(citySlug)}&brand=${encodeURIComponent(brandSlug)}&limit=${limit}&offset=${offset}`,{locale});}catch{return undefined;}
}
