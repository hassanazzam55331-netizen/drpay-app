import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper for admin check
async function checkAdmin() {
    // In production, verify session/JWT
    return true;
}

export async function GET() {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { id, action, ...profileData } = body;

        // 1. UPDATE status or profile
        if (action === 'update') {
            const { error } = await supabase
                .from('profiles')
                .update(profileData)
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        // 2. DELETE profile
        if (action === 'delete') {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        // 3. CREATE (Simplified: Admin creates a profile record)
        // In real app, this would involve auth.admin.createUser
        if (action === 'create') {
           const { error } = await supabase
                .from('profiles')
                .insert({
                    id: crypto.randomUUID(), // Mock ID for demo if not using real Auth
                    ...profileData
                });
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
