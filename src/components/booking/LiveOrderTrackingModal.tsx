import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Zap,
  ChevronRight,
  AlertCircle,
  X,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Booking } from '../../lib/database.types';

interface LiveOrderTrackingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveOrderTrackingModal: React.FC<LiveOrderTrackingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(14 * 60 + 20); // 14 mins 20s
  const [currentStep, setCurrentStep] = useState<number>(2); // 0: Placed, 1: Packed, 2: En Route, 3: Arrived
  const [liveDistanceKm, setLiveDistanceKm] = useState(1.4);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Live countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setCurrentStep(3);
          setLiveDistanceKm(0.1);
          return 0;
        }
        // As time decreases, update simulated distance
        const newDist = Math.max(0.1, Math.round((prev / 860) * 1.4 * 10) / 10);
        setLiveDistanceKm(newDist);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const etaFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const arrivalTime = new Date(Date.now() + secondsRemaining * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const otpCode = booking.booking_code.replace(/\D/g, '').slice(-4) || '7492';

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(otpCode);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in zoom-in-95 flex flex-col max-h-[94vh]">
        {/* BLINKIT STYLE TOP HERO HEADER */}
        <div className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#0A261D] text-white p-5 sm:p-6 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Order Radar
              </span>
              <span className="text-xs text-stone-400 font-mono">#{booking.booking_code}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors text-xs"
            >
              ✕
            </button>
          </div>

          {/* Giant Blinkit Arrival Banner */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div>
                <p className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider">
                  Estimated Delivery & Arrival
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight text-white flex items-center gap-2">
                    <span className="text-amber-400">⚡</span> {mins > 0 ? `${mins} MINS` : 'ARRIVING NOW!'}
                  </h2>
                  <span className="text-sm sm:text-base font-mono text-emerald-200 font-bold">
                    ({etaFormatted})
                  </span>
                </div>
              </div>

              <div className="text-right bg-white/10 px-3 py-1.5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-stone-300 block font-bold uppercase">Expected By</span>
                <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">{arrivalTime}</span>
              </div>
            </div>

            {/* Live Distance Meter */}
            <div className="flex items-center justify-between text-xs pt-1 text-emerald-100 font-medium">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-amber-400 transform rotate-45" />
                Artisan is <strong className="font-bold text-white font-mono">{liveDistanceKm} km</strong> away
              </span>
              <span className="text-[11px] bg-emerald-400/20 px-2 py-0.5 rounded-md font-bold text-emerald-300">
                🚀 Traffic Smooth
              </span>
            </div>

            {/* Pulsing Animated Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden relative mt-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, Math.max(15, 100 - (secondsRemaining / (15 * 60)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* BODY CONTENT (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-stone-700">
          {/* 1. ARTISAN DISPATCH CARD */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-50 via-emerald-50/40 to-stone-50 border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    booking.worker_avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={booking.worker_name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4A373] shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-extrabold text-sm text-stone-900">{booking.worker_name}</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                    ★ 4.9 (128 Jobs)
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">{booking.cooperative_name}</p>
                <p className="text-[10px] text-emerald-800 font-bold mt-0.5">
                  Verified Cooperative Professional • Police Cleared
                </p>
              </div>
            </div>

            {/* Call & WhatsApp Quick Buttons */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <a
                href={`tel:${booking.worker_contact || '+919819987654'}`}
                className="px-3 py-1.5 rounded-xl bg-[#0C3B2E] text-white font-bold text-[11px] hover:bg-[#164E3F] transition-colors flex items-center gap-1 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/919819987654?text=Hi%20${encodeURIComponent(
                  booking.worker_name || 'Artisan'
                )},%20regarding%20Sahyog%20booking%20${booking.booking_code}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] transition-colors flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>Chat</span>
              </a>
            </div>
          </div>

          {/* 2. MULTI-STAGE STEP PROGRESS TRACKER (Blinkit Style) */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0C3B2E]" />
              <span>Live Order Journey</span>
            </h4>

            <div className="space-y-3 relative pl-6 border-l-2 border-emerald-400 ml-2 pt-1">
              {/* Step 1: Assigned */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                  ✓
                </span>
                <p className="font-bold text-stone-900 text-xs">Artisan Assigned & Wage Protected</p>
                <p className="text-[10px] text-stone-500">100% floor wage guaranteed under Multi-State Act</p>
              </div>

              {/* Step 2: Toolkit Prepared */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                  ✓
                </span>
                <p className="font-bold text-stone-900 text-xs">Standard Cooperative Toolkit Prepared</p>
                <p className="text-[10px] text-stone-500">Sanitized gear & safety equipment checked</p>
              </div>

              {/* Step 3: En Route */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-white animate-pulse flex items-center justify-center text-[9px] text-white font-bold">
                  🛵
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-emerald-900 text-xs">En Route to Your Household</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {liveDistanceKm} km away
                  </span>
                </div>
                <p className="text-[10px] text-stone-500">Artisan is navigating via optimal live GPS route</p>
              </div>

              {/* Step 4: Doorstep Arrival */}
              <div className="relative opacity-60">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-stone-300 border-2 border-white" />
                <p className="font-bold text-stone-700 text-xs">Doorstep Arrival & Service Delivery</p>
                <p className="text-[10px] text-stone-400">Share 4-digit verification code upon arrival</p>
              </div>
            </div>
          </div>

          {/* 3. SAFETY OTP VERIFICATION CARD */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">
                Doorstep Service PIN / OTP
              </span>
              <p className="text-[11px] text-stone-600">Share this with artisan when they reach your doorstep:</p>
            </div>

            <div
              onClick={handleCopyOtp}
              className="px-4 py-2 bg-white rounded-xl border-2 border-amber-400 text-center cursor-pointer shadow-xs hover:bg-amber-100/50 transition-colors flex-shrink-0"
              title="Click to copy OTP"
            >
              <span className="font-mono text-xl font-black text-[#0C3B2E] tracking-widest">{otpCode}</span>
              <span className="block text-[9px] text-amber-700 font-bold">
                {copiedOtp ? '✓ Copied!' : 'Click to Copy'}
              </span>
            </div>
          </div>

          {/* 4. BOOKING SERVICE SUMMARY */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500">Service Task:</span>
              <span className="font-bold text-stone-900">{booking.service_task}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Household Address:</span>
              <span className="font-medium text-stone-800 text-right max-w-[220px] truncate">
                {booking.location?.address || 'Perry Cross Road, Bandra West, Mumbai'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Fair Wage Total:</span>
              <span className="font-black text-[#0C3B2E]">₹{booking.price_breakdown?.total_amount}</span>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-white transition-colors"
          >
            Keep Browsing
          </button>
          <a
            href={`tel:${booking.worker_contact || '+919819987654'}`}
            className="flex-1 py-2.5 rounded-xl bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
            <span>Call Artisan</span>
          </a>
        </div>
      </div>
    </div>
  );
};
