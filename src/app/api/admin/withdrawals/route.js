import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*, profiles(store_name, full_name, phone)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, withdrawals: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, status } = await request.json();

    const { data: wdr, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // If rejected, refund the balance
    if (status === 'rejected') {
      const { error: refundError } = await supabase.rpc('add_balance_v2', {
        p_merchant_id: wdr.merchant_id,
        p_amount: wdr.amount,
        p_ref_id: id,
        p_desc: `استرداد طلب سحب مرفوض`,
        p_type: 'refund'
      });
      if (refundError) throw refundError;
    }

    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({ status, processed_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
