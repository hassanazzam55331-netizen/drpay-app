"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    address: "",
    password: "",
  });
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.nationalId.length !== 14) {
      setError("الرقم القومي يجب أن يكون 14 رقماً");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      if (idFront) data.append("idFront", idFront);
      if (idBack) data.append("idBack", idBack);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000);
      } else {
        setError(result.error || "فشل تسجيل الحساب");
      }
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 text-center max-w-sm animate-slide-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center mb-6 pulse-glow">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-emerald-400 mb-2">تم تقديم الطلب!</h2>
          <p className="text-slate-400 text-sm">سيتم مراجعة بياناتك وتفعيل الحساب خلال 24 ساعة.</p>
          <p className="text-xs text-slate-500 mt-4 italic">جاري تحويلك لصفحة الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold gradient-text">إنشاء حساب تاجر</h1>
          <p className="text-slate-400 mt-2">انضم إلى Dr. Pay وابدأ مشروعك الآن</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">الاسم بالكامل</label>
                <input
                  name="fullName"
                  type="text"
                  required
                  className="input-field"
                  placeholder="أدخل الاسم ثلاثي كما في البطاقة"
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">الرقم القومي</label>
                <input
                  name="nationalId"
                  type="text"
                  maxLength="14"
                  required
                  className="input-field"
                  placeholder="14 رقم فقط"
                  onChange={handleInputChange}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">رقم المحمول</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="input-field"
                  placeholder="01xxxxxxxxx"
                  onChange={handleInputChange}
                  dir="ltr"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">العنوان بالتفصيل</label>
                <input
                  name="address"
                  type="text"
                  required
                  className="input-field"
                  placeholder="المحافظة - المدينة - الحي - الشارع"
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="6 أحرف على الأقل"
                  onChange={handleInputChange}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">صورة البطاقة (الوجه)</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdFront(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-slate-800/50 ${idFront ? 'border-emerald-500/50' : 'border-slate-700 group-hover:border-indigo-500/50'}`}>
                    <span className="text-2xl mb-2">{idFront ? '🖼️' : '📸'}</span>
                    <p className="text-[10px] text-slate-400 text-center">
                      {idFront ? idFront.name : 'انقر لرفع وجه البطاقة'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">صورة البطاقة (الظهر)</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdBack(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-slate-800/50 ${idBack ? 'border-emerald-500/50' : 'border-slate-700 group-hover:border-indigo-500/50'}`}>
                    <span className="text-2xl mb-2">{idBack ? '🖼️' : '📸'}</span>
                    <p className="text-[10px] text-slate-400 text-center">
                      {idBack ? idBack.name : 'انقر لرفع ظهر البطاقة'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm animate-fade-in text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري معالجة البيانات...
                </>
              ) : (
                'إنشاء الحساب'
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-400">
                لديك حساب بالفعل؟{" "}
                <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  سجل دخول
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
