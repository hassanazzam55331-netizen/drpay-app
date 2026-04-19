"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDepositAccounts() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newAcc, setNewAcc] = useState({ name: '', type: 'بنك', number: '', instructions: '' });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/admin/accounts');
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    }
  };

  const handleAdd = async () => {
    try {
      await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...newAcc })
      });
      fetchAccounts();
      setShowAdd(false);
      setNewAcc({ name: '', type: 'بنك', number: '', instructions: '' });
    } catch (e) {
      alert('فشل إضافة الحساب');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id, is_active: !currentStatus })
      });
      fetchAccounts();
    } catch (e) {
      alert('فشل تحديث الحالة');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      fetchAccounts();
    } catch (e) {
      alert('فشل الحذف');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass border-b border-white/5 py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <button onClick={() => router.push('/admin')} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
        <h1 className="text-xl font-bold">إعدادات حسابات الإيداع</h1>
      </nav>

      <main className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">حساباتك البنكية والمحافظ</h2>
            <button onClick={() => setShowAdd(true)} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all">+ إضافة حساب جديد</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {accounts.map(acc => (
                <div key={acc.id} className="glass rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-xl">
                            {acc.type === 'بنك' ? '🏦' : '📱'}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-100">{acc.name}</h3>
                            <p className="text-xs text-slate-500">{acc.number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase ${
                            acc.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                            {acc.is_active ? 'مفعل' : 'معطل'}
                        </span>
                        <button onClick={() => toggleStatus(acc.id, acc.is_active)} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">تغيير الحالة</button>
                        <button onClick={() => handleDelete(acc.id)} className="text-xs text-red-500 hover:text-red-400 font-bold">حذف</button>
                    </div>
                </div>
            ))}
            {accounts.length === 0 && <p className="text-center text-slate-500 py-10">لا توجد حسابات مسجلة</p>}
        </div>
      </main>

      {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
              <div className="glass w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-scale-in">
                  <div className="flex justify-between items-start mb-8">
                       <button onClick={() => setShowAdd(false)} className="text-2xl text-slate-500">×</button>
                       <h2 className="text-xl font-bold">إضافة حساب إيداع جديد</h2>
                  </div>
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <input 
                            placeholder="اسم الحساب (مثلاً: بنك مصر)" 
                            value={newAcc.name} onChange={e => setNewAcc({...newAcc, name: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3"
                          />
                          <select 
                            value={newAcc.type} onChange={e => setNewAcc({...newAcc, type: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-slate-300"
                          >
                            <option value="بنك">بنك</option>
                            <option value="محفظة">محفظة إلكترونية</option>
                          </select>
                      </div>
                      <input 
                        placeholder="رقم الحساب أو الهاتف" 
                        value={newAcc.number} onChange={e => setNewAcc({...newAcc, number: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3"
                      />
                      <textarea 
                        placeholder="تعليمات إضافية (تظهر للتاجر)" 
                        value={newAcc.instructions} onChange={e => setNewAcc({...newAcc, instructions: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 h-24"
                      />
                  </div>
                  <div className="flex gap-4 mt-8">
                      <button onClick={handleAdd} className="flex-1 py-4 bg-indigo-600 rounded-xl font-bold shadow-lg shadow-indigo-600/20">حفظ الحساب</button>
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
