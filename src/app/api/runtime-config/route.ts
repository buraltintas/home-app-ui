import {NextResponse} from 'next/server';

export const dynamic='force-dynamic';

const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';

export async function GET(){
  let reviewRadiusMeters=2000;
  try{
    const response=await fetch(`${API_ORIGIN}/v1/runtime-config`,{
      cache:'no-store',
      headers:{'X-BFF-Secret':process.env.BFF_SECRET??''},
      signal:AbortSignal.timeout(2000),
    });
    if(response.ok){
      const config=await response.json() as {store_review_radius_meters?:number};
      if(typeof config.store_review_radius_meters==='number'&&config.store_review_radius_meters>0){
        reviewRadiusMeters=config.store_review_radius_meters;
      }
    }
  }catch{
    // Authentication remains usable during a temporary backend outage. The review
    // flow receives the documented default until the runtime endpoint is reachable.
  }
  return NextResponse.json({
    googleClientId:process.env.GOOGLE_CLIENT_ID??process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID??'',
    reviewRadiusMeters,
  },{headers:{'cache-control':'no-store, no-cache, must-revalidate'}});
}
