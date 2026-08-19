import {NextRequest,NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {forwardToBackend} from '@/lib/backend-forward';
import {clearSessionCookies} from '@/lib/session-cookies';
import type {TokenPair} from '@/lib/types';

// Signing out used to only drop cookies. The session itself stayed valid on the server,
// so the refresh token -- which survived, being written under another path -- could mint
// a new access token straight afterwards. The backend revokes the whole token family,
// which is what actually ends a session, and it is called here first.
export async function POST(request:NextRequest){
  const cookieStore=await cookies();
  const refreshToken=cookieStore.get('bosagezme_refresh')?.value;
  try{
    const revoked=await forwardToBackend({request,path:'auth/logout',method:'POST'});
    // An access token that expired while the tab sat open cannot revoke anything, and
    // that is exactly when somebody walks away from a shared machine. One rotation buys a
    // live token to revoke with; the family is revoked immediately after, so rotating it
    // here costs nothing.
    if(revoked.status===401&&refreshToken){
      const renewed=await forwardToBackend({request,path:'auth/refresh',method:'POST',anonymous:true,body:JSON.stringify({refresh_token:refreshToken})});
      if(renewed.ok){
        const pair=await renewed.json() as TokenPair;
        await forwardToBackend({request,path:'auth/logout',method:'POST',bearer:pair.access_token});
      }
    }
  }catch{
    // The cookies still go, so the browser is signed out either way.
  }
  const response=NextResponse.json({status:'signed_out'});
  clearSessionCookies(response);
  return response;
}
