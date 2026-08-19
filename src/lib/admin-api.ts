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

export const getOverview=()=>read<{snapshot:Snapshot;daily:unknown[]}>('overview');
export const getSearchInsights=()=>read<Record<string,unknown>>('search-insights');
export const getUsers=(q?:string)=>read<{items:UserRow[]}>(`users${qs({q,limit:100})}`);
export const getStores=(q?:string,premium?:boolean)=>read<{items:StoreRow[]}>(`stores${qs({q,premium:premium?'true':undefined,limit:100})}`);
export const getReviews=(q?:string)=>read<{items:ReviewRow[]}>(`reviews${qs({q,limit:100})}`);
export const getSearches=(q?:string)=>read<{items:SearchRow[]}>(`searches${qs({q,limit:100})}`);
export const getAudit=()=>read<{items:AuditRow[]}>(`audit${qs({limit:100})}`);
