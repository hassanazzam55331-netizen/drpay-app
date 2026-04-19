import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fullName = formData.get('fullName');
    const storeName = formData.get('storeName');
    const nationalId = formData.get('nationalId');
    const phone = formData.get('phone');
    const phone2 = formData.get('phone2');
    const address = formData.get('address');
    const governorate = formData.get('governorate');
    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    const deviceInfo = formData.get('deviceInfo');
    const password = formData.get('password');
    const idFront = formData.get('idFront');
    const idBack = formData.get('idBack');

    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${phone}@drpay.local`,
      password: password,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // 2. Upload ID Images
    let frontUrl = '';
    let backUrl = '';

    if (idFront && typeof idFront !== 'string') {
      const { data: frontData } = await supabase.storage
        .from('id-documents')
        .upload(`${userId}/front.jpg`, idFront, { upsert: true });
      frontUrl = frontData?.path || '';
    }

    if (idBack && typeof idBack !== 'string') {
      const { data: backData } = await supabase.storage
        .from('id-documents')
        .upload(`${userId}/back.jpg`, idBack, { upsert: true });
      backUrl = backData?.path || '';
    }

    // 3. Create Profile
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: userId,
      full_name: fullName,
      store_name: storeName,
      national_id: nationalId,
      phone: phone,
      phone_2: phone2,
      address: address,
      governorate: governorate,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      device_info: deviceInfo ? JSON.parse(deviceInfo) : null,
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
