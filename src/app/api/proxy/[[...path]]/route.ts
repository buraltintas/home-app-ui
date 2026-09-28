import {NextRequest,NextResponse} from 'next/server';import {cookies} from 'next/headers';
import {backendHeaders} from '@/lib/backend-forward';
const API_ORIGIN=process.env.API_ORIGIN??'http://localhost:8080';
async function proxy(request:NextRequest,{params}:{params:Promise<{path?:string[]}>}){const {path=[]}=await params;const cookieStore=await cookies();const destination=new URL(`/v1/${path.join('/')}`,API_ORIGIN);request.nextUrl.searchParams.forEach((value,key)=>destination.searchParams.append(key,value));// What the backend is told about who is asking is built in one place, shared with the auth
// routes beside this one. It used to be written out twice, and the two copies had already
// begun to differ.
const outgoingHeaders=backendHeaders({request,cookieStore,accessToken:cookieStore.get('bosagezme_access')?.value});const response=await fetch(destination,{method:request.method,headers:outgoingHeaders,body:['GET','HEAD'].includes(request.method)?undefined:request.body,duplex:'half'} as RequestInit&{duplex:'half'});const body=await response.arrayBuffer();// A 204 carries no body by definition and the Response constructor rejects one, which
// turned every successful favourite into a 500 on our own side.
// Everything through this proxy is answered per signed-in viewer, so it must never be
// held by a shared cache where one person's liked and saved flags could reach another.
const empty=response.status===204||response.status===205||response.status===304;const outgoing=new NextResponse(empty?null:body,{status:response.status,headers:{'content-type':response.headers.get('content-type')??'application/json','cache-control':'private, no-store'}});for(const key of ['retry-after','x-request-id']){const value=response.headers.get(key);if(value)outgoing.headers.set(key,value)}if(response.ok&&response.headers.get('content-type')?.includes('json')){try{const data=JSON.parse(new TextDecoder().decode(body)) as {visitor_session_id?:string};if(data.visitor_session_id)outgoing.cookies.set('bosagezme_visitor',data.visitor_session_id,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:15552000})}catch{}}return outgoing}
export const GET=proxy;export const POST=proxy;export const PUT=proxy;export const PATCH=proxy;export const DELETE=proxy;
