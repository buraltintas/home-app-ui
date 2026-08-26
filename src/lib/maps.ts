// Google's documented Maps URL for a place. The shorter `place/?q=place_id:…` form looks
// tidier and answers "no results found" often enough to be useless — reported from the
// live site after shipping exactly that. This one is the format Google supports, and the
// coordinates carry the link when the id cannot, so it always lands somewhere real.
export function mapsLink(latitude:number,longitude:number,placeID?:string){
  const base=`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  return placeID?`${base}&query_place_id=${encodeURIComponent(placeID)}`:base;
}
