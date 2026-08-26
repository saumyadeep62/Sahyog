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
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectCategory, onExploreServices }) => {
  const { t, language } = useLanguage();
  const { categories, workers, openWorkerModal, openEmergencyModal, openBookingFlow } = useMarketplace();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION WITH 3D COOPERATIVE GLOBE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0C3B2E] via-[#144537] to-[#0C3B2E] text-white pt-12 sm:pt-20 pb-20 sm:pb-28">
        {/* Ambient 3D Glowing Orbs */}
        <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-[#D4A373]/15 blur-3xl pointer-events-none animate-float"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none animate-float-reverse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D5C4B]/80 backdrop-blur-md border border-[#297762] text-xs font-semibold text-[#D4A373] shadow-lg animate-pulse">
                <Shield className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{t('hero_badge', 'Democratically Owned by Labour Cooperative Federations')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] leading-[1.12]">
                {t('hero_headline', 'Skilled Labour Services, Owned by Artisans Themselves.')}
              </h1>

              <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t(
                  'hero_subtext',
                  'No 30% private aggregator cuts. 100% of fair floor wages go directly to certified electricians, plumbers, carpenters, caregivers, and technicians with collective accident insurance and mutual aid funds.'
                )}
              </p>

              {/* Action Buttons with Modern 3D Micro-interactions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onExploreServices}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4A373] via-[#E0A96D] to-[#c68b59] hover:from-[#c68b59] hover:to-[#d4a373] text-[#0C3B2E] font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>{t('btn_book_artisan', 'Book Verified Artisan')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={openEmergencyModal}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm border border-red-400/40 shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{t('btn_urgent_sos', 'Emergency SOS Dispatch')}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('trust_nsdc', 'NSDC / ITI Certified')}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('trust_police', 'Police Verified')}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('trust_ayushman', 'Ayushman Health Shield')}</span>
                </div>
              </div>
            </div>

            {/* Right: 3D INTERACTIVE THREE.JS GLOBE */}
            <div className="lg:col-span-6 flex justify-center">
              <TiltCard maxTilt={8} scale={1.01} className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <TiltCard maxTilt={12} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {t('stats_verified_artisans', 'Verified Artisans')}
              </span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">14,280+</p>
            <p className="text-[11px] text-emerald-700 font-semibold">{t('stats_sub_artisans', '100% KYC & Trade Certified')}</p>
          </TiltCard>

          <TiltCard maxTilt={12} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {t('stats_fair_wages', 'Fair Wages Paid')}
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">₹3.82 Cr</p>
            <p className="text-[11px] text-emerald-700 font-semibold">{t('stats_sub_wages', '0% Aggregator Cuts')}</p>
          </TiltCard>

          <TiltCard maxTilt={12} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {t('stats_welfare_pool', 'Health & Welfare Pool')}
              </span>
              <HeartHandshake className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">₹68.5 Lakh</p>
            <p className="text-[11px] text-emerald-700 font-semibold">{t('stats_sub_welfare', 'Universal Accident Shield')}</p>
          </TiltCard>

          <TiltCard maxTilt={12} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {t('stats_cooperatives', 'Cooperatives')}
              </span>
              <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">42 Societies</p>
            <p className="text-[11px] text-emerald-700 font-semibold">{t('stats_sub_coop', 'Multi-State Network')}</p>
          </TiltCard>
        </div>
      </section>

      {/* 4. WHY COOPERATIVE OWNERSHIP MATTERS (3D TILT CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            {t('why_badge', 'Ethical Paradigm Shift')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit']">
            {t('why_title', 'Why Cooperative Ownership Changes Everything')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t('why_subtext', 'Private tech aggregators commodify labour. SAHYOG is democratically owned by worker-members with legal governance, dividend rights, and social security.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Corporate Gig Aggregators */}
          <TiltCard maxTilt={6} className="bg-rose-50/70 rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-rose-950">{t('corp_title', 'Corporate Gig Aggregators')}</h3>
                <p className="text-xs text-rose-700">{t('corp_sub', 'Profit Extraction Model')}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-900 text-xs font-bold">
                {t('corp_cut', '25-35% Cuts')}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-rose-900">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>{t('corp_point1', 'Extracts up to 35% commission on every job from artisan earnings')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>{t('corp_point2', 'Workers can be abruptly deactivated/banned by black-box algorithms')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>{t('corp_point3', 'Zero health insurance, no provident fund, no accident protection')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>{t('corp_point4', 'Predatory 300% surge pricing that gouges consumers without benefiting workers')}</span>
              </li>
            </ul>
          </TiltCard>

          {/* SAHYOG Cooperative Network */}
          <TiltCard maxTilt={6} className="bg-emerald-50/80 rounded-3xl p-6 sm:p-8 border-2 border-[#0C3B2E] shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#0C3B2E]">{t('coop_title', 'SAHYOG Cooperative Network')}</h3>
                <p className="text-xs text-emerald-800 font-medium">{t('coop_sub', 'Worker-Owned & Community Governed')}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold">
                {t('coop_cut', '0% Cuts')}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-emerald-950">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{t('coop_point1', '100% fair floor wages paid directly to verified artisan members')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{t('coop_point2', 'Democratic dispute redressal — no automated algorithm account bans')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{t('coop_point3', 'Ayushman Bharat & ₹5 Lakh accidental cover standard for all active members')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{t('coop_point4', 'Annual surplus dividend distributed back to registered cooperative artisans')}</span>
              </li>
            </ul>
          </TiltCard>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <TiltCard
              key={cat.id}
              maxTilt={12}
              onClick={() => onSelectCategory(cat)}
              className="group bg-white rounded-2xl border border-stone-200 hover:border-[#0C3B2E] shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                    <span className="font-bold drop-shadow">
                      {language === 'or'
                        ? (cat.slug === 'electricians' ? 'ଇଲେକ୍ଟ୍ରିସିଆନ' : cat.slug === 'plumbers' ? 'ପ୍ଲମ୍ବର' : cat.slug === 'carpenters' ? 'ବଢ଼େଇ' : cat.slug === 'painters' ? 'ପେଣ୍ଟର' : cat.slug === 'domestic-helpers' ? 'ଘରୋଇ ସହାୟକ' : cat.slug === 'caregivers' ? 'ସେବାକାରୀ' : cat.slug === 'drivers' ? 'ଚାଳକ' : cat.slug === 'gardeners' ? 'ମାଳୀ' : cat.slug === 'cleaners' ? 'ସଫେଇ କର୍ମୀ' : 'ଟେକ୍ନିସିଆନ')
                        : cat.name_hi || cat.name}
                    </span>
                    <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      {cat.base_price_range}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-stone-900 text-sm group-hover:text-[#0C3B2E] transition-colors">
                    {language === 'or'
                      ? (cat.slug === 'electricians' ? 'ଇଲେକ୍ଟ୍ରିସିଆନ ଓ ତାର ଯୋଡ଼ା' : cat.slug === 'plumbers' ? 'ପ୍ଲମ୍ବର ଓ ପାଇପ୍ ସେବା' : cat.slug === 'carpenters' ? 'ବଢ଼େଇ ଓ କାଠ କାର୍ଯ୍ୟ' : cat.slug === 'painters' ? 'ପେଣ୍ଟର ଓ କାନ୍ଥ ରଙ୍ଗ' : cat.slug === 'domestic-helpers' ? 'ଘରୋଇ ସହାୟକ ଓ ରୋଷେୟା' : cat.slug === 'caregivers' ? 'ବୃଦ୍ଧ ଓ ରୋଗୀ ସେବାକାରୀ' : cat.slug === 'drivers' ? 'ପ୍ରମାଣିତ ଚାଳକ (ଡ୍ରାଇଭର)' : cat.slug === 'gardeners' ? 'ମାଳୀ ଓ ବଗିଚା କାର୍ଯ୍ୟ' : cat.slug === 'cleaners' ? 'ଗଭୀର ସଫେଇ ସେବା' : 'ଉପକରଣ ଓ ଏସି ଟେକ୍ନିସିଆନ')
                      : cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-[#0C3B2E] font-bold">
                <span>{t('book_service', 'Book Service')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
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

      {/* 7. INSTITUTIONAL & HOUSEHOLD CTA */}
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
