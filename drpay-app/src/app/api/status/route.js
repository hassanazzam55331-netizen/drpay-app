import { NextResponse } from 'next/server';
import { agentRequest } from '@/lib/agent';

export async function POST(request) {
  try {
    const body = await request.json();
    const { APIID } = body;

    const data = await agentRequest('chkst', 'QRY', { APIID });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

