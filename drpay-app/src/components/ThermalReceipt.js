"use client";
import React from 'react';

export default function ThermalReceipt({ data }) {
  if (!data) return null;

  return (
    <div className="receipt-container bg-white text-black p-4 font-mono text-sm leading-tight border border-slate-200 shadow-xl mx-auto w-[300px]" dir="rtl">
      {/* Print Controls - Hidden during print */}
      <div className="flex gap-2 no-print mb-6">
        <button 
            onClick={() => window.print()} 
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs"
        >
            🖨️ طباعة
        </button>
        <button 
            onClick={() => window.close()} 
            className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-xs"
        >
            ❌ إغلاق
        </button>
      </div>

      {/* Actual Receipt Content */}
      <div className="print-area">
        <div className="text-center mb-4 border-b border-black/10 pb-4">
            <img src="/img/logo.png" alt="DrPay" className="h-16 mx-auto mb-2 grayscale" onError={(e) => e.target.style.display='none'} />
            <h1 className="font-black text-lg">Dr. Pay</h1>
            <p className="text-[10px]">دكتور باي - للدفع الإلكتروني</p>
        </div>

        <table className="w-full text-right">
            <tbody>
                <tr>
                    <td className="py-1">الخدمة: </td>
                    <td className="py-1 font-bold">{data.service_name || 'خدمة عامة'}</td>
                </tr>
                <tr>
                    <td className="py-1">الرقم المرجعي: </td>
                    <td className="py-1 font-mono text-xs">{data.api_id || 'N/A'}</td>
                </tr>
                {data.mobile && (
                    <tr>
                        <td className="py-1">رقم العملية: </td>
                        <td className="py-1 font-bold">{data.mobile}</td>
                    </tr>
                )}
                <tr className="border-t border-black/5 mt-2">
                    <td className="py-1 pt-2">القيمة: </td>
                    <td className="py-1 pt-2">{data.amount} ج.م</td>
                </tr>
                <tr>
                    <td className="py-1">الرسوم: </td>
                    <td className="py-1">{data.fee || '0'} ج.م</td>
                </tr>
                <tr className="font-black text-base border-t border-black/20 pt-2">
                    <td className="py-1">الإجمالي: </td>
                    <td className="py-1">{data.total_amount} ج.م</td>
                </tr>
            </tbody>
        </table>

        <div className="text-center my-6 py-2 bg-black text-white rounded text-xs font-bold">
            عملية ناجحة برقم {data.bid || 'OK'}
        </div>

        <div className="text-[10px] space-y-1 mb-6 border-b border-black/10 pb-4">
            <div className="flex justify-between">
                <span>التوقيت:</span>
                <span dir="ltr">{data.created_at ? new Date(data.created_at).toLocaleString('ar-EG') : 'N/A'}</span>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-1">
                <span>التاجر:</span>
                <span className="font-bold">{data.merchant_name || 'Dr. Pay Merchant'}</span>
            </div>
            <div className="flex justify-between">
                <span>هاتف التاجر:</span>
                <span dir="ltr">{data.merchant_phone || 'N/A'}</span>
            </div>
        </div>

        <div className="text-center text-[9px] leading-relaxed italic opacity-70">
            في حالة بطئ الشبكات قد يستغرق تنفيذ العملية 24 ساعة عمل<br/>
            تم السداد عبر منصة Dr. Pay<br/>
            للمساعدة: 01550158755<br/>
            .
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .receipt-container { border: none !important; box-shadow: none !important; width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}
