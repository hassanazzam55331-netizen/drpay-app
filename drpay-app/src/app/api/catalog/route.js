import { supabase } from '@/lib/supabase';
import { agentRequest } from '@/lib/agent';

export async function GET() {
  try {
    // 1. Fetch official catalog via agent
    const catalog = await agentRequest('GetCatalog', 'QRY');

    // 2. Fetch local admin overrides
    const { data: overrides } = await supabase.from('service_overrides').select('*');
    
    if (catalog.menus && overrides) {
        // Apply overrides to the catalog
        Object.keys(catalog.menus).forEach(menuKey => {
            const menu = catalog.menus[menuKey];
            if (menu.services) {
                Object.keys(menu.services).forEach(srvKey => {
                    const srv = menu.services[srvKey];
                    const override = overrides.find(o => o.service_code === srv.srv.toString());
                    
                    if (override) {
                        if (override.custom_fee !== null && override.custom_fee !== undefined) {
                            srv.fee = override.custom_fee;
                        }
                        if (override.is_active === false) {
                            srv.disabled = true;
                        }
                    }
                });
            }
        });
    }

    return NextResponse.json(catalog);
  } catch (error) {
    console.error('Catalog API Error:', error);
    // Fallback to local data is handled by the agentRequest internals if needed
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

