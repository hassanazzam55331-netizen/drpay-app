import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*, profiles(full_name, store_name), ticket_messages(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { ticket_id, admin_id, message, status } = await request.json();

    // 1. Add Message
    const { error: mError } = await supabase
      .from('ticket_messages')
      .insert([{ 
        ticket_id, 
        sender_id: admin_id, 
        message, 
        is_admin: true 
      }]);

    if (mError) throw mError;

    // 2. Update Ticket Status
    const { error: tError } = await supabase
      .from('tickets')
      .update({ status: status || 'replied', last_reply_at: new Date().toISOString() })
      .eq('id', ticket_id);

    if (tError) throw tError;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
