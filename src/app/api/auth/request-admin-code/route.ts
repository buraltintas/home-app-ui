import {NextRequest,NextResponse} from 'next/server';
import {forwardToBackend} from '@/lib/backend-forward';

// The panel's own way of asking for a code. It is a separate address from the public one for
// a single reason: /admin can be reached by anybody, and the public endpoint would post a
// real code to whatever address was typed there. This one answers identically whoever asks
// and only posts to an address the backend already knows as an administrator.
export async function POST(request:NextRequest){
  const response=await forwardToBackend({request,path:'auth/email/request-admin-code',method:'POST',anonymous:true,body:await request.text()});
  return new NextResponse(await response.arrayBuffer(),{status:response.status,headers:{'content-type':'application/json',...(response.headers.get('retry-after')?{'retry-after':response.headers.get('retry-after')!}:{})}});
}
