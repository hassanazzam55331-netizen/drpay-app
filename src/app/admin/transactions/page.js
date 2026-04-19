"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminTransactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    // Mock data for setup
    setTimeout(() => {
      setTransactions([
        { id: '1', apiId: 'DP240419ABC123', merchant: 'أحمد محمد علي', service: 'كارت شحن فودافون 100', amount: 100, status: 'YES', createdAt: '2024-04-19 12:40' },
        { id: '2', apiId: 'DP240419XYZ789', merchant: 'سارة محمود حسن', service: 'فاتورة تليفون أرضي', amount: 45.5, status: 'YES', createdAt: '2024-04-19 11:30' },
        { id: '3', apiId: 'DP240419ERR555', merchant: 'أحمد محمد علي', service: 'شحن رصيد اورنج', amount: 20, status: 'ERR', createdAt: '2024-04-19 10:15' },
      ]);
      setLoading(false);
    }, 800);
  };

  const filtered = transactions.filter(t => 
    t.apiId.toLowerCase().includes(filter.toLowerCase()) || 
    t.merchant.includes(filter)
  );

  if (loading) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => router.push('/admin')} className="btn-secondary py-2 px-4 flex items-center gap-2">
            <span>→</span> لوحة التحكم
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold">سجل العمليات العام</h1>
            <p className="text-sm text-slate-500">مراقبة جميع العمليات المنفذة عبر النظام</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input 
              type="text" 
              placeholder="البحث برقم العملية أو اسم التاجر..." 
              className="input-field pr-12 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <select className="input-field md:w-48">
            <option>جميع الحالات</option>
            <option>ناجحة</option>
            <option>فاشلة</option>
            <option>معلقة</option>
          </select>
        </div>

        <div className="glass rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-800/80 text-slate-300 text-sm">
              <tr>
                <th className="p-4">رقم العملية</th>
                <th className="p-4">التاجر</th>
                <th className="p-4">الخدمة</th>
                <th className="p-4">المبلغ</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">تفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-sm text-indigo-400">{t.apiId}</td>
                  <td className="p-4 font-bold text-sm">{t.merchant}</td>
                  <td className="p-4 text-sm">{t.service}</td>
                  <td className="p-4 font-bold">{t.amount} ج.م</td>
                  <td className="p-4">
                    <span className={`badge ${
                      t.status === 'YES' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {t.status === 'YES' ? 'ناجحة' : 'فاشلة'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{t.createdAt}</td>
                  <td className="p-4">
                     <button className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">📄</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-20 text-center text-slate-500">
               <span className="text-4xl block mb-2">🏜️</span>
               لا توجد عمليات تطابق البحث
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
