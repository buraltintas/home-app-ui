import 'server-only';
import type {NextResponse} from 'next/server';
import type {TokenPair} from '@/lib/types';

/** Readable by scripts on purpose: it holds a timestamp, never a credential. */
export const SESSION_EXPIRES_COOKIE='bosagezme_session_expires';

// The access cookie deliberately outlives the token it carries -- an expired token still
// reaches the backend and comes back 401, which the client repairs, whereas a missing
// cookie reads as an anonymous visitor and silently loses every viewer-scoped flag. The
// consequence is that nothing in the browser could tell when the token was about to die,
// so the only repair was a failed request. This companion cookie says when, which lets
// the session be renewed before anything breaks.
export function setSessionCookies(response:NextResponse,pair:TokenPair){
  const secure=process.env.NODE_ENV==='production';
  const expires=new Date(pair.refresh_expires_at);
  response.cookies.set('bosagezme_access',pair.access_token,{httpOnly:true,secure,sameSite:'lax',path:'/',expires});
  response.cookies.set('bosagezme_refresh',pair.refresh_token,{httpOnly:true,secure,sameSite:'strict',path:'/api/auth',expires});
  response.cookies.set(SESSION_EXPIRES_COOKIE,pair.access_expires_at,{httpOnly:false,secure,sameSite:'lax',path:'/',expires});
}

// Each cookie has to be cleared at the path it was written to. Deleting by name alone
// targets "/", which never touched the refresh cookie sitting under /api/auth: signing out
// removed the access cookie, the next request answered 401, and the refresh cookie that
// was still there quietly signed the person back in. On a shared device that is not an
// inconvenience, it is the whole point of the button failing.
export function clearSessionCookies(response:NextResponse){
  response.cookies.delete({name:'bosagezme_access',path:'/'});
  response.cookies.delete({name:'bosagezme_refresh',path:'/api/auth'});
  response.cookies.delete({name:SESSION_EXPIRES_COOKIE,path:'/'});
}
