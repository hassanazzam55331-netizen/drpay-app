"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminMerchants() {
  const router = useRouter();
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMerchant, setNewMerchant] = useState({
      fullName: '',
      phone: '',
      nationalId: '',
      address: '',
      status: 'active',
      is_admin: false
  });

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const res = await fetch('/api/admin/merchants');
      const data = await res.json();
      setMerchants(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch merchants", error);
    }
  };

  const updateStatus = async (id, status, reason = '') => {
    try {
      await fetch('/api/admin/merchants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action: 'update', status, rejection_reason: reason })
      });
      fetchMerchants();
      setSelectedMerchant(null);
    } catch (e) {
      alert('فشل تحديث الحالة');
    }
  };

  const handleCreate = async () => {
      try {
          await fetch('/api/admin/merchants', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'create', ...newMerchant })
          });
          fetchMerchants();
          setShowAddForm(false);
          setNewMerchant({ fullName: '', phone: '', nationalId: '', address: '', status: 'active' });
      } catch (e) {
          alert('فشل إضافة التاجر');
      }
  };

  const handleDelete = async (id) => {
      if (!confirm('هل أنت متأكد من حذف هذا التاجر؟')) return;
      try {
          await fetch('/api/admin/merchants', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, action: 'delete' })
          });
          fetchMerchants();
      } catch (e) {
          alert('فشل حذف التاجر');
      }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => router.push('/admin')} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowAddForm(true)} className="btn-primary py-2 px-6">+ إضافة تاجر جديد</button>
             <h1 className="text-2xl font-bold">إدارة المستخدمين والتجار</h1>
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden shadow-2xl border-white/5">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-6 font-medium text-right">المحل / التاجر</th>
                <th className="p-6 font-medium text-right">الرصيد</th>
                <th className="p-6 font-medium text-right">المحمول</th>
                <th className="p-6 font-medium text-right">الحالة</th>
                <th className="p-6 font-medium text-right">التاريخ</th>
                <th className="p-6 font-medium text-center">إجراءات</th>
              </tr>

            </thead>
            <tbody className="divide-y divide-white/5">
              {merchants.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-all group">
                  <td className="p-6">
                    <p className="font-bold text-slate-100">{m.store_name || 'بدون محل'}</p>
                    <p className="text-xs text-slate-500 mt-1">{m.full_name || m.fullName}</p>
                  </td>
                  <td className="p-6 text-sm font-bold text-emerald-400">{m.balance?.toLocaleString() || 0} ج.م</td>
                  <td className="p-6 text-sm font-mono text-slate-300">{m.phone}</td>

                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      m.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 
                      m.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {m.status === 'active' ? 'نشط' : m.status === 'pending' ? 'مراجعة' : 'مرفوض'}
                    </span>
                  </td>
                  <td className="p-6 text-xs text-slate-500">{new Date(m.created_at || m.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="p-6">
                    <div className="flex justify-center gap-3">
                        <button onClick={() => setSelectedMerchant(m)} className="p-2 hover:bg-indigo-500/10 rounded-lg text-indigo-400 transition-colors">👁️</button>
                        <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {merchants.length === 0 && (
                  <tr>
                      <td colSpan="6" className="p-20 text-center text-slate-500">لا يوجد تجار مسجلين حالياً</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="glass w-full max-w-xl rounded-3xl p-8 animate-scale-in">
                  <h2 className="text-xl font-bold mb-6">إضافة مستخدم جديد</h2>
                  <div className="space-y-4">
                      <input 
                        type="text" placeholder="الاسم الكامل" 
                        value={newMerchant.fullName} onChange={e => setNewMerchant({...newMerchant, fullName: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3"
                      />
                      <input 
                        type="text" placeholder="الرقم القومي" 
                        value={newMerchant.nationalId} onChange={e => setNewMerchant({...newMerchant, nationalId: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3"
                      />
                      <input 
                        type="text" placeholder="رقم الهاتف" 
                        value={newMerchant.phone} onChange={e => setNewMerchant({...newMerchant, phone: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3"
                      />
                      <textarea 
                        placeholder="العنوان" 
                        value={newMerchant.address} onChange={e => setNewMerchant({...newMerchant, address: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 h-24"
                      />
                      <div className="flex items-center gap-3 p-3 glass rounded-xl">
                          <input 
                            type="checkbox" 
                            checked={newMerchant.is_admin} 
                            onChange={e => setNewMerchant({...newMerchant, is_admin: e.target.checked})}
                            id="is_admin_check"
                          />
                          <label htmlFor="is_admin_check" className="text-sm text-slate-300">منح صلاحيات مدير النظام (Admin)</label>
                      </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                      <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 rounded-xl bg-slate-800 font-bold">إلغاء</button>
                      <button onClick={handleCreate} className="flex-1 py-3 rounded-xl bg-indigo-600 font-bold">إضافة التاجر</button>
                  </div>
              </div>
          </div>
      )}

      {/* Detail Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl rounded-3xl p-8 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-start mb-8">
              <button onClick={() => setSelectedMerchant(null)} className="text-2xl text-slate-500">×</button>
              <h2 className="text-xl font-bold">تفاصيل وبيانات التاجر</h2>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                  <DetailItem label="اسم المحل" value={selectedMerchant.store_name || '—'} />
                  <DetailItem label="الاسم الكامل" value={selectedMerchant.full_name || selectedMerchant.fullName} />
                  <DetailItem label="الرقم القومي" value={selectedMerchant.national_id || selectedMerchant.nationalId} mono />
                  <DetailItem label="رقم الهاتف" value={selectedMerchant.phone} mono />
                  <DetailItem label="العنوان" value={selectedMerchant.address} />
                  <DetailItem label="الرصيد الحالي" value={`${selectedMerchant.balance?.toLocaleString() || 0} ج.م`} />

              </div>
              <div className="space-y-4">
                  <p className="text-xs text-slate-500 uppercase">وثائق الهوية</p>
                  <div className="grid grid-cols-1 gap-4">
                     <div className="aspect-video rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-600 text-xs">وجه البطاقة</div>
                     <div className="aspect-video rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-600 text-xs">ظهر البطاقة</div>
                  </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5 flex justify-end gap-3">
               {selectedMerchant.status === 'pending' && (
                 <>
                   <button onClick={() => updateStatus(selectedMerchant.id, 'rejected')} className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold">رفض</button>
                   <button onClick={() => updateStatus(selectedMerchant.id, 'active')} className="px-10 py-3 rounded-xl bg-emerald-500 text-white font-bold">موافقة</button>
                 </>
               )}
                {selectedMerchant.status === 'active' && (
                   <div className="flex gap-2">
                       <button 
                         onClick={() => updateStatus(selectedMerchant.id, selectedMerchant.status, 'toggle_admin')} 
                         className={`px-6 py-3 rounded-xl font-bold ${selectedMerchant.is_admin ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}
                       >
                         {selectedMerchant.is_admin ? 'إزالة صلاحية مدير' : 'جعل مديراً للنظام'}
                       </button>
                       <button onClick={() => updateStatus(selectedMerchant.id, 'rejected')} className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold">إيقاف الحساب</button>
                   </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value, mono }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</p>
            <p className={`font-medium ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
        </div>
    );
}
