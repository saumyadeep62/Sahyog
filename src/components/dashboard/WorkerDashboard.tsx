import React, { useState } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { GrievanceModal } from '../common/GrievanceModal';
import { TiltCard } from '../3d/TiltCard';

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
    claimWelfareEmergency,
  } = useMarketplace();

  // Find worker profile matching current user or default to Rameshwar Patil
  const worker = workers.find((w) => w.user_id === currentUser.id) || workers[0];
  const workerCerts = certifications.filter((c) => c.worker_id === worker.id);
  const welfare = welfareList.find((w) => w.worker_id === worker.id) || welfareList[0];

  const [dutyStatus, setDutyStatus] = useState<'online' | 'busy' | 'offline'>(worker.availability);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isUploadCertOpen, setIsUploadCertOpen] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newIssuingBody, setNewIssuingBody] = useState('National Skill Development Corporation (NSDC)');
  const [claimAmount, setClaimAmount] = useState('10000');
  const [claimReason, setClaimReason] = useState('');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Incoming jobs
  const assignedBookings = bookings.filter(
    (b) => b.worker_id === worker.id || b.worker_name === worker.full_name
  );
  const pendingJobs = assignedBookings.filter((b) => b.status === 'requested' || b.status === 'confirmed');
  const inProgressJobs = assignedBookings.filter((b) => b.status === 'en_route' || b.status === 'in_progress');
  const completedJobs = assignedBookings.filter((b) => b.status === 'completed');

  const handleAcceptJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'en_route');
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}
  };

  const handleCompleteJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
  };

  const handleUploadCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim()) return;

    uploadCertification(
      worker.id,
      newCertName,
      newIssuingBody,
      'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80'
    );
    setIsUploadCertOpen(false);
    setNewCertName('');
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    claimWelfareEmergency(worker.id, parseInt(claimAmount, 10), claimReason);
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setIsClaimModalOpen(false);
      setClaimReason('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. ARTISAN WORKSTATION IDENTITY BANNER */}
      <div className="bg-gradient-to-r from-[#2C1810] via-[#3E2317] to-[#1E110A] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <img
              src={worker.avatar_url}
              alt={worker.full_name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-[#D4A373] shadow-xl"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#2C1810] ${
                dutyStatus === 'online'
                  ? 'bg-emerald-500 animate-pulse'
                  : dutyStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-stone-500'
              }`}
              title={`Status: ${dutyStatus}`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                {worker.full_name}
              </h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30 uppercase tracking-wider">
                ⚡ Certified Master Artisan
              </span>
            </div>
            <p className="text-xs text-amber-200/80 font-medium">{worker.cooperative_name}</p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-300 pt-0.5">
              <span>Trade ID: <strong className="text-white font-mono">MSCS-MUM-7421</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">100% Floor Wage Guarantee</span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{worker.skills.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Duty Status Radar Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative z-10">
          <div className="bg-[#180C07]/90 p-1.5 rounded-2xl border border-amber-800/60 shadow-inner flex items-center gap-1 text-xs">
            <button
              onClick={() => setDutyStatus('online')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                dutyStatus === 'online'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-ping text-emerald-300" />
              <span>Available (Online)</span>
            </button>
            <button
              onClick={() => setDutyStatus('busy')}
              className={`px-3 py-2 rounded-xl font-bold transition-all ${
                dutyStatus === 'busy'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              On Job
            </button>
            <button
              onClick={() => setDutyStatus('offline')}
              className={`px-3 py-2 rounded-xl font-bold transition-all ${
                dutyStatus === 'offline'
                  ? 'bg-stone-700 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Off Duty
            </button>
          </div>

          <button
            onClick={() => setIsGrievanceOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all shadow-xs"
          >
            Tribunal Grievance
          </button>
        </div>
      </div>

      {/* 2. FAIR EARNINGS & WELFARE LEDGER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Month's Fair Earnings</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#2C1810] font-['Outfit']">₹42,850</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Direct Payout (₹0 Deductions)</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Mutual Aid Fund</span>
            <HeartHandshake className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#2C1810] font-['Outfit']">
            ₹{welfare.welfare_fund_contribution.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold">
            <span>Collective Emergency Safety Pool</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Annual Co-op Dividend</span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#2C1810] font-['Outfit']">
            ₹{welfare.cooperative_dividend_earned.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-teal-700 font-bold">
            <span>Member Profit Share Entitlement</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Jobs & Rating</span>
            <Award className="w-5 h-5 text-[#D4A373]" />
          </div>
          <p className="text-3xl font-extrabold text-[#2C1810] font-['Outfit']">
            {worker.total_jobs_completed} <span className="text-base font-normal text-stone-400">/ ★ {worker.rating}</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium">
            <span>0 Algorithm Penalties or Bans</span>
          </div>
        </TiltCard>
      </div>

      {/* 3. DISPATCH RADAR QUEUE & ACTIVE JOB TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Queue */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Job in Progress Banner */}
          {inProgressJobs.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-900 to-[#0C3B2E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500 text-white font-black tracking-wider animate-pulse flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-white text-white" />
                  CURRENT ACTIVE DISPATCH
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300">
                  {inProgressJobs[0].booking_code}
                </span>
              </div>

              <div>
                <h3 className="font-black text-xl text-white">{inProgressJobs[0].service_task}</h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">{inProgressJobs[0].description}</p>
                <div className="bg-white/10 rounded-2xl p-4 mt-3 border border-white/10 space-y-1.5 text-xs">
                  <p className="text-stone-200 font-medium">
                    Customer: <strong className="text-white">{inProgressJobs[0].customer_name}</strong> ({inProgressJobs[0].customer_contact})
                  </p>
                  <p className="text-stone-300 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5" />
                    <span>{inProgressJobs[0].location.address}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-emerald-800">
                <div>
                  <span className="text-[11px] text-emerald-300 block font-semibold">Your Guaranteed Floor Wage</span>
                  <span className="text-2xl font-black text-[#D4A373]">
                    ₹{inProgressJobs[0].price_breakdown.worker_wage}
                  </span>
                </div>
                <button
                  onClick={() => handleCompleteJob(inProgressJobs[0].id)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Job Completed ✓</span>
                </button>
              </div>
            </div>
          )}

          {/* Pending Job Requests */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-stone-900 text-lg font-['Outfit'] flex items-center gap-2">
              <span>Incoming Live Dispatches</span>
              <span className="text-xs bg-[#2C1810] text-white px-2.5 py-0.5 rounded-full font-bold">
                {pendingJobs.length} Available
              </span>
            </h3>

            {pendingJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-xs text-stone-500 space-y-2">
                <Radio className="w-8 h-8 text-emerald-600 mx-auto animate-ping" />
                <p className="font-bold text-stone-700 text-sm">Radar Active • Listening for Job Dispatches</p>
                <p className="text-stone-400">You are on-duty and will receive priority regional matchings within your cooperative zone.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingJobs.map((bk) => (
                  <TiltCard
                    key={bk.id}
                    maxTilt={6}
                    className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md hover:shadow-xl transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-stone-900 text-base">{bk.service_task}</h4>
                          {bk.is_emergency && (
                            <span className="text-[10px] bg-red-100 text-red-800 font-black px-2.5 py-0.5 rounded-full animate-bounce">
                              ⚡ EMERGENCY SOS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {bk.service_category_name} • Scheduled: {bk.scheduled_time}
                        </p>
                      </div>
                      <div className="text-left sm:text-right bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 block font-bold">Direct Member Earnings</span>
                        <span className="font-black text-emerald-700 text-lg">
                          ₹{bk.price_breakdown.worker_wage}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-3.5 rounded-2xl">
                      <p><strong className="text-stone-800">Address:</strong> {bk.location.address}</p>
                      <p><strong className="text-stone-800">Task Notes:</strong> {bk.description}</p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => handleAcceptJob(bk.id)}
                        className="px-6 py-2.5 rounded-xl bg-[#2C1810] hover:bg-[#3E2317] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 transform hover:scale-105"
                      >
                        <span>Accept Dispatch & Start Route</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TiltCard>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Health Insurance, Trade Certifications & Mutual Aid */}
        <div className="lg:col-span-4 space-y-6">
          {/* Health & Accident Insurance Digital Card */}
          <TiltCard maxTilt={8} className="bg-gradient-to-br from-[#2C1810] via-[#1E110A] to-[#0C3B2E] rounded-3xl p-6 text-white shadow-xl space-y-4 border border-amber-900/50">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4A373]" />
                <span className="font-bold text-xs uppercase tracking-wider">Ayushman Co-op Shield</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-400/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-stone-300 text-[11px]">Provider: {welfare.insurance_provider}</p>
              <p className="font-mono font-black text-base text-[#D4A373]">{welfare.policy_number}</p>
              <p className="text-[11px] text-stone-300">
                Coverage: <strong>₹{welfare.coverage_amount.toLocaleString()}</strong> (Hospitalization & Accidental)
              </p>
              <p className="text-[11px] text-stone-400">Renewal: {welfare.expiry_date}</p>
            </div>

            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4 text-[#D4A373]" />
              <span>Claim Emergency Mutual Aid</span>
            </button>
          </TiltCard>

          {/* Trade Certifications Vault */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D4A373]" />
                <span>Trade Certifications ({workerCerts.length})</span>
              </h4>
              <button
                onClick={() => setIsUploadCertOpen(true)}
                className="text-xs font-bold text-[#2C1810] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add License</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {workerCerts.map((cert) => (
                <div key={cert.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-stone-800 text-xs">{cert.certificate_name}</p>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">{cert.issuing_body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* UPLOAD CERTIFICATION MODAL */}
      {isUploadCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="font-extrabold text-base text-stone-900 font-['Outfit']">
              Upload Trade Skill Certificate
            </h3>
            <form onSubmit={handleUploadCertSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Certificate / Qualification Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ITI Class-A Wireman License, NSDC Level-4..."
                  value={newCertName}
                  onChange={(e) => setNewCertName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#2C1810] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Issuing Body / Authority</label>
                <input
                  type="text"
                  required
                  value={newIssuingBody}
                  onChange={(e) => setNewIssuingBody(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#2C1810] focus:outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center space-y-1">
                <FileText className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-semibold text-stone-700">Drag & Drop PDF or Image Document</p>
                <p className="text-[10px] text-stone-400">Stored securely in Supabase Storage</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadCertOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2C1810] hover:bg-[#3E2317] text-white text-xs font-bold shadow-md"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WELFARE EMERGENCY CLAIM MODAL */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="font-extrabold text-base text-stone-900 font-['Outfit']">
              Claim Cooperative Emergency Mutual Aid
            </h3>
            {claimSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-stone-800">Claim Forwarded to Society Committee</h4>
                <p className="text-xs text-stone-500">Immediate disbursal review initiated.</p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Required Amount (₹)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#2C1810] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Reason / Medical Need</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tool replacement, hospitalization aid, or family emergency..."
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#2C1810] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsClaimModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#2C1810] hover:bg-[#3E2317] text-white text-xs font-bold shadow-md"
                  >
                    Submit Assistance Claim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* GRIEVANCE MODAL */}
      <GrievanceModal isOpen={isGrievanceOpen} onClose={() => setIsGrievanceOpen(false)} />
    </div>
  );
};
