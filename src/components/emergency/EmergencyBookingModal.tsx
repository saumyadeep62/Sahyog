import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Radio,
  MapPin,
  Clock,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../lib/database.types';

export const EmergencyBookingModal: React.FC = () => {
  const { isEmergencyModalOpen, closeEmergencyModal, categories, workers, createEmergencyBooking, openInvoiceModal } =
    useMarketplace();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<'details' | 'scanning' | 'dispatched'>('details');
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat-1');
  const [address, setAddress] = useState('Flat 402, Sea Crest Apartments, Bandra West, Mumbai');
  const [urgentNote, setUrgentNote] = useState('Immediate power tripping / smoke from main switchboard');
  const [dispatchedBooking, setDispatchedBooking] = useState<Booking | null>(null);

  // Filter urgent categories
  const urgentCategories = categories.filter((c) => c.urgency_available);

  useEffect(() => {
    if (!isEmergencyModalOpen) {
      setStep('details');
      setDispatchedBooking(null);
    }
  }, [isEmergencyModalOpen]);

  if (!isEmergencyModalOpen) return null;

  const handleStartEmergencyDispatch = () => {
    setStep('scanning');

    // Simulate 2.2s radar lock with nearest cooperative brigade
    setTimeout(() => {
      const bk = createEmergencyBooking(selectedCategoryId, address, urgentNote);
      setDispatchedBooking(bk);
      setStep('dispatched');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-red-200 flex flex-col">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-700 to-[#0C3B2E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-base font-['Outfit'] flex items-center gap-2">
                Emergency SOS Dispatch
                <span className="text-[10px] bg-red-800/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Fast Track
                </span>
              </h3>
              <p className="text-[11px] text-stone-200">Nearest Certified Cooperative Artisan Routing</p>
            </div>
          </div>
          <button
            onClick={closeEmergencyModal}
            className="p-1.5 rounded-lg text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'details' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Transparent Priority Response</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Unlike corporate apps with 300% predatory surge pricing, SAHYOG adds a fixed, transparent ₹100
                    hazard & speed allowance that goes 100% to the attending artisan.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Select Emergency Trade</label>
                <div className="grid grid-cols-2 gap-2">
                  {urgentCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(c.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center gap-2 ${
                        selectedCategoryId === c.id
                          ? 'border-red-600 bg-red-50/50 text-red-900 ring-2 ring-red-500/20'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <Zap className={`w-3.5 h-3.5 ${selectedCategoryId === c.id ? 'text-red-600' : 'text-stone-400'}`} />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Emergency Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Brief Problem Description</label>
                <input
                  type="text"
                  value={urgentNote}
                  onChange={(e) => setUrgentNote(e.target.value)}
                  placeholder="e.g. Major pipe burst flooding kitchen, electrical sparks..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-800">Fixed Emergency Tariff</span>
                  <p className="text-[11px] text-stone-500">Includes visit, 1st hour labour & hazard allowance</p>
                </div>
                <span className="text-base font-extrabold text-[#0C3B2E]">₹200</span>
              </div>

              <button
                type="button"
                onClick={handleStartEmergencyDispatch}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <Radio className="w-4 h-4 animate-spin" />
                <span>Locate & Dispatch Nearest Artisan</span>
              </button>
            </div>
          )}

          {step === 'scanning' && (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-2 border-red-500/60 animate-pulse"></div>
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl">
                  <Radio className="w-8 h-8 animate-spin text-white" />
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-stone-800">
                  Scanning Cooperative Radar (3.5 km Radius)...
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Connecting with Mumbai Shramik Sahakari on-duty emergency roster
                </p>
              </div>
            </div>
          )}

          {step === 'dispatched' && dispatchedBooking && (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">Artisan Dispatched & En Route!</h4>
                  <p className="text-xs text-emerald-700">Priority emergency request confirmed.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={dispatchedBooking.worker_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                      alt="Worker"
                      className="w-12 h-12 rounded-xl object-cover border border-[#D4A373]"
                    />
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{dispatchedBooking.worker_name}</p>
                      <p className="text-stone-500 text-[11px]">{dispatchedBooking.cooperative_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">ETA</span>
                    <span className="font-extrabold text-emerald-700 text-base flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 18 Mins
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block font-bold">Booking Code</span>
                    <span className="font-mono font-bold text-stone-800">{dispatchedBooking.booking_code}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-bold">Fixed Total</span>
                    <span className="font-bold text-[#0C3B2E]">₹{dispatchedBooking.price_breakdown.total_amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openInvoiceModal(dispatchedBooking)}
                  className="flex-1 py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  View Invoice
                </button>
                <button
                  type="button"
                  onClick={closeEmergencyModal}
                  className="flex-1 py-2.5 rounded-lg bg-[#0C3B2E] text-white text-xs font-bold shadow-md hover:bg-[#164E3F] transition-colors"
                >
                  Done & Track
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
