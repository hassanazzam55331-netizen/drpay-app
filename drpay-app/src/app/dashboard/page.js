"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/serviceData";
import { parseServiceCatalog, getServicesByCategory, getSubCategories } from "@/lib/serviceData";
import { generateAPIID } from "@/lib/api";

// ============ SIDEBAR ============
function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "الرئيسية" },
    { id: "services", icon: "📋", label: "الخدمات" },
    { id: "transactions", icon: "📊", label: "العمليات" },
    { id: "settings", icon: "⚙️", label: "الإعدادات" },
  ];

  return (
    <aside className="fixed right-0 top-0 h-full w-[72px] glass flex flex-col items-center py-6 z-50">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-8 shadow-lg">
        <span className="text-xl">💳</span>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group relative ${
              activeTab === tab.id
                ? "bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="absolute right-full mr-3 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="w-12 h-12 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all"
        title="تسجيل الخروج"
      >
        <span className="text-xl">🚪</span>
      </button>
    </aside>
  );
}

// ============ HEADER ============
function Header({ balance, balanceLoading }) {
  return (
    <header className="flex items-center justify-between mb-8 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold">مرحباً 👋</h1>
        <p className="text-slate-400 text-sm">نظام Dr. Pay للدفع الإلكتروني</p>
      </div>
      <div className="glass rounded-2xl px-6 py-3 flex items-center gap-3">
        <div className="text-left">
          <p className="text-xs text-slate-400">الرصيد المتاح</p>
          {balanceLoading ? (
            <div className="h-6 w-24 shimmer rounded mt-1" />
          ) : (
            <p className="text-xl font-bold gradient-text">{balance} ج.م</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <span className="text-xl">💰</span>
        </div>
      </div>
    </header>
  );
}

import ThermalReceipt from "@/components/ThermalReceipt";

// ============ STAT CARDS ============
function StatCards({ summary }) {
  const stats = [
    { label: "عمليات اليوم", value: summary?.count || 0, icon: "📊", color: "from-indigo-500/15 to-purple-500/15", border: "border-indigo-500/20" },
    { label: "إجمالي المبالغ", value: `${(summary?.total_amount || 0).toFixed(2)} ج`, icon: "💵", color: "from-emerald-500/15 to-green-500/15", border: "border-emerald-500/20" },
    { label: "ناجحة", value: summary?.success_count || 0, icon: "✅", color: "from-cyan-500/15 to-blue-500/15", border: "border-cyan-500/20" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-[2rem] p-6 animate-slide-up shadow-xl shadow-black/20`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
            <span className="text-4xl filter drop-shadow-md">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}


// ============ CATEGORY GRID ============
function CategoryGrid({ onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span>📋</span> الخدمات
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className="card text-center group animate-slide-up cursor-pointer"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </span>
            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              {cat.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

import { getServiceIcon } from "@/lib/serviceData";

// ============ SERVICE LIST ============
function ServiceList({ services, category, onSelect, onBack }) {
  if (!services || services.length === 0) {
    return (
      <div className="animate-fade-in">
        <button onClick={onBack} className="btn-secondary mb-4 flex items-center gap-2">
          <span>→</span> رجوع
        </button>
        <div className="text-center py-16 text-slate-400">
          <span className="text-5xl block mb-4">📭</span>
          <p>لا توجد خدمات في هذا التصنيف</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="btn-secondary py-2 px-4 flex items-center gap-2">
          <span>→</span> رجوع
        </button>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>{category?.icon}</span> {category?.name}
        </h2>
        <span className="badge badge-info mr-auto">{services.length} خدمة</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((s, i) => {
          const icon = getServiceIcon(s.name, s.ico);
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="card flex items-center gap-4 hover:border-indigo-500/50 transition-all text-right group"
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-800/50 group-hover:scale-110 transition-transform">
                {typeof icon === 'string' ? <span className="text-2xl">{icon}</span> : icon}
              </div>
              <span className="text-sm font-bold truncate">{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============ SERVICE EXECUTION ============
function ServiceExecution({ service, onBack, onTransaction }) {
  const [fields, setFields] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [step, setStep] = useState("input"); // input, inquiry, payment, result
  const [inquiryResult, setInquiryResult] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFieldChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  // Instant Inquiry Logic
  useEffect(() => {
    if (step !== "input" || loading) return;

    const inputs = service.inp || [];
    const isReady = inputs.every(inp => {
        const val = fields[inp.name] || "";
        if (inp.type === "tel") return val.length === 11;
        if (inp.type === "number" && inp.title.includes("القومي")) return val.length === 14;
        if (inp.type === "gov") return val.length >= 2;
        return val.length > 0;
    });

    // Also check if PAX (company) is selected if required
    const paxReady = service.PAX ? fields.PAX : true;

    if (isReady && paxReady && Object.keys(fields).length > 0) {
        const timer = setTimeout(() => handleInquiry(), 800); // 800ms debounce
        return () => clearTimeout(timer);
    }
  }, [fields, service, step]);

  const handleInquiry = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = { srv: service.srv, service_name: service.name, ...fields };
      if (selectedOption) {
        payload.avsa = selectedOption.vsa || selectedOption.value;
        payload.pvsa = selectedOption.pvsa || selectedOption.value;
        // Some services need the selected value in a specific field if not avsa
        if (service.lst || service.PAX) {
           payload.Key1 = selectedOption.id || selectedOption.value;
        }
      }

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.ST === "YES" || data.ST === "INF" || data.NXT === "PAY" || data.VSA > 0) {
        setInquiryResult(data);
        setStep("inquiry");
      } else if (data.ST === "ERR") {
        setError(data.SMS || "فشل الاستعلام من المصدر");
      } else if (data.ST === "LOG") {
        setError("انتهت جلسة العمل، يرجى إعادة المحاولة");
      } else {
        setError(data.SMS || "حدث خطأ غير متوقع");
      }
    } catch {
      setError("خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const apiId = generateAPIID();
      const payload = {
        srv: service.srv,
        APIID: apiId,
        service_name: service.name,
        ...fields,
      };
      if (inquiryResult?.CPRID) payload.CPRID = inquiryResult.CPRID;
      if (selectedOption) {
        payload.avsa = selectedOption.vsa || selectedOption.value;
        if (service.lst || service.PAX) {
           payload.Key1 = selectedOption.id || selectedOption.value;
        }
      }
      if (inquiryResult?.VSA) payload.avsa = inquiryResult.VSA;

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-merchant-id": JSON.parse(localStorage.getItem('drpay_user'))?.id || 'demo-merchant'
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      data._APIID = apiId;
      setPaymentResult(data);

      if (data.ST === "YES") {
          setStep("result");
          // Update transactions locally too
          onTransaction({
            apiId,
            service: service.name,
            serviceCode: service.srv,
            amount: data.VSA || inquiryResult?.VSA || 0,
            status: data.ST,
            bid: data.BID,
            time: new Date().toLocaleString("ar-EG"),
            response: data,
          });
      } else {
          setError(data.SMS || "فشلت العملية");
          setStep("result");
      }
    } catch {
      setError("خطأ في تنفيذ العملية");
    } finally {
      setLoading(false);
    }
  };


  // Render input fields based on service definition
  const renderInputs = () => {
    // If service has a selection list (sel)
    if (service.sel && !service.inp?.length) {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300 mb-2">اختر الخدمة</label>
          {service.sel.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(opt)}
              className={`w-full text-right p-4 rounded-xl border transition-all ${
                selectedOption?.value === opt.value
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
              }`}
            >
              <p className="font-medium text-sm">{opt.title}</p>
              {opt.vsa && <p className="text-xs text-slate-400 mt-1">{opt.vsa} ج.م</p>}
            </button>
          ))}
        </div>
      );
    }

    // If service has a card list (lst)
    if (service.lst) {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300 mb-2">اختر الفئة</label>
          <div className="grid grid-cols-2 gap-2">
            {service.lst.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(item)}
                className={`text-right p-3 rounded-xl border transition-all ${
                  selectedOption?.id === item.id || selectedOption?.value === item.value
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                <p className="font-medium text-xs">{item.title}</p>
                {item.value && <p className="text-xs text-emerald-400 mt-1">{item.value} ج</p>}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // If service has a PAX list (like electricity meters)
    if (service.PAX) {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300 mb-2">اختر الشركة</label>
          {service.PAX.map((pax, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(pax)}
              className={`w-full text-right p-4 rounded-xl border transition-all ${
                selectedOption?.value === pax.value
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
              }`}
            >
              <p className="font-medium text-sm">{pax.title}</p>
            </button>
          ))}
        </div>
      );
    }

    // Regular input fields
    const inputs = service.inp || [];
    return (
      <div className="space-y-4">
        {inputs.map((inp, i) => {
          if (inp.type === "div") return null; // Skip div elements

          if (inp.type === "gov") {
            const govList = [
              { code: "02", name: "القاهرة" },
              { code: "03", name: "الاسكندرية" },
              { code: "040", name: "طنطا" },
              { code: "045", name: "الزقازيق" },
              { code: "047", name: "كفر الشيخ" },
              { code: "048", name: "المنصورة" },
              { code: "050", name: "بنها" },
              { code: "055", name: "الشرقية" },
              { code: "057", name: "دمياط" },
              { code: "062", name: "بورسعيد" },
              { code: "064", name: "الاسماعيلية" },
              { code: "065", name: "السويس" },
              { code: "066", name: "البحر الأحمر" },
              { code: "068", name: "شمال سيناء" },
              { code: "069", name: "جنوب سيناء" },
              { code: "082", name: "بني سويف" },
              { code: "084", name: "الفيوم" },
              { code: "086", name: "المنيا" },
              { code: "088", name: "اسيوط" },
              { code: "092", name: "الأقصر" },
              { code: "093", name: "سوهاج" },
              { code: "095", name: "قنا" },
              { code: "096", name: "اسوان" },
              { code: "097", name: "الوادي الجديد" },
            ];
            return (
              <div key={i}>
                <label className="block text-sm font-medium text-slate-300 mb-2">المحافظة</label>
                <select
                  className="input-field"
                  onChange={(e) => handleFieldChange(inp.name || "gov", e.target.value)}
                  value={fields[inp.name || "gov"] || ""}
                >
                  <option value="">اختر المحافظة...</option>
                  {govList.map((g, j) => (
                    <option key={j} value={g.code}>{g.name} ({g.code})</option>
                  ))}
                </select>
              </div>
            );
          }

          if (inp.type === "sel" && inp.list) {
            return (
              <div key={i}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{inp.title}</label>
                <select
                  className="input-field"
                  onChange={(e) => handleFieldChange(inp.name, e.target.value)}
                  value={fields[inp.name] || ""}
                >
                  <option value="">اختر...</option>
                  {inp.list.map((opt, j) => (
                    <option key={j} value={opt.value}>{opt.title}</option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={i}>
              <label className="block text-sm font-medium text-slate-300 mb-2">{inp.title}</label>
              <input
                type={inp.type === "tel" ? "text" : inp.type || "text"}
                className="input-field"
                placeholder={inp.title}
                value={fields[inp.name] || ""}
                onChange={(e) => handleFieldChange(inp.name, e.target.value)}
                dir="ltr"
                required
              />
            </div>
          );
        })}
        {/* Selection options if exist alongside inputs */}
        {service.sel && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">اختر الباقة</label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {service.sel.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedOption(opt)}
                  className={`text-right p-3 rounded-xl border transition-all ${
                    selectedOption?.value === opt.value
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  }`}
                >
                  <p className="font-medium text-xs">{opt.title}</p>
                  {opt.vsa && <p className="text-xs text-emerald-400 mt-1">{opt.vsa} ج</p>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <button onClick={onBack} className="btn-secondary mb-4 flex items-center gap-2">
        <span>→</span> رجوع
      </button>

      <div className="glass rounded-2xl p-6">
        {/* Service Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/50">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
            <span className="text-2xl">💼</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">{service.name}</h2>
            <p className="text-xs text-slate-400">كود: {service.srv}</p>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center gap-2 mb-6 text-xs">
          {["الإدخال", "الاستعلام", "النتيجة"].map((s, i) => {
            const stepIdx = ["input", "inquiry", "result"].indexOf(step);
            return (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  i <= stepIdx ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-400"
                }`}>
                  {i + 1}
                </div>
                <span className={i <= stepIdx ? "text-white" : "text-slate-500"}>{s}</span>
                {i < 2 && <div className={`flex-1 h-0.5 ${i < stepIdx ? "bg-indigo-500" : "bg-slate-700"}`} />}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        {step === "input" && (
          <div className="space-y-4">
            {renderInputs()}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}
            {service.inf && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: service.inf }} />
            )}
            <button
              onClick={handleInquiry}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>🔍</span> استعلام
                </>
              )}
            </button>
          </div>
        )}

        {step === "inquiry" && inquiryResult && (
          <div className="space-y-4 animate-slide-up">
            {inquiryResult && (
              <div className="glass rounded-2xl p-6 border-indigo-500/30 animate-scale-in">
                <h3 className="text-lg font-bold mb-4 text-indigo-400">تفاصيل الاستعلام</h3>
                <div className="space-y-4">
                  {/* Dynamic mapping of inquiry results */}
                  {Object.entries(inquiryResult).map(([key, value]) => {
                    if (['ST', 'SMS', 'RES', 'AUTH'].includes(key)) return null;
                    if (typeof value === 'object') return null;
                    
                    // Human readable names for common keys
                    const labels = {
                        val: 'القيمة المستحقة',
                        NAM: 'اسم العميل',
                        NUM: 'رقم الفاتورة',
                        DAT: 'تاريخ الاستحقاق',
                        ADR: 'العنوان',
                    };

                    return (
                      <div key={key} className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-sm text-slate-400">{labels[key] || key}</span>
                        <span className="font-bold text-slate-100">{value}</span>
                      </div>
                    );
                  })}
                  
                  {inquiryResult.val !== undefined && (
                    <div className="pt-4 mt-2 border-t border-indigo-500/30">
                       <label className="block text-xs text-slate-500 mb-1">المبلغ المطلوب دفعه</label>
                       <p className="text-3xl font-black text-white">{inquiryResult.val} <span className="text-sm font-normal">ج.م</span></p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">{error}</div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setStep("input"); setError(""); }} className="btn-secondary flex-1">
                إلغاء
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>💳</span> تأكيد الدفع
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "result" && paymentResult && (
          <div className="animate-slide-up">
            {paymentResult.ST === "YES" ? (
               <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center mb-2">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-lg font-bold text-emerald-400">عملية ناجحة</h3>
                  </div>
                  
                  {/* Digital Receipt View */}
                  <div className="max-h-[400px] overflow-y-auto rounded-3xl border border-white/5 bg-white/5">
                      <ThermalReceipt data={{
                          ...paymentResult,
                          service_name: service.name,
                          amount: paymentResult.VSA,
                          total_amount: paymentResult.VSA,
                          merchant_name: JSON.parse(localStorage.getItem('drpay_user'))?.name,
                          created_at: new Date().toISOString()
                      }} />
                  </div>
               </div>
            ) : (
              <div className="space-y-4 text-center py-10">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/15 flex items-center justify-center">
                  <span className="text-5xl">❌</span>
                </div>
                <h3 className="text-xl font-bold text-red-400">فشلت العملية</h3>
                <p className="text-slate-400">{paymentResult.SMS || "حدث خطأ أثناء تنفيذ العملية"}</p>
              </div>
            )}
            <button onClick={onBack} className="btn-primary mt-6 w-full py-4 rounded-2xl font-bold shadow-lg shadow-indigo-600/20">
              <span>🏠</span> العودة للرئيسية
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ============ TRANSACTIONS VIEW ============
function TransactionsView({ transactions }) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span>📊</span> سجل العمليات
      </h2>
      {transactions.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <span className="text-5xl block mb-4">📭</span>
          <p>لا توجد عمليات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, i) => (
            <div key={i} className="card flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                tx.status === "YES" ? "bg-emerald-500/15" : "bg-red-500/15"
              }`}>
                <span className="text-xl">{tx.status === "YES" ? "✅" : "❌"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{tx.service}</p>
                <p className="text-xs text-slate-400">{tx.time}</p>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{tx.amount} ج</p>
                <span className={`badge ${tx.status === "YES" ? "badge-success" : "badge-danger"}`}>
                  {tx.status === "YES" ? "ناجحة" : "فاشلة"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ SETTINGS VIEW ============
function SettingsView() {
  return (
    <div className="animate-fade-in max-w-lg">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span>⚙️</span> الإعدادات
      </h2>
      <div className="space-y-4">
        <div className="card">
          <h3 className="font-bold mb-3 flex items-center gap-2"><span>👤</span> معلومات الحساب</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">رقم الحساب</span><span className="font-mono">213956</span></div>
            <div className="flex justify-between"><span className="text-slate-400">نوع الحساب</span><span>تاجر</span></div>
            <div className="flex justify-between"><span className="text-slate-400">الحالة</span><span className="badge badge-success">نشط</span></div>
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold mb-3 flex items-center gap-2"><span>🔗</span> معلومات النظام</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">الإصدار</span><span>2.0.0</span></div>
            <div className="flex justify-between"><span className="text-slate-400">المنصة</span><span>Dr. Pay</span></div>
            <div className="flex justify-between"><span className="text-slate-400">البيئة</span><span className="badge badge-info">إنتاج</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN DASHBOARD ============
export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const [balance, setBalance] = useState("---");
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [catalog, setCatalog] = useState(null);
  const [parsedData, setParsedData] = useState({ menus: {}, services: {} });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [currentServices, setCurrentServices] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");
  const [allServices, setAllServices] = useState([]);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("drpay_token");
    if (!token) {
      router.push("/");
      return;
    }
    loadBalance();
    loadCatalog();
    const saved = localStorage.getItem("drpay_transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, [router]);

  // Flatten all services for global search
  useEffect(() => {
    if (parsedData.services) {
        setAllServices(Object.values(parsedData.services));
    }
  }, [parsedData]);

  // Universal Search-as-you-type Logic
  useEffect(() => {
    if (search.length >= 2) {
        const query = search.toLowerCase();
        const exactMatch = allServices.find(s => s.srv.toString() === query);
        if (exactMatch && !selectedService) {
            setSelectedService(exactMatch);
            setSearch(""); // Reset search after select
        }
    }
  }, [search, allServices, selectedService]);

  const loadBalance = async () => {
    setBalanceLoading(true);
    try {
      const data = await (await fetch("/api/balance")).json();
      if (data.rVSA !== undefined) {
        setBalance(parseFloat(data.rVSA).toLocaleString("ar-EG"));
      } else if (data.balance !== undefined) {
        setBalance(parseFloat(data.balance).toLocaleString("ar-EG"));
      } else {
        setBalance("0.00");
      }
    } catch {
      setBalance("0.00");
    } finally {
      setBalanceLoading(false);
    }
  };

  const loadCatalog = async () => {
    try {
      const data = await (await fetch("/api/catalog")).json();
      setCatalog(data);
      setParsedData(parseServiceCatalog(data));
    } catch (e) {
      console.error("Failed to load catalog", e);
    }
  };

  const handleCategorySelect = useCallback((cat) => {
    setSelectedCategory(cat);
    // Get sub-categories and services for this category
    const subCats = getSubCategories(parsedData.menus, cat.id);
    const services = getServicesByCategory(parsedData.services, cat.id);
    // Also get services from subcategories
    const subServices = subCats.flatMap(sc => getServicesByCategory(parsedData.services, sc.id));
    setCurrentServices([...services, ...subServices]);
    setActiveTab("services");
    setSearch("");
  }, [parsedData]);

  const handleServiceSelect = (srv) => {
    setSelectedService(srv);
    setSearch("");
  };

  const handleTransaction = (tx) => {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    localStorage.setItem("drpay_transactions", JSON.stringify(updated));
    loadBalance(); // Refresh balance
  };

  const handleBackFromService = () => {
    if (selectedService) {
      setSelectedService(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setActiveTab("home");
    }
  };

  const filteredServices = allServices.filter(s => 
    s.name.includes(search) || s.srv.toString().includes(search)
  );

  return (
    <div className="min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={(t) => {
        setActiveTab(t);
        setSelectedCategory(null);
        setSelectedService(null);
        setSearch("");
      }} />

      <main className="mr-[72px] p-6 lg:p-8">
        <Header balance={balance} balanceLoading={balanceLoading} />

        {/* Universal Search Bar */}
        {(activeTab === "home" || activeTab === "services") && !selectedService && (
            <div className="mb-8 relative max-w-2xl animate-slide-up">
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
                <input 
                    type="text"
                    placeholder="ابحث باسم الخدمة أو الكود بنظام (كتابة والاستعلام التلقائي)..."
                    className="input-field pr-14 py-4 text-base"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search.length > 2 && filteredServices.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl shadow-2xl z-40 max-h-60 overflow-y-auto divide-y divide-white/5 border border-white/10 animate-fade-in">
                        {filteredServices.slice(0, 10).map(s => (
                            <button 
                                key={s.srv} 
                                onClick={() => handleServiceSelect(s)}
                                className="w-full text-right p-4 hover:bg-white/5 flex justify-between items-center group transition-colors"
                            >
                                <span className="font-medium group-hover:text-indigo-400">{s.name}</span>
                                <span className="text-xs text-slate-500 font-mono">كود: {s.srv}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === "home" && (
          <>
            <StatCards transactions={transactions} />
            <CategoryGrid onSelect={handleCategorySelect} />
          </>
        )}

        {activeTab === "services" && !selectedService && (
          <ServiceList
            services={currentServices}
            category={selectedCategory}
            onSelect={handleServiceSelect}
            onBack={handleBackFromService}
          />
        )}

        {activeTab === "services" && selectedService && (
          <ServiceExecution
            service={selectedService}
            onBack={handleBackFromService}
            onTransaction={handleTransaction}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionsView transactions={transactions} />
        )}

        {activeTab === "settings" && <SettingsView />}
      </main>
    </div>
  );
}
