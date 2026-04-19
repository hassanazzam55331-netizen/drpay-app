"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MerchantReports() {
  const router = useRouter();
  const [data, setData] = useState({ transactions: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, successful, failed

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Mock data for UI development
    setTimeout(() => {
        setData({
            transactions: [
                { id: 'DP-201', service: 'فودافون كاش', amount: '100', fee: '2', status: 'YES', date: '2024-04-19 10:45 ص' },
                { id: 'DP-200', service: 'شحن رصيد - اورنج', amount: '50', fee: '1', status: 'YES', date: '2024-04-18 11:20 م' },
                { id: 'DP-199', service: 'فاتورة الغاز', amount: '240', fee: '5', status: 'ERR', date: '2024-04-18 09:15 م' }
            ],
            history: [
                { id: 1, type: 'خصم عملية', amount: '-102', source: 'فودافون كاش', balance: '4,520.50', date: 'اليوم' },
                { id: 2, type: 'إيداع رصيد', amount: '+2,000', source: 'بنك مصر', balance: '4,622.50', date: 'أمس' }
            ]
        });
        setLoading(false);
    }, 700);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass border-b border-white/5 py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
        <h1 className="text-xl font-bold text-slate-100">سجل المدفوعات والتقارير</h1>
      </nav>

      <main className="p-6 max-w-6xl mx-auto space-y-12 animate-fade-in">
        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="إجمالي مدفوعات اليوم" value="452.00 ج.م" color="text-indigo-400" />
            <StatCard title="رصيد الحساب الحالي" value="4,520.50 ج.م" color="text-emerald-400" />
            <StatCard title="عمولات اليوم" value="12.50 ج.م" color="text-amber-400" />
        </div>

        {/* Transactions Section */}
        <section className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-lg font-bold">كل المعاملات</h2>
                <div className="flex bg-slate-900 rounded-xl p-1 border border-white/5 w-full md:w-auto">
                    {['all', 'successful', 'failed'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                                filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {f === 'all' ? 'الكل' : f === 'successful' ? 'ناجحة' : 'فاشلة'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-white/5 text-[10px] text-slate-500 uppercase">
                        <tr>
                            <th className="p-4">كود العملية</th>
                            <th className="p-4">الخدمة</th>
                            <th className="p-4">المبلغ</th>
                            <th className="p-4 text-center">الحالة</th>
                            <th className="p-4">التاريخ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.transactions
                         .filter(t => filter === 'all' || (filter === 'successful' && t.status === 'YES') || (filter === 'failed' && t.status === 'ERR'))
                         .map(t => (
                            <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-sm text-slate-400">{t.id}</td>
                                <td className="p-4 font-bold text-slate-200">{t.service}</td>
                                <td className="p-4">
                                    <p className="text-sm font-bold">{t.amount} ج.م</p>
                                    <p className="text-[9px] text-slate-500">رسوم: {t.fee} ج.م</p>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${t.status === 'YES' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></span>
                                </td>
                                <td className="p-4 text-[10px] text-slate-500">{t.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        {/* History Section */}
        <section className="space-y-6">
            <h2 className="text-lg font-bold">حركة الرصيد</h2>
            <div className="space-y-3">
                {data.history.map(h => (
                    <div key={h.id} className="glass rounded-2xl p-5 flex justify-between items-center border-white/5 group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                                h.amount.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                                {h.amount.startsWith('+') ? '📈' : '📉'}
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold">{h.type}</p>
                                <p className="text-[10px] text-slate-500">{h.source} • {h.date}</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className={`font-bold ${h.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{h.amount} ج.م</p>
                            <p className="text-[10px] text-slate-500">الرصيد بعدها: {h.balance} ج.م</p>
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
