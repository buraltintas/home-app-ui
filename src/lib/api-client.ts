let refreshing:Promise<boolean>|null=null;

// Server components read the access cookie directly and cannot refresh it, so once the
// browser has obtained a fresh token it announces the fact and whoever rendered against
// the stale one can ask for new markup.
export const SESSION_REFRESHED='bosagezme:session-refreshed';

function refresh():Promise<boolean>{
  if(!refreshing)refreshing=fetch('/api/auth/refresh',{method:'POST'})
    .then(response=>{
      if(response.ok)window.dispatchEvent(new Event(SESSION_REFRESHED));
      return response.ok;
    })
    .catch(()=>false)
    .finally(()=>{refreshing=null});
  return refreshing;
}

export async function apiFetch(path:string,init?:RequestInit):Promise<Response>{
  const response=await fetch(path,init);
  if(response.status!==401)return response;
  const ok=await refresh();
  if(!ok)return response;
  // A signal that already fired cannot be reused for the retry, which silently turned
  // every refreshed request into an abort.
  const retry:RequestInit={...init};
  delete retry.signal;
  return fetch(path,retry);
}
