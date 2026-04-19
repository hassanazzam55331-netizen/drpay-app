import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { agentRequest } from '@/lib/agent';

export async function POST(request) {
  try {
    const body = await request.json();
    const { srv, APIID, ...fields } = body;

    const data = await agentRequest(srv, 'PAY', { APIID, ...fields });

    // Log to Supabase if config is available
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co') {
        const total_amount = data.VSA || fields.avsa || 0;
        await supabase.from('transactions').insert([{
          api_id: APIID,
          service_name: fields.service_name || 'Service',
          service_code: srv,
          amount: total_amount,
          total_amount: total_amount,
          status: data.ST,
          bid: data.BID,
          mobile: fields.cmob || fields.tel || fields.payMOB,
          response_data: data
        }]);
      }
    } catch (dbError) {
      console.error('Database logging failed:', dbError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


