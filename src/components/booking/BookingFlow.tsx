import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Zap,
  Star,
  Receipt,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { Booking, ServiceCategory, Worker } from '../../lib/database.types';

export const BookingFlow: React.FC = () => {
  const {
    isBookingFlowOpen,
    closeBookingFlow,
    bookingTargetCategory,
    bookingTargetWorker,
    categories,
    workers,
    createBooking,
    openInvoiceModal,
  } = useMarketplace();
  const { currentUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(
    bookingTargetCategory || categories[0]
  );
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState<string>(
    'Flat 402, Sea Crest Apartments, Perry Cross Road, Bandra West, Mumbai 400050'
  );
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(bookingTargetWorker || null);
  const [autoMatch, setAutoMatch] = useState<boolean>(!bookingTargetWorker);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'CashAfterWork'>('UPI');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (bookingTargetCategory) {
      setSelectedCategory(bookingTargetCategory);
      if (bookingTargetCategory.popular_tasks?.length) {
        setSelectedTask(bookingTargetCategory.popular_tasks[0]);
      }
    }
    if (bookingTargetWorker) {
      setSelectedWorker(bookingTargetWorker);
      setAutoMatch(false);
    }
  }, [bookingTargetCategory, bookingTargetWorker, isBookingFlowOpen]);

  if (!isBookingFlowOpen) return null;

  // Category matching workers
  const eligibleWorkers = workers.filter((w) =>
    w.service_category_ids.includes(selectedCategory.id)
  );

  // Price calculations
  const baseRate = selectedWorker ? selectedWorker.hourly_rate * 2 : 550;
  const workerWage = isEmergency ? baseRate + 200 : baseRate;
  const welfareContribution = Math.round(workerWage * 0.08);
  const coopAdminFee = Math.round(workerWage * 0.05);
  const emergencyFee = isEmergency ? 100 : 0;
  const totalAmount = workerWage + welfareContribution + coopAdminFee + emergencyFee;

  const handleFinalConfirm = () => {
    const assignedWorker = autoMatch
      ? eligibleWorkers.find((w) => w.availability === 'online') || eligibleWorkers[0]
      : selectedWorker || eligibleWorkers[0];

    const bk = createBooking({
      customer_id: currentUser.id,
      customer_name: currentUser.name,
      customer_contact: currentUser.contact,
      worker_id: assignedWorker?.id,
      worker_name: assignedWorker?.full_name,
      worker_contact: '+91 98199 87654',
      worker_avatar: assignedWorker?.avatar_url,
      cooperative_name: assignedWorker?.cooperative_name || 'Mumbai Shramik Sahakari Sanstha',
      service_category_id: selectedCategory.id,
      service_category_name: selectedCategory.name,
      service_task: selectedTask || selectedCategory.name,
      description: description || 'Standard booking through SAHYOG cooperative portal.',
      scheduled_time: `${bookingDate}T${timeSlot.split(' - ')[0]}`,
      is_emergency: isEmergency,
      location: {
        address,
        lat: 19.0596,
        lng: 72.8295,
      },
      price_breakdown: {
        worker_wage: workerWage,
        welfare_contribution: welfareContribution,
        coop_admin_fee: coopAdminFee,
        platform_fee: 0,
        tax_amount: 0,
        emergency_fee: emergencyFee,
        total_amount: totalAmount,
      },
      notes: 'Cooperative verified booking with full artisan insurance cover.',
    });

    setConfirmedBooking(bk);
    setCurrentStep(5);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Step Indicator Header */}
        <div className="bg-[#0C3B2E] text-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#1D5C4B] text-[#D4A373] font-bold">
                Step {currentStep} of 5
              </span>
              <h3 className="font-bold text-sm font-['Outfit']">
                {currentStep === 1 && 'Service Requirement'}
                {currentStep === 2 && 'Schedule & Location'}
                {currentStep === 3 && 'Choose Cooperative Artisan'}
                {currentStep === 4 && 'Transparent Fair Pricing'}
                {currentStep === 5 && 'Booking Confirmed!'}
              </h3>
            </div>
            <button
              onClick={closeBookingFlow}
              className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-[#164E3F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#144537] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#D4A373] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700 flex-1">
          {/* STEP 1: Task Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">Selected Category</label>
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <img
                    src={selectedCategory.image_url}
                    alt={selectedCategory.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{selectedCategory.name}</h4>
                    <p className="text-[11px] text-stone-500">{selectedCategory.description}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">Common Tasks</label>
                <div className="space-y-1.5">
                  {selectedCategory.popular_tasks?.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTask(t)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        selectedTask === t
                          ? 'border-[#0C3B2E] bg-emerald-50/60 font-bold text-[#0C3B2E]'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span>{t}</span>
                      {selectedTask === t && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Additional Notes / Instructions</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue or any specific tools required..."
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
                />
              </div>

              {selectedCategory.urgency_available && (
                <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-bold text-stone-800">Need Urgent Fast-Track?</p>
                      <p className="text-[11px] text-stone-500">Nearest artisan dispatched within 30 mins (+₹100)</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="w-4 h-4 text-[#0C3B2E] rounded focus:ring-[#0C3B2E]"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Date, Time & Address */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '08:00 AM - 10:00 AM',
                    '10:00 AM - 12:00 PM',
                    '01:00 PM - 03:00 PM',
                    '04:00 PM - 06:00 PM',
                    '06:00 PM - 08:00 PM',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                        timeSlot === slot
                          ? 'border-[#0C3B2E] bg-emerald-50 text-[#0C3B2E] font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Service Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Worker Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div
                onClick={() => {
                  setAutoMatch(true);
                  setSelectedWorker(null);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  autoMatch
                    ? 'border-[#0C3B2E] bg-emerald-50/70 ring-2 ring-[#0C3B2E]/20'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0C3B2E] text-white">
                    <UserCheck className="w-5 h-5 text-[#D4A373]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">Instant Cooperative Auto-Match (Recommended)</h4>
                    <p className="text-[11px] text-stone-500">
                      Cooperative assigns the nearest available certified artisan in your zone
                    </p>
                  </div>
                </div>
                {autoMatch && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
              </div>

              <div className="relative text-center">
                <span className="bg-white px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider relative z-10">
                  Or Pick a Specific Artisan
                </span>
                <div className="absolute inset-0 top-1/2 border-t border-stone-200 -z-0"></div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {eligibleWorkers.map((w) => {
                  const isSelected = selectedWorker?.id === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => {
                        setSelectedWorker(w);
                        setAutoMatch(false);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#0C3B2E] bg-emerald-50/70 ring-2 ring-[#0C3B2E]/20'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={w.avatar_url}
                          alt={w.full_name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#D4A373]"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-900">{w.full_name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-medium">
                              ★ {w.rating}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500">
                            {w.cooperative_name} • {w.experience_years} yrs exp
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#0C3B2E] block">₹{w.hourly_rate}/h</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 inline mt-1" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Transparent Cost Breakdown & Payment */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E5DDD0] space-y-2.5">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-[#0C3B2E]" />
                  Transparent Cooperative Fare Breakdown
                </h4>

                <div className="divide-y divide-stone-200/80 space-y-2 pt-1 text-xs">
                  <div className="flex justify-between text-stone-700 pt-1">
                    <span>Artisan Fair Wage (100% floor minimum)</span>
                    <span className="font-semibold text-stone-900">₹{workerWage}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 pt-2">
                    <span>Worker Welfare, ESI & Accidental Fund (7%)</span>
                    <span className="font-semibold text-amber-700">₹{welfareContribution}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 pt-2">
                    <span>Cooperative Society Operational Overhead (5%)</span>
                    <span className="font-semibold text-teal-700">₹{coopAdminFee}</span>
                  </div>
                  {isEmergency && (
                    <div className="flex justify-between text-rose-700 pt-2 font-medium">
                      <span>Emergency Priority Dispatch Allowance</span>
                      <span>₹{emergencyFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-700 font-bold pt-2">
                    <span>Private Gig Aggregator Cut</span>
                    <span>₹0.00 (Zero Extraction)</span>
                  </div>
                  <div className="flex justify-between text-stone-900 font-extrabold text-sm pt-2 border-t-2 border-stone-300">
                    <span>Total Payable</span>
                    <span className="text-base text-[#0C3B2E]">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded-xl border text-xs text-center font-semibold transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#0C3B2E] bg-emerald-50 text-[#0C3B2E]'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    UPI / QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-2.5 rounded-xl border text-xs text-center font-semibold transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-[#0C3B2E] bg-emerald-50 text-[#0C3B2E]'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Cards / NetBanking
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CashAfterWork')}
                    className={`p-2.5 rounded-xl border text-xs text-center font-semibold transition-all ${
                      paymentMethod === 'CashAfterWork'
                        ? 'border-[#0C3B2E] bg-emerald-50 text-[#0C3B2E]'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Pay Post-Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation Success */}
          {currentStep === 5 && confirmedBooking && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div>
                <h4 className="font-extrabold text-lg text-[#0C3B2E] font-['Outfit']">
                  Booking Confirmed with Fair Wages!
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Thank you for supporting community-owned labour cooperatives.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Booking Code:</span>
                  <span className="font-mono font-bold text-stone-800">{confirmedBooking.booking_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Service:</span>
                  <span className="font-semibold text-stone-800">{confirmedBooking.service_task}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Assigned Artisan:</span>
                  <span className="font-semibold text-emerald-700">{confirmedBooking.worker_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Scheduled:</span>
                  <span className="text-stone-800">{bookingDate} • {timeSlot}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-stone-200 pt-2 text-stone-900">
                  <span>Total Amount:</span>
                  <span className="text-[#0C3B2E]">₹{confirmedBooking.price_breakdown.total_amount}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openInvoiceModal(confirmedBooking)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Download Cooperative Invoice
                </button>
                <button
                  type="button"
                  onClick={closeBookingFlow}
                  className="flex-1 py-2.5 rounded-xl bg-[#0C3B2E] text-white text-xs font-bold shadow-md hover:bg-[#164E3F] transition-colors"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Buttons */}
        {currentStep < 5 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-lg bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="px-6 py-2.5 rounded-lg bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Confirm & Lock Fair Wage (₹{totalAmount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
