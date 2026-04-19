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

  const handleLogin = async (e) => {
    e.preventDefault();
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 mb-4 shadow-lg shadow-indigo-500/25">
            <span className="text-4xl">💳</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text">Dr. Pay</h1>
          <p className="text-slate-400 mt-2">نظام الدفع الإلكتروني</p>
        </div>

        {/* Login Form */}
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                كود التاجر
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-field"
                placeholder="أدخل كود التاجر"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="أدخل كلمة المرور"
                required
                dir="ltr"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/20" />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">ذكرني</span>
              </label>
              <Link href="/register" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                إنشاء حساب جديد
              </Link>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الدخول...
                </>
              ) : (
                <>
                  <span>🔐</span>
                  دخول
                </>
              )}
            </button>
          </form>


          {/* Features */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-800/50">
                <span className="text-2xl">⚡</span>
                <p className="text-xs text-slate-400 mt-1">سريع</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50">
                <span className="text-2xl">🔒</span>
                <p className="text-xs text-slate-400 mt-1">آمن</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50">
                <span className="text-2xl">💎</span>
                <p className="text-xs text-slate-400 mt-1">موثوق</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Dr. Pay © {new Date().getFullYear()} - جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
