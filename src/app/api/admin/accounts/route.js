import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: accounts, error } = await supabase
      .from('system_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, id, ...rest } = body;

    if (action === 'create') {
      const { error } = await supabase.from('system_accounts').insert([rest]);
      if (error) throw error;
    } else if (action === 'update') {
      const { error } = await supabase.from('system_accounts').update(rest).eq('id', id);
      if (error) throw error;
    } else if (action === 'delete') {
      const { error } = await supabase.from('system_accounts').delete().eq('id', id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
