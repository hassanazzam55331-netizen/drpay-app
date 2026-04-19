"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [permissions, setPermissions] = useState({
    location: 'pending',
    nearby: 'pending',
    bluetooth: 'pending',
    contacts: 'pending'
  });
  const [showWizard, setShowWizard] = useState(false);

  const requestPermissions = async () => {
    setShowWizard(true);
    
    // 1. Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setPermissions(p => ({ ...p, location: 'granted' })),
        () => setPermissions(p => ({ ...p, location: 'denied' }))
      );
    }

    // 2. Bluetooth & Nearby (Mocked for PWA context)
    if ("bluetooth" in navigator) {
      setPermissions(p => ({ ...p, bluetooth: 'granted' }));
    }
    
    // Simulate other checks
    setTimeout(() => {
        setPermissions(p => ({ ...p, nearby: 'granted', contacts: 'granted' }));
    }, 1500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (permissions.location === 'pending' && !showWizard) {
      await requestPermissions();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: code, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("drpay_token", data.token);
        localStorage.setItem("drpay_user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.error || "فشل تسجيل الدخول");
      }
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md animate-slide-up">
        
        {/* Permission Wizard Overlay */}
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
            <div className="glass w-full max-w-sm p-8 rounded-[2.5rem] space-y-6 text-center shadow-2xl border border-white/10">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-4xl shadow-inner">🛡️</div>
              <div>
                <h2 className="text-xl font-black">فحص الصلاحيات</h2>
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">Permissions Audit</p>
              </div>

              <div className="space-y-4 text-right">
                <PermissionItem label="الموقع الجغرافي" status={permissions.location} icon="📍" />
                <PermissionItem label="الأجهزة المجاورة" status={permissions.nearby} icon="📱" />
                <PermissionItem label="البلوتوث" status={permissions.bluetooth} icon="📶" />
                <PermissionItem label="جهات الاتصال" status={permissions.contacts} icon="👤" />
              </div>

              <button 
                onClick={() => setShowWizard(false)}
                className="btn-primary w-full py-4 text-xs font-black uppercase shadow-xl shadow-indigo-600/20 rounded-2xl"
              >
                متابعة للدخول
              </button>
            </div>
          </div>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2.5rem] bg-slate-900 border border-white/5 p-6 mb-6 shadow-2xl group hover:scale-105 transition-all">
            <img 
                src="/logo/logo.png" 
                alt="DrPay Logo" 
                className="w-full h-full object-contain" 
                onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/8634/8634027.png'} 
            />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Dr. Pay Pro</h1>
          <p className="text-slate-500 text-[10px] mt-2 uppercase font-bold tracking-[0.3em]">Smart Secure Platform</p>
        </div>

        {/* Login Form */}
        <div className="glass rounded-[3rem] p-10 shadow-2xl border border-white/5 bg-white/[0.02]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">كود التاجر</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-field-custom"
                placeholder="أدخل كود التاجر"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field-custom"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-slate-900 accent-indigo-500" />
                <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">ذكرني</span>
              </label>
              <Link href="/register" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
                إنشاء حساب جديد
              </Link>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] text-center font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-5 w-full text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                <>دخول</>
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .glass {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .input-field-custom {
            width: 100%;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 1.25rem;
            padding: 18px 24px;
            color: white;
            font-size: 13px;
            outline: none;
            transition: all 0.3s;
            text-align: right;
        }
        .input-field-custom:focus {
            border-color: rgba(99, 102, 241, 0.4);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
        }
        .btn-primary {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            transition: all 0.3s;
        }
      `}</style>
    </div>
  );
}

function PermissionItem({ label, status, icon }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-white/5">
            <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-[11px] font-bold text-slate-200">{label}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${status === 'granted' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : status === 'denied' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-slate-700'}`}></div>
        </div>
    );
}

