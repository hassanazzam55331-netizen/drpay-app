import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const merchantId = request.headers.get('x-merchant-id');
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*, ticket_messages(*)')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { merchant_id, subject, priority, message } = await request.json();

    const { data: ticket, error: tError } = await supabase
      .from('tickets')
      .insert([{ merchant_id, subject, priority, status: 'open' }])
      .select().single();

    if (tError) throw tError;

    const { error: mError } = await supabase
      .from('ticket_messages')
      .insert([{ 
        ticket_id: ticket.id, 
        sender_id: merchant_id, 
        message, 
        is_admin: false 
      }]);

    if (mError) throw mError;

    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
