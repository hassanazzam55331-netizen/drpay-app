import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const merchantId = searchParams.get('merchant_id');

  if (!merchantId) {
    return NextResponse.json({ error: 'Missing merchant_id' }, { status: 400 });
  }

  try {
    // 1. Fetch Daily Stats
    const today = new Date();
    today.setHours(0,0,0,0);

    const { data: dailyTx, error: txError } = await supabase
      .from('transactions')
      .select('amount, fee, status')
      .eq('merchant_id', merchantId)
      .gte('created_at', today.toISOString());

    if (txError) throw txError;

    const successfulTx = dailyTx.filter(t => t.status === 'YES');
    const totalVolume = successfulTx.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalFees = successfulTx.reduce((sum, t) => sum + parseFloat(t.fee || 0), 0);

    // 2. Fetch Ledger History (Last 20 entries)
    const { data: ledger, error: ledgerError } = await supabase
      .from('audit_ledger')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (ledgerError) throw ledgerError;

    // 3. Fetch Current Balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', merchantId)
      .single();

    if (profileError) throw profileError;

    return NextResponse.json({
      success: true,
      stats: {
        dailyVolume: totalVolume,
        dailyCommissions: totalFees,
        currentBalance: profile.balance
      },
      ledger: ledger,
      transactions: successfulTx
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
