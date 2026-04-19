"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminWithdrawals() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWithdrawals(); }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch('/api/admin/withdrawals'); // Need to create this
      const data = await res.json();
      if (data.success) setWithdrawals(data.withdrawals);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchWithdrawals();
        alert(`تم ${status === 'processed' ? 'الموافقة على' : 'رفض'} الطلب`);
      }
    } catch (e) { alert("فشل الإجراء"); }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center text-right">
          <button onClick={() => router.push('/admin')} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
          <h1 className="text-2xl font-bold">إدارة طلبات سحب الأرباح</h1>
        </div>

        <div className="glass rounded-3xl overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-900/50 text-slate-400 text-xs">
              <tr>
                <th className="p-6">التاجر</th>
                <th className="p-6">المبلغ</th>
                <th className="p-6">الطريقة</th>
                <th className="p-6">الحالة</th>
                <th className="p-6">التاريخ</th>
                <th className="p-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {withdrawals.map(w => (
                <tr key={w.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <p className="font-bold">{w.profiles?.store_name || w.profiles?.full_name}</p>
                    <p className="text-[10px] text-slate-500">{w.profiles?.phone}</p>
                  </td>
                  <td className="p-6 font-bold">{w.amount} ج.م</td>
                  <td className="p-6 text-sm text-slate-300">{w.method}</td>
                  <td className="p-6">
                    <span className={`badge ${w.status === 'processed' ? 'badge-success' : w.status === 'rejected' ? 'badge-danger' : 'badge-info'}`}>
                      {w.status === 'processed' ? 'تم التنفيذ' : w.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                    </span>
                  </td>
                  <td className="p-6 text-xs text-slate-500">{new Date(w.created_at).toLocaleString('ar-EG')}</td>
                  <td className="p-6">
                    {w.status === 'pending' && (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleAction(w.id, 'rejected')} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold">رفض</button>
                        <button onClick={() => handleAction(w.id, 'processed')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold">موافقة</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {withdrawals.length === 0 && (
                  <tr><td colSpan="6" className="p-20 text-center text-slate-500">لا توجد طلبات سحب حالياً</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
