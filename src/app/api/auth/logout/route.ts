import {NextResponse} from 'next/server';export async function POST(){const response=NextResponse.json({status:'signed_out'});response.cookies.delete('homeapp_access');response.cookies.delete('homeapp_refresh');return response}

