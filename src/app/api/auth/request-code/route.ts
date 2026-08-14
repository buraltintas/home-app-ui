import {NextRequest,NextResponse} from 'next/server';
export async function POST(request:NextRequest){const response=await fetch(new URL('/api/proxy/auth/email/request-code',request.url),{method:'POST',headers:{'content-type':'application/json','x-locale':request.headers.get('x-locale')??'tr'},body:await request.text()});return new NextResponse(await response.arrayBuffer(),{status:response.status,headers:{'content-type':'application/json',...(response.headers.get('retry-after')?{'retry-after':response.headers.get('retry-after')!}:{})}})}

