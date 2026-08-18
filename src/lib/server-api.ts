import 'server-only'; import { cookies,headers } from 'next/headers'; import { notFound } from 'next/navigation'; import type { Locale,StoreDetail } from './types';
const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';
export async function serverApi<T>(path:string,init:RequestInit={}):Promise<T>{const cookieStore=await cookies();const requestHeaders=await headers();const locale=(cookieStore.get('bosagezme_locale')?.value??'tr') as Locale;const response=await fetch(`${API_ORIGIN}${path}`,{...init,cache:'no-store',headers:{'Content-Type':'application/json','X-BFF-Secret':process.env.BFF_SECRET??'','X-Locale':locale,'Accept-Language':requestHeaders.get('accept-language')??locale,...(cookieStore.get('bosagezme_access')?.value?{Authorization:`Bearer ${cookieStore.get('bosagezme_access')!.value}`}:{}) ,...(cookieStore.get('bosagezme_visitor')?.value?{'X-Visitor-Session-ID':cookieStore.get('bosagezme_visitor')!.value}:{}) ,...(init.headers??{})}});if(!response.ok)throw await response.json();return response.status===204?undefined as T:response.json()}
const STORE_ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// A store page must show that store or nothing. Falling back to sample content here
// used to render a fictional store for any unknown id, including /stores/undefined.
// A store with no reviews yet comes back with a null recent_posts, so the list is
// normalised here rather than leaving every caller to guard against it.
export async function getStore(id:string):Promise<StoreDetail>{if(!STORE_ID.test(id))notFound();try{const detail=await serverApi<StoreDetail>(`/v1/stores/${id}`);return {...detail,recent_posts:detail.recent_posts??[]}}catch{notFound()}}
export const backendOrigin=API_ORIGIN;
