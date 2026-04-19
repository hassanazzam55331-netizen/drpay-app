import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const merchantId = searchParams.get('merchant_id');

  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, withdrawals: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { merchant_id, amount, method } = await request.json();

    // 1. Transactionally check balance and mark withdrawal
    // We'll use deduct_balance_v2 but with 'withdrawal' type
    const { error: deductError } = await supabase.rpc('deduct_balance_v2', {
      p_merchant_id: merchant_id,
      p_amount: amount,
      p_ref_id: `WDR-${Date.now()}`,
      p_desc: `طلب سحب أرباح عبر ${method}`
    });

    if (deductError) throw deductError;

    // 2. Insert into withdrawals table
    const { error: insertError } = await supabase
      .from('withdrawals')
      .insert([{ merchant_id, amount, method, status: 'pending' }]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
