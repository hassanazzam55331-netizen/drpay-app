import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*');

    if (error) throw error;

    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, credentials, paymentMode, maintenance_mode, global_notice } = body;

    if (action === 'save') {
      if (credentials) await supabase.from('system_settings').upsert({ key: 'credentials', value: credentials });
      if (paymentMode) await supabase.from('system_settings').upsert({ key: 'paymentMode', value: paymentMode });
      if (maintenance_mode !== undefined) await supabase.from('system_settings').upsert({ key: 'maintenance_mode', value: maintenance_mode });
      if (global_notice) await supabase.from('system_settings').upsert({ key: 'global_notice', value: global_notice });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
