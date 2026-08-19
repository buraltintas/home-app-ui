import {NextRequest,NextResponse} from 'next/server';
import {forwardToBackend} from '@/lib/backend-forward';
import {clearSessionCookies,setSessionCookies} from '@/lib/session-cookies';
import type {TokenPair} from '@/lib/types';

export async function POST(request:NextRequest){
  const response=await forwardToBackend({request,path:'auth/google',method:'POST',anonymous:true,body:await request.text()});
  const data=await response.json() as TokenPair|{error?:{code?:string}};
  const outgoing=NextResponse.json(response.ok?{user_id:(data as TokenPair).user_id}:data,{status:response.status});
  if(response.ok)setSessionCookies(outgoing,data as TokenPair);
  else if('error' in data&&data.error?.code==='ACCOUNT_UNAVAILABLE')clearSessionCookies(outgoing);
  return outgoing;
}
