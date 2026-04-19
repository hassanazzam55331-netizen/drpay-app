import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = request.headers.get('x-merchant-id') || 'demo-merchant';

    // 1. Fetch Official Accounts
    const { data: accounts } = await supabase
      .from('official_accounts')
      .select('*')
      .eq('is_active', true);

    // 2. Fetch Merchant Deposits
    const { data: deposits } = await supabase
      .from('deposits')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, accounts, deposits });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { merchant_id, amount, payment_method, proof_url } = body;

    const { data, error } = await supabase
      .from('deposits')
      .insert([{
        merchant_id,
        amount: parseFloat(amount),
        payment_method,
        proof_url,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, deposit: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
