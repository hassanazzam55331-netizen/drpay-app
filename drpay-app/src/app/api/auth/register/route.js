import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fullName = formData.get('fullName');
    const nationalId = formData.get('nationalId');
    const phone = formData.get('phone');
    const address = formData.get('address');
    const password = formData.get('password');
    const idFront = formData.get('idFront');
    const idBack = formData.get('idBack');

    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${phone}@drpay.local`, // Use phone as unique identifier
      password: password,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // 2. Upload ID Images (simplified for now, assumes bucket 'id-documents' exists)
    let frontUrl = '';
    let backUrl = '';

    if (idFront) {
      const { data: frontData } = await supabase.storage
        .from('id-documents')
        .upload(`${userId}/front.jpg`, idFront);
      frontUrl = frontData?.path || '';
    }

    if (idBack) {
      const { data: backData } = await supabase.storage
        .from('id-documents')
        .upload(`${userId}/back.jpg`, idBack);
      backUrl = backData?.path || '';
    }

    // 3. Create Profile
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: userId,
      full_name: fullName,
      national_id: nationalId,
      phone: phone,
      address: address,
      id_front_url: frontUrl,
      id_back_url: backUrl,
      status: 'pending'
    }]);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, message: 'Registration submitted for review' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
