// The search page keeps the last query and its results so that leaving Discover and
// returning does not throw the work away. Global navigation never destroys work merely
// because another page was opened.
export const SNAPSHOT_KEY='bosagezme:search';

// Kept in local storage rather than session storage, and this is the whole of the mobile
// bug: a phone under memory pressure discards the background tab while a store page is
// open, and everything session storage held goes with it. The visitor comes back and the
// page has never heard of their search. A desktop tab is rarely discarded, which is why
// only one of the two was affected.
//
// Local storage survives that. It also survives longer than it should, so the snapshot
// carries the moment it was written and is ignored once it is stale -- a search from
// yesterday is not what somebody is returning to.
const SNAPSHOT_MAX_AGE=60*60*1000;

type Stored<T>={saved_at:number;value:T};

export function readSearchSnapshot<T>():T|undefined{
  try{
    const raw=window.localStorage.getItem(SNAPSHOT_KEY);
    if(!raw)return undefined;
    const held=JSON.parse(raw) as Stored<T>;
    if(typeof held?.saved_at!=='number'||Date.now()-held.saved_at>SNAPSHOT_MAX_AGE){
      window.localStorage.removeItem(SNAPSHOT_KEY);
      return undefined;
    }
    return held.value;
  }catch{return undefined;}
}

export function writeSearchSnapshot<T>(value:T){
  try{window.localStorage.setItem(SNAPSHOT_KEY,JSON.stringify({saved_at:Date.now(),value} satisfies Stored<T>));}catch{}
}

export function clearSearchSnapshot(){
  try{window.localStorage.removeItem(SNAPSHOT_KEY);}catch{}
}
