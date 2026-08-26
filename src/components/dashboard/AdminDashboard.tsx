import React, { useState, useEffect } from 'react';
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
  Radio,
  Lock,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AiDemandForecast } from './AiDemandForecast';
import { Worker } from '../../lib/database.types';
import { TiltCard } from '../3d/TiltCard';
import { supabase } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
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
    refreshData,
  } = useMarketplace();

  const [activeAdminTab, setActiveAdminTab] = useState<'roster' | 'grievances' | 'ai_forecast' | 'metrics'>('roster');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [localWorkers, setLocalWorkers] = useState<Worker[]>(workers);

  // 1. Strict Security Guard: Only admin@gmail.com is authorized
  if (!currentUser || currentUser.email !== 'admin@gmail.com') {
    return (
      <div className="max-w-3xl mx-auto my-16 p-8 bg-white rounded-3xl border border-red-200 shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">Restricted Admin Access</h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          This governance dashboard is strictly restricted to authenticated administrators (<strong>admin@gmail.com</strong>).
        </p>
        <p className="text-xs text-stone-400">
          Current session: {currentUser?.email || 'Logged Out'}
        </p>
      </div>
    );
  }

  // Sync workers state
  useEffect(() => {
    setLocalWorkers(workers);
  }, [workers]);

  // 2. Realtime Listener on Supabase workers table
  useEffect(() => {
    const channel = supabase
      .channel('admin-realtime-workers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workers' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setLocalWorkers((prev) =>
              prev.map((w) => (w.id === payload.new.id ? { ...w, ...payload.new } : w))
            );
          } else if (payload.eventType === 'INSERT' && payload.new) {
            refreshData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshData]);

  const currentCoop = cooperatives[0] || {
    name: 'National Federation of Multi-State Worker Cooperatives',
    registration_id: 'MSCS/ND/2026/8849',
    region: 'National Tier 1',
    total_members: 14280,
    welfare_fund_pool: 2850000,
  };

  const openGrievances = grievances.filter((g) => g.status !== 'resolved');

  const handleResolveGrievance = (grievanceId: string) => {
    if (!resolutionNote.trim()) return;
    resolveGrievance(grievanceId, resolutionNote);
    setSelectedGrievanceId(null);
    setResolutionNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. ADMIN COMMAND BANNER */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0D9488] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-200 flex items-center justify-center text-[#0F172A] font-black text-3xl shadow-xl border border-white/20">
            🏛️
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit']">{currentCoop.name}</h1>
              <span className="text-[10px] bg-teal-400/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold border border-teal-400/30 uppercase tracking-wider">
                Consolidated Governance HQ
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Registration No: <strong className="font-mono text-teal-300">{currentCoop.registration_id}</strong> • Region: {currentCoop.region}
            </p>
            <p className="text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Authorized Admin: {currentUser.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-[#0A0F1D]/80 px-4 py-2.5 rounded-2xl border border-teal-700/60 shadow-inner text-right">
            <span className="text-[10px] text-teal-400 block font-bold uppercase tracking-wider">
              Cooperative Welfare Pool
            </span>
            <span className="text-xl font-black text-white font-mono">
              ₹{(currentCoop.welfare_fund_pool / 100000).toFixed(1)} Lakh
            </span>
          </div>
        </div>
      </div>

      {/* 2. ADMIN STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Registered Artisans</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] font-['Outfit']">
            {localWorkers.length}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <Radio className="w-3 h-3 text-emerald-500 animate-ping" />
            <span>{localWorkers.filter((w) => w.availability === 'online').length} Currently On Duty</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Jobs Logged</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] font-['Outfit']">
            {bookings.length}
          </p>
          <span className="text-[11px] text-stone-500 font-medium">100% Floor Wage Guaranteed</span>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Grievances</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] font-['Outfit']">
            {openGrievances.length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">24h SLA Target</span>
        </TiltCard>

        <TiltCard maxTilt={10} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">AI Surplus / Deficit Alerts</span>
            <BrainCircuit className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] font-['Outfit']">
            2 Zones
          </p>
          <span className="text-[11px] text-purple-600 font-medium">Auto-Balancing Active</span>
        </TiltCard>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="flex border-b border-stone-200 gap-2 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveAdminTab('roster')}
          className={`px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeAdminTab === 'roster'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Live Artisan Roster (Realtime)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('grievances')}
          className={`px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeAdminTab === 'grievances'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Grievance Arbitration ({openGrievances.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('ai_forecast')}
          className={`px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeAdminTab === 'ai_forecast'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>AI Demand Forecasting</span>
        </button>
      </div>

      {/* 4. TAB CONTENT: LIVE ARTISAN ROSTER */}
      {activeAdminTab === 'roster' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg font-['Outfit'] flex items-center gap-2">
                <span>Realtime Artisan Status Roster</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 animate-pulse">
                  Live Supabase Realtime
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Monitors artisan duty availability, ratings, and KYC credentials across all societies.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Artisan Member</th>
                  <th className="py-3.5 px-4 font-bold">Cooperative Society</th>
                  <th className="py-3.5 px-4 font-bold">Availability Status</th>
                  <th className="py-3.5 px-4 font-bold">Rating</th>
                  <th className="py-3.5 px-4 font-bold">Completed Jobs</th>
                  <th className="py-3.5 px-4 font-bold">KYC Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {localWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={w.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80'}
                        alt={w.full_name}
                        className="w-9 h-9 rounded-xl object-cover border border-stone-300"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{w.full_name}</p>
                        <p className="text-[10px] text-stone-400">{w.experience_years} yrs exp • ₹{w.hourly_rate}/h</p>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-stone-700">
                      {w.cooperative_name}
                    </td>

                    <td className="py-3 px-4">
                      {w.availability === 'online' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Online (Free)
                        </span>
                      ) : w.availability === 'busy' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Busy (On Job)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                          Offline
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-800">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{w.rating}</span>
                        <span className="text-stone-400 text-[10px]">({w.total_ratings_count})</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-800">
                      {w.total_jobs_completed}
                    </td>

                    <td className="py-3 px-4">
                      {w.verification_status === 'verified' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending KYC
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {w.verification_status !== 'verified' ? (
                        <button
                          onClick={() => verifyWorkerKyc(w.id, true)}
                          className="px-3 py-1 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-bold shadow"
                        >
                          Approve KYC
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-medium">Compliant</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: GRIEVANCES */}
      {activeAdminTab === 'grievances' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-stone-900 text-lg font-['Outfit']">
              Grievance Arbitration Queue ({openGrievances.length} Open)
            </h3>
          </div>

          {openGrievances.length === 0 ? (
            <div className="p-10 text-center text-xs text-stone-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-stone-800 text-sm">All Grievances Resolved</p>
              <p>Zero pending consumer or artisan disputes currently.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {openGrievances.map((g) => (
                <div key={g.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        {g.category}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm mt-1">{g.description}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">Raised by: {g.filed_by_name}</p>
                    </div>

                    <button
                      onClick={() => setSelectedGrievanceId(g.id)}
                      className="px-4 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold shadow"
                    >
                      Arbitrate & Resolve
                    </button>
                  </div>

                  {selectedGrievanceId === g.id && (
                    <div className="p-4 rounded-xl bg-white border border-teal-200 space-y-3 mt-3">
                      <label className="block text-xs font-bold text-stone-700">Arbitration Resolution Note</label>
                      <textarea
                        rows={2}
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        placeholder="Detail compensation or corrective actions under MSCS bylaws..."
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-teal-700 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedGrievanceId(null)}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleResolveGrievance(g.id)}
                          className="px-4 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold shadow"
                        >
                          Confirm Resolution
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT: AI DEMAND FORECASTING */}
      {activeAdminTab === 'ai_forecast' && (
        <AiDemandForecast />
      )}
    </div>
  );
};
