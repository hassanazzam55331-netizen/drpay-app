// Service categories and icon mapping
export const CATEGORIES = [
  { id: "1", name: "شحن الموبيل", icon: "📱", color: "#6366f1", gradient: "from-indigo-500 to-purple-600" },
  { id: "2", name: "شحن الفكة", icon: "🪙", color: "#f59e0b", gradient: "from-amber-500 to-orange-600" },
  { id: "3", name: "كروت الشحن", icon: "💳", color: "#06b6d4", gradient: "from-cyan-500 to-blue-600" },
  { id: "17", name: "تجديد الباقة", icon: "📶", color: "#10b981", gradient: "from-emerald-500 to-green-600" },
  { id: "4", name: "فواتير الموبيل", icon: "📄", color: "#8b5cf6", gradient: "from-violet-500 to-purple-600" },
  { id: "5", name: "الانترنت والارضي", icon: "🌐", color: "#3b82f6", gradient: "from-blue-500 to-indigo-600" },
  { id: "6", name: "شحن المحافظ", icon: "👛", color: "#ec4899", gradient: "from-pink-500 to-rose-600" },
  { id: "7", name: "التعليم", icon: "🎓", color: "#14b8a6", gradient: "from-teal-500 to-cyan-600" },
  { id: "8", name: "المرافق العامة", icon: "⚡", color: "#eab308", gradient: "from-yellow-500 to-amber-600" },
  { id: "9", name: "خدمات التأمين", icon: "🛡️", color: "#64748b", gradient: "from-slate-500 to-gray-600" },
  { id: "10", name: "نقل وسياحة", icon: "🚌", color: "#f97316", gradient: "from-orange-500 to-red-600" },
  { id: "11", name: "معاملات مالية", icon: "🏦", color: "#0ea5e9", gradient: "from-sky-500 to-blue-600" },
  { id: "12", name: "الاون لاين", icon: "🎮", color: "#a855f7", gradient: "from-purple-500 to-fuchsia-600" },
  { id: "13", name: "اشتراكات وتبرعات", icon: "🎗️", color: "#ef4444", gradient: "from-red-500 to-pink-600" },
  { id: "16", name: "اقساط وقروض", icon: "🧮", color: "#22c55e", gradient: "from-green-500 to-emerald-600" },
  { id: "14", name: "خدمات حكومية", icon: "⚖️", color: "#6366f1", gradient: "from-indigo-500 to-violet-600" },
  { id: "15", name: "خدمات متنوعة", icon: "🎲", color: "#06b6d4", gradient: "from-cyan-500 to-teal-600" },
  { id: "18", name: "خدمات التاجر", icon: "📖", color: "#f59e0b", gradient: "from-amber-500 to-yellow-600" },
];

// Parse service catalog JSON into usable format
export function parseServiceCatalog(catalogData) {
  const menus = {};
  const services = {};

  if (catalogData?.mnu) {
    Object.values(catalogData.mnu).forEach(m => {
      menus[m.id] = { id: m.id, sid: m.sid, name: m.name, ico: m.ico };
    });
  }

  if (catalogData?.srv) {
    Object.values(catalogData.srv).forEach(s => {
      services[s.id] = {
        id: s.id,
        sid: s.sid,
        srv: s.srv,
        name: s.name,
        ico: s.ico,
        inp: s.inp || [],
        sel: s.sel || null,
        lst: s.lst || null,
        css: s.css || null,
        inf: s.inf || null,
        partial: s.partial || 0,
        PAX: s.PAX || null,
      };
    });
  }

  return { menus, services };
}

// Get services by category ID
export function getServicesByCategory(services, categoryId) {
  return Object.values(services).filter(s => s.sid === categoryId);
}

// Get subcategories
export function getSubCategories(menus, parentId) {
  return Object.values(menus).filter(m => m.sid === parentId);
}

import { getBrandLogo } from './logos';

// Icon helper for service icons
export function getServiceIcon(name, ico) {
  // Try branded logo first
  const branded = getBrandLogo(name);
  if (branded) return branded;

  // Fallback to defaults
  if (!ico) return "💼";
  return null; // Image icon handled in component
}

// Egyptian governorate codes from phone prefix
export const GOV_CODES = [
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
