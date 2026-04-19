import { supabase } from './supabase';

const AGENT_CONFIG = {
  VER: '231223',
  VEN: 'DrPay-Agent-Pro',
  GPS: '30.0444,31.2357', // Cairo
  PSN: 'DP-' + (process.env.ACCOUNT_AID || 'AGENT'),
  BASE_URL: 'https://wifi.e-misr.com/ICO',
  CREDENTIALS: {
    AID: process.env.ACCOUNT_AID,
    PWD: process.env.ACCOUNT_PWD,
    PHONE: process.env.VERIFY_PHONE || '01283986095',
    NATID: process.env.VERIFY_NATIONAL_ID || '28210031302391',
  }
};

/**
 * Perform a background login or verification
 */
async function performLogin() {
    console.log('Attempting Background Agent Login...');
    
    // Initial login attempt
    const res = await fetch(`${AGENT_CONFIG.BASE_URL}/ajax.php?j=n`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'PSN': AGENT_CONFIG.PSN,
            'VER': AGENT_CONFIG.VER,
            'VEN': AGENT_CONFIG.VEN,
            'GPS': AGENT_CONFIG.GPS,
        },
        body: new URLSearchParams({
            USER: AGENT_CONFIG.CREDENTIALS.AID,
            PASS: AGENT_CONFIG.CREDENTIALS.PWD,
            do: 'login',
        }).toString(),
    });

    const data = await res.json();
    const sdaHeader = res.headers.get('SDA');
    
    // Handle Verification Required
    if (data.ST === 'INF' || data.NXT === 'REG') {
        console.log('First Device Verification Required. Submitting credentials...');
        const regRes = await fetch(`${AGENT_CONFIG.BASE_URL}/ajax.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'PSN': AGENT_CONFIG.PSN,
                'VER': AGENT_CONFIG.VER,
                'VEN': AGENT_CONFIG.VEN,
                'GPS': AGENT_CONFIG.GPS,
            },
            body: JSON.stringify({
                do: 'REG',
                AID: AGENT_CONFIG.CREDENTIALS.AID,
                PWD: AGENT_CONFIG.CREDENTIALS.PWD,
                PHONE: AGENT_CONFIG.CREDENTIALS.PHONE,
                NATID: AGENT_CONFIG.CREDENTIALS.NATID,
            }),
        });
        const regData = await regRes.json();
        if (regData.ST === 'YES') {
            return performLogin(); // Retry login after registration
        }
        throw new Error('Registration failed: ' + regData.SMS);
    }

    let auth = '';
    if (sdaHeader) {
        const sda = JSON.parse(sdaHeader);
        auth = sda.AUTH;
    } else if (data.AUTH) {
        auth = data.AUTH;
    }

    if (!auth) throw new Error('Could not retrieve AUTH token: ' + (data.SMS || 'Unknown error'));

    const session = {
        auth,
        aid: AGENT_CONFIG.CREDENTIALS.AID,
        expires: Date.now() + (12 * 60 * 60 * 1000), // 12h
    };

    // Store in Supabase config
    await supabase.from('agent_config').upsert({
        key: 'session',
        value: session,
        updated_at: new Date().toISOString()
    });

    return session;
}

/**
 * Standard request wrapper with automatic session handling
 */
export async function agentRequest(srv, doAction, fields = {}) {
    let session;
    try {
        const { data } = await supabase.from('agent_config').select('value').eq('key', 'session').single();
        if (data?.value?.auth && data.value.expires > Date.now()) {
            session = data.value;
        }
    } catch (e) {}

    if (!session) {
        session = await performLogin();
    }

    const payload = {
        srv,
        do: doAction,
        AID: session.aid,
        ...fields,
    };

    const res = await fetch(`${AGENT_CONFIG.BASE_URL}/ajax.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'AUTH': session.auth,
            'PSN': AGENT_CONFIG.PSN,
            'VER': AGENT_CONFIG.VER,
            'VEN': AGENT_CONFIG.VEN,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    // If session expired while running
    if (data.ST === 'LOG' || data.SMS?.includes('Session')) {
        session = await performLogin();
        return agentRequest(srv, doAction, fields);
    }

    return data;
}
