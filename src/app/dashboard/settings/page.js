"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MerchantSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', address: '', phone: '' });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("drpay_user") || "{}");
    if (!userData.id) {
        router.push("/");
        return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("drpay_user") || "{}");
        const merchantId = userData.id;

        // Fetch Profile
        const res = await fetch(`/api/merchant/profile?id=${merchantId}`);
        const data = await res.json();
        
        if (data.success) {
            setProfile(data.profile);
            setFormData({
                full_name: data.profile.full_name,
                address: data.profile.address,
                phone: data.profile.phone
            });
            // Dummy devices for now or fetch from a device table if it exists
            setDevices([
                { id: 1, name: "الجلسة الحالية", last_login: "الآن", current: true },
            ]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };


  const handleUpdate = () => {
      setProfile({...profile, ...formData});
      setEditing(false);
      alert('تم تحديث البيانات بنجاح');
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
        <h1 className="text-xl font-bold">إعدادات الحساب</h1>
      </nav>

      <main className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Profile Card */}
        <div className="glass rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-10 -mt-10 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20">
                {profile.full_name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{profile.full_name}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 uppercase tracking-widest">كود المستخدم:</span>
                    <span className="text-xs font-mono text-indigo-400 font-bold">{profile.account_id}</span>
                </div>
              </div>
            </div>
            <button 
                onClick={() => setEditing(!editing)}
                className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all"
            >
                {editing ? 'إلغاء التعديل' : 'تعديل البيانات'}
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
            <div className="space-y-6">
                <InfoRow label="الاسم الكامل" value={profile.full_name} isEditing={editing} val={formData.full_name} setVal={(v) => setFormData({...formData, full_name: v})} />
                <InfoRow label="رقم الهاتف" value={profile.phone} isEditing={editing} val={formData.phone} setVal={(v) => setFormData({...formData, phone: v})} />
            </div>
            <div className="space-y-6">
                <InfoRow label="العنوان" value={profile.address} isEditing={editing} val={formData.address} setVal={(v) => setFormData({...formData, address: v})} />
                <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500">الحالة</span>
                    <span className="badge badge-success">نشط</span>
                </div>
            </div>
          </div>

          {editing && (
              <button 
                onClick={handleUpdate}
                className="w-full mt-8 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
              >
                حفظ التغييرات
              </button>
          )}
        </div>

        {/* Security & Devices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-3xl p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <span>🛡️</span> الأجهزة المسجلة
                    </h3>
                    <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full uppercase">أمان عالي</span>
                </div>
                
                <div className="space-y-4">
                    {devices.map(dev => (
                        <div key={dev.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{dev.name.includes('iPhone') ? '📱' : '💻'}</span>
                                <div>
                                    <p className="text-sm font-bold">{dev.name} {dev.current && <span className="text-[9px] text-emerald-500 ml-1">(هذا الجهاز)</span>}</p>
                                    <p className="text-[10px] text-slate-500">آخر ظهور: {dev.last_login}</p>
                                </div>
                            </div>
                            {!dev.current && <button className="text-xs text-red-500 hover:text-red-400">حذف</button>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass rounded-3xl p-8 space-y-6 flex flex-col justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 text-2xl">
                        🔑
                    </div>
                    <div>
                        <h3 className="font-bold">كود التفعيل</h3>
                        <p className="text-xs text-slate-500 mt-1">استخدم هذا الكود عند تسجيل الدخول من جهاز جديد</p>
                    </div>
                    <div className="py-4 px-8 bg-slate-900 rounded-2xl border border-dashed border-white/10">
                        <span className="text-2xl font-black font-mono tracking-widest text-indigo-400">885-321</span>
                    </div>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">توليد كود جديد</button>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 pt-10">
            <button onClick={() => router.push('/dashboard/support')} className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold border border-white/5 hover:border-white/10 transition-all">الدعم الفني</button>
            <button onClick={() => { localStorage.clear(); router.push('/'); }} className="flex-1 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 hover:bg-red-500/20 transition-all">تسجيل الخروج</button>
        </div>
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

function InfoRow({ label, value, isEditing, val, setVal }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</span>
            {isEditing ? (
                <input 
                    type="text" 
                    value={val} 
                    onChange={e => setVal(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none"
                />
            ) : (
                <span className="text-sm font-bold text-slate-200">{value}</span>
            )}
        </div>
    );
}
