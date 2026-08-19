import {NextRequest,NextResponse} from 'next/server';
import {forwardToBackend} from '@/lib/backend-forward';
import {clearSessionCookies,setSessionCookies} from '@/lib/session-cookies';
import type {TokenPair} from '@/lib/types';

export async function POST(request:NextRequest){
  const response=await forwardToBackend({request,path:'auth/email/verify-code',method:'POST',anonymous:true,body:await request.text()});
  const data=await response.json() as TokenPair|{error?:{code?:string}};
  const outgoing=NextResponse.json(response.ok?{user_id:(data as TokenPair).user_id}:data,{status:response.status});
  // The cookie must outlive the token it carries. When it expired with the token the
  // browser dropped it, the proxy sent no Authorization header at all, and the backend
  // answered as an anonymous visitor with 200 instead of the 401 that triggers a refresh.
  if(response.ok)setSessionCookies(outgoing,data as TokenPair);else if('error' in data&&data.error?.code==='ACCOUNT_UNAVAILABLE')clearSessionCookies(outgoing);
  return outgoing;
}
