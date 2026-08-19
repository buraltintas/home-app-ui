import 'server-only';
import {serverApi} from './server-api';

// Admin reads go through the same server-side path as every other backend call, so the
// BFF boundary is unchanged: the browser never addresses the Go API, and the admin session
// is the ordinary one already in the cookie.
//
// The backend answers 404 rather than 403 to a non-administrator, so a failure here is
// indistinguishable from the route not existing. That is the point; the page turns it into
// an access message rather than leaking which it was.
export type AdminResult<T>={ok:true;data:T}|{ok:false};

async function read<T>(path:string):Promise<AdminResult<T>>{
  try{return {ok:true,data:await serverApi<T>(`/v1/admin/${path}`)};}
  catch{return {ok:false};}
}

export type Snapshot={total_users?:number;total_stores?:number;total_posts?:number;total_searches?:number}&Record<string,unknown>;
export type UserRow={id:string;email:string;username:string;display_name:string;status:string;review_count:number;created_at:string;deleted_at?:string};
export type StoreRow={id:string;name:string;slug:string;city:string;is_premium:boolean;review_count:number;average_rating:number;created_at:string};
export type ReviewRow={id:string;store_id:string;store_name:string;user_id:string;author:string;rating:number;text:string;created_at:string;deleted:boolean};
export type SearchRow={id:string;query:string;user_id?:string;query_language:string;scope:string;result_count:number;click_count:number;duration_ms?:number;fallback_state?:string;created_at:string};
export type AuditRow={id:string;actor_email:string;action:string;target_type:string;target_id:string;metadata:Record<string,unknown>;created_at:string};

const qs=(params:Record<string,string|number|undefined>)=>{
  const search=new URLSearchParams();
  for(const [key,value] of Object.entries(params))if(value!==undefined&&value!=='')search.set(key,String(value));
  const text=search.toString();
  return text?`?${text}`:'';
};

export const PAGE_SIZE=50;

// One extra row is requested and then dropped. It answers "is there a next page?" without
// a second COUNT over the whole table, which on the searches log is the expensive question.
export type Page<T>={rows:T[];hasNext:boolean};

async function readPage<T>(path:string,params:Record<string,string|number|undefined>,page:number):Promise<AdminResult<Page<T>>>{
  const offset=Math.max(0,page)*PAGE_SIZE;
  const result=await read<{items:T[]}>(`${path}${qs({...params,limit:PAGE_SIZE+1,offset})}`);
  if(!result.ok)return {ok:false};
  const items=result.data.items??[];
  return {ok:true,data:{rows:items.slice(0,PAGE_SIZE),hasNext:items.length>PAGE_SIZE}};
}

export const getOverview=()=>read<{snapshot:Snapshot;daily:unknown[]}>('overview');
export const getSearchInsights=()=>read<Record<string,unknown>>('search-insights');
export const getUsers=(q?:string,page=0)=>readPage<UserRow>('users',{q},page);
export const getStores=(q?:string,premium?:boolean,page=0)=>readPage<StoreRow>('stores',{q,premium:premium?'true':undefined},page);
export const getReviews=(q?:string,page=0)=>readPage<ReviewRow>('reviews',{q},page);
export const getSearches=(q?:string,page=0)=>readPage<SearchRow>('searches',{q},page);
export const getAudit=(page=0)=>readPage<AuditRow>('audit',{},page);
