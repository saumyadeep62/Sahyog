import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const InvoiceModal: React.FC = () => {
  const { selectedBookingForInvoice, closeInvoiceModal, invoices } = useMarketplace();

  if (!selectedBookingForInvoice) return null;

  const booking = selectedBookingForInvoice;
  const invoice = invoices.find((inv) => inv.booking_id === booking.id) || {
    invoice_number: `COOP-INV-2026-${booking.booking_code.split('-')[2] || '08812'}`,
    gateway_reference: `UPI/COOP/PAY-${booking.booking_code}`,
    payment_method: 'UPI (Instant Transfer)',
    payment_status: 'completed',
    created_at: booking.created_at,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Top Action Bar */}
        <div className="bg-[#0C3B2E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4A373]" />
            <span className="font-bold text-sm">Official Cooperative Receipt & Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#144537] hover:bg-[#1D5C4B] text-xs font-semibold text-stone-200 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={closeInvoiceModal}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-[#164E3F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800 printable-area">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0C3B2E] text-[#D4A373] flex items-center justify-center font-extrabold text-2xl shadow-md">
                स
              </div>
              <div>
                <h2 className="font-extrabold text-xl text-[#0C3B2E] font-['Outfit']">SAHYOG COOPERATIVE</h2>
                <p className="text-xs text-stone-500">Reg No: MSCS/MUM/2018/7421 • Fair Labour Network</p>
                <p className="text-[11px] text-stone-400">Shramik Bhavan, Bandra-Kurla Complex, Mumbai</p>
              </div>
            </div>
            <div className="text-right sm:border-l sm:border-stone-200 sm:pl-6">
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                PAID VIA UPI
              </span>
              <p className="text-xs font-mono font-bold text-stone-700 mt-1">{invoice.invoice_number}</p>
              <p className="text-[11px] text-stone-500">
                Date: {new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Billed To & Service Worker Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                Billed To (Customer)
              </span>
              <p className="font-bold text-stone-800 text-sm">{booking.customer_name}</p>
              <p className="text-stone-600 mt-0.5">{booking.location.address}</p>
              <p className="text-stone-500 mt-0.5">Contact: {booking.customer_contact}</p>
            </div>
            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                Artisan & Affiliated Society
              </span>
              <p className="font-bold text-stone-800 text-sm">{booking.worker_name || 'Assigned Artisan'}</p>
              <p className="text-emerald-700 font-medium">{booking.cooperative_name || 'Mumbai Shramik Sahakari Sanstha'}</p>
              <p className="text-stone-500 mt-0.5">Booking Code: {booking.booking_code}</p>
            </div>
          </div>

          {/* Service Line Items */}
          <div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-300 text-stone-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 font-bold">Service Description</th>
                  <th className="py-2.5 font-bold text-center">Category</th>
                  <th className="py-2.5 font-bold text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-3">
                    <p className="font-bold text-stone-800">{booking.service_task}</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">{booking.description}</p>
                  </td>
                  <td className="py-3 text-center text-stone-600">{booking.service_category_name}</td>
                  <td className="py-3 text-right font-semibold text-stone-800">
                    ₹{booking.price_breakdown.worker_wage}
                  </td>
                </tr>
                {booking.is_emergency && (
                  <tr>
                    <td className="py-2 text-rose-700 font-medium">Emergency Priority Dispatch Allowance</td>
                    <td className="py-2 text-center text-stone-500">SOS Urgent</td>
                    <td className="py-2 text-right font-semibold text-rose-700">₹{booking.price_breakdown.emergency_fee}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Transparent Cooperative Fee Distribution Matrix */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E5DDD0] space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Direct Worker Fair Wage (Floor Standard)
              </span>
              <span className="font-semibold text-stone-800">₹{booking.price_breakdown.worker_wage}</span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Worker Welfare, ESI & Accident Shield Contribution
              </span>
              <span className="font-semibold text-stone-800">₹{booking.price_breakdown.welfare_contribution}</span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Cooperative Society Admin & Audit Overhead
              </span>
              <span className="font-semibold text-stone-800">₹{booking.price_breakdown.coop_admin_fee}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 font-bold border-t border-stone-200 pt-2">
              <span>Private Aggregator Middleman Commission</span>
              <span>₹0.00 (100% Retained by Co-op)</span>
            </div>
            <div className="flex items-center justify-between text-stone-900 font-extrabold text-sm border-t-2 border-stone-300 pt-2">
              <span>Total Paid Amount</span>
              <span className="text-base text-[#0C3B2E]">₹{booking.price_breakdown.total_amount}</span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Certified Fair Trade Cooperative Service</span>
            </div>
            <div className="text-right font-mono text-[10px]">
              Ref: {invoice.gateway_reference}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
