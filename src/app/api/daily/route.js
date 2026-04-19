import { NextResponse } from 'next/server';
import { agentRequest } from '@/lib/agent';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sdate = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const data = await agentRequest('chk', 'QRY', {
      cmob: '',
      sdate,
      edate: sdate,
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Daily report error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

