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

// Writes still in the air when a page reads. Saving a store and going straight to the
// favourites list showed an empty list: the list request overtook the save that had not
// landed yet, and only a reload put the store back. The optimistic flip in the button is
// what makes this easy to hit -- it looks finished long before it is.
//
// Module state survives client navigation, so the write a previous page started is still
// known here. Reads wait for it; writes wait for nothing.
const pendingWrites=new Set<Promise<unknown>>();
// A write that never settles must not hold every read hostage. After this the read goes
// ahead and may be a moment stale, which is the lesser failure.
const WRITE_WAIT_MS=8000;

function settleWrites():Promise<unknown>{
  if(pendingWrites.size===0)return Promise.resolve();
  return Promise.race([
    (async()=>{while(pendingWrites.size)await Promise.allSettled([...pendingWrites]);})(),
    new Promise(resolve=>setTimeout(resolve,WRITE_WAIT_MS)),
  ]);
}

// Renew the session on purpose rather than in response to a failure. It shares the
// single-flight guard with the reactive path, so a scheduled renewal and a 401 arriving
// together still present the refresh token exactly once.
export function renewSession():Promise<boolean>{return refresh();}

async function send(path:string,init?:RequestInit):Promise<Response>{
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

export async function apiFetch(path:string,init?:RequestInit):Promise<Response>{
  const method=(init?.method??'GET').toUpperCase();
  if(method==='GET'||method==='HEAD'){
    await settleWrites();
    return send(path,init);
  }
  const call=send(path,init);
  pendingWrites.add(call);
  // Both outcomes clear it, so a failed write cannot leave every later read waiting.
  void call.then(()=>pendingWrites.delete(call),()=>pendingWrites.delete(call));
  return call;
}
