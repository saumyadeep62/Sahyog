import React from 'react';
import {
  Shield,
  Zap,
  CheckCircle2,
  Award,
  ArrowRight,
  Sparkles,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  HeartHandshake,
  Users,
  ShieldCheck,
  Scale,
  Headphones,
  PhoneCall,
  MessageSquare,
  Mail,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ServiceCategory } from '../../lib/database.types';
import { CooperativeGlobe3D } from '../3d/CooperativeGlobe3D';
import { CooperativeBadge3D } from '../3d/CooperativeBadge3D';
import { TiltCard } from '../3d/TiltCard';
import { AnimatedMarquee3D } from '../3d/AnimatedMarquee3D';

interface LandingPageProps {
  onSelectCategory: (cat: ServiceCategory) => void;
  onExploreServices: () => void;
  onNavigateCare?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectCategory, onExploreServices, onNavigateCare }) => {
  const { t, language } = useLanguage();
  const { categories, workers, openWorkerModal, openEmergencyModal, openBookingFlow } = useMarketplace();
  const [monthlyGrossIncome, setMonthlyGrossIncome] = React.useState<number>(40000);

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION WITH 3D COOPERATIVE GLOBE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0C3B2E] via-[#144537] to-[#0C3B2E] text-white pt-8 sm:pt-16 pb-14 sm:pb-24">
        {/* Ambient 3D Glowing Orbs */}
        <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-[#D4A373]/15 blur-3xl pointer-events-none animate-float"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none animate-float-reverse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#1D5C4B]/80 backdrop-blur-md border border-[#297762] text-[11px] sm:text-xs font-semibold text-[#D4A373] shadow-lg animate-pulse">
                <Shield className="w-3.5 h-3.5 text-[#D4A373] flex-shrink-0" />
                <span>{t('hero_badge', 'Democratically Owned by Labour Cooperative Federations')}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] leading-tight">
                {t('hero_headline', 'Skilled Labour Services, Owned by Artisans Themselves.')}
              </h1>

              <p className="text-xs sm:text-base text-stone-200/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t(
                  'hero_subtext',
                  'No 30% private aggregator cuts. 100% of fair floor wages go directly to certified electricians, plumbers, carpenters, caregivers, and technicians with collective accident insurance and mutual aid funds.'
                )}
              </p>

              {/* Action Buttons with Modern 3D Micro-interactions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
                <button
                  onClick={onExploreServices}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#D4A373] via-[#E0A96D] to-[#c68b59] hover:from-[#c68b59] hover:to-[#d4a373] text-[#0C3B2E] font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>{t('btn_book_artisan', 'Book Verified Artisan')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={openEmergencyModal}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs sm:text-sm border border-red-400/40 shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{t('btn_urgent_sos', 'Emergency SOS Dispatch')}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[11px] sm:text-xs text-stone-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                  <span>{t('trust_nsdc', 'NSDC / ITI Certified')}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                  <span>{t('trust_police', 'Police Verified')}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                  <span>{t('trust_ayushman', 'Ayushman Health Shield')}</span>
                </div>
              </div>
            </div>

            {/* Right: 3D INTERACTIVE THREE.JS GLOBE */}
            <div className="lg:col-span-6 flex justify-center">
              <TiltCard maxTilt={8} scale={1.01} className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-2xl">
                <CooperativeGlobe3D />
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE 3D ANIMATED MARQUEE */}
      <AnimatedMarquee3D />

      {/* 3. 3D TILT IMPACT METRICS COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          <TiltCard maxTilt={12} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-3.5 sm:p-6 space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">
                {t('stats_verified_artisans', 'Artisans')}
              </span>
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">14,280+</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold truncate">{t('stats_sub_artisans', '100% KYC Certified')}</p>
          </TiltCard>

          <TiltCard maxTilt={12} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-3.5 sm:p-6 space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">
                {t('stats_fair_wages', 'Fair Wages')}
              </span>
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">₹3.82 Cr</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold truncate">{t('stats_sub_wages', '0% Aggregator Cuts')}</p>
          </TiltCard>

          <TiltCard maxTilt={12} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-3.5 sm:p-6 space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">
                {t('stats_welfare_pool', 'Welfare Pool')}
              </span>
              <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <p className="text-xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">₹68.5 L</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold truncate">{t('stats_sub_welfare', 'Accident Shield')}</p>
          </TiltCard>

          <TiltCard maxTilt={12} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-3.5 sm:p-6 space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">
                {t('stats_cooperatives', 'Societies')}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4A373]" />
            </div>
            <p className="text-xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">42 Co-ops</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold truncate">{t('stats_sub_coop', 'Multi-State')}</p>
          </TiltCard>
        </div>
      </section>

      {/* 4. WHY COOPERATIVE OWNERSHIP MATTERS (INTERACTIVE EARNING COMPARISON) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            {t('why_badge', 'Ethical Paradigm Shift')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">
            {t('why_title', 'Why Cooperative Ownership Changes Everything')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t('why_subtext', 'Private tech aggregators charge up to 35% commission on every booking. SAHYOG charges a flat minimal ₹1,000/month solidarity subscription for UNLIMITED 0% commission earnings.')}
          </p>
        </div>

        {/* Interactive Earning Comparison Slider */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900 font-['Outfit'] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#0C3B2E]" />
                <span>Simulate Monthly Artisan Earnings</span>
              </h3>
              <p className="text-xs text-stone-500">
                Adjust monthly customer bookings to see exact net take-home and platform deductions.
              </p>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 flex items-center gap-2">
              <span className="text-xs text-stone-500 font-semibold">Monthly Bookings:</span>
              <span className="text-lg sm:text-xl font-black text-[#0C3B2E] font-mono">
                ₹{monthlyGrossIncome.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="15000"
              max="100000"
              step="5000"
              value={monthlyGrossIncome}
              onChange={(e) => setMonthlyGrossIncome(Number(e.target.value))}
              className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0C3B2E]"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-semibold">
              <span>₹15,000 (Part-time)</span>
              <span>₹40,000 (Average)</span>
              <span>₹70,000 (Pro Guild)</span>
              <span>₹1,00,000+ (Master Artisan)</span>
            </div>
          </div>

          {/* Side by Side Mathematical Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Corporate Gig Platform Column */}
            <div className="bg-rose-50/70 rounded-2xl p-5 sm:p-6 border border-rose-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-rose-950">Corporate Gig Platform</h4>
                    <p className="text-[11px] text-rose-700">Urban Company / Private Aggregators</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-200 text-rose-900 text-[11px] font-black">
                    25-35% Commission
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-rose-950 bg-white/80 p-3 rounded-xl border border-rose-100">
                  <div className="flex justify-between">
                    <span>Gross Customer Bookings:</span>
                    <span className="font-mono font-bold">₹{monthlyGrossIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>30% Platform Cut:</span>
                    <span className="font-mono">-₹{Math.round(monthlyGrossIncome * 0.3).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Lead Fees & Equipment Deductions:</span>
                    <span className="font-mono">-₹1,200</span>
                  </div>
                  <div className="pt-2 border-t border-rose-100 flex justify-between font-black text-sm text-rose-950">
                    <span>Artisan Net Take-Home:</span>
                    <span className="font-mono text-base text-rose-700">
                      ₹{(monthlyGrossIncome - Math.round(monthlyGrossIncome * 0.3) - 1200).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-rose-900">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>Zero accident or health insurance included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>Arbitrary account bans with 0 human appeal rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>0% ownership & no profit dividend sharing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* SAHYOG Democratic Model Column */}
            <div className="bg-emerald-50/90 rounded-2xl p-5 sm:p-6 border-2 border-[#0C3B2E] shadow-xl space-y-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-[#0C3B2E] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                0% Commission • Unlimited
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-[#0C3B2E]">SAHYOG Cooperative</h4>
                    <p className="text-[11px] text-emerald-800 font-medium">Worker-Owned Solidarity Model</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-950 text-[11px] font-black">
                    Flat ₹1,000/mo
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-emerald-950 bg-white/90 p-3 rounded-xl border border-emerald-100">
                  <div className="flex justify-between">
                    <span>Gross Customer Bookings:</span>
                    <span className="font-mono font-bold">₹{monthlyGrossIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Platform Commission (0%):</span>
                    <span className="font-mono text-emerald-600">₹0 (Zero Cut)</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Solidarity & Welfare Subscription:</span>
                    <span className="font-mono font-bold text-stone-800">-₹1,000/mo</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-100 flex justify-between font-black text-sm text-[#0C3B2E]">
                    <span>Artisan Net Take-Home:</span>
                    <span className="font-mono text-base text-emerald-700">
                      ₹{(monthlyGrossIncome - 1000).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-emerald-950">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span><strong>₹5 Lakh Accidental Cover</strong> + Ayushman Shield funded by the ₹1,000 dues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span><strong>100% Unlimited Jobs:</strong> Keep every single rupee from all customer visits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span><strong>Cooperative Shareholding:</strong> Annual surplus dividend returned to artisans</span>
                  </li>
                </ul>
              </div>

              {/* Extra Savings Callout Banner */}
              <div className="bg-gradient-to-r from-[#0C3B2E] to-[#144537] text-white p-3 rounded-xl flex items-center justify-between shadow-md">
                <span className="text-xs font-bold text-amber-300">Extra Income in Artisan's Pocket:</span>
                <span className="font-mono font-black text-sm sm:text-base text-white">
                  +₹{((monthlyGrossIncome - 1000) - (monthlyGrossIncome - Math.round(monthlyGrossIncome * 0.3) - 1200)).toLocaleString('en-IN')}/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 10 CERTIFIED TRADES WITH 3D TILT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#1D5C4B] text-[#D4A373] text-xs font-bold uppercase tracking-wider">
              {t('trades_badge', '10 Certified Trades')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit'] mt-2">
              {t('trades_title', 'Browse Cooperative Trades & Skills')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {t('trades_sub', 'Select a trade to inspect verified artisans, transparent rate cards, and schedule visits.')}
            </p>
          </div>

          <button
            onClick={onExploreServices}
            className="self-start md:self-auto px-4 py-2 rounded-xl border border-[#0C3B2E] text-[#0C3B2E] hover:bg-[#0C3B2E] hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>{t('btn_view_all_trades', 'View All Trades')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid with 3D Tilt Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-6">
          {categories.map((cat) => (
            <TiltCard
              key={cat.id}
              maxTilt={12}
              onClick={() => onSelectCategory(cat)}
              className="group bg-white rounded-2xl border border-stone-200 hover:border-[#0C3B2E] shadow-xs hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-24 sm:h-36 overflow-hidden">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                  <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2 flex items-center justify-between text-white text-[10px] sm:text-xs">
                    <span className="font-bold drop-shadow truncate">
                      {language === 'or'
                        ? (cat.slug === 'electricians' ? 'ଇଲେକ୍ଟ୍ରିସିଆନ' : cat.slug === 'plumbers' ? 'ପ୍ଲମ୍ବର' : cat.slug === 'carpenters' ? 'ବଢ଼େଇ' : cat.slug === 'painters' ? 'ପେଣ୍ଟର' : cat.slug === 'domestic-helpers' ? 'ଘରୋଇ ସହାୟକ' : cat.slug === 'caregivers' ? 'ସେବାକାରୀ' : cat.slug === 'drivers' ? 'ଚାଳକ' : cat.slug === 'gardeners' ? 'ମାଳୀ' : cat.slug === 'cleaners' ? 'ସଫେଇ କର୍ମୀ' : 'ଟେକ୍ନିସିଆନ')
                        : cat.name_hi || cat.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] bg-black/50 px-1.5 py-0.2 rounded backdrop-blur-xs font-mono">
                      {cat.base_price_range}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2">
                  <h3 className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-[#0C3B2E] transition-colors truncate">
                    {language === 'or'
                      ? (cat.slug === 'electricians' ? 'ଇଲେକ୍ଟ୍ରିସିଆନ ଓ ତାର ଯୋଡ଼ା' : cat.slug === 'plumbers' ? 'ପ୍ଲମ୍ବର ଓ ପାଇପ୍ ସେବା' : cat.slug === 'carpenters' ? 'ବଢ଼େଇ ଓ କାଠ କାର୍ଯ୍ୟ' : cat.slug === 'painters' ? 'ପେଣ୍ଟର ଓ କାନ୍ଥ ରଙ୍ଗ' : cat.slug === 'domestic-helpers' ? 'ଘରୋଇ ସହାୟକ ଓ ରୋଷେୟା' : cat.slug === 'caregivers' ? 'ବୃଦ୍ଧ ଓ ରୋଗୀ ସେବାକାରୀ' : cat.slug === 'drivers' ? 'ପ୍ରମାଣିତ ଚାଳକ (ଡ୍ରାଇଭର)' : cat.slug === 'gardeners' ? 'ମାଳୀ ଓ ବଗିଚା କାର୍ଯ୍ୟ' : cat.slug === 'cleaners' ? 'ଗଭୀର ସଫେଇ ସେବା' : 'ଉପକରଣ ଓ ଏସି ଟେକ୍ନିସିଆନ')
                      : cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              <div className="p-2.5 sm:p-4 pt-0 border-t border-stone-100 flex items-center justify-between text-[11px] sm:text-xs text-[#0C3B2E] font-bold">
                <span>{t('book_service', 'Book')}</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 6. WORKER SOLIDARITY SPOTLIGHT WITH 3D ROTATING COOPERATIVE BADGE */}
      <section className="bg-[#FAF8F5] py-16 border-y border-[#E5DDD0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            <div className="text-center lg:text-left space-y-2 max-w-2xl">
              <span className="px-3.5 py-1 rounded-full bg-[#D4A373]/20 text-[#5C3D2E] text-xs font-bold uppercase tracking-wider">
                {t('voices_badge', 'Voices of the Guild')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">
                {t('voices_title', 'Dignity of Labour in Practice')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                {t('voices_sub', 'Meet the skilled master artisans who power our homes and institutions every single day.')}
              </p>
            </div>

            {/* 3D Rotating Gold Cooperative Medallion */}
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-amber-200 shadow-lg">
              <CooperativeBadge3D size={120} />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-[#0C3B2E] text-sm block">{t('seal_title', 'Cooperative Seal of Trust')}</span>
                <p className="text-stone-500 text-[11px]">{t('seal_sub', 'Multi-State Act Verified')}</p>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded inline-block">
                  {t('seal_badge', '0% Commission Standard')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workers.slice(0, 3).map((w) => (
              <TiltCard
                key={w.id}
                maxTilt={10}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.avatar_url}
                      alt={w.full_name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4A373]"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{w.full_name}</h4>
                      <p className="text-[11px] text-[#0C3B2E] font-medium">{w.cooperative_name}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{w.rating}</span>
                        <span className="text-stone-400 font-normal">({w.total_jobs_completed} jobs)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 italic leading-relaxed">
                    "{w.bio.slice(0, 140)}..."
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-stone-400 block text-[10px]">{t('floor_rate', 'Floor Rate')}</span>
                    <span className="font-extrabold text-[#0C3B2E]">₹{w.hourly_rate}/hr</span>
                  </div>
                  <button
                    onClick={() => openWorkerModal(w)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#0C3B2E] hover:text-white text-xs font-semibold text-stone-800 transition-colors"
                  >
                    {t('view_credentials', 'View Credentials')}
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 24/7 CUSTOMER CARE & HELPLINE SPOTLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#08281F] via-[#0C3B2E] to-[#144537] rounded-3xl p-6 sm:p-10 border border-[#297762]/60 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#164E3F] text-[#D4A373] text-xs font-bold border border-[#297762]">
                <Headphones className="w-4 h-4 text-[#D4A373]" />
                <span>24/7 Multi-Lingual Customer Support & Grievance Tribunal</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] leading-tight">
                Need Help or Have a Query? We are Always Here.
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                Direct human assistance, zero automated bot walls, under 15-minute emergency SOS dispatch, and democratic 24-hour dispute arbitration under the Multi-State Co-op Societies Act.
              </p>

              {/* Quick Contact Action Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="tel:1800724964"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Toll-Free: 1800-SAHYOG (724-964)</span>
                </a>

                <a
                  href="https://wa.me/919820072496?text=Hello%20Sahyog%20Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-xs font-bold text-emerald-200 flex items-center gap-2 transition-all shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: +91 98200-SAHYOG</span>
                  <ExternalLink className="w-3 h-3 text-stone-300" />
                </a>

                <button
                  onClick={onNavigateCare}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#E0A96D] text-[#0C3B2E] text-xs font-black flex items-center gap-2 hover:opacity-95 transition-opacity shadow-lg"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Open Full Customer Care Desk →</span>
                </button>
              </div>
            </div>

            {/* Right: SLA Highlights Card */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#D4A373]">Emergency Response</span>
                <p className="font-extrabold text-sm text-white">&lt; 15 Mins</p>
                <p className="text-[10px] text-stone-300">Rapid local artisan radar</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-300">Billing & Refunds</span>
                <p className="font-extrabold text-sm text-white">&lt; 2 Hours</p>
                <p className="text-[10px] text-stone-300">100% 0% fee refund window</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300">Tribunal Arbitration</span>
                <p className="font-extrabold text-sm text-white">&lt; 24 Hours</p>
                <p className="text-[10px] text-stone-300">Democratic grievance hearing</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-300">Multi-Lingual Care</span>
                <p className="font-extrabold text-sm text-white">7 Languages</p>
                <p className="text-[10px] text-stone-300">Voice & text 3D AI Sahayak</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTITUTIONAL & HOUSEHOLD CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TiltCard maxTilt={4} className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#164E3F] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#D4A373] text-[#0C3B2E] text-xs font-bold uppercase tracking-wider">
              {t('inst_badge', 'Institutional & Society Onboarding')}
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-['Outfit']">
              {t('inst_title', 'Need Contract Maintenance for Societies, Hospitals, or Campuses?')}
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              {t('inst_sub', 'SAHYOG provides enterprise-grade verified workforce pools for facilities management, annual maintenance contracts (AMC), and residential housing societies with 100% statutory compliance.')}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onExploreServices}
                className="px-6 py-3 rounded-xl bg-white text-[#0C3B2E] font-extrabold text-xs sm:text-sm shadow-md hover:bg-stone-100 transition-colors"
              >
                {t('inst_btn_rfp', 'Request Institutional RFP')}
              </button>
              <button
                onClick={() => openBookingFlow()}
                className="px-6 py-3 rounded-xl bg-[#1D5C4B] border border-[#297762] text-white font-bold text-xs sm:text-sm hover:bg-[#297762] transition-colors"
              >
                {t('inst_btn_audit', 'Schedule Facility Audit')}
              </button>
            </div>
          </div>
        </TiltCard>
      </section>
    </div>
  );
};
