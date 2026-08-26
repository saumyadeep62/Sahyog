import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  ShieldCheck,
  Award,
  HeartHandshake,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  FileText,
  AlertCircle,
  Sparkles,
  Zap,
  PhoneCall,
  DollarSign,
  Radio,
  MapPin,
  Flame,
  ArrowRight,
  Shield,
  Navigation,
  Check,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { GrievanceModal } from '../common/GrievanceModal';
import { TiltCard } from '../3d/TiltCard';
import { BookingStatus, Worker } from '../../lib/database.types';
import { GoogleMapViewer } from '../maps/GoogleMapViewer';

export const WorkerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const {
    workers,
    bookings,
    certifications,
    welfareList,
    updateBookingStatus,
    openInvoiceModal,
    uploadCertification,
    uploadCertificationFile,
    updateWorkerAvailability,
    claimWelfareEmergency,
  } = useMarketplace();

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-stone-600 font-medium">
        Please sign in to access the Artisan Workstation.
      </div>
    );
  }

  // Find worker profile matching current user or fallback to first worker
  const worker: Worker = workers.find((w) => w.user_id === currentUser.id) || workers[0];
  const workerCerts = certifications.filter((c) => c.worker_id === worker?.id);
  const welfare = welfareList.find((w) => w.worker_id === worker?.id) || welfareList[0];

  const [dutyStatus, setDutyStatus] = useState<'online' | 'busy' | 'offline'>(worker?.availability || 'online');
  const [activeWorkTab, setActiveWorkTab] = useState<'workstation' | 'earnings' | 'certs' | 'welfare'>('workstation');
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isUploadCertOpen, setIsUploadCertOpen] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newIssuingBody, setNewIssuingBody] = useState('National Skill Development Corporation (NSDC)');
  const [selectedCertFile, setSelectedCertFile] = useState<File | null>(null);
  const [isUploadingCert, setIsUploadingCert] = useState(false);

  const [claimAmount, setClaimAmount] = useState('10000');
  const [claimReason, setClaimReason] = useState('');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    if (worker) {
      setDutyStatus(worker.availability);
    }
  }, [worker]);

  // Handle duty status toggle
  const handleToggleDutyStatus = async (newStatus: 'online' | 'offline') => {
    setDutyStatus(newStatus);
    if (worker) {
      await updateWorkerAvailability(worker.id, newStatus);
    }
  };

  // Filter jobs assigned to this worker
  const assignedBookings = bookings.filter(
    (b) => b.worker_id === worker?.id || b.worker_name === worker?.full_name
  );
  const pendingJobs = assignedBookings.filter((b) => b.status === 'requested' || b.status === 'confirmed');
  const inProgressJobs = assignedBookings.filter((b) => b.status === 'en_route' || b.status === 'in_progress');
  const completedJobs = assignedBookings.filter((b) => b.status === 'completed');

  const activeJob = inProgressJobs[0] || null;

  const handleAcceptJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'en_route');
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}
  };

  const handleStartWork = (bookingId: string) => {
    updateBookingStatus(bookingId, 'in_progress');
  };

  const handleCompleteJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
  };

  const handleAdvanceJobStatus = (bookingId: string, currentStatus: BookingStatus) => {
    const sequence: BookingStatus[] = ['requested', 'confirmed', 'en_route', 'in_progress', 'completed'];
    const nextIdx = sequence.indexOf(currentStatus) + 1;
    if (nextIdx < sequence.length) {
      updateBookingStatus(bookingId, sequence[nextIdx]);
      if (sequence[nextIdx] === 'completed') {
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {}
      }
    }
  };

  const handleUploadCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !worker) return;

    setIsUploadingCert(true);
    try {
      if (selectedCertFile) {
        await uploadCertificationFile(worker.id, selectedCertFile, {
          certificate_name: newCertName,
          issuing_body: newIssuingBody,
        });
      } else {
        uploadCertification(
          worker.id,
          newCertName,
          newIssuingBody,
          'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80'
        );
      }
      setIsUploadCertOpen(false);
      setNewCertName('');
      setSelectedCertFile(null);
    } finally {
      setIsUploadingCert(false);
    }
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimReason.trim() || !worker) return;

    claimWelfareEmergency(worker.id, parseInt(claimAmount) || 10000, claimReason);
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setIsClaimModalOpen(false);
      setClaimReason('');
    }, 2000);
  };

  // Generate 7-day schedule slots (Urban Company Style)
  const scheduleDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: d.toISOString().split('T')[0],
    };
  });

  const timeSlots = [
    { slot: '08:00 AM - 10:00 AM', status: 'free' },
    { slot: '10:00 AM - 12:00 PM', status: activeJob ? 'booked' : 'free', label: activeJob?.service_task },
    { slot: '12:00 PM - 02:00 PM', status: 'free' },
    { slot: '02:00 PM - 04:00 PM', status: pendingJobs[0] ? 'booked' : 'free', label: pendingJobs[0]?.service_task },
    { slot: '04:00 PM - 06:00 PM', status: 'free' },
    { slot: '06:00 PM - 08:00 PM', status: 'free' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. URBAN COMPANY STYLE TOP COMMAND BAR */}
      <div className="bg-gradient-to-r from-[#2C1810] via-[#3E2317] to-[#1C3B2E] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                currentUser.avatar_url ||
                worker?.avatar_url ||
                'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2C1810] ${
                dutyStatus === 'online' ? 'bg-emerald-400' : 'bg-stone-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit']">{currentUser.name}</h1>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30 uppercase tracking-wider">
                Co-op Verified Artisan
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              {worker?.cooperative_name || 'Mumbai Shramik Sahakari Sanstha'} • ₹{worker?.hourly_rate || 350}/hr Floor Rate
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-300 font-semibold">
              <span>★ {worker?.rating || '4.9'} ({worker?.total_ratings_count || 128} Reviews)</span>
              <span>•</span>
              <span>{worker?.total_jobs_completed || 86} Completed Jobs</span>
            </div>
          </div>
        </div>

        {/* Online / Offline Duty Switcher */}
        <div className="flex items-center gap-4 bg-black/30 p-2.5 rounded-2xl border border-white/10">
          <div className="text-right">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Duty Status</span>
            <span className={`text-xs font-black ${dutyStatus === 'online' ? 'text-emerald-400' : 'text-stone-400'}`}>
              {dutyStatus === 'online' ? '🟢 ON DUTY (Radar Live)' : '⚪ OFF DUTY'}
            </span>
          </div>

          <button
            onClick={() => handleToggleDutyStatus(dutyStatus === 'online' ? 'offline' : 'online')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all transform active:scale-95 ${
              dutyStatus === 'online'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
            }`}
          >
            {dutyStatus === 'online' ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* 2. TABBED NAVIGATION: FOCUSED WORKSTATION VS SECONDARY METRICS */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveWorkTab('workstation')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeWorkTab === 'workstation'
              ? 'bg-[#2C1810] text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Live Radar & Active Workstation</span>
        </button>

        <button
          onClick={() => setActiveWorkTab('earnings')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeWorkTab === 'earnings'
              ? 'bg-[#2C1810] text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Fair Wage Earnings & Payouts</span>
        </button>

        <button
          onClick={() => setActiveWorkTab('certs')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeWorkTab === 'certs'
              ? 'bg-[#2C1810] text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>NSDC Certifications ({workerCerts.length})</span>
        </button>

        <button
          onClick={() => setActiveWorkTab('welfare')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeWorkTab === 'welfare'
              ? 'bg-[#2C1810] text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Mutual Aid & Ayushman</span>
        </button>
      </div>

      {/* 3. MAIN TAB: URBAN COMPANY–STYLE WORKSTATION */}
      {activeWorkTab === 'workstation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: LIVE MAP & ACTIVE JOB DISPATCH */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Route & Navigation Map */}
            <GoogleMapViewer
              customerLocation={{
                lat: 19.076,
                lng: 72.8777,
                label: activeJob ? activeJob.customer_name : 'Assigned Service Zone',
              }}
              workerLocation={{
                lat: 19.082,
                lng: 72.884,
                name: `${currentUser.name} (Your GPS)`,
                contact: currentUser.contact,
              }}
              showRoute={Boolean(activeJob)}
              height="340px"
              title={
                activeJob
                  ? `Live Navigation: Route to ${activeJob.customer_name}`
                  : 'Artisan Live GPS & Regional Service Cluster'
              }
            />

            {/* ACTIVE JOB IN PROGRESS CARD */}
            {activeJob ? (
              <div className="bg-gradient-to-r from-emerald-950 via-[#0C3B2E] to-teal-950 text-white rounded-3xl p-6 shadow-2xl border border-emerald-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500 text-white font-black tracking-wider animate-pulse flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-white text-white" />
                      ACTIVE DISPATCH
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-200 font-bold">
                      {activeJob.status === 'en_route' ? '🚗 En Route to Customer' : '🛠️ Work In Progress'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    {activeJob.booking_code}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-xl text-white">{activeJob.service_task}</h3>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">{activeJob.description}</p>
                  
                  {/* Interactive Address & Navigation Box */}
                  <div className="bg-white/10 rounded-2xl p-4 mt-3 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="text-stone-200 font-medium">
                        Customer: <strong className="text-white">{activeJob.customer_name}</strong>
                      </p>
                      {activeJob.customer_contact && (
                        <a
                          href={`tel:${activeJob.customer_contact}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 font-bold text-[11px] flex items-center gap-1 transition-colors border border-emerald-400/30"
                        >
                          <PhoneCall className="w-3 h-3 text-amber-300" />
                          <span>Call: {activeJob.customer_contact}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/10">
                      <p className="text-stone-300 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5" />
                        <span>{activeJob.location?.address || 'Flat 402, Sea Crest Apartments, Bandra West, Mumbai'}</span>
                      </p>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const destLat = activeJob.location?.lat || 19.076;
                          const destLng = activeJob.location?.lng || 72.8777;
                          const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
                          window.open(navUrl, '_blank');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-[11px] shadow flex items-center gap-1.5 transition-all w-fit flex-shrink-0"
                      >
                        <Navigation className="w-3.5 h-3.5 fill-stone-950 transform rotate-45" />
                        <span>Open Turn-by-Turn GPS</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-emerald-800">
                  <div>
                    <span className="text-[11px] text-emerald-300 block font-semibold">Guaranteed Fair Earnings</span>
                    <span className="text-2xl font-black text-[#D4A373]">
                      ₹{activeJob.price_breakdown?.worker_wage || 550}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {activeJob.status === 'en_route' ? (
                      <>
                        <button
                          onClick={() => {
                            const destLat = activeJob.location?.lat || 19.076;
                            const destLng = activeJob.location?.lng || 72.8777;
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`,
                              '_blank'
                            );
                          }}
                          className="px-4 py-3 rounded-2xl bg-[#D4A373] hover:bg-[#E0A96D] text-[#0C3B2E] font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all transform hover:scale-105"
                          title="Open Google Maps app with route"
                        >
                          <Navigation className="w-4 h-4 fill-[#0C3B2E] transform rotate-45" />
                          <span>Google Maps Nav</span>
                        </button>
                        <button
                          onClick={() => handleStartWork(activeJob.id)}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Arrived • Start Work →</span>
                        </button>
                        <button
                          onClick={() => handleAdvanceJobStatus(activeJob.id, activeJob.status)}
                          className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs shadow transition-colors"
                          title="Advance to next step"
                        >
                          Advance Step →
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleCompleteJob(activeJob.id)}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Job Completed ✓</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-2 shadow-sm">
                <Radio className="w-8 h-8 text-emerald-600 mx-auto animate-ping" />
                <p className="font-bold text-stone-800 text-sm">Ready for Regional Dispatches</p>
                <p className="text-xs text-stone-500">
                  You are marked {dutyStatus === 'online' ? 'Online' : 'Offline'}. Matchings are prioritized within your registered cooperative zone.
                </p>
              </div>
            )}

            {/* PENDING JOB REQUESTS */}
            {pendingJobs.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-stone-900 text-sm font-['Outfit']">
                  Incoming Job Requests ({pendingJobs.length})
                </h3>
                {pendingJobs.map((bk) => (
                  <div key={bk.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-stone-900 text-sm">{bk.service_task}</h4>
                        <p className="text-xs text-stone-500">{bk.customer_name} • {bk.scheduled_time}</p>
                      </div>
                      <span className="font-black text-emerald-700 text-base">
                        ₹{bk.price_breakdown?.worker_wage || 450}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAdvanceJobStatus(bk.id, bk.status)}
                        className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                      >
                        Advance Step →
                      </button>
                      <button
                        onClick={() => handleAcceptJob(bk.id)}
                        className="px-5 py-2 rounded-xl bg-[#2C1810] hover:bg-[#3E2317] text-white text-xs font-bold shadow"
                      >
                        Accept Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: URBAN COMPANY TIME-SLOT SCHEDULE */}
          <div className="lg:col-span-4 space-y-6">
            {/* Day Selector Ribbon */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2C1810]" />
                  <h3 className="font-black text-stone-900 text-sm font-['Outfit']">Time-Slot Schedule</h3>
                </div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Upcoming 7 Days</span>
              </div>

              {/* Horizontal Day Buttons */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {scheduleDays.map((day, idx) => (
                  <button
                    key={day.fullDate}
                    onClick={() => setSelectedDayIdx(idx)}
                    className={`p-2 rounded-2xl border transition-all ${
                      selectedDayIdx === idx
                        ? 'bg-[#2C1810] text-white border-[#2C1810] shadow-md'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-[10px] block font-bold">{day.dayName}</span>
                    <span className="text-sm font-black">{day.dateNumber}</span>
                  </button>
                ))}
              </div>

              {/* Slots List for Selected Day */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <p className="text-[11px] font-bold text-stone-400 uppercase">
                  Slots for {scheduleDays[selectedDayIdx].dayName} ({scheduleDays[selectedDayIdx].dateNumber}{' '}
                  {scheduleDays[selectedDayIdx].month})
                </p>

                <div className="space-y-2">
                  {timeSlots.map((ts, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                        ts.status === 'booked'
                          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                          : 'bg-emerald-50/40 border-emerald-100 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-semibold">{ts.slot}</span>
                      </div>

                      {ts.status === 'booked' ? (
                        <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                          Booked
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Grievances */}
            <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Artisan Solidarity Actions</h4>
              <button
                onClick={() => setIsUploadCertOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center justify-between"
              >
                <span>Upload NSDC Skill Certificate</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
              <button
                onClick={() => setIsClaimModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center justify-between"
              >
                <span>Emergency Welfare Fund Claim</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
              <button
                onClick={() => setIsGrievanceOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-stone-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center justify-between"
              >
                <span>File Cooperative Grievance</span>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SECONDARY TAB: FAIR WAGE EARNINGS */}
      {activeWorkTab === 'earnings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-stone-900 font-['Outfit']">Fair Wage Breakdown & Lifetime Payouts</h3>
              <p className="text-xs text-stone-500">100% of the customer floor wage goes directly to your account.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">Total Lifetime Earnings</span>
              <span className="text-2xl font-black text-emerald-700 font-['Outfit']">
                ₹{(completedJobs.length * 550 + 24500).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">This Week's Net Wage</span>
              <span className="text-xl font-black text-emerald-900">₹8,450</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Cooperative Welfare Pool Contribution</span>
              <span className="text-xl font-black text-amber-900">₹676</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-700 uppercase block">Platform Aggregator Fee Cut</span>
              <span className="text-xl font-black text-emerald-700">₹0 (0%)</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECONDARY TAB: CERTIFICATIONS */}
      {activeWorkTab === 'certs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-stone-900 font-['Outfit']">National Trade Certifications</h3>
              <p className="text-xs text-stone-500">Stored in Supabase Storage with digital signature verification.</p>
            </div>
            <button
              onClick={() => setIsUploadCertOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#2C1810] text-white text-xs font-bold shadow"
            >
              + Upload Certificate
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workerCerts.map((cert) => (
              <div key={cert.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{cert.certificate_name}</h4>
                  <p className="text-xs text-stone-500">{cert.issuing_body}</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                    Verified Digital Credential
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SECONDARY TAB: WELFARE & MUTUAL AID */}
      {activeWorkTab === 'welfare' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-black text-stone-900 font-['Outfit']">Ayushman Bharat & Emergency Mutual Aid</h3>
            <p className="text-xs text-stone-500">Cooperative collective insurance guaranteeing ₹5 Lakh hospital coverage.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50 space-y-2">
              <span className="text-[10px] font-bold text-teal-800 uppercase block">Ayushman Health Card</span>
              <p className="text-sm font-black text-teal-950">ABHA: 91-8201-9923-4412</p>
              <p className="text-xs text-teal-700">Covered for cashless hospital treatments up to ₹5,00,000/yr.</p>
            </div>

            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 space-y-2">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Cooperative Emergency Reserve</span>
              <p className="text-sm font-black text-amber-950">Instant 0% Interest Relief</p>
              <p className="text-xs text-amber-700">Available balance for immediate medical or tool repair claims: ₹25,000</p>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL MODALS */}
      {isGrievanceOpen && (
        <GrievanceModal isOpen={isGrievanceOpen} onClose={() => setIsGrievanceOpen(false)} />
      )}

      {/* CERTIFICATE UPLOAD MODAL */}
      {isUploadCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">Upload Trade Certification</h3>
              <button
                onClick={() => {
                  setIsUploadCertOpen(false);
                  setSelectedCertFile(null);
                }}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadCertSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Certification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Electrician Level 4"
                  value={newCertName}
                  onChange={(e) => setNewCertName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#2C1810] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  required
                  value={newIssuingBody}
                  onChange={(e) => setNewIssuingBody(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#2C1810] focus:outline-none"
                />
              </div>

              <label className="block border-2 border-dashed border-stone-300 hover:border-amber-700 rounded-2xl p-4 text-center space-y-1 cursor-pointer transition-colors">
                <FileText className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-semibold text-stone-700">
                  {selectedCertFile ? selectedCertFile.name : 'Select or Drag & Drop PDF / Image'}
                </p>
                <p className="text-[10px] text-stone-400">Stored securely in Supabase Storage</p>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSelectedCertFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadCertOpen(false);
                    setSelectedCertFile(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingCert}
                  className="flex-1 py-2.5 rounded-xl bg-[#2C1810] hover:bg-[#3E2317] disabled:opacity-50 text-white text-xs font-bold shadow-md"
                >
                  {isUploadingCert ? 'Uploading to Storage...' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
