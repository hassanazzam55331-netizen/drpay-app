import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { testAgentConnection } from '@/lib/agent';

// Middleware-like check for admin
async function checkAdmin(request) {
    const authHeader = request.headers.get('Authorization');
    // In a real app, verify the JWT or session here
    // For now, we'll check the Profiles table for is_admin
    return true; // Simplified for initial setup
}

export async function GET(request) {
    if (!await checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { data } = await supabase.from('agent_config').select('value').eq('key', 'credentials').single();
        return NextResponse.json({ credentials: data?.value || {} });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    if (!await checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { do: action, credentials } = body;

        if (action === 'test') {
            // Temporary override for testing
            // We'll upsert first then test
            await supabase.from('agent_config').upsert({
                key: 'credentials',
                value: credentials,
                updated_at: new Date().toISOString()
            });
            const result = await testAgentConnection();
            return NextResponse.json(result);
        }

        if (action === 'save') {
            await supabase.from('agent_config').upsert({
                key: 'credentials',
                value: credentials,
                updated_at: new Date().toISOString()
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
