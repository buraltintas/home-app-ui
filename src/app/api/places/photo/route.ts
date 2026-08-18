import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';
// Mirrors the backend guard. The character class is what keeps the value from
// escaping the provider URL; the length only has to be generous enough for a real
// photo reference, which Google issues at well over four hundred characters.
const PHOTO_NAME=/^places\/[A-Za-z0-9_-]{1,300}\/photos\/[A-Za-z0-9_-]{1,1000}$/;

export async function GET(request:Request){
  const {searchParams}=new URL(request.url);
  const name=searchParams.get('name')??'';
  if(!PHOTO_NAME.test(name))return NextResponse.json({error:{code:'INVALID_INPUT',message:'Invalid photo name'}},{status:400});
  const width=Math.min(1600,Math.max(160,Number(searchParams.get('w'))||520));
  const cookieStore=await cookies();
  const headers:Record<string,string>={'X-BFF-Secret':process.env.BFF_SECRET??''};
  const access=cookieStore.get('bosagezme_access')?.value;
  if(access)headers.Authorization=`Bearer ${access}`;
  const target=new URL('/v1/places/photo',API_ORIGIN);
  target.searchParams.set('name',name);
  target.searchParams.set('max_width',String(width));
  try{
    const response=await fetch(target,{headers,cache:'no-store'});
    if(!response.ok)return NextResponse.json({error:{code:'PHOTO_UNAVAILABLE',message:'Photo is unavailable'}},{status:response.status});
    return new NextResponse(await response.arrayBuffer(),{status:200,headers:{'content-type':response.headers.get('content-type')??'image/jpeg','cache-control':'public, max-age=3600'}});
  }catch{return NextResponse.json({error:{code:'UPSTREAM_UNAVAILABLE',message:'Photo is temporarily unavailable'}},{status:502});}
}
