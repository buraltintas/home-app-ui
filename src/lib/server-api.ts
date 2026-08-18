import 'server-only'; import { cookies,headers } from 'next/headers'; import { notFound } from 'next/navigation'; import type { Comment,Locale,Post,PublicProfile,StoreDetail } from './types';
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
  if(!response.ok)throw await response.json();
  return response.status===204?undefined as T:response.json();
}
const STORE_ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// A store page must show that store or nothing. Falling back to sample content here
// used to render a fictional store for any unknown id, including /stores/undefined.
// A store with no reviews yet comes back with a null recent_posts, so the list is
// normalised here rather than leaving every caller to guard against it.
export async function getStore(id:string):Promise<StoreDetail>{if(!STORE_ID.test(id))notFound();try{const detail=await serverApi<StoreDetail>(`/v1/stores/${id}`);return {...detail,recent_posts:detail.recent_posts??[]}}catch{notFound()}}

// A review page shows that review. Comments are a separate read so a failure there
// still leaves the review itself on screen rather than turning the page into a 404.
export async function getPost(id:string):Promise<Post>{if(!STORE_ID.test(id))notFound();try{return await serverApi<Post>(`/v1/posts/${id}`)}catch{notFound()}}
export async function getComments(id:string):Promise<Comment[]>{try{return (await serverApi<{items:Comment[]}>(`/v1/posts/${id}/comments?limit=50`)).items??[]}catch{return []}}
export async function getProfile(id:string):Promise<PublicProfile>{if(!STORE_ID.test(id))notFound();try{return await serverApi<PublicProfile>(`/v1/users/${id}`)}catch{notFound()}}
export async function getUserPosts(id:string):Promise<Post[]>{try{return (await serverApi<{items:Post[]}>(`/v1/users/${id}/posts?limit=20`)).items??[]}catch{return []}}
export const backendOrigin=API_ORIGIN;
