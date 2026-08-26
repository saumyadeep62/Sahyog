import React, { useState } from 'react';
import {
  LayoutDashboard,
  Shield,
  Building,
  Users,
  CheckCircle2,
  TrendingUp,
  Globe,
  Sliders,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';

export const SuperAdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { cooperatives, workers, forecasts } = useMarketplace();

  const [minFloorRate, setMinFloorRate] = useState('250');
  const [welfarePercent, setWelfarePercent] = useState('7');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const totalMembers = cooperatives.reduce((acc, c) => acc + c.total_members, 0);
  const totalWelfarePool = cooperatives.reduce((acc, c) => acc + c.welfare_fund_pool, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0C3B2E] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#164E3F]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
            🌐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-['Outfit']">National Super Admin Directorate</h1>
              <span className="text-[11px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded font-bold border border-purple-400/30">
                Multi-State Oversight
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Chief Administrator: {currentUser.name} • Ministry & Multi-State Federation Liaison
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Exporting Consolidated National Cooperative Audit Report (PDF)...')}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-2 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>National Audit Report</span>
        </button>
      </div>

      {/* NATIONAL MACRO STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Enrolled Artisan Members
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0C3B2E] font-['Outfit']">
            {totalMembers.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">Across 4 Federations</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            National Welfare Reserves
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0C3B2E] font-['Outfit']">
            ₹{(totalWelfarePool / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">100% Solvency Ratio</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Statutory Compliance
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-['Outfit']">100%</p>
          <p className="text-[11px] text-stone-500">Zero non-compliance flags</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Active Cooperatives
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0C3B2E] font-['Outfit']">
            {cooperatives.length} Societies
          </p>
          <p className="text-[11px] text-stone-500">Western, Northern, Southern</p>
        </div>
      </div>

      {/* FEDERATIONS ROSTER & POLICY CONFIG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Federations List */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider text-xs">
            Affiliated Multi-State Labour Cooperatives
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cooperatives.map((coop) => (
              <div
                key={coop.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {coop.region}
                    </span>
                    <span className="text-[11px] text-stone-400">Est. {coop.established_year}</span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm mt-2">{coop.name}</h4>
                  <p className="text-xs text-stone-500 mt-0.5 font-mono">{coop.registration_id}</p>
                </div>

                <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Members</span>
                    <span className="font-bold text-stone-800">{coop.total_members.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Welfare Pool</span>
                    <span className="font-bold text-[#0C3B2E]">₹{(coop.welfare_fund_pool / 100000).toFixed(1)}L</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* National Policy Thresholds */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0C3B2E]" />
            <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider text-xs">
              National Policy Floor Rules
            </h4>
          </div>

          <form onSubmit={handleSavePolicies} className="space-y-3.5 text-xs">
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Policies updated nationwide.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Statutory Minimum Floor Wage (₹ / hr)
              </label>
              <input
                type="number"
                value={minFloorRate}
                onChange={(e) => setMinFloorRate(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] font-bold"
              />
              <p className="text-[10px] text-stone-500 mt-1">No cooperative artisan can be booked below this rate.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mandatory Worker Welfare Pool (%)
              </label>
              <input
                type="number"
                value={welfarePercent}
                onChange={(e) => setWelfarePercent(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] font-bold"
              />
              <p className="text-[10px] text-stone-500 mt-1">Auto-credited to accident and health shields.</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600">
              <span className="font-bold block text-stone-800">Private Extraction Cap: 0%</span>
              SAHYOG bylaws strictly forbid algorithmic commissions or middleman extraction.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0C3B2E] hover:bg-[#164E3F] text-white font-bold text-xs shadow-md transition-colors"
            >
              Update National Parameters
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
