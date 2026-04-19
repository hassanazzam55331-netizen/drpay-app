"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MerchantDeposits() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("drpay_user") || "{}");
        const res = await fetch('/api/merchant/deposits', {
            headers: { 'x-merchant-id': userData.id }
        });
        const data = await res.json();
        if (data.success) {
            setAccounts(data.accounts || []);
            setDeposits(data.deposits || []);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleDeposit = async () => {
      try {
          const userData = JSON.parse(localStorage.getItem("drpay_user") || "{}");
          const res = await fetch('/api/merchant/deposits', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  merchant_id: userData.id,
                  amount: amount,
                  payment_method: selectedAccount.name,
                  proof_url: 'dummy-upload-path' // In production, handle real S3/Supabase upload
              })
          });
          const data = await res.json();
          if (data.success) {
              alert('تم إرسال طلب الإيداع بنجاح. سيتم مراجعته من قبل الإدارة.');
              setShowAdd(false);
              setAmount('');
              fetchData();
          }
      } catch (e) {
          alert('فشل إرسال الطلب');
      }
  };


  if (loading) return null;

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass border-b border-white/5 py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
        <h1 className="text-xl font-bold">شحن الرصيد</h1>
      </nav>

      <main className="p-6 max-w-5xl mx-auto space-y-10 animate-fade-in">
        {/* Step 1: Official Accounts */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-bold text-slate-100">1. اختر حساب الإيداع</h2>
            <p className="text-[10px] text-slate-500">قم بالتحويل لأي من هذه الحسابات أولاً</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accounts.map(acc => (
              <button 
                key={acc.id} 
                onClick={() => { setSelectedAccount(acc); setShowAdd(true); }}
                className={`group relative overflow-hidden glass rounded-3xl p-6 text-right border-l-4 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                   selectedAccount?.id === acc.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white/10'
                }`}
                style={{ borderLeftColor: acc.color }}
              >
                <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl">{acc.type === 'بنك' ? '🏦' : '📱'}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">{acc.type}</span>
                </div>
                <h3 className="font-bold text-slate-200">{acc.name}</h3>
                <p className="text-sm font-mono text-slate-400 mt-2 tracking-wider">{acc.number}</p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    إيداع في هذا الحساب <span>←</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Recent Deposits */}
        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-6">2. تاريخ الإيداعات</h2>
          <div className="glass rounded-3xl overflow-hidden">
            <table className="w-full text-right border-collapse">
              <thead className="bg-white/5 text-[10px] text-slate-500 uppercase">
                <tr>
                  <th className="p-4">كود العملية</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">الحساب</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deposits.map(dep => (
                  <tr key={dep.id} className="text-sm text-slate-300">
                    <td className="p-4 font-mono">{dep.id}</td>
                    <td className="p-4 font-bold">{dep.amount} ج.م</td>
                    <td className="p-4 text-xs">{dep.account}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        dep.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {dep.status === 'confirmed' ? 'تم التأكيد' : 'قيد المراجعة'}
                      </span>
                    </td>
                    <td className="p-4 text-[10px] text-slate-500">{dep.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Add Deposit Modal */}
      {showAdd && selectedAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
              <div className="glass w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-scale-in">
                  <div className="flex justify-between items-start mb-8">
                      <button onClick={() => setShowAdd(false)} className="text-2xl text-slate-500">×</button>
                      <div className="text-right">
                          <h2 className="text-xl font-bold">تأكيد عملية إيداع</h2>
                          <p className="text-xs text-slate-500">إلى: {selectedAccount.name}</p>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-xs text-slate-500 uppercase">مبلغ الإيداع (ج.م)</label>
                          <input 
                            type="number" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-2xl font-black focus:border-indigo-500 outline-none transition-all"
                          />
                      </div>

                      <div className="space-y-2">
                          <label className="text-xs text-slate-500 uppercase tracking-tighter">إرفاق صورة الإيصال / رسالة التأكيد</label>
                          <div className="aspect-video cursor-pointer rounded-2xl border-2 border-dashed border-white/10 bg-slate-900 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500/50 hover:bg-slate-800 transition-all">
                              <span className="text-3xl mb-1">📸</span>
                              <span className="text-[10px] font-bold">انقر لرفع الصورة</span>
                              <span className="text-[8px] mt-1 opacity-50">JPG, PNG - بحد أقصى 5MB</span>
                          </div>
                      </div>

                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                          <p className="text-[10px] text-amber-500 font-bold leading-relaxed">
                            ⚠️ سيتم مراجعة العملية من قبل الإدارة وإضافة الرصيد لحسابك خلال دقائق من التأكد.
                          </p>
                      </div>

                      <button 
                        onClick={handleDeposit}
                        disabled={!amount}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
                      >
                        إرسال الطلب الآن
                      </button>
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
