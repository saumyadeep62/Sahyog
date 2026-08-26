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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Booking, BookingStatus } from '../../lib/database.types';
import { GrievanceModal } from '../common/GrievanceModal';

export const CustomerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
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
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [selectedGrievanceBookingId, setSelectedGrievanceBookingId] = useState<string | undefined>(undefined);

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

  const handleAdvanceStatusForDemo = (bookingId: string, currentStatus: BookingStatus) => {
    const sequence: BookingStatus[] = ['requested', 'confirmed', 'en_route', 'in_progress', 'completed'];
    const nextIdx = sequence.indexOf(currentStatus) + 1;
    if (nextIdx < sequence.length) {
      updateBookingStatus(bookingId, sequence[nextIdx]);
    }
  };

  const handleOpenRating = (bk: Booking) => {
    setRatingModalBooking(bk);
    setRatingStars(5);
    setRatingComment('Excellent service, highly professional and transparent.');
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
      tags: ['Punctual', 'Fair Price', 'Cooperative Quality'],
    });

    setRatingModalBooking(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C3B2E] to-[#164E3F] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser.avatar_url ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
            }
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4A373] shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-['Outfit']">{currentUser.name}</h1>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium border border-emerald-400/30">
                Verified Household
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">{currentUser.contact} • {currentUser.email}</p>
            <p className="text-[11px] text-[#D4A373] font-medium mt-1">
              Member of Mumbai Shramik Consumer Solidarity Circle
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => openBookingFlow()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#E0A96D] text-[#0C3B2E] font-bold text-xs shadow-md hover:opacity-95 flex items-center gap-1.5 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Service</span>
          </button>
          <button
            onClick={openEmergencyModal}
            className="px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Urgent SOS</span>
          </button>
        </div>
      </div>

      {/* ACTIVE BOOKINGS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 font-['Outfit'] flex items-center gap-2">
            <span>Active & In-Progress Bookings</span>
            <span className="text-xs bg-[#0C3B2E] text-white px-2 py-0.5 rounded-full font-bold">
              {activeBookings.length}
            </span>
          </h2>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-2">
            <p className="font-bold text-stone-700 text-sm">No active bookings currently</p>
            <p className="text-xs text-stone-500">Need an electrician, plumber, or caregiver? Book a verified artisan.</p>
            <button
              onClick={() => openBookingFlow()}
              className="mt-2 px-4 py-2 rounded-lg bg-[#0C3B2E] text-white text-xs font-bold shadow-md"
            >
              Book Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.map((bk) => {
              const currentStepIdx = getStepIndex(bk.status);

              return (
                <div
                  key={bk.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 space-y-6"
                >
                  {/* Top Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-base border border-emerald-200">
                        {bk.is_emergency ? '⚡' : '🛠️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-stone-900 text-base">{bk.service_task}</h3>
                          {bk.is_emergency && (
                            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                              EMERGENCY
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">
                          Booking: <span className="font-mono font-bold text-stone-700">{bk.booking_code}</span> •{' '}
                          {bk.service_category_name}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-stone-400 block">Total Fair Fare</span>
                      <span className="font-extrabold text-lg text-[#0C3B2E]">
                        ₹{bk.price_breakdown.total_amount}
                      </span>
                    </div>
                  </div>

                  {/* STEPPER PROGRESS */}
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                      Live Job Progress
                    </span>
                    <div className="grid grid-cols-5 gap-2 relative">
                      {statusSteps.map((s, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={s.key} className="text-center space-y-1.5">
                            <div
                              className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                                isCurrent
                                  ? 'bg-[#0C3B2E] text-white ring-4 ring-emerald-200'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-100 text-stone-400'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] block font-semibold leading-tight ${
                                isCurrent ? 'text-[#0C3B2E]' : isDone ? 'text-stone-800' : 'text-stone-400'
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Artisan Card & Action */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          bk.worker_avatar ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                        }
                        alt="Artisan"
                        className="w-12 h-12 rounded-xl object-cover border border-[#D4A373]"
                      />
                      <div>
                        <p className="font-bold text-stone-900 text-sm">{bk.worker_name || 'Assigned Artisan'}</p>
                        <p className="text-emerald-800 font-medium text-[11px]">{bk.cooperative_name}</p>
                        <p className="text-stone-500 text-[10px] mt-0.5">Contact: {bk.worker_contact || '+91 98199 87654'}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Advance status helper button for demo */}
                      {bk.status !== 'completed' && (
                        <button
                          onClick={() => handleAdvanceStatusForDemo(bk.id, bk.status)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                          title="Advance progress status"
                        >
                          Advance Step →
                        </button>
                      )}

                      <button
                        onClick={() => openInvoiceModal(bk)}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedGrievanceBookingId(bk.id);
                          setIsGrievanceOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Dispute</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PAST SERVICE HISTORY & INVOICES */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-stone-900 font-['Outfit']">Service History & Downloadable Invoices</h2>

        {pastBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-stone-200 text-xs text-stone-500">
            No completed past bookings yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
            {pastBookings.map((bk) => (
              <div key={bk.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{bk.service_task}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-stone-500">
                    Artisan: <span className="font-medium text-stone-700">{bk.worker_name}</span> • {bk.cooperative_name}
                  </p>
                  <p className="text-[11px] text-stone-400 font-mono">
                    Code: {bk.booking_code} • {new Date(bk.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-extrabold text-[#0C3B2E] text-sm">₹{bk.price_breakdown.total_amount}</span>
                  <button
                    onClick={() => openInvoiceModal(bk)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold flex items-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                  <button
                    onClick={() => handleOpenRating(bk)}
                    className="px-3 py-1.5 rounded-lg bg-[#0C3B2E] hover:bg-[#164E3F] text-white font-semibold flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-300" />
                    <span>Rate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RATING & REVIEW MODAL */}
      {ratingModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 font-['Outfit']">
              Rate & Review {ratingModalBooking.worker_name}
            </h3>
            <p className="text-xs text-stone-500">
              Cooperative ratings celebrate worker dignity and build mutual community trust.
            </p>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    className="p-1 text-2xl focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= ratingStars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Feedback Comments</label>
                <textarea
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
                />
              </div>

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

      {/* GRIEVANCE MODAL */}
      <GrievanceModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        defaultBookingId={selectedGrievanceBookingId}
      />
    </div>
  );
};
