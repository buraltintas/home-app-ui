import {NextRequest,NextResponse} from 'next/server';
import {forwardToBackend} from '@/lib/backend-forward';

export async function POST(request:NextRequest){
  const response=await forwardToBackend({request,path:'auth/email/request-code',method:'POST',anonymous:true,body:await request.text()});
  return new NextResponse(await response.arrayBuffer(),{status:response.status,headers:{'content-type':'application/json',...(response.headers.get('retry-after')?{'retry-after':response.headers.get('retry-after')!}:{})}});
}

