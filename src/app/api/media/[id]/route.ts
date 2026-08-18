import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:{code:'INVALID_INPUT',message:'Invalid media ID'}},{status:400});
  const cookieStore=await cookies();const headers:Record<string,string>={'X-BFF-Secret':process.env.BFF_SECRET??''};const access=cookieStore.get('bosagezme_access')?.value;if(access)headers.Authorization=`Bearer ${access}`;
  try{const response=await fetch(new URL(`/media/${id}`,API_ORIGIN),{headers,cache:'no-store'});return new NextResponse(await response.arrayBuffer(),{status:response.status,headers:{'content-type':response.headers.get('content-type')??'application/octet-stream','cache-control':response.headers.get('cache-control')??'public, max-age=300'}});}catch{return NextResponse.json({error:{code:'UPSTREAM_UNAVAILABLE',message:'Media is temporarily unavailable'}},{status:502});}
}
