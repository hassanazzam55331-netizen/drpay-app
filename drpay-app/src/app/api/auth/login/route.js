import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accessCode, password } = await request.json();

    // 1. Check for Admin Access (Env based for root admin)
    const adminCode = process.env.ADMIN_CODE || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'drpay2024';

    if (accessCode === adminCode && password === adminPass) {
      return NextResponse.json({
        success: true,
        user: { id: 'admin', name: 'المدير العام', role: 'admin' },
        token: Buffer.from(`admin:${Date.now()}`).toString('base64'),
      });
    }

    // 2. Check for Merchant Access (In production, lookup in DB)
    const validCode = process.env.ACCOUNT_AID;
    const validPwd = process.env.ACCOUNT_PWD;

    if (accessCode === validCode && password === validPwd) {
      return NextResponse.json({
        success: true,
        user: { id: accessCode, name: 'Dr. Pay Merchant', role: 'merchant' },
        token: Buffer.from(`${accessCode}:${Date.now()}`).toString('base64'),
      });
    }

    return NextResponse.json({ success: false, error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

