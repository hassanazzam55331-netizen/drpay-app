"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDeposits() {
  const router = useRouter();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
        setLoading(true);
        const res = await fetch('/api/admin/deposits');
        const data = await res.json();
        setDeposits(Array.isArray(data) ? data : []);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleAction = async (id, status, merchantId, amount) => {
    try {
        const res = await fetch('/api/admin/deposits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                action: status === 'confirmed' ? 'confirm' : 'reject',
                merchant_id: merchantId,
                amount: amount
            })
        });
        const data = await res.json();
        if (data.success) {
            alert(`تم ${status === 'confirmed' ? 'تأكيد' : 'رفض'} الإيداع بنجاح.`);
            fetchDeposits();
            setSelected(null);
        }
    } catch (e) {
        alert('حدث خطأ أثناء معالجة الطلب');
    }
  };


  if (loading) return null;

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass border-b border-white/5 py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <button onClick={() => router.push('/admin')} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
        <h1 className="text-xl font-bold">إدارة عمليات الإيداع</h1>
      </nav>

      <main className="p-6 max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pending List */}
            <div className="space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> طلبيات بانتظار المراجعة
                </h2>
                <div className="space-y-4">
                    {deposits.filter(d => d.status === 'pending').map(dep => (
                        <div key={dep.id} className="glass rounded-3xl p-6 border-white/5 hover:border-indigo-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-100">{dep.profiles?.full_name || dep.merchant}</h3>
                                    <p className="text-[10px] text-slate-500 uppercase">{dep.payment_method || dep.account} • {new Date(dep.created_at || dep.date).toLocaleDateString()}</p>
                                </div>
                                <span className="text-lg font-black text-indigo-400">{dep.amount} ج.م</span>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setSelected(dep)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-xs font-bold transition-all"
                                >
                                    عرض الإيصال
                                </button>
                                <button 
                                    onClick={() => handleAction(dep.id, 'confirmed', dep.merchant_id, dep.amount)}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
                                >
                                    تأكيد الشحن
                                </button>

                            </div>
                        </div>
                    ))}
                    {deposits.filter(d => d.status === 'pending').length === 0 && (
                        <p className="text-center py-10 text-slate-500">لا توجد إيداعات معلقة</p>
                    )}
                </div>
            </div>

            {/* Recently Confirmed */}
            <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-400">آخر الإيداعات المؤكدة</h2>
                <div className="space-y-4">
                    {deposits.filter(d => d.status === 'confirmed').slice(0, 5).map(dep => (
                        <div key={dep.id} className="glass rounded-2xl p-5 flex justify-between items-center opacity-60">
                            <div>
                                <p className="text-sm font-bold">{dep.profiles?.full_name}</p>
                                <p className="text-[10px] text-slate-500">{dep.payment_method}</p>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-emerald-400">+{dep.amount} ج.م</p>
                                <p className="text-[9px] text-slate-500">تم التأكيد {new Date(dep.processed_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
      </main>

      {/* Proof Viewer Modal */}
      {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
              <div className="glass w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-scale-in">
                  <div className="flex justify-between items-start mb-6">
                      <button onClick={() => setSelected(null)} className="text-2xl text-slate-500">×</button>
                      <div className="text-right">
                          <h2 className="text-xl font-bold">إيصال التحويل</h2>
                          <p className="text-xs text-slate-500">{selected.merchant} - {selected.amount} ج.م</p>
                      </div>
                  </div>

                  <div className="aspect-[3/4] rounded-2xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center relative">
                      {/* Fake Image Placeholder */}
                      <div className="text-center space-y-2 opacity-20">
                          <span className="text-6xl">📄</span>
                          <p className="text-xs">صورة الإيصال تظهر هنا</p>
                      </div>
                      <div className="absolute top-4 left-4 bg-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full text-white shadow-lg">تم التحقق من الكود</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                      <button onClick={() => handleAction(selected.id, 'rejected', selected.merchant_id, selected.amount)} className="py-4 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/20">رفض العملية</button>
                      <button onClick={() => handleAction(selected.id, 'confirmed', selected.merchant_id, selected.amount)} className="py-4 rounded-xl bg-emerald-600 text-white font-bold">تأكيد العملية</button>
                  </div>

              </div>
          </div>
      )}

      <style jsx>{`
        .glass {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
