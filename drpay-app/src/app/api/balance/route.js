import { NextResponse } from 'next/server';
import { agentRequest } from '@/lib/agent';

export async function GET() {
  try {
    const data = await agentRequest('GetBalance', 'QRY');
    
    return NextResponse.json({
      balance: data.rvsa || data.VSA || "0.00",
      ...data
    });
  } catch (error) {
    console.error('Balance error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


