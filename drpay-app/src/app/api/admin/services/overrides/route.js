import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: overrides, error } = await supabase
      .from('service_overrides')
      .select('*');
    
    if (error) throw error;
    return NextResponse.json(overrides);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { service_code, custom_fee, is_active } = body;

    const upsertData = { service_code, last_updated: new Date().toISOString() };
    if (custom_fee !== undefined) upsertData.custom_fee = custom_fee;
    if (is_active !== undefined) upsertData.is_active = is_active;

    const { error } = await supabase
      .from('service_overrides')
      .upsert(upsertData, { onConflict: 'service_code' });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
