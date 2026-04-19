"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
    const router = useRouter();
    const [creds, setCreds] = useState({
        targetUrl: 'https://wifi.e-misr.com/ICO',
        AID: '',
        PWD: '',
        PHONE: '',
        NATID: ''
    });
    const [systemMode, setSystemMode] = useState('FULL_SYNC');
    const [maintenance, setMaintenance] = useState(false);
    const [notice, setNotice] = useState('');
    const [loading, setLoading] = useState(true);
    const [testStatus, setTestStatus] = useState(null);


    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/config');
            const data = await res.json();
            if (data.credentials) setCreds(data.credentials);
            if (data.paymentMode) setSystemMode(data.paymentMode.mode || 'FULL_SYNC');
            if (data.maintenance_mode !== undefined) setMaintenance(data.maintenance_mode);
            if (data.global_notice) setNotice(data.global_notice);
            setLoading(false);

        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async (isTest = false) => {
        setTestStatus({ loading: true });
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: isTest ? 'test' : 'save', 
                    credentials: creds,
                    paymentMode: { mode: systemMode },
                    maintenance_mode: maintenance,
                    global_notice: notice
                })

            });
            const data = await res.json();
            if (isTest) {
                setTestStatus(data);
            } else {
                alert('تم حفظ الإعدادات بنجاح');
                setTestStatus(null);
            }
        } catch (e) {
            setTestStatus({ success: false, error: e.message });
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <button onClick={() => router.push('/admin')} className="text-slate-400 hover:text-white transition-colors">← العودة للوحة التحكم</button>
                     <h1 className="text-2xl font-bold">إعدادات النظام والموقع الأساسي</h1>
                </div>

                {/* System Mode Toggle */}
                <div className="glass rounded-[2rem] p-8 border-indigo-500/20 bg-indigo-500/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-right">
                            <h3 className="font-bold text-lg mb-1">وضعية تشغيل النظام</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {systemMode === 'FULL_SYNC' 
                                    ? 'النظام حالياً يقوم بالتنفيذ الفعلي على الموقع الأساسي والخصم من رصيد التاجر محلياً.' 
                                    : 'النظام حالياً يقوم بالخصم من رصيد التاجر محلياً فقط دون تنفيذ الدفع على الموقع الأساسي.'}
                            </p>
                        </div>
                        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5">
                            <button 
                                onClick={() => setSystemMode('FULL_SYNC')}
                                className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${systemMode === 'FULL_SYNC' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                تنفيذ كامل (خارجي + محلي)
                            </button>
                            <button 
                                onClick={() => setSystemMode('LOCAL_ONLY')}
                                className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${systemMode === 'LOCAL_ONLY' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                خصم محلي فقط
                            </button>
                        </div>
                    </div>
                </div>


                <div className="glass rounded-3xl p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                             <label className="text-xs text-slate-500 uppercase">الموقع المستهدف للعمل في الخلفية</label>
                             <select 
                                value={creds.targetUrl || 'https://wifi.e-misr.com/ICO'}
                                onChange={e => setCreds({...creds, targetUrl: e.target.value})}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-indigo-500 outline-none text-slate-100"
                             >
                                <option value="https://wifi.e-misr.com/ICO">الموقع الأساسي (wifi.e-misr.com)</option>
                                <option value="https://beta.e-misr.com/ICO">موقع البيتا (beta.e-misr.com)</option>
                             </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase">رقم الحساب (AID)</label>
                                <input 
                                    type="text" 
                                    value={creds.AID}
                                    onChange={e => setCreds({...creds, AID: e.target.value})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="مثلاً: 213956"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase">كلمة المرور</label>
                                <input 
                                    type="password" 
                                    value={creds.PWD}
                                    onChange={e => setCreds({...creds, PWD: e.target.value})}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase">رقم الهاتف للتحقق</label>
                                <input 
                                    type="text" 
                                    value={creds.PHONE}
                                    onChange={e => setCreds({...creds, PHONE: e.target.value})}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="01283986095"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase">الرقم القومي</label>
                                <input 
                                    type="text" 
                                    value={creds.NATID}
                                    onChange={e => setCreds({...creds, NATID: e.target.value})}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="28210031302391"
                                />
                            </div>
                        </div>
                    </div>

                    {testStatus && (
                        <div className={`p-4 rounded-2xl border ${
                            testStatus.loading ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                            testStatus.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <span>{testStatus.loading ? '⏳' : testStatus.success ? '✅' : '❌'}</span>
                                <span>{testStatus.loading ? 'جاري تجربة الاتصال...' : testStatus.success ? 'تم الاتصال بنجاح' : 'فشل الاتصال'}</span>
                            </div>
                            {testStatus.balance && <p className="mt-1 text-xs">الرصيد الحالي: {testStatus.balance} ج.م</p>}
                            {testStatus.error && <p className="mt-1 text-xs">{testStatus.error}</p>}
                        </div>
                    )}
                    
                    <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between p-4 glass rounded-2xl">
                            <div>
                                <p className="font-bold text-sm">وضع الصيانة (Maintenance Mode)</p>
                                <p className="text-[10px] text-slate-500">منع التجار من إجراء أي عمليات حالياً</p>
                            </div>
                            <button 
                                onClick={() => setMaintenance(!maintenance)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold ${maintenance ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                            >
                                {maintenance ? 'مفعل' : 'معطل'}
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                             <label className="text-xs text-slate-500 uppercase">إشعار النظام العام (Global Notice)</label>
                             <input 
                                type="text" 
                                value={notice}
                                onChange={e => setNotice(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-indigo-500 outline-none"
                                placeholder="مرحباً بكم في منصة Dr. Pay..."
                             />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={() => handleSave(true)}
                            disabled={testStatus?.loading}
                            className="flex-1 py-4 rounded-xl bg-slate-800 border border-slate-700 font-bold hover:bg-slate-700 transition-all disabled:opacity-50"
                        >
                            تجربة الاتصال
                        </button>
                        <button 
                            onClick={() => handleSave(false)}
                            disabled={testStatus?.loading}
                            className="flex-1 py-4 rounded-xl bg-indigo-600 font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50"
                        >
                            حفظ الإعدادات
                        </button>
                    </div>
                </div>

                <div className="glass rounded-3xl p-8 border-amber-500/20 bg-amber-500/5">
                    <div className="flex gap-4">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h3 className="font-bold text-amber-500 mb-1">تعليمات هامة</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                البيانات المدخلة هنا هي التي تمكن النظام من تنفيذ عمليات التنبؤ والاستعلام في الخلفية. 
                                يرجى التأكد من دقة البيانات وتجربة الاتصال قبل الحفظ النهائي.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
