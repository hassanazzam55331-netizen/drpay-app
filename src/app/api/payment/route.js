export async function POST(request) {
  try {
    const body = await request.json();
    const { srv, APIID, ...fields } = body;
    const merchantId = request.headers.get('x-merchant-id') || 'demo-merchant'; // Identify payer

    // 1. Fetch Merchant Balance & System Mode
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', merchantId).single();
    const { data: modeConfig } = await supabase.from('system_settings').select('value').eq('key', 'PAYMENT_MODE').single();
    
    const amount = parseFloat(fields.avsa || 0);
    const balance = parseFloat(profile?.balance || 0);
    const mode = modeConfig?.value?.mode || 'FULL_SYNC'; // FULL_SYNC or LOCAL_ONLY

    // 2. Local Balance Check
    if (balance < amount) {
        return NextResponse.json({ 
            ST: 'ERR', 
            SMS: 'عذراً، رصيدك غير كافٍ لإتمام هذه العملية. يرجى شحن الرصيد.',
            code: 'INSUFFICIENT_FUNDS' 
        }, { status: 402 });
    }

    let externalResponse = { ST: 'YES', VSA: amount, BID: 'LOCAL-' + Date.now() };

    // 3. Conditional External Execution
    if (mode === 'FULL_SYNC') {
        externalResponse = await agentRequest(srv, 'PAY', { APIID, ...fields });
    }

    // 4. Handle Success & Local Deduction
    if (externalResponse.ST === 'YES') {
        const finalAmount = parseFloat(externalResponse.VSA || amount);
        
        // 3. Deduct locally with Ledger Logging
        const { error: deductError } = await supabase.rpc('deduct_balance_v2', {
          p_merchant_id: merchantId,
          p_amount: finalAmount,
          p_ref_id: APIID,
          p_desc: `دفع خدمة: ${fields.service_name || 'Service'}`
        });

        // Log Transaction
        await supabase.from('transactions').insert([{
            api_id: APIID,
            merchant_id: merchantId,
            service_name: fields.service_name || 'Service',
            service_code: srv,
            amount: finalAmount,
            total_amount: finalAmount,
            status: 'YES',
            bid: externalResponse.BID,
            mobile: fields.cmob || fields.tel || fields.payMOB,
            provider_response: externalResponse
        }]);
    } else {
        // Log Failed Attempt
        await supabase.from('transactions').insert([{
            api_id: APIID,
            merchant_id: merchantId,
            service_name: fields.service_name || 'Service',
            service_code: srv,
            amount: amount,
            total_amount: amount,
            status: 'ERR',
            provider_response: externalResponse
        }]);
    }

    return NextResponse.json(externalResponse);
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ ST: 'ERR', SMS: error.message }, { status: 500 });
  }
}



