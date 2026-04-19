"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    merchants: { total: 0, pending: 0 },
    transactions: { total: 0, volume: 0 },
    system: { balance: "0.00", status: "Active" }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("drpay_user") || "{}");
    if (user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch admin stats");
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sidebar Placeholder / Mobile Nav */}
      <nav className="glass border-b border-white/5 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <h1 className="text-xl font-bold gradient-text">لوحة التحكم (المدير)</h1>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <button onClick={logout} className="text-sm text-red-400 hover:text-red-300">خروج</button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="canvas-card p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl">👥</span>
              <span className="badge badge-info">{stats.merchants.pending} طلبات معلقة</span>
            </div>
            <p className="text-slate-400 text-sm">إجمالي التجار</p>
            <h3 className="text-2xl font-bold">{stats.merchants.total}</h3>
          </div>

          <div className="canvas-card p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl">📊</span>
              <span className="text-xs text-emerald-400">+12% اليوم</span>
            </div>
            <p className="text-slate-400 text-sm">إجمالي العمليات</p>
            <h3 className="text-2xl font-bold">{stats.transactions.total}</h3>
          </div>

          <div className="canvas-card p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-slate-400 text-sm">حجم العمليات الإجمالي</p>
            <h3 className="text-2xl font-bold">{stats.transactions.volume} ج.م</h3>
          </div>

          <div className="canvas-card p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl">🏦</span>
              <span className="badge badge-success">مستقر</span>
            </div>
            <p className="text-slate-400 text-sm">الرصيد في الموقع الرئيسي</p>
            <h3 className="text-2xl font-bold text-emerald-400">{stats.system.balance} ج.م</h3>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">مهام عاجلة</h2>
                </div>
                <div className="space-y-4">
                    <Link href="/admin/merchants" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">👥</span>
                            <div>
                                <p className="font-bold text-sm">إدارة المستخدمين والتجار</p>
                                <p className="text-xs text-slate-500">إضافة، تعديل، أو تفعيل حسابات التجار</p>
                            </div>
                        </div>
                        <span className="text-slate-600 group-hover:translate-x-[-4px] transition-transform">←</span>
                    </Link>

                    <Link href="/admin/deposits" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">💰</span>
                            <div>
                                <p className="font-bold text-sm">عمليات الإيداع والشحن</p>
                                <p className="text-xs text-slate-500">مراجعة وتأكيد طلبات رصيد التجار</p>
                            </div>
                        </div>
                        <span className="text-slate-600 group-hover:translate-x-[-4px] transition-transform">←</span>
                    </Link>

                    <Link href="/admin/support" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">📬</span>
                            <div>
                                <p className="font-bold text-sm">تذاكر الدعم الفني</p>
                                <p className="text-xs text-slate-500">الرد على استفسارات المشتركين</p>
                            </div>
                        </div>
                        <span className="text-slate-600 group-hover:translate-x-[-4px] transition-transform">←</span>
                    </Link>

                    <Link href="/admin/accounts" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">🏦</span>
                            <div>
                                <p className="font-bold text-sm">إدارة حسابات الاستقبال</p>
                                <p className="text-xs text-slate-500">تعديل أرقام الحسابات التي تستقبل الإيداعات</p>
                            </div>
                        </div>
                        <span className="text-slate-600 group-hover:translate-x-[-4px] transition-transform">←</span>
                    </Link>

                    <Link href="/admin/services" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">📋</span>
                            <div>
                                <p className="font-bold text-sm">إدارة الخدمات والرسوم</p>
                                <p className="text-xs text-slate-500">تعديل الرسوم أو تعطيل خدمات النظام</p>
                            </div>
                        </div>
                        <span className="text-slate-600 group-hover:translate-x-[-4px] transition-transform">←</span>
                    </Link>


                    <Link href="/admin/settings" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-500 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-400">⚙️</span>
                            <div>
                                <p className="font-bold text-sm">إعدادات النظام والوكيل</p>
                                <p className="text-xs text-slate-500">تغيير الموقع الأساسي وتجربة الاتصال</p>
                            </div>
                        </div>
                        <span className="text-slate-600 group-hover:translate-x-[-4px] transition-transform">←</span>
                    </Link>

                </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                 <h2 className="text-lg font-bold mb-6">حالة الاتصال</h2>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">الموقع الرئيسي (Background Agent)</span>
                        <span className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> متصل
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">قاعدة البيانات (Supabase)</span>
                        <span className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> متصل
                        </span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <style jsx>{`
        .canvas-card {
           background: linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.4));
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 20px;
           box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3);
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .canvas-card:hover {
           transform: translateY(-5px);
           border-color: rgba(99, 102, 241, 0.3);
           box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

function NotificationBell() {
    const [notifs, setNotifs] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("drpay_user") || "{}");
        if (!user.id) return;
        fetch(`/api/notifications?user_id=${user.id}`).then(r => r.json()).then(d => {
            if (d.notifications) setNotifs(d.notifications);
        });
    }, []);

    const markRead = async (id) => {
        await fetch('/api/notifications', {
            method: 'POST',
            body: JSON.stringify({ id, action: 'mark_read' })
        });
        setNotifs(notifs.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const unreadCount = notifs.filter(n => !n.is_read).length;

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[8px] flex items-center justify-center rounded-full font-bold border-2 border-slate-950 animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {open && (
                <div className="absolute top-full left-0 mt-2 w-72 glass rounded-2xl shadow-2xl p-4 z-[100] border-white/5 animate-scale-in">
                    <h4 className="text-sm font-bold mb-4 border-b border-white/5 pb-2">الإشعارات</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {notifs.length === 0 ? <p className="text-[10px] text-slate-500 py-4 text-center">لا توجد إشعارات</p> :
                         notifs.map(n => (
                            <div key={n.id} onClick={() => markRead(n.id)} className={`p-3 rounded-xl cursor-pointer transition-colors ${n.is_read ? 'opacity-40' : 'bg-white/5 hover:bg-white/10'}`}>
                                <p className="font-bold text-[10px]">{n.title}</p>
                                <p className="text-[10px] text-slate-400">{n.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
