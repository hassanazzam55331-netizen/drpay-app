"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminMerchants() {
  const router = useRouter();
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    // Mock data for setup
    setTimeout(() => {
      setMerchants([
        { id: '1', fullName: 'أحمد محمد علي', nationalId: '28210031302391', phone: '01283986095', address: 'القاهرة - المعادي', status: 'pending', createdAt: '2024-04-18' },
        { id: '2', fullName: 'سارة محمود حسن', nationalId: '29001011500456', phone: '01063151472', address: 'الجيزة - الدقي', status: 'active', createdAt: '2024-04-15' },
      ]);
      setLoading(false);
    }, 800);
  };

  const updateStatus = async (id, status) => {
    // In production, update via API
    setMerchants(merchants.map(m => m.id === id ? { ...m, status } : m));
    setSelectedMerchant(null);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => router.push('/admin')} className="btn-secondary py-2 px-4 flex items-center gap-2">
            <span>→</span> لوحة التحكم
          </button>
          <h1 className="text-2xl font-bold">إدارة التجار</h1>
        </div>

        <div className="glass rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-800/80 text-slate-300 text-sm">
              <tr>
                <th className="p-4">التاجر</th>
                <th className="p-4">الرقم القومي</th>
                <th className="p-4">المحمول</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {merchants.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold">{m.fullName}</p>
                    <p className="text-xs text-slate-500">{m.address}</p>
                  </td>
                  <td className="p-4 text-sm font-mono">{m.nationalId}</td>
                  <td className="p-4 text-sm font-mono">{m.phone}</td>
                  <td className="p-4">
                    <span className={`badge ${
                      m.status === 'active' ? 'badge-success' : 
                      m.status === 'pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {m.status === 'active' ? 'نشط' : m.status === 'pending' ? 'بانتظار المراجعة' : 'مرفوض'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{m.createdAt}</td>
                  <td className="p-4">
                    <button onClick={() => setSelectedMerchant(m)} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold">عرض التفاصيل</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-start mb-8">
              <button onClick={() => setSelectedMerchant(null)} className="text-2xl text-slate-500">×</button>
              <h2 className="text-xl font-bold">تفاصيل التاجر</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase">الاسم الكامل</p>
                  <p className="font-bold">{selectedMerchant.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase">الرقم القومي</p>
                  <p className="font-bold font-mono">{selectedMerchant.nationalId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase">رقم الهاتف</p>
                  <p className="font-bold font-mono">{selectedMerchant.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase">العنوان</p>
                  <p className="font-bold">{selectedMerchant.address}</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xs text-slate-500 uppercase mb-2">مستندات الهوية (تمويه للمثال)</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="aspect-[3/2] rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-600">
                      <span className="text-3xl mb-1">🖼️</span>
                      <span className="text-[10px]">وجه البطاقة</span>
                   </div>
                   <div className="aspect-[3/2] rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-600">
                      <span className="text-3xl mb-1">🖼️</span>
                      <span className="text-[10px]">ظهر البطاقة</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800 flex justify-end gap-4">
               {selectedMerchant.status === 'pending' && (
                 <>
                   <button onClick={() => updateStatus(selectedMerchant.id, 'rejected')} className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all">رفض الطلب</button>
                   <button onClick={() => updateStatus(selectedMerchant.id, 'active')} className="px-10 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all">موافقة وتفعيل</button>
                 </>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
