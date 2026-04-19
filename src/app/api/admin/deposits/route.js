import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: deposits, error } = await supabase
      .from('deposits')
      .select('*, profiles(full_name, account_id)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(deposits);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, action, merchant_id, amount } = body;

    if (action === 'confirm') {
        // 1. Update deposit status
        const { error: depError } = await supabase
            .from('deposits')
            .update({ status: 'confirmed', processed_at: new Date().toISOString() })
            .eq('id', id);
        
        if (depError) throw depError;

        // 2. Add balance to merchant (Atomic)
        const { error: balError } = await supabase.rpc('add_balance', {
            m_id: merchant_id,
            amount: parseFloat(amount)
        });

        if (balError) throw balError;
        
        return NextResponse.json({ success: true, message: 'Deposit confirmed and balance added' });
    }

    if (action === 'reject') {
        const { error } = await supabase
            .from('deposits')
            .update({ status: 'rejected', processed_at: new Date().toISOString() })
            .eq('id', id);
        
        if (error) throw error;
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Deposit processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
