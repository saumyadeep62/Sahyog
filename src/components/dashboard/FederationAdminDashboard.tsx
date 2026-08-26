import React, { useState } from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BrainCircuit,
  Scale,
  FileCheck,
  AlertTriangle,
  Send,
  Building,
  DollarSign,
  Download,
  CreditCard,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AiDemandForecast } from './AiDemandForecast';
import { Worker } from '../../lib/database.types';
import { TiltCard } from '../3d/TiltCard';

export const FederationAdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const {
    cooperatives,
    workers,
    bookings,
    grievances,
    welfareList,
    verifyWorkerKyc,
    resolveGrievance,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'roster' | 'ai_forecast' | 'grievances' | 'payouts'>('roster');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const currentCoop = cooperatives[0]; // Mumbai Shramik Sahakari Sanstha Maryadit

  const pendingKycWorkers = workers.filter((w) => w.verification_status !== 'verified');
  const verifiedWorkers = workers.filter((w) => w.verification_status === 'verified');
  const openGrievances = grievances.filter((g) => g.status !== 'resolved');

  const handleResolveGrievance = (grievanceId: string) => {
    if (!resolutionNote.trim()) return;
    resolveGrievance(grievanceId, resolutionNote);
    setSelectedGrievanceId(null);
    setResolutionNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. FEDERATION HQ COMMAND BANNER */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0D9488] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-200 flex items-center justify-center text-[#0F172A] font-black text-3xl shadow-xl border border-white/20">
            🏛️
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit']">{currentCoop.name}</h1>
              <span className="text-[10px] bg-teal-400/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold border border-teal-400/30 uppercase tracking-wider">
                Federation Command HQ
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Registration No: <strong className="font-mono text-teal-300">{currentCoop.registration_id}</strong> • Region: {currentCoop.region}
            </p>
            <p className="text-[11px] text-amber-300 font-semibold">
              Presiding Officer: {currentUser.name} ({currentUser.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-[#0A0F1D]/80 px-4 py-2.5 rounded-2xl border border-teal-700/60 shadow-inner text-right">
            <span className="text-[10px] text-teal-400 block font-bold uppercase tracking-wider">Cooperative Welfare Pool</span>
            <span className="text-xl font-black text-white font-mono">
              ₹{(currentCoop.welfare_fund_pool / 100000).toFixed(1)} Lakh
            </span>
          </div>
        </div>
      </div>

      {/* 2. FEDERATION COMMAND METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Registered Artisans</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] font-['Outfit']">
            {currentCoop.total_members.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-teal-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{verifiedWorkers.length} Active in This Regional Guild</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Disbursed Wages (MTD)</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] font-['Outfit']">₹1.42 Cr</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <span>100% Floor Wage Compliance</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">KYC Verification Queue</span>
            <FileCheck className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 font-['Outfit']">
            {pendingKycWorkers.length} Pending
          </p>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold">
            <span>NSDC & Biometric Trade Checks</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Dispute Tribunal</span>
            <Scale className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-3xl font-extrabold text-rose-700 font-['Outfit']">
            {openGrievances.length} Active
          </p>
          <div className="flex items-center gap-1 text-[11px] text-rose-700 font-bold">
            <span>Democratic Redressal (0 Algo Bans)</span>
          </div>
        </TiltCard>
      </div>

      {/* 3. FEDERATION TOOL TABS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-6">
        {/* Tab navigation buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roster'
                ? 'bg-[#0F172A] text-white shadow-md'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Artisan Roster & KYC Desk ({pendingKycWorkers.length} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_forecast')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ai_forecast'
                ? 'bg-[#0F172A] text-white shadow-md'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-teal-400" />
            <span>AI Demand Forecast & Workforce Balancing</span>
          </button>

          <button
            onClick={() => setActiveTab('grievances')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'grievances'
                ? 'bg-[#0F172A] text-white shadow-md'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Scale className="w-4 h-4 text-rose-400" />
            <span>Dispute Tribunal ({openGrievances.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'payouts'
                ? 'bg-[#0F172A] text-white shadow-md'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Bank Disbursal & Welfare Treasury</span>
          </button>
        </div>

        {/* TAB 1: ARTISAN ROSTER & KYC DESK */}
        {activeTab === 'roster' && (
          <div className="space-y-6 animate-in fade-in">
            {pendingKycWorkers.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-3">
                <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Pending Trade Qualifications & KYC Verification</span>
                </h4>
                <div className="divide-y divide-amber-200">
                  {pendingKycWorkers.map((w) => (
                    <div key={w.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={w.avatar_url} alt={w.full_name} className="w-12 h-12 rounded-2xl object-cover" />
                        <div>
                          <p className="font-extrabold text-stone-900 text-sm">{w.full_name}</p>
                          <p className="text-xs text-stone-600">
                            {w.skills.join(', ')} • {w.experience_years} Yrs Exp • Status: <span className="font-bold text-amber-700 uppercase">{w.verification_status}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => verifyWorkerKyc(w.id, true)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          Approve KYC ✓
                        </button>
                        <button
                          onClick={() => verifyWorkerKyc(w.id, false)}
                          className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Active Guild Artisans */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-stone-900 text-sm">Verified Society Artisans ({verifiedWorkers.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verifiedWorkers.map((w) => (
                  <div key={w.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-3">
                      <img src={w.avatar_url} alt={w.full_name} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <p className="font-bold text-stone-900 text-sm">{w.full_name}</p>
                        <p className="text-[11px] text-stone-500">{w.skills.join(', ')}</p>
                        <p className="text-[11px] text-emerald-700 font-bold">Floor Rate: ₹{w.hourly_rate}/hr</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
                      <span>Rating: ★ {w.rating} ({w.total_jobs_completed} jobs)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        KYC Approved
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI DEMAND FORECAST */}
        {activeTab === 'ai_forecast' && (
          <div className="animate-in fade-in">
            <AiDemandForecast />
          </div>
        )}

        {/* TAB 3: DISPUTE TRIBUNAL */}
        {activeTab === 'grievances' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-600">
              <p className="font-bold text-stone-800 text-sm">Cooperative Democratic Dispute Protocol</p>
              <p className="mt-1">
                Every grievance is arbitrated by a tripartite committee comprising 1 Consumer representative, 1 Worker delegate, and 1 Federation Officer. No black-box algorithmic bans or arbitrary wage withholdings.
              </p>
            </div>

            {openGrievances.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No unresolved disputes currently logged in this cooperative jurisdiction.
              </div>
            ) : (
              <div className="space-y-4">
                {openGrievances.map((g) => (
                  <div key={g.id} className="p-5 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-3">
                      <div>
                        <h4 className="font-bold text-rose-950 text-sm">
                          Case #{g.ticket_number || g.id.slice(0, 8)} • Filed by: {g.filed_by_name} ({g.filed_by_role})
                        </h4>
                        <p className="text-xs text-rose-700">Category: {g.category.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <span className="text-xs bg-rose-200 text-rose-900 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
                        Status: {g.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-rose-100">
                      "{g.description}"
                    </p>

                    {selectedGrievanceId === g.id ? (
                      <div className="space-y-2 bg-white p-4 rounded-xl border border-stone-300">
                        <label className="block text-xs font-bold text-stone-800">
                          Mediation Order & Resolution Settlement:
                        </label>
                        <textarea
                          rows={3}
                          placeholder="State cooperative tribunal findings and financial adjustments..."
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedGrievanceId(null)}
                            className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleResolveGrievance(g.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
                          >
                            Sign & Issue Tribunal Resolution
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedGrievanceId(g.id)}
                        className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold shadow-xs"
                      >
                        Arbitrate & Resolve Grievance →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BANK DISBURSAL & TREASURY */}
        {activeTab === 'payouts' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase">Weekly Auto-NEFT Disbursals</span>
                <p className="text-2xl font-extrabold text-emerald-950 font-mono">₹28,45,000</p>
                <p className="text-[11px] text-emerald-700">Next cycle scheduled: Friday 18:00 IST</p>
              </div>
              <div className="p-5 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
                <span className="text-xs font-bold text-teal-900 uppercase">Ayushman Premium Escrow</span>
                <p className="text-2xl font-extrabold text-teal-950 font-mono">₹4,20,000</p>
                <p className="text-[11px] text-teal-700">Covering 420 active guild families</p>
              </div>
              <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                <span className="text-xs font-bold text-purple-900 uppercase">Statutory Audit Status</span>
                <p className="text-2xl font-extrabold text-purple-950 font-mono">100% Compliant</p>
                <p className="text-[11px] text-purple-700">Audited under MSCS Act 2002</p>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-800 text-sm">Download Multi-State Cooperative Statutory Ledger</p>
                <p className="text-xs text-stone-500">Includes all worker floor wage bank credit receipts and TDS filings.</p>
              </div>
              <button
                onClick={() => alert('Cooperative Statutory Audit Ledger generated and ready for download.')}
                className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger (CSV)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
