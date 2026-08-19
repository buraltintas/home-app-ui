import {NextRequest,NextResponse} from 'next/server';
import {forwardToBackend} from '@/lib/backend-forward';
import type {TokenPair} from '@/lib/types';

export async function POST(request:NextRequest){
  const response=await forwardToBackend({request,path:'auth/email/verify-code',method:'POST',anonymous:true,body:await request.text()});
  const data=await response.json() as TokenPair|{error?:{code?:string}};
  const outgoing=NextResponse.json(response.ok?{user_id:(data as TokenPair).user_id}:data,{status:response.status});
  // The cookie must outlive the token it carries. When it expired with the token the
  // browser dropped it, the proxy sent no Authorization header at all, and the backend
  // answered as an anonymous visitor with 200 instead of the 401 that triggers a refresh.
  if(response.ok){const pair=data as TokenPair;const secure=process.env.NODE_ENV==='production';outgoing.cookies.set('bosagezme_access',pair.access_token,{httpOnly:true,secure,sameSite:'lax',path:'/',expires:new Date(pair.refresh_expires_at)});outgoing.cookies.set('bosagezme_refresh',pair.refresh_token,{httpOnly:true,secure,sameSite:'strict',path:'/api/auth',expires:new Date(pair.refresh_expires_at)});}else if('error' in data&&data.error?.code==='ACCOUNT_UNAVAILABLE'){outgoing.cookies.delete('bosagezme_access');outgoing.cookies.delete('bosagezme_refresh');}
  return outgoing;
}
