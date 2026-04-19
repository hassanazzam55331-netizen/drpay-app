import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Total & Pending Merchants
    const { count: totalMerchants } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: pendingMerchants } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 2. Transactions Summary
    const { data: txs } = await supabase
      .from('transactions')
      .select('total_amount');
    
    const totalTransactions = txs?.length || 0;
    const totalVolume = txs?.reduce((sum, tx) => sum + parseFloat(tx.total_amount), 0) || 0;

    // 3. System Balance (Optional: from source API or profiles sum)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('balance');
    const systemLiability = profiles?.reduce((sum, p) => sum + parseFloat(p.balance), 0) || 0;

    return NextResponse.json({
      success: true,
      stats: {
        merchants: { total: totalMerchants || 0, pending: pendingMerchants || 0 },
        transactions: { total: totalTransactions, volume: totalVolume },
        system: { liability: systemLiability, balance: "---" } // Balance might need external API check
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
