"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, overRes] = await Promise.all([
        fetch('/api/catalog'),
        fetch('/api/admin/services/overrides') // I will need to create this API
      ]);
      
      const catalog = await catRes.json();
      const overridesData = await overRes.json();

      // Flatten services from catalog
      const allServices = [];
      if (catalog?.menus) {
          Object.values(catalog.menus).forEach(menu => {
              if (menu.services) {
                  Object.values(menu.services).forEach(srv => {
                      allServices.push(srv);
                  });
              }
          });
      }

      setServices(allServices);
      
      // Convert overrides to a map for easy lookup
      const overMap = {};
      overridesData.forEach(o => {
          overMap[o.service_code] = o;
      });
      setOverrides(overMap);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (srvCode, currentlyActive) => {
      try {
          await fetch('/api/admin/services/overrides', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  service_code: srvCode.toString(),
                  is_active: !currentlyActive
              })
          });
          fetchData(); // Refresh
      } catch (e) {
          alert('فشل التحديث');
      }
  };

  const handleFeeUpdate = async (srvCode, newFee) => {
      try {
          await fetch('/api/admin/services/overrides', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  service_code: srvCode.toString(),
                  custom_fee: parseFloat(newFee)
              })
          });
          alert('تم تحديث الرسوم');
          fetchData();
      } catch (e) {
          alert('فشل التحديث');
      }
  };

  const filtered = services.filter(s => s.name.includes(search) || s.srv.toString().includes(search));

  if (loading) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => router.push('/admin')} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
          <div className="text-right">
            <h1 className="text-2xl font-bold">إدارة الخدمات</h1>
            <p className="text-sm text-slate-500">التحكم في الرسوم وحالة الخدمات الفردية</p>
          </div>
        </div>

        <div className="glass p-4 rounded-3xl">
          <input 
            type="text" 
            placeholder="البحث باسم الخدمة أو الكود..." 
            className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all text-right"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(srv => {
            const over = overrides[srv.srv.toString()] || {};
            const isActive = over.is_active !== false; // Active by default
            return (
              <div key={srv.srv} className={`glass rounded-3xl p-6 space-y-4 border ${!isActive ? 'border-red-500/20 opacity-70' : 'border-white/5'}`}>
                <div className="flex justify-between items-start">
                   <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {isActive ? 'نشطة' : 'معطلة'}
                   </div>
                   <div className="text-right">
                      <h3 className="font-bold text-sm truncate w-40">{srv.name}</h3>
                      <p className="text-xs text-slate-500">كود: {srv.srv}</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-1">الرسوم الحالية (ج.م)</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => {
                                const val = prompt('المبلغ الجديد للرسوم:', over.custom_fee || srv.fee);
                                if (val !== null) handleFeeUpdate(srv.srv, val);
                            }}
                            className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-600/30 transition-all"
                        >
                            تعديل
                        </button>
                        <span className="text-sm font-bold flex-1 text-left">{over.custom_fee ?? srv.fee} ج.م</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleToggle(srv.srv, isActive)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                        isActive 
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                    }`}
                  >
                    {isActive ? 'تعطيل الخدمة' : 'تشغيل الخدمة'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
