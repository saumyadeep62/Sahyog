import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Receipt,
  Star,
  ShieldAlert,
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Booking, BookingStatus, ServiceCategory } from '../../lib/database.types';
import { GrievanceModal } from '../common/GrievanceModal';
import { GoogleMapViewer } from '../maps/GoogleMapViewer';
import { TiltCard } from '../3d/TiltCard';

export const CustomerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    categories,
    bookings,
    updateBookingStatus,
    openInvoiceModal,
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

  // Interactive Wage Calculator State
  const [calcHours, setCalcHours] = useState<number>(2);
  const [calcHourlyRate, setCalcHourlyRate] = useState<number>(350);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-stone-600 font-medium">Please sign in to view your customer dashboard.</p>
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
    setRatingComment('Excellent service, transparent fair pricing and professional craftsmanship.');
    setSelectedRatingTags(['Punctual', 'Fair Price', 'Cooperative Quality']);
  };

  const toggleTag = (tag: string) => {
    setSelectedRatingTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
    { name: 'Electrician', icon: '⚡', catSlug: 'electricians', rate: '₹350/hr' },
    { name: 'Plumber', icon: '🚰', catSlug: 'plumbing', rate: '₹300/hr' },
    { name: 'Deep Cleaning', icon: '🧹', catSlug: 'cleaning-sanitization', rate: '₹400/hr' },
    { name: 'Carpenter', icon: '🪚', catSlug: 'carpentry', rate: '₹350/hr' },
    { name: 'Appliance Repair', icon: '❄️', catSlug: 'appliance-repair', rate: '₹450/hr' },
    { name: 'Elder Care', icon: '👵', catSlug: 'caregiving-elderly', rate: '₹280/hr' },
  ];

  const totalWorkerWagesPaid = pastBookings.reduce(
    (acc, b) => acc + (b.price_breakdown?.worker_wage || 450),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. INTERACTIVE HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#1D5C4B] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-[#297762] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <img
              src={
                currentUser.avatar_url ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-[#D4A373] shadow-xl"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0C3B2E] flex items-center justify-center text-[10px] text-stone-900 font-bold">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit']">{currentUser.name}</h1>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/30 uppercase tracking-wider">
                Solidarity Member
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              {currentUser.contact} • {currentUser.email}
            </p>
            <p className="text-[11px] text-[#D4A373] font-medium mt-1">
              Solidarity Consumer Circle • 100% Floor Wage Guaranteed to Artisans
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => openBookingFlow()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4A373] via-[#E0A96D] to-[#FAEDCD] text-[#0C3B2E] font-black text-xs shadow-lg hover:opacity-95 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#0C3B2E]" />
            <span>Book New Service</span>
          </button>

          <button
            onClick={openEmergencyModal}
            className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
            <span>SOS Urgent Dispatch</span>
          </button>
        </div>
      </div>

      {/* 2. INTERACTIVE 1-CLICK QUICK BOOKING DOCK */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Instant 1-Click Service Dispatch</span>
          </h2>
          <span className="text-[11px] text-stone-500">Zero Surge Pricing • 0% Aggregator Cuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickTrades.map((qt) => {
            const cat = categories.find((c) => c.slug === qt.catSlug) || categories[0];
            return (
              <button
                key={qt.name}
                onClick={() => openBookingFlow(cat)}
                className="bg-white hover:bg-emerald-50/60 p-4 rounded-2xl border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all text-center space-y-1.5 group transform hover:-translate-y-1"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">{qt.icon}</div>
                <p className="font-bold text-xs text-stone-900 truncate">{qt.name}</p>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  {qt.rate}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. LIVE COOPERATIVE LOCATION & RADAR MAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 font-['Outfit'] flex items-center gap-2">
            <span>Live Household GPS & Dispatch Radar</span>
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
          height="300px"
          title={
            activeBookings.length > 0 && activeBookings[0].worker_name
              ? `Live Route: ${activeBookings[0].worker_name} ➔ Your Home`
              : 'Cooperative Coverage & Regional Artisan Cluster'
          }
        />
      </div>

      {/* 4. ACTIVE BOOKINGS & LIVE TRACKER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 font-['Outfit'] flex items-center gap-2">
            <span>Active & In-Progress Bookings</span>
            <span className="text-xs bg-[#0C3B2E] text-white px-2.5 py-0.5 rounded-full font-bold">
              {activeBookings.length}
            </span>
          </h2>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-3 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="font-bold text-stone-800 text-sm">No active bookings right now</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Need an electrician, plumber, or carpenter? Click below to book a verified artisan with 100% transparent cooperative pricing.
            </p>
            <button
              onClick={() => openBookingFlow()}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#0C3B2E] text-white text-xs font-bold shadow-md hover:bg-[#164E3F] transition-colors inline-flex items-center gap-1.5"
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
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        100% Floor Wage Locked
                      </span>
                    </div>
                  </div>

                  {/* Interactive Status Steps */}
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
                        className="w-12 h-12 rounded-xl object-cover border border-stone-300"
                      />
                      <div>
                        <p className="font-bold text-stone-900 text-xs">
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

      {/* 5. INTERACTIVE COOPERATIVE FAIR WAGE CALCULATOR */}
      <TiltCard maxTilt={6} className="bg-gradient-to-br from-white via-emerald-50/30 to-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base font-['Outfit']">
                Interactive Fair Wage & Solidarity Calculator
              </h3>
              <p className="text-xs text-stone-500">
                Explore where 100% of your payment goes compared to commercial aggregators.
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
                <span>1 hr (Quick Fix)</span>
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
                {[280, 350, 450].map((rate) => (
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
              <span className="text-stone-600 font-medium">Cooperative Welfare & Ayushman (7%)</span>
              <span className="font-bold text-amber-700 font-mono">₹{Math.round(calcHours * calcHourlyRate * 0.07)}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
              <span className="text-stone-600 font-medium">Federation Admin & Auditing (5%)</span>
              <span className="font-bold text-teal-700 font-mono">₹{Math.round(calcHours * calcHourlyRate * 0.05)}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100 text-emerald-700 font-semibold">
              <span>Commercial Aggregator Platform Cut</span>
              <span className="font-bold font-mono">₹0 (0% Cut)</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-black text-sm text-stone-900">Total Transparent Estimate:</span>
              <span className="font-black text-xl text-[#0C3B2E] font-mono">
                ₹{Math.round(calcHours * calcHourlyRate)}
              </span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* 6. PAST COMPLETED BOOKINGS & REVIEWS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-['Outfit']">Past Service History ({pastBookings.length})</h2>

        {pastBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center text-xs text-stone-500 border border-stone-200">
            No completed services yet.
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

      {/* 7. INTERACTIVE 5-STAR RATING MODAL */}
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
