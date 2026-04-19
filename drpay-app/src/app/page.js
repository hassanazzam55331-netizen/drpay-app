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
    location: 'pending', // pending, granted, denied
    bluetooth: 'pending',
    notifications: 'pending'
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

    // 2. Bluetooth (Mocked check as web bluetooth requires pairing)
    if ("bluetooth" in navigator) {
      setPermissions(p => ({ ...p, bluetooth: 'granted' }));
    } else {
      setPermissions(p => ({ ...p, bluetooth: 'denied' }));
    }

    // 3. Notifications
    if ("Notification" in window) {
      const res = await Notification.requestPermission();
      setPermissions(p => ({ ...p, notifications: res === 'granted' ? 'granted' : 'denied' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Check if we already requested permissions
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        
        {/* Permission Wizard Overlay */}
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
            <div className="glass w-full max-w-sm p-8 rounded-3xl space-y-6 text-center shadow-2xl animate-scale-in">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-3xl">🛡️</div>
              <div>
                <h2 className="text-xl font-bold">فحص أمان النظام</h2>
                <p className="text-xs text-slate-400 mt-2">يرجى السماح بالصلاحيات لضمان حماية حسابك</p>
              </div>

              <div className="space-y-3 text-right">
                <PermissionItem label="الموقع الجغرافي (GPS)" status={permissions.location} icon="📍" />
                <PermissionItem label="البلوتوث والأجهزة المجاورة" status={permissions.bluetooth} icon="📶" />
                <PermissionItem label="التنبيهات والإشعارات" status={permissions.notifications} icon="🔔" />
                <PermissionItem label="جهات الاتصال ولوحة المفاتيح" status="granted" icon="👤" />
              </div>

              <button 
                onClick={() => setShowWizard(false)}
                className="btn-primary w-full py-4 text-sm font-bold shadow-lg shadow-indigo-600/20"
              >
                متابعة للدخول
              </button>
            </div>
          </div>
        )}

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900/50 p-4 mb-4 shadow-2xl border border-white/5 group relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"></div>
            <img src="/img/logo.png" alt="DrPay Logo" className="w-full h-full object-contain" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/8634/8634027.png'} />
          </div>
          <h1 className="text-4xl font-black gradient-text tracking-tighter">Dr. Pay Pro</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">نظام الدفع الذكي والآمن</p>
        </div>

        {/* Login Form */}
        <div className="glass rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">كود التاجر</label>
                <span className="text-[10px] text-indigo-400/50">Merchant ID</span>
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-field-premium"
                placeholder="000000"
                required
                dir="ltr"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">كلمة المرور</label>
                <span className="text-[10px] text-indigo-400/50">Password</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field-premium"
                placeholder="••••••••"
                required
                dir="ltr"
              />
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded-md border-2 border-slate-700 bg-slate-800 flex items-center justify-center transition-all group-hover:border-indigo-500/50 overflow-hidden">
                    <input type="checkbox" className="w-full h-full opacity-0 absolute cursor-pointer" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-sm scale-0 transition-transform"></div>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">تذكرني</span>
              </label>
              <Link href="/register" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-all hover:scale-105">
                ليس لديك حساب؟
              </Link>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-500 text-xs text-center animate-fade-in font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-glow w-full flex items-center justify-center gap-3 text-sm py-5 font-black uppercase tracking-widest"
            >
              {loading ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>دخول آمن للمنصة</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-10 uppercase tracking-[0.2em] font-bold">
          Powered by AntiGravity Intelligence
        </p>
      </div>

      <style jsx>{`
        .input-field-premium {
            width: 100%;
            background: rgba(15, 23, 42, 0.6);
            border: 2px solid rgba(255, 255, 255, 0.03);
            border-radius: 20px;
            padding: 16px 20px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            outline: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-field-premium:focus {
            border-color: rgba(99, 102, 241, 0.4);
            background: rgba(30, 41, 59, 0.8);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
        }
        .btn-primary-glow {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px -5px rgba(79, 70, 229, 0.4);
            transition: all 0.3s;
        }
        .btn-primary-glow:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 40px -5px rgba(79, 70, 229, 0.6);
            background: linear-gradient(135deg, #8183f4 0%, #6366f1 100%);
        }
      `}</style>
    </div>
  );
}

function PermissionItem({ label, status, icon }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-white/5">
            <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-bold">{label}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${status === 'granted' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`}></div>
        </div>
    );
}
