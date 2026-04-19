import { NextResponse } from 'next/server';
import { agentRequest } from '@/lib/agent';

export async function POST(request) {
  try {
    const body = await request.json();
    const { srv, ...fields } = body;

    const data = await agentRequest(srv, 'QRY', fields);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Inquiry error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


