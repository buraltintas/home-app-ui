// The search page keeps the last query and its results for the length of a tab so
// that opening a result and coming back does not throw the work away. Reaching the
// page from the navigation means the opposite: start over. Both sides of that
// contract live here so the header does not have to import the search component.
export const SNAPSHOT_KEY='bosagezme:search';
export const RESET_EVENT='bosagezme:search-reset';

export function startFreshSearch(){
  try{sessionStorage.removeItem(SNAPSHOT_KEY);}catch{}
  // Pressing the link while already on the search page never remounts it, so the
  // running instance has to be told as well.
  window.dispatchEvent(new Event(RESET_EVENT));
}
