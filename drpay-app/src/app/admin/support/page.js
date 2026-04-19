"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSupport() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/support');
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
  };

  const handleReply = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("drpay_user"));
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticket_id: selected.id, 
          admin_id: user.id, 
          message: reply,
          status: 'replied'
        })
      });
      if (res.ok) {
        setReply('');
        fetchTickets();
        setSelected(null);
        alert('تم إرسال الرد بنجاح');
      }
    } catch (e) {
      alert('فشل إرسال الرد');
    }
  };

  const closeTicket = async (id) => {
    try {
      await fetch('/api/admin/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticket_id: id, status: 'closed' })
      });
      fetchTickets();
      setSelected(null);
    } catch (e) { alert('فشل إغلاق التذكرة'); }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass border-b border-white/5 py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <button onClick={() => router.push('/admin')} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
        <h1 className="text-xl font-bold">إدارة تذاكر الدعم الفني</h1>
      </nav>

      <main className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-fade-in">
        <div className="w-full lg:w-1/3 space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase px-2 mb-4">التذاكر النشطة ({tickets.filter(t => t.status !== 'closed').length})</h2>
            <div className="space-y-3">
                {tickets.map(t => (
                    <button 
                        key={t.id} 
                        onClick={() => setSelected(t)}
                        className={`w-full glass rounded-3xl p-5 text-right border-l-4 transition-all ${
                            selected?.id === t.id ? 'border-indigo-500 bg-white/5' : 'border-white/5 hover:border-white/10'
                        }`}
                        style={{ borderLeftColor: t.status === 'open' ? '#3b82f6' : '#94a3b8' }}
                    >
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-sm text-slate-100">{t.subject}</h3>
                             <span className="text-[8px] text-slate-500">{new Date(t.created_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{t.profiles?.store_name || t.profiles?.full_name}</p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                t.status === 'open' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                            }`}>
                                {t.status === 'open' ? 'نشطة' : t.status}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1">
            {selected ? (
                <div className="glass rounded-[40px] p-8 h-[75vh] flex flex-col shadow-2xl border-white/5">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
                         <div className="flex gap-4">
                             <button onClick={() => closeTicket(selected.id)} className="text-xs text-red-500 bg-red-500/10 px-4 py-2 rounded-xl font-bold">إغلاق التذكرة</button>
                         </div>
                         <div className="text-right">
                            <h2 className="text-xl font-black">{selected.subject}</h2>
                            <p className="text-xs text-slate-500">المرسل: {selected.profiles?.store_name} • {selected.id.slice(0,8)}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 px-4">
                        {selected.ticket_messages?.map((msg, idx) => (
                            <Message 
                                key={idx} 
                                user={msg.is_admin ? "المدير" : (selected.profiles?.store_name || "التاجر")} 
                                text={msg.message} 
                                time={new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} 
                                isAdmin={msg.is_admin} 
                            />
                        ))}
                    </div>

                    {selected.status !== 'closed' && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <div className="relative">
                                <textarea 
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    placeholder="اكتب ردك هنا..."
                                    className="w-full bg-slate-900 border border-white/10 rounded-3xl p-6 pr-16 h-28 focus:border-indigo-500 outline-none transition-all resize-none font-sans"
                                />
                                <button 
                                    onClick={handleReply}
                                    disabled={!reply}
                                    className="absolute bottom-4 left-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50"
                                >
                                    إرسال الرد
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="glass rounded-[40px] h-[75vh] flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <span className="text-6xl mb-4">📬</span>
                    <h2 className="text-xl font-bold">اختر تذكرة لبدء المحادثة</h2>
                </div>
            )}
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

function Message({ user, text, time, isAdmin }) {
    return (
        <div className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} gap-2`}>
            <div className={`p-4 rounded-3xl max-w-[85%] text-sm shadow-sm ${
                isAdmin ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5' : 'bg-indigo-600 text-white rounded-tr-none'
            }`}>
                <p className="font-bold text-[9px] mb-1 opacity-50 uppercase tracking-widest">{user}</p>
                {text}
            </div>
            <span className="text-[8px] text-slate-600 font-mono">{time}</span>
        </div>
    );
}
