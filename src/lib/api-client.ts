let refreshing:Promise<boolean>|null=null;

function refresh():Promise<boolean>{
  if(!refreshing)refreshing=fetch('/api/auth/refresh',{method:'POST'}).then(response=>response.ok).catch(()=>false).finally(()=>{refreshing=null});
  return refreshing;
}

export async function apiFetch(path:string,init?:RequestInit):Promise<Response>{
  const response=await fetch(path,init);
  if(response.status!==401)return response;
  const ok=await refresh();
  if(!ok)return response;
  return fetch(path,init);
}
