// The backend attributes a favorite or a review back to the search that led to it.
// The link is carried in sessionStorage because the user leaves the results page
// before acting, and it is deliberately per-tab and short lived.
const KEY='bosagezme:origin-search';

export type OriginSearch={search_id:string;search_result_id:string};

export function rememberOriginSearch(origin:OriginSearch){
  try{sessionStorage.setItem(KEY,JSON.stringify(origin));}catch{}
}

export function readOriginSearch():OriginSearch|undefined{
  try{
    const raw=sessionStorage.getItem(KEY);
    if(!raw)return undefined;
    const parsed=JSON.parse(raw) as Partial<OriginSearch>;
    return parsed.search_id&&parsed.search_result_id?{search_id:parsed.search_id,search_result_id:parsed.search_result_id}:undefined;
  }catch{return undefined;}
}

export function originSearchHeaders():Record<string,string>{
  const origin=readOriginSearch();
  return origin?{'X-Origin-Search-ID':origin.search_id,'X-Origin-Search-Result-ID':origin.search_result_id}:{};
}
