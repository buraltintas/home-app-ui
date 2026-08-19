import {NextRequest,NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {forwardToBackend} from '@/lib/backend-forward';
import {clearSessionCookies,setSessionCookies} from '@/lib/session-cookies';
import type {TokenPair} from '@/lib/types';

export async function POST(request:NextRequest){
  const cookieStore=await cookies();
  const refreshToken=cookieStore.get('bosagezme_refresh')?.value;
  if(!refreshToken)return NextResponse.json({error:{code:'NO_REFRESH_TOKEN'}},{status:401});
  const response=await forwardToBackend({request,path:'auth/refresh',method:'POST',body:JSON.stringify({refresh_token:refreshToken})});
  const data=await response.json() as TokenPair|{error?:{code?:string}};
  const outgoing=NextResponse.json({status:response.ok?'refreshed':'failed'},{status:response.status});
  if(response.ok)setSessionCookies(outgoing,data as TokenPair);
  else clearSessionCookies(outgoing);
  return outgoing;
}
