"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MerchantReports() {
  const router = useRouter();
  const [data, setData] = useState({ stats: {}, ledger: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("drpay_user"));
      const res = await fetch(`/api/merchant/reports?merchant_id=${user.id}`);
      const result = await res.json();
      if (result.success) {
        setData(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass border-b border-white/5 py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
        <h1 className="text-xl font-bold text-slate-100">سجل المدفوعات والتقارير</h1>
      </nav>

      <main className="p-6 max-w-6xl mx-auto space-y-12 animate-fade-in">
        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="إجمالي مدفوعات اليوم" value={`${data.stats.dailyVolume?.toLocaleString() || 0} ج.م`} color="text-indigo-400" />
            <StatCard title="رصيد الحساب الحالي" value={`${data.stats.currentBalance?.toLocaleString() || 0} ج.م`} color="text-emerald-400" />
            <StatCard title="عمولات اليوم" value={`${data.stats.dailyCommissions?.toLocaleString() || 0} ج.م`} color="text-amber-400" />
        </div>

        {/* History Section (Ledger) */}
        <section className="space-y-6">
            <h2 className="text-lg font-bold">حركة الرصيد والتاريخ المالي</h2>
            <div className="space-y-3">
                {data.ledger.length === 0 ? (
                  <p className="text-center text-slate-500 py-10">لا توجد حركة رصيد مسجلة حالياً</p>
                ) : data.ledger.map(h => (
                    <div key={h.id} className="glass rounded-2xl p-5 flex justify-between items-center border-white/5 group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                                h.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                                {h.amount > 0 ? '📈' : '📉'}
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold">{h.description || (h.type === 'payment' ? 'خصم عملية' : 'إيداع رصيد')}</p>
                                <p className="text-[10px] text-slate-500">{new Date(h.created_at).toLocaleString('ar-EG')}</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className={`font-bold ${h.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{h.amount > 0 ? '+' : ''}{h.amount} ج.م</p>
                            <p className="text-[10px] text-slate-500">الرصيد بعدها: {h.balance_after?.toLocaleString()} ج.م</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </main>

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

function StatCard({ title, value, color }) {
    return (
        <div className="glass rounded-3xl p-6 border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{title}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
        </div>
    );
}
