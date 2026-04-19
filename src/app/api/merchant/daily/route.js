import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = request.headers.get('x-merchant-id') || 'demo-merchant';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Query transactions for the specified merchant and date
    const { data: txs, error } = await supabase
      .from('transactions')
      .select('amount, status, total_amount')
      .eq('merchant_id', merchantId)
      .gte('created_at', `${date}T00:00:00`)
      .lte('created_at', `${date}T23:59:59`);

    if (error) throw error;

    const summary = {
        count: txs.length,
        total_amount: txs.reduce((sum, tx) => sum + parseFloat(tx.total_amount), 0),
        success_count: txs.filter(tx => tx.status === 'YES').length,
        failed_count: txs.filter(tx => tx.status === 'ERR').length,
    };

    return NextResponse.json({ success: true, date, summary });
  } catch (error) {
    console.error('Daily statement error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
