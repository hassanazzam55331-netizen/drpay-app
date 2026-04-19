import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, store_name, account_id, phone, address, balance, status')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, full_name, address, phone } = body;

        const { error } = await supabase
            .from('profiles')
            .update({ full_name, address, phone })
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
