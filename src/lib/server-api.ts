import 'server-only'; import { cache } from 'react'; import { cookies,headers } from 'next/headers'; import { notFound } from 'next/navigation'; import type { Comment,Locale,Post,PublicProfile,StoreDetail } from './types';
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
export async function getStoreIndex(limit=2000):Promise<StoreIndexEntry[]>{try{return (await serverApi<{items:StoreIndexEntry[]}>(`/v1/stores/index?limit=${limit}`)).items??[]}catch{return []}}

export const backendOrigin=API_ORIGIN;
