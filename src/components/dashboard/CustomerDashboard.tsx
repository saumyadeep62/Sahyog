import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Receipt,
  Star,
  Zap,
  PhoneCall,
  UserCheck,
  ChevronRight,
  Plus,
  Wrench,
  Sparkles,
  HeartHandshake,
  DollarSign,
  Sliders,
  Shield,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Award,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Headphones,
  Copy,
  Check,
  Building2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Booking, BookingStatus, ServiceCategory } from '../../lib/database.types';
import { GrievanceModal } from '../common/GrievanceModal';
import { GoogleMapViewer } from '../maps/GoogleMapViewer';
import { TiltCard } from '../3d/TiltCard';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, openChangePasswordModal, openEditProfileModal } = useAuth();
  const {
    categories,
    bookings,
    updateBookingStatus,
    openInvoiceModal,
    openTrackingModal,
    addRatingReview,
    openBookingFlow,
    openEmergencyModal,
  } = useMarketplace();

  const [ratingModalBooking, setRatingModalBooking] = useState<Booking | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [selectedRatingTags, setSelectedRatingTags] = useState<string[]>(['Punctual', 'Fair Price']);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [selectedGrievanceBookingId, setSelectedGrievanceBookingId] = useState<string | undefined>(undefined);
  const [copiedPin, setCopiedPin] = useState(false);

  // Dynamic Live Arrival Countdown (14 Minutes default)
  const [secondsRemaining, setSecondsRemaining] = useState(14 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 14 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdownMins = Math.floor(secondsRemaining / 60);
  const countdownSecs = secondsRemaining % 60;
  const formattedCountdown = `${countdownMins}:${countdownSecs < 10 ? '0' : ''}${countdownSecs}`;

  // Interactive Wage Calculator State
  const [calcHours, setCalcHours] = useState<number>(2.5);
  const [calcHourlyRate, setCalcHourlyRate] = useState<number>(350);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-stone-600 font-medium">Please log in to view your customer dashboard.</p>
      </div>
    );
  }

  // Filter bookings for this customer
  const customerBookings = bookings.filter(
    (b) => b.customer_id === currentUser.id || b.customer_name === currentUser.name
  );

  const activeBookings = customerBookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const pastBookings = customerBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const statusSteps: { key: BookingStatus; label: string }[] = [
    { key: 'requested', label: 'Requested' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'en_route', label: 'En Route' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const getStepIndex = (status: BookingStatus) => {
    return statusSteps.findIndex((s) => s.key === status);
  };

  const handleOpenRating = (bk: Booking) => {
    setRatingModalBooking(bk);
    setRatingStars(5);
    setRatingComment('Excellent craftsmanship, punctual arrival, and 100% transparent cooperative pricing.');
    setSelectedRatingTags(['Punctual', 'Fair Price', 'Cooperative Quality']);
  };

  const toggleTag = (tag: string) => {
    setSelectedRatingTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalBooking) return;

    addRatingReview({
      booking_id: ratingModalBooking.id,
      rated_by: currentUser.id,
      rated_by_name: currentUser.name,
      rated_user_id: ratingModalBooking.worker_id || 'usr-work-1',
      rating: ratingStars,
      comment: ratingComment,
      tags: selectedRatingTags,
    });

    try {
      confetti({ particleCount: 60, spread: 70 });
    } catch {}

    setRatingModalBooking(null);
  };

  // Quick Trade Shortcuts
  const quickTrades = [
    { name: 'Electrician', icon: '⚡', catSlug: 'electricians', rate: '₹350/hr', desc: 'Wiring & Tripping' },
    { name: 'Plumber', icon: '🚰', catSlug: 'plumbing', rate: '₹300/hr', desc: 'Leak & Pipe Welder' },
    { name: 'Deep Cleaning', icon: '🧹', catSlug: 'cleaning-sanitization', rate: '₹400/hr', desc: 'Complete Home Sanitize' },
    { name: 'Carpenter', icon: '🪚', catSlug: 'carpentry', rate: '₹350/hr', desc: 'Furniture & Lock Fit' },
    { name: 'Appliance Repair', icon: '❄️', catSlug: 'appliance-repair', rate: '₹450/hr', desc: 'AC, Fridge & Washing' },
    { name: 'Elder Care', icon: '👵', catSlug: 'caregiving-elderly', rate: '₹280/hr', desc: 'Compassionate Care' },
  ];

  const totalWorkerWagesPaid = pastBookings.reduce(
    (acc, b) => acc + (b.price_breakdown?.worker_wage || 520),
    0
  );

  const estimatedSavings = Math.round(totalWorkerWagesPaid * 0.35) + 1250;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. PREMIUM HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#1D5C4B] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-[#297762] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#D4A373]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 sm:gap-5 relative z-10">
          <div
            onClick={openEditProfileModal}
            className="relative cursor-pointer group select-none flex-shrink-0"
            title="Click to Edit Profile & Photo"
          >
            <img
              src={
                currentUser.avatar_url ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-[#D4A373] shadow-xl group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity backdrop-blur-xs">
              <span>📷 Edit</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0C3B2E] flex items-center justify-center text-[10px] text-stone-900 font-bold shadow">
              ✓
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit']">{currentUser.name}</h1>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/30 uppercase tracking-wider">
                Verified Household Member
              </span>
            </div>
            <p className="text-xs text-stone-300">
              {currentUser.contact} • {currentUser.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1 text-[#D4A373] font-semibold bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Floor Wage Direct Settlement</span>
              </span>
              <span className="text-stone-300 font-medium hidden sm:inline">
                • 0% Platform Markup
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={openEditProfileModal}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
            title="Update Profile Details & Photo"
          >
            <span>✏️ Edit Profile</span>
          </button>

          <button
            onClick={openChangePasswordModal}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
            title="Update Password"
          >
            <span>🔑 Password</span>
          </button>

          <button
            onClick={() => openBookingFlow()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4A373] via-[#E0A96D] to-[#FAEDCD] hover:from-[#E0A96D] hover:to-[#FAEDCD] text-[#0C3B2E] font-black text-xs shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#0C3B2E]" />
            <span>Book New Trade</span>
          </button>

          <button
            onClick={openEmergencyModal}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
            <span>SOS Urgent</span>
          </button>
        </div>
      </div>

      {/* 2. PROMINENT "ARTISAN ARRIVING IN 14 MINUTES" BLINKIT STYLE LIVE RADAR BANNER */}
      {activeBookings.length > 0 && (
        <div className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#0A261D] text-white p-6 sm:p-7 rounded-3xl shadow-2xl border-2 border-emerald-400/50 relative overflow-hidden space-y-5 animate-in fade-in">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Line: Live Dispatch Badge & Doorstep PIN */}
          <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>RAPID DISPATCH RADAR</span>
              </span>
              <span className="text-xs text-stone-300 font-mono font-bold bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">
                #{activeBookings[0].booking_code}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-2">
                <span className="text-[10px] text-stone-300 uppercase font-bold">Doorstep PIN:</span>
                <span className="font-mono text-sm font-black text-amber-300 tracking-wider">
                  {activeBookings[0].booking_code.replace(/\D/g, '').slice(-4) || '7492'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyPin(activeBookings[0].booking_code.replace(/\D/g, '').slice(-4) || '7492')}
                  className="text-stone-400 hover:text-white transition-colors"
                  title="Copy PIN"
                >
                  {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Main Giant Headline: "Artisan Arriving in 14 Minutes" */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-amber-400/20 border-2 border-emerald-400/50 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl flex-shrink-0 animate-bounce">
                🛵
              </div>
              <div className="space-y-1">
                <p className="text-[11px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  <span>Live Journey Radar & ETA Countdown</span>
                </p>
                <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white tracking-tight flex items-center gap-2">
                  <span className="text-amber-400">⚡</span> Artisan Arriving in 14 Minutes
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                  <strong>{activeBookings[0].worker_name}</strong> ({activeBookings[0].service_task}) has departed the regional cooperative depot and is en route.
                </p>
              </div>
            </div>

            {/* Quick Live Tracking CTA & Call */}
            <div className="flex flex-wrap items-center gap-3 relative z-10 flex-shrink-0">
              <button
                type="button"
                onClick={() => openTrackingModal(activeBookings[0])}
                className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-stone-950" />
                <span>⚡ Open Live Radar Tracking →</span>
              </button>

              {activeBookings[0].worker_contact && (
                <a
                  href={`tel:${activeBookings[0].worker_contact}`}
                  className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="Direct Call Artisan"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-300" />
                  <span className="hidden sm:inline">Call Artisan</span>
                </a>
              )}
            </div>
          </div>

          {/* Progress Route Indicator */}
          <div className="space-y-2 pt-2 border-t border-white/10 relative z-10">
            <div className="flex items-center justify-between text-xs text-stone-200">
              <span className="flex items-center gap-1.5 font-medium">
                <Navigation className="w-3.5 h-3.5 text-amber-400 transform rotate-45" />
                <span>Live Distance: <strong className="text-white font-mono font-bold">1.8 km away</strong></span>
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                Countdown: {formattedCountdown}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/10 p-0.5">
              <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 rounded-full w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* 4. INSTANT 1-CLICK RAPID TRADE DISPATCH */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 uppercase tracking-wide font-['Outfit'] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant 1-Click Trade Dispatch</span>
            </h2>
            <p className="text-xs text-stone-500">Certified local artisans at transparent statutory rates. Zero surge fees.</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline">
            100% Floor Wage Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickTrades.map((qt) => {
            const cat = categories.find((c) => c.slug === qt.catSlug) || categories[0];
            return (
              <button
                key={qt.name}
                onClick={() => openBookingFlow(cat)}
                className="bg-white hover:bg-emerald-50/60 p-4 rounded-3xl border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all text-center space-y-2 group transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 group-hover:bg-emerald-100 text-2xl flex items-center justify-center transition-colors group-hover:scale-110">
                  {qt.icon}
                </div>
                <div>
                  <p className="font-extrabold text-xs text-stone-900 truncate">{qt.name}</p>
                  <p className="text-[10px] text-stone-400 truncate">{qt.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 font-black bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block border border-emerald-200/60">
                  {qt.rate}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. LIVE HOUSEHOLD GPS RADAR MAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 font-['Outfit'] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Household GPS Radar & Artisan Proximity</span>
            {activeBookings.length > 0 && activeBookings[0].worker_name && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300 animate-pulse">
                ⚡ Artisan Tracking Active
              </span>
            )}
          </h2>
        </div>

        <GoogleMapViewer
          customerLocation={{
            lat: 19.076,
            lng: 72.8777,
            label: `${currentUser.name} (Household)`,
          }}
          workerLocation={
            activeBookings.length > 0 && activeBookings[0].worker_name
              ? {
                  lat: 19.082,
                  lng: 72.884,
                  name: activeBookings[0].worker_name,
                  contact: activeBookings[0].worker_contact,
                }
              : undefined
          }
          showRoute={activeBookings.length > 0 && Boolean(activeBookings[0].worker_name)}
          height="320px"
          title={
            activeBookings.length > 0 && activeBookings[0].worker_name
              ? `Live Route: ${activeBookings[0].worker_name} ➔ Your Doorstep`
              : 'Cooperative Coverage & Regional Artisan Cluster'
          }
        />
      </div>

      {/* 6. ACTIVE BOOKINGS & STEPPER TIMELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-stone-900 font-['Outfit'] flex items-center gap-2">
            <span>Active & In-Progress Service Bookings</span>
            <span className="text-xs bg-[#0C3B2E] text-white px-2.5 py-0.5 rounded-full font-bold">
              {activeBookings.length}
            </span>
          </h2>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <p className="font-extrabold text-stone-800 text-sm">No Active Bookings Right Now</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Need an electrician, plumber, or appliance repair master? Book in 60 seconds with 100% floor wage guarantee.
            </p>
            <button
              onClick={() => openBookingFlow()}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Book an Artisan</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.map((bk) => {
              const currentStepIdx = getStepIndex(bk.status);
              return (
                <div
                  key={bk.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {bk.booking_code}
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-500">{bk.service_category_name}</span>
                      </div>
                      <h3 className="font-extrabold text-stone-900 text-base mt-1">{bk.service_task}</h3>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                      <span className="text-xl font-black text-stone-900 font-['Outfit']">
                        ₹{bk.price_breakdown?.total_amount || 520}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        100% Floor Wage Locked
                      </span>
                    </div>
                  </div>

                  {/* Interactive Status Steps Stepper */}
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                          width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%`,
                        }}
                      />

                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div key={step.key} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? 'bg-[#0C3B2E] text-white shadow-md'
                                  : 'bg-stone-200 text-stone-500'
                              } ${isCurrent ? 'ring-4 ring-emerald-200 animate-pulse' : ''}`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1 font-semibold ${
                                isCurrent ? 'text-[#0C3B2E] font-bold' : 'text-stone-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Artisan Details & Interactive Call / Actions */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-stone-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          bk.worker_avatar ||
                          'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={bk.worker_name || 'Artisan'}
                        className="w-12 h-12 rounded-2xl object-cover border border-stone-300 shadow-xs"
                      />
                      <div>
                        <p className="font-extrabold text-stone-900 text-xs">
                          {bk.worker_name || 'Verified Cooperative Artisan Matched'}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {bk.cooperative_name || 'Mumbai Shramik Sahakari Sanstha'}
                        </p>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <UserCheck className="w-3 h-3" />
                          <span>Police & NSDC Verified</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openTrackingModal(bk)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 text-xs font-black shadow flex items-center gap-1.5 hover:from-amber-500 hover:to-yellow-500 transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>⚡ Live Arrival Tracker</span>
                      </button>

                      {bk.worker_contact && (
                        <a
                          href={`tel:${bk.worker_contact}`}
                          className="px-3.5 py-2 rounded-xl bg-[#0C3B2E] text-white text-xs font-bold shadow flex items-center gap-1.5 hover:bg-[#164E3F] transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                          <span>Call Artisan</span>
                        </a>
                      )}
                      <button
                        onClick={() => openInvoiceModal(bk)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5 text-stone-500" />
                        <span>View Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. INTERACTIVE FAIR WAGE & SOLIDARITY CALCULATOR */}
      <TiltCard maxTilt={5} className="bg-gradient-to-br from-white via-emerald-50/20 to-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base font-['Outfit']">
                Interactive Fair Wage & Transparency Calculator
              </h3>
              <p className="text-xs text-stone-500">
                See where 100% of your payment goes vs private aggregator platforms.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
            0% Aggregator Commissions
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1.5">
                <span>Estimated Work Duration</span>
                <span className="text-[#0C3B2E] font-black">{calcHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={calcHours}
                onChange={(e) => setCalcHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0C3B2E]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>1 hr (Quick Repair)</span>
                <span>4 hrs (Half Day)</span>
                <span>8 hrs (Full Day)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1.5">
                <span>Base Skill Trade Rate</span>
                <span className="text-[#0C3B2E] font-black">₹{calcHourlyRate}/hr</span>
              </div>
              <div className="flex gap-2">
                {[280, 350, 450, 600].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setCalcHourlyRate(rate)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      calcHourlyRate === rate
                        ? 'bg-[#0C3B2E] text-white border-[#0C3B2E]'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    ₹{rate}/h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Breakdown */}
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
              <span className="text-stone-600 font-medium">Direct Artisan Floor Wage (88%)</span>
              <span className="font-bold text-stone-900 font-mono">₹{Math.round(calcHours * calcHourlyRate * 0.88)}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
              <span className="text-stone-600 font-medium">Cooperative Welfare & Ayushman Shield (7%)</span>
              <span className="font-bold text-amber-700 font-mono">₹{Math.round(calcHours * calcHourlyRate * 0.07)}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
              <span className="text-stone-600 font-medium">Federation Auditing & Tech Operations (5%)</span>
              <span className="font-bold text-teal-700 font-mono">₹{Math.round(calcHours * calcHourlyRate * 0.05)}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100 text-emerald-700 font-semibold">
              <span>Private Aggregator Commission Cut</span>
              <span className="font-bold font-mono">₹0 (0% Cut)</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-black text-sm text-stone-900">Total Transparent Price:</span>
              <span className="font-black text-xl text-[#0C3B2E] font-mono">
                ₹{Math.round(calcHours * calcHourlyRate)}
              </span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* 8. PAST COMPLETED BOOKINGS & SERVICE HISTORY */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-stone-900 font-['Outfit']">Past Service History ({pastBookings.length})</h2>

        {pastBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center text-xs text-stone-500 border border-stone-200">
            No completed services yet. Book your first artisan above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastBookings.map((bk) => (
              <div
                key={bk.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-400">{bk.booking_code}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                      Completed ✓
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm mt-1">{bk.service_task}</h4>
                  <p className="text-xs text-stone-500">Artisan: {bk.worker_name || 'Verified Artisan'}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="font-black text-stone-900 font-mono">₹{bk.price_breakdown?.total_amount || 450}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenRating(bk)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Rate Service</span>
                    </button>
                    <button
                      onClick={() => openInvoiceModal(bk)}
                      className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-[11px]"
                    >
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 9. STATUTORY GUARANTEES & CUSTOMER CARE HELPLINE SPOTLIGHT */}
      <div className="bg-gradient-to-r from-[#2C1810] via-[#3E2317] to-[#1C3B2E] text-white p-6 sm:p-7 rounded-3xl shadow-xl space-y-4 border border-amber-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase">
                Statutory Tribunal Protection
              </span>
              <span className="text-xs text-stone-300">Multi-State Co-op Societies Act, 2002</span>
            </div>
            <h3 className="text-lg font-black text-white font-['Outfit']">
              24/7 Household Consumer Rights & Speedy Dispute Tribunal
            </h3>
            <p className="text-xs text-stone-300 max-w-2xl">
              Every booking is protected by a 2-hour conciliation tribunal, guaranteed warranty on artisan craftsmanship, and 100% price lock protection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:1800724964"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0C3B2E] font-black text-xs shadow flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#0C3B2E]" />
              <span>1800-SAHYOG</span>
            </a>
            <button
              onClick={() => setIsGrievanceOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors"
            >
              <span>File Grievance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10. INTERACTIVE 5-STAR RATING MODAL */}
      {ratingModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">Review Cooperative Artisan</h3>
              <button onClick={() => setRatingModalBooking(null)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <div className="text-center space-y-1">
              <p className="font-bold text-xs text-stone-800">{ratingModalBooking.service_task}</p>
              <p className="text-[11px] text-stone-500">Artisan: {ratingModalBooking.worker_name}</p>
            </div>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="p-1 transform hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratingStars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Interactive Tags */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-500 uppercase block">Solidarity Badges</label>
              <div className="flex flex-wrap gap-1.5">
                {['Punctual', 'Fair Price', 'Cooperative Quality', 'Polite', 'Clean Work'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      selectedRatingTags.includes(tag)
                        ? 'bg-[#0C3B2E] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-3 pt-2">
              <textarea
                rows={3}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your experience with this artisan..."
                className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRatingModalBooking(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grievance Modal */}
      {isGrievanceOpen && (
        <GrievanceModal
          isOpen={isGrievanceOpen}
          onClose={() => setIsGrievanceOpen(false)}
          defaultBookingId={selectedGrievanceBookingId}
        />
      )}
    </div>
  );
};
