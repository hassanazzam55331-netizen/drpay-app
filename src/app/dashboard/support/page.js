"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MerchantSupport() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'normal' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    // Mock data for UI development
    setTimeout(() => {
        setTickets([
            { id: 'TK-120', subject: "تأخر في شحن الرصيد", status: "open", priority: "high", date: "منذ ساعة" },
            { id: 'TK-115', subject: "استفسار عن خدمة فودافون", status: "closed", priority: "normal", date: "15 أبريل" }
        ]);
        setLoading(false);
    }, 600);
  };

  const handleCreate = () => {
      alert('تم فتح التذكرة بنجاح. سنرد عليك في أقرب وقت.');
      setShowAdd(false);
      setNewTicket({ subject: '', message: '', priority: 'normal' });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass border-b border-white/5 py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">← العودة</button>
        <h1 className="text-xl font-bold text-slate-100">الدعم الفني</h1>
      </nav>

      <main className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center bg-indigo-600/10 p-6 rounded-3xl border border-indigo-500/20">
            <div>
                <h2 className="text-lg font-bold text-indigo-400">تحتاج لنساعدة؟</h2>
                <p className="text-xs text-slate-500">فريق الدعم متاح على مدار الساعة لخدمتكم</p>
            </div>
            <button 
                onClick={() => setShowAdd(true)}
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all"
            >
                + فتح تذكرة جديدة
            </button>
        </div>

        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 px-2 uppercase tracking-widest">التذاكر الحالية</h3>
            {tickets.map(ticket => (
                <button 
                    key={ticket.id} 
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                            ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'
                        }`}>
                            {ticket.status === 'open' ? '💬' : '✅'}
                        </div>
                        <div className="text-right">
                            <h4 className="font-bold text-slate-200">{ticket.subject}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">ID: {ticket.id} • {ticket.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                            ticket.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                            {ticket.priority === 'high' ? 'عاجل' : 'عادي'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                            ticket.status === 'open' ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                            {ticket.status === 'open' ? 'نشطة' : 'مغلقة'}
                        </span>
                    </div>
                </button>
            ))}
        </div>
      </main>

      {/* Add Ticket Modal */}
      {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
              <div className="glass w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-scale-in">
                  <div className="flex justify-between items-start mb-8">
                       <button onClick={() => setShowAdd(false)} className="text-2xl text-slate-500">×</button>
                       <h2 className="text-xl font-bold text-right">فتح تذكرة دعم فني</h2>
                  </div>

                  <div className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-xs text-slate-500 uppercase">عنوان التذكرة</label>
                          <input 
                            type="text" 
                            value={newTicket.subject}
                            onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                            placeholder="مثلاً: مشكلة في شحن فوري"
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 focus:border-indigo-500 outline-none"
                          />
                      </div>

                      <div className="space-y-2">
                          <label className="text-xs text-slate-500 uppercase">المستوى</label>
                          <div className="flex gap-4">
                                {['normal', 'high'].map(p => (
                                    <button 
                                        key={p}
                                        onClick={() => setNewTicket({...newTicket, priority: p})}
                                        className={`flex-1 py-3 rounded-xl border font-bold capitalize transition-all ${
                                            newTicket.priority === p ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-white/10 text-slate-500'
                                        }`}
                                    >
                                        {p === 'high' ? 'عاجل' : 'عادي'}
                                    </button>
                                ))}
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-xs text-slate-500 uppercase">تفاصيل المشكلة</label>
                          <textarea 
                            value={newTicket.message}
                            onChange={e => setNewTicket({...newTicket, message: e.target.value})}
                            placeholder="اشرح المشكلة بالتفصيل..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 h-32 focus:border-indigo-500 outline-none"
                          />
                      </div>

                      <button 
                        onClick={handleCreate}
                        disabled={!newTicket.subject || !newTicket.message}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
                      >
                        إرسال التذكرة
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Ticket View Modal (Simplified for now) */}
      {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
               <div className="glass w-full max-w-2xl rounded-3xl p-8 shadow-2xl h-[80vh] flex flex-col animate-slide-up">
                    <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                        <button onClick={() => setSelectedTicket(null)} className="text-2xl text-slate-500">×</button>
                        <div className="text-right">
                            <h2 className="font-bold text-lg">{selectedTicket.subject}</h2>
                            <p className="text-[10px] text-slate-500 uppercase font-mono">ID: {selectedTicket.id}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 py-4">
                        {/* Mock Chat */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                                {selectedTicket.subject} - هل يمكن المساعدة؟
                            </div>
                            <span className="text-[8px] text-slate-500">10:30 ص</span>
                        </div>

                        {selectedTicket.status === 'closed' && (
                            <div className="flex flex-col items-start gap-2">
                                <div className="bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none text-sm max-w-[80%] border border-white/5">
                                    تم حل المشكلة وتحديث حالة طلبكم. شكراً لتواصلكم معنا.
                                </div>
                                <span className="text-[8px] text-slate-500">11:00 ص</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <div className="flex gap-2">
                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">إرسال</button>
                            <input 
                                type="text" 
                                placeholder="اكتب ردك هنا..."
                                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
               </div>
          </div>
      )}

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
