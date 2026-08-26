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
  Search,
  Filter,
  PhoneCall,
  MapPin,
  Calendar,
  Receipt,
  UserCheck,
  ChevronRight,
  Eye,
  Check,
  X,
  HeartHandshake,
  Activity,
  Award,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AiDemandForecast } from './AiDemandForecast';
import { Worker, Booking, BookingStatus } from '../../lib/database.types';
import { TiltCard } from '../3d/TiltCard';
import { supabase } from '../../lib/supabase';
import { SEED_USERS } from '../../lib/seedData';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  member_type: string;
  total_bookings: number;
  total_spend: number;
  joined_date: string;
  avatar_url?: string;
  status: 'active' | 'suspended';
}

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
    openInvoiceModal,
    refreshData,
  } = useMarketplace();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'artisans' | 'customers' | 'bookings' | 'grievances' | 'welfare' | 'ai_forecast'
  >('artisans');

  // Search & Filter States
  const [artisanSearch, setArtisanSearch] = useState('');
  const [artisanDutyFilter, setArtisanDutyFilter] = useState<'all' | 'online' | 'busy' | 'offline'>('all');
  const [artisanKycFilter, setArtisanKycFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const [customerSearch, setCustomerSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

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

  // Compile Comprehensive Customer Base
  const customerBase: CustomerRecord[] = [
    {
      id: 'cust-1',
      name: 'Saumyadeep Sutradhar',
      email: 'saumyadeep.sutradhar@example.com',
      contact: '+91 98201 45678',
      address: 'Flat 402, Sea Crest Apartments, Bandra West',
      city: 'Mumbai',
      member_type: 'Solidarity Circle Member',
      total_bookings: 6,
      total_spend: 3450,
      joined_date: '2026-01-10',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    {
      id: 'cust-2',
      name: 'Pooja Bhattacharya',
      email: 'pooja.b@example.com',
      contact: '+91 98331 99012',
      address: '12-B, Green Meadows, Dadar Central',
      city: 'Mumbai',
      member_type: 'Resident Member',
      total_bookings: 4,
      total_spend: 2180,
      joined_date: '2026-01-15',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    {
      id: 'cust-3',
      name: 'Dr. Ananya Sen',
      email: 'ananya.sen@example.com',
      contact: '+91 98711 23456',
      address: 'B-704, Royal Palms, Goregaon East',
      city: 'Mumbai',
      member_type: 'Institutional Co-op Buyer',
      total_bookings: 9,
      total_spend: 6850,
      joined_date: '2026-01-02',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    {
      id: 'cust-4',
      name: 'Karan Mehra',
      email: 'karan.mehra@example.com',
      contact: '+91 98110 55432',
      address: 'Plot 88, Vasant Vihar, Thane West',
      city: 'Mumbai',
      member_type: 'Resident Member',
      total_bookings: 3,
      total_spend: 1650,
      joined_date: '2026-01-20',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    {
      id: 'cust-5',
      name: 'Sunita Narang',
      email: 'sunita.narang@example.com',
      contact: '+91 97188 66789',
      address: 'Flat 501, Silver Arch, Khar West',
      city: 'Mumbai',
      member_type: 'Solidarity Circle Member',
      total_bookings: 5,
      total_spend: 2900,
      joined_date: '2026-01-18',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
  ];

  // Financial Calculations
  const totalWagesDistributed = bookings.reduce(
    (acc, b) => acc + (b.price_breakdown?.worker_wage || 450),
    0
  );

  const openGrievances = grievances.filter((g) => g.status !== 'resolved');

  // Filtered Artisans
  const filteredWorkers = localWorkers.filter((w) => {
    const matchesSearch =
      w.full_name.toLowerCase().includes(artisanSearch.toLowerCase()) ||
      w.skills.some((s) => s.toLowerCase().includes(artisanSearch.toLowerCase())) ||
      (w.cooperative_name || '').toLowerCase().includes(artisanSearch.toLowerCase());

    const matchesDuty =
      artisanDutyFilter === 'all' || w.availability === artisanDutyFilter;

    const matchesKyc =
      artisanKycFilter === 'all' ||
      (artisanKycFilter === 'verified' && w.kyc_verified) ||
      (artisanKycFilter === 'pending' && !w.kyc_verified);

    return matchesSearch && matchesDuty && matchesKyc;
  });

  // Filtered Customers
  const filteredCustomers = customerBase.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.contact.includes(customerSearch) ||
      c.address.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.booking_code.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      (b.worker_name || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.service_task.toLowerCase().includes(bookingSearch.toLowerCase());

    const matchesStatus =
      bookingStatusFilter === 'all' || b.status === bookingStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleResolveGrievance = (grievanceId: string) => {
    if (!resolutionNote.trim()) return;
    resolveGrievance(grievanceId, resolutionNote);
    setSelectedGrievanceId(null);
    setResolutionNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. MASTER GOVERNANCE COMMAND BANNER */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0D9488] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-teal-800/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-200 flex items-center justify-center text-[#0F172A] font-black text-3xl shadow-xl border border-white/20 flex-shrink-0">
            🏛️
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit']">{currentCoop.name}</h1>
              <span className="text-[10px] bg-teal-400/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold border border-teal-400/30 uppercase tracking-wider">
                Federation Command HQ
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Registration No: <strong className="font-mono text-teal-300">{currentCoop.registration_id}</strong> • Region: {currentCoop.region}
            </p>
            <p className="text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Super Administrator: {currentUser.email}</span>
            </p>
          </div>
        </div>

        {/* Top Summary Stat Pills */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="bg-[#0A0F1D]/80 px-4 py-2.5 rounded-2xl border border-teal-700/60 shadow-inner text-right">
            <span className="text-[10px] text-teal-400 block font-bold uppercase tracking-wider">
              Welfare Pool Reserve
            </span>
            <span className="text-lg sm:text-xl font-black text-white font-mono">
              ₹{(currentCoop.welfare_fund_pool / 100000).toFixed(1)} Lakh
            </span>
          </div>

          <div className="bg-[#0A0F1D]/80 px-4 py-2.5 rounded-2xl border border-teal-700/60 shadow-inner text-right">
            <span className="text-[10px] text-emerald-400 block font-bold uppercase tracking-wider">
              Total Wages Disbursed
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
              ₹{totalWagesDistributed.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ENTERPRISE KPI AUDIT SUMMARY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Artisans</span>
            <Users className="w-4 h-4 text-[#0C3B2E]" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-['Outfit']">{localWorkers.length}</p>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            {localWorkers.filter((w) => w.availability === 'online').length} On Duty Now
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Customer Base</span>
            <Building className="w-4 h-4 text-teal-700" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-['Outfit']">{customerBase.length}</p>
          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full inline-block">
            100% Verified Households
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Bookings</span>
            <Receipt className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-['Outfit']">{bookings.length}</p>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
            Every Entry Tracked
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">KYC Audits</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-['Outfit']">
            {localWorkers.filter((w) => w.kyc_verified).length} / {localWorkers.length}
          </p>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            Police & NSDC Approved
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Grievances</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-['Outfit']">{openGrievances.length}</p>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
            Under Arbitration
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Platform Take</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-['Outfit']">0%</p>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            Cooperative Model
          </span>
        </div>
      </div>

      {/* 3. CONSOLIDATED MASTER NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('artisans')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'artisans'
              ? 'bg-[#0F172A] text-teal-300 shadow-md border border-teal-500/40'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4 text-teal-400" />
          <span>Artisans & Worker Registry ({localWorkers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('customers')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'customers'
              ? 'bg-[#0F172A] text-teal-300 shadow-md border border-teal-500/40'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Building className="w-4 h-4 text-cyan-400" />
          <span>Full Customer Base ({customerBase.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('bookings')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'bookings'
              ? 'bg-[#0F172A] text-teal-300 shadow-md border border-teal-500/40'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-400" />
          <span>Master Bookings Ledger ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('grievances')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'grievances'
              ? 'bg-[#0F172A] text-teal-300 shadow-md border border-teal-500/40'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Grievance Arbitration ({openGrievances.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('welfare')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'welfare'
              ? 'bg-[#0F172A] text-teal-300 shadow-md border border-teal-500/40'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-rose-400" />
          <span>Welfare & Ayushman Fund</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('ai_forecast')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'ai_forecast'
              ? 'bg-[#0F172A] text-teal-300 shadow-md border border-teal-500/40'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-purple-400" />
          <span>AI Demand Forecasting</span>
        </button>
      </div>

      {/* 4. TAB 1: ARTISANS & WORKER REGISTRY */}
      {activeAdminTab === 'artisans' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={artisanSearch}
                onChange={(e) => setArtisanSearch(e.target.value)}
                placeholder="Search artisans by name, trade skill, or cooperative guild..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={artisanDutyFilter}
                onChange={(e) => setArtisanDutyFilter(e.target.value as any)}
                className="px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 font-semibold focus:outline-none"
              >
                <option value="all">All Duty Statuses</option>
                <option value="online">🟢 Online (Radar Live)</option>
                <option value="busy">🟡 In Job (Busy)</option>
                <option value="offline">⚪ Offline</option>
              </select>

              <select
                value={artisanKycFilter}
                onChange={(e) => setArtisanKycFilter(e.target.value as any)}
                className="px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 font-semibold focus:outline-none"
              >
                <option value="all">All Verification</option>
                <option value="verified">KYC Verified ✓</option>
                <option value="pending">Pending KYC Review</option>
              </select>
            </div>
          </div>

          {/* Table of Artisans */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F172A] text-stone-300 font-bold border-b border-stone-800">
                  <tr>
                    <th className="p-4">Artisan & Cooperative Guild</th>
                    <th className="p-4">Primary Trade Skills</th>
                    <th className="p-4">Realtime Duty</th>
                    <th className="p-4">Floor Wage Rate</th>
                    <th className="p-4">Track Record</th>
                    <th className="p-4">KYC & Police Status</th>
                    <th className="p-4 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredWorkers.map((w) => (
                    <tr key={w.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={w.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80'}
                            alt={w.full_name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                          />
                          <div>
                            <p className="font-extrabold text-stone-900 text-sm">{w.full_name}</p>
                            <p className="text-[11px] text-stone-500">
                              {w.cooperative_name || 'Mumbai Shramik Sahakari Sanstha'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {w.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            w.availability === 'online'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : w.availability === 'busy'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              w.availability === 'online'
                                ? 'bg-emerald-500 animate-ping'
                                : w.availability === 'busy'
                                ? 'bg-amber-500'
                                : 'bg-stone-400'
                            }`}
                          />
                          <span className="capitalize">{w.availability}</span>
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-stone-800">
                        ₹{w.hourly_rate}/hr
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-stone-900 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{w.rating}</span>
                            <span className="text-stone-400 font-normal text-[10px]">
                              ({w.total_ratings_count || 120})
                            </span>
                          </span>
                          <p className="text-[10px] text-stone-500">{w.total_jobs_completed} jobs done</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            w.kyc_verified
                              ? 'bg-teal-50 text-teal-800 border border-teal-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {w.kyc_verified ? <CheckCircle2 className="w-3 h-3 text-teal-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          <span>{w.kyc_verified ? 'Verified ✓' : 'Pending Audit'}</span>
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => verifyWorkerKyc(w.id, !w.kyc_verified)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                            w.kyc_verified
                              ? 'bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200'
                              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                          }`}
                        >
                          {w.kyc_verified ? 'Revoke KYC' : 'Approve KYC ✓'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 2: FULL CUSTOMER BASE & HOUSEHOLD REGISTRY */}
      {activeAdminTab === 'customers' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search customer base by name, email, contact, or neighborhood..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              />
            </div>
            <span className="text-xs text-stone-500 font-bold">
              Showing {filteredCustomers.length} Verified Households
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F172A] text-stone-300 font-bold border-b border-stone-800">
                  <tr>
                    <th className="p-4">Customer / Household</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Registered Address</th>
                    <th className="p-4">Membership Category</th>
                    <th className="p-4">Total Services</th>
                    <th className="p-4">Wages Paid to Artisans</th>
                    <th className="p-4">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                            alt={c.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                          />
                          <div>
                            <p className="font-extrabold text-stone-900 text-sm">{c.name}</p>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                              Active Household
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="font-mono text-stone-800 font-bold">{c.contact}</p>
                          <p className="text-stone-500 text-[11px]">{c.email}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-start gap-1 text-stone-700">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                          <span>{c.address}, {c.city}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                          {c.member_type}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-stone-800">
                        {c.total_bookings} Bookings
                      </td>

                      <td className="p-4 font-mono font-extrabold text-emerald-700">
                        ₹{c.total_spend.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 font-mono text-stone-500">
                        {c.joined_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 3: MASTER BOOKINGS LEDGER (EVERY ENTRY) */}
      {activeAdminTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search booking ledger by code (SHY-...), customer, artisan, or task..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 font-semibold focus:outline-none"
              >
                <option value="all">All Booking Statuses</option>
                <option value="requested">Requested</option>
                <option value="confirmed">Confirmed</option>
                <option value="en_route">En Route</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed ✓</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F172A] text-stone-300 font-bold border-b border-stone-800">
                  <tr>
                    <th className="p-4">Booking Code</th>
                    <th className="p-4">Customer Household</th>
                    <th className="p-4">Assigned Artisan</th>
                    <th className="p-4">Trade & Task</th>
                    <th className="p-4">Schedule Date & Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Floor Wage Breakdown</th>
                    <th className="p-4 text-right">Invoice Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-stone-900">
                        {b.booking_code}
                      </td>

                      <td className="p-4">
                        <div>
                          <p className="font-bold text-stone-900">{b.customer_name}</p>
                          <p className="text-[11px] text-stone-500 font-mono">{b.customer_contact}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        {b.worker_name ? (
                          <div>
                            <p className="font-bold text-stone-900">{b.worker_name}</p>
                            <p className="text-[11px] text-stone-500 font-mono">{b.worker_contact}</p>
                          </div>
                        ) : (
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                            AI Auto-Dispatching...
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-stone-900">{b.service_task}</p>
                        <p className="text-[11px] text-stone-500">{b.service_category_name}</p>
                      </td>

                      <td className="p-4 font-mono text-stone-700">
                        {b.scheduled_time}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : b.status === 'en_route'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 font-mono">
                        <p className="font-black text-stone-900">₹{b.price_breakdown?.total_amount || 520}</p>
                        <p className="text-[10px] text-emerald-700">
                          Wage: ₹{b.price_breakdown?.worker_wage || 450} (88%)
                        </p>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => openInvoiceModal(b)}
                          className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-stone-500" />
                          <span>Inspect Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 4: GRIEVANCES */}
      {activeAdminTab === 'grievances' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {grievances.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-400">{g.ticket_number}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        g.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {g.status}
                    </span>
                    <span className="text-xs text-stone-500 font-bold bg-stone-100 px-2 py-0.5 rounded">
                      {g.category.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-stone-400">{g.created_at.split('T')[0]}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-stone-900 text-base">
                    Filed by: {g.filed_by_name} ({g.filed_by_role})
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">{g.description}</p>
                </div>

                {g.resolution_notes && (
                  <div className="bg-emerald-50 p-3.5 rounded-xl text-xs text-emerald-900 border border-emerald-200">
                    <strong className="block font-bold mb-0.5">Arbitration Resolution Note:</strong>
                    {g.resolution_notes}
                  </div>
                )}

                {g.status !== 'resolved' && (
                  <div className="pt-2">
                    {selectedGrievanceId === g.id ? (
                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        <textarea
                          rows={3}
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          placeholder="Provide binding arbitration note and refund/support resolution..."
                          className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setSelectedGrievanceId(null)}
                            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleResolveGrievance(g.id)}
                            className="px-4 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md hover:bg-teal-700"
                          >
                            Execute Settlement
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedGrievanceId(g.id)}
                        className="px-4 py-2 rounded-xl bg-[#0F172A] text-teal-300 text-xs font-bold hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Arbitrate Ticket</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TAB 5: WELFARE FUND & AYUSHMAN POOL */}
      {activeAdminTab === 'welfare' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-teal-900 to-emerald-950 text-white p-6 rounded-3xl shadow-xl space-y-2">
              <span className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                Total Fund Corpus
              </span>
              <p className="text-3xl font-black font-mono">₹28,50,000</p>
              <p className="text-[11px] text-stone-300">Audited under MSCS Act Section 63</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-2">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                7% Job Contributions Today
              </span>
              <p className="text-3xl font-black text-stone-900 font-mono">₹4,280</p>
              <p className="text-[11px] text-emerald-700 font-semibold">100% automated co-op deduction</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-2">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                Active Ayushman Claims
              </span>
              <p className="text-3xl font-black text-stone-900 font-mono">4 Pending</p>
              <p className="text-[11px] text-stone-500">Emergency medical & tool insurance</p>
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB 6: AI DEMAND FORECASTING */}
      {activeAdminTab === 'ai_forecast' && (
        <div className="space-y-4">
          <AiDemandForecast />
        </div>
      )}
    </div>
  );
};
