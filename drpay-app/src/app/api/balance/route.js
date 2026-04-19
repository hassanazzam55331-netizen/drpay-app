import { NextResponse } from 'next/server';
import { agentRequest } from '@/lib/agent';

export async function GET(request) {
  try {
    // In a real app, extract merchant ID from JWT/Session
    // For this prototype, we'll try to find the merchant based on headers or fallback
    const merchantId = request.headers.get('x-merchant-id');
    
    if (merchantId) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', merchantId)
            .single();
        
        return NextResponse.json({
            balance: profile?.balance || 0,
            source: 'local'
        });
    }

    // Fallback/Legacy: Sync with external once in a while or per admin check
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



