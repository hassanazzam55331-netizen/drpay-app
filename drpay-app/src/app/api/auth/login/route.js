import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accessCode, password } = await request.json();

    // 1. Authenticate with Supabase (In a real app, use auth.signInWithPassword)
    // For this prototype, we'll check the 'profiles' table for matching credentials
    // Note: This is an abstraction of the Supabase Auth flow for brevity
    
    // Check root admin from ENV
    const adminCode = process.env.ADMIN_CODE || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'drpay2024';

    if (accessCode === adminCode && password === adminPass) {
      return NextResponse.json({
        success: true,
        user: { id: 'admin', name: 'المدير العام', role: 'admin' },
        token: Buffer.from(`admin:${Date.now()}`).toString('base64'),
      });
    }

    // Check Merchant from DB
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_id', accessCode) // Assuming account_id is the access code
        .single();

    if (profile && password === '123456') { // Mocking password check for profiles
        if (profile.status !== 'active') {
            return NextResponse.json({ success: false, error: 'هذا الحساب معلق أو مرفوض' }, { status: 403 });
        }
        
        return NextResponse.json({
            success: true,
            user: { 
                id: profile.id, 
                name: profile.full_name, 
                role: profile.is_admin ? 'admin' : 'merchant' 
            },
            token: Buffer.from(`${profile.id}:${Date.now()}`).toString('base64'),
        });
    }

    return NextResponse.json({ success: false, error: 'بيانات الدخول غير صحيحة' }, { status: 401 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

