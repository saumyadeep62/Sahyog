import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Zap,
  Calendar,
  Clock,
  Award,
  Radio,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Worker, ServiceCategory } from '../../lib/database.types';
import { TiltCard } from '../3d/TiltCard';

interface ServiceBrowserProps {
  initialCategory?: ServiceCategory | null;
  onSelectWorkerForBooking: (worker: Worker) => void;
  onNavigateHome?: () => void;
}

export const ServiceBrowser: React.FC<ServiceBrowserProps> = ({
  initialCategory,
  onSelectWorkerForBooking,
  onNavigateHome,
}) => {
  const { categories, cooperatives, workers, openWorkerModal, openBookingFlow, openEmergencyModal } =
    useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategory?.id || 'all');
  const [selectedCoopId, setSelectedCoopId] = useState<string>('all');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price_low' | 'price_high'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filtering
  const filteredWorkers = workers
    .filter((w) => {
      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        w.full_name.toLowerCase().includes(query) ||
        w.skills.some((s) => s.toLowerCase().includes(query)) ||
        w.location.area.toLowerCase().includes(query) ||
        w.location.city.toLowerCase().includes(query);

      // Category match
      const matchesCategory =
        selectedCategoryId === 'all' || w.service_category_ids.includes(selectedCategoryId);

      // Cooperative match
      const matchesCoop = selectedCoopId === 'all' || w.cooperative_id === selectedCoopId;

      // Online status
      const matchesOnline = !onlyOnline || w.availability === 'online';

      return matchesSearch && matchesCategory && matchesCoop && matchesOnline;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experience_years - a.experience_years;
      if (sortBy === 'price_low') return a.hourly_rate - b.hourly_rate;
      if (sortBy === 'price_high') return b.hourly_rate - a.hourly_rate;
      return 0;
    });

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Navigation Breadcrumb Bar with Back to Home Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-xs text-xs font-semibold">
        <div className="flex items-center gap-2 text-stone-500">
          <button
            onClick={onNavigateHome}
            className="text-[#0C3B2E] hover:underline font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            <span>← Back to Home</span>
          </button>
          <span>/</span>
          <span className="text-stone-400">Trade Directory</span>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-[#0C3B2E] font-bold">{activeCategory.name}</span>
            </>
          )}
        </div>

        <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{filteredWorkers.length} Verified Cooperative Artisans Available</span>
        </div>
      </div>

      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-[#0C3B2E] text-[#D4A373] font-bold uppercase tracking-wider">
              Cooperative Directory
            </span>
            <span className="text-xs text-stone-500 font-medium">100% Floor Wage Guaranteed</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0C3B2E] font-['Outfit'] mt-1">
            {activeCategory ? activeCategory.name : 'Certified Cooperative Artisans & Services'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Browse trade guild masters, inspect verified credentials, and book with 100% direct fair wages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openEmergencyModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs shadow-md flex items-center gap-2 animate-pulse"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Emergency Fast-Track</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-stone-200 space-y-4">
        {/* Search & Main Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search artisan name, skill (e.g. MCB wiring, pipe leak, AC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
            />
          </div>

          {/* Trade Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full py-2.5 px-3 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-white font-medium text-stone-700"
            >
              <option value="all">All 10 Certified Trades</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.name_hi})
                </option>
              ))}
            </select>
          </div>

          {/* Cooperative Society Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCoopId}
              onChange={(e) => setSelectedCoopId(e.target.value)}
              className="w-full py-2.5 px-3 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-white font-medium text-stone-700"
            >
              <option value="all">All Societies</option>
              {cooperatives.map((coop) => (
                <option key={coop.id} value={coop.id}>
                  {coop.city} ({coop.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-white font-medium text-stone-700"
            >
              <option value="rating">Top Rated ★</option>
              <option value="experience">Most Experienced</option>
              <option value="price_low">Floor Rate (Low to High)</option>
              <option value="price_high">Floor Rate (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-[#0C3B2E] text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Trades ({workers.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategoryId === c.id
                  ? 'bg-[#0C3B2E] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* View mode toggle & Online filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyOnline}
              onChange={(e) => setOnlyOnline(e.target.checked)}
              className="w-4 h-4 text-[#0C3B2E] rounded focus:ring-[#0C3B2E]"
            />
            <span className="font-semibold text-stone-700">Show Available Now Only</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
          </label>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Artisan Cards ({filteredWorkers.length})
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-600" />
              <span>Radar Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* RADAR MAP VIEW (Simulated Interactive Geo-Locator) */}
      {viewMode === 'map' && (
        <div className="bg-[#0C3B2E] rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-extrabold text-base font-['Outfit'] flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400 animate-spin" />
                Cooperative Geo-Cluster & Radar Map
              </h3>
              <p className="text-xs text-stone-300">Active artisans connected to regional societies</p>
            </div>
            <span className="text-xs bg-[#144537] text-amber-300 px-3 py-1 rounded-full border border-[#297762]">
              Radius: 15 km Radius
            </span>
          </div>

          {/* Interactive Map Visual Simulation */}
          <div className="h-80 bg-[#08281F] rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden">
            {/* Concentric radar circles */}
            <div className="absolute w-72 h-72 rounded-full border border-emerald-500/20"></div>
            <div className="absolute w-48 h-48 rounded-full border border-emerald-500/30"></div>
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40"></div>
            <div className="absolute w-2 h-2 rounded-full bg-amber-400"></div>

            {/* Radar sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent animate-spin opacity-50"></div>

            {/* Pin elements for workers */}
            {filteredWorkers.map((w, idx) => {
              const angles = [30, 80, 140, 210, 290, 330];
              const radii = [60, 95, 120, 80, 110, 70];
              const angle = angles[idx % angles.length];
              const radius = radii[idx % radii.length];
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <div
                  key={w.id}
                  onClick={() => openWorkerModal(w)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className="absolute cursor-pointer group z-20"
                >
                  <div className="relative">
                    <img
                      src={w.avatar_url}
                      alt={w.full_name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400 shadow-lg group-hover:scale-125 transition-transform"
                    />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
                  </div>

                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-white text-stone-900 text-[10px] p-2 rounded-lg shadow-xl pointer-events-none z-30">
                    <p className="font-bold">{w.full_name}</p>
                    <p className="text-stone-500">{w.location.area}</p>
                    <p className="text-emerald-700 font-bold">₹{w.hourly_rate}/h</p>
                  </div>
                </div>
              );
            })}

            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-stone-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Center: Greater Mumbai & Western Suburbs</span>
            </div>
          </div>
        </div>
      )}

      {/* ARTISANS CARDS GRID */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <p className="font-bold text-stone-700 text-base">No artisans found matching current criteria</p>
          <p className="text-xs text-stone-500">Try resetting filters or searching for another trade.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryId('all');
              setSelectedCoopId('all');
              setOnlyOnline(false);
            }}
            className="px-4 py-2 rounded-lg bg-[#0C3B2E] text-white text-xs font-bold shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <TiltCard
              key={worker.id}
              maxTilt={10}
              className="bg-white rounded-2xl border border-stone-200 hover:border-[#0C3B2E] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Top */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={worker.avatar_url}
                        alt={worker.full_name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#D4A373]"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          worker.availability === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        title={worker.availability}
                      ></span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-stone-900 text-sm">{worker.full_name}</h3>
                        {worker.police_verified && (
                          <span title="Police Verified">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#0C3B2E] font-medium truncate max-w-[180px]">
                        {worker.cooperative_name}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{worker.rating}</span>
                        <span className="text-stone-400 font-normal">({worker.total_ratings_count} ratings)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 block text-[10px]">Floor Rate</span>
                    <span className="font-extrabold text-sm text-[#0C3B2E]">₹{worker.hourly_rate}/h</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                    NSDC Certified
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                    Ayushman Covered
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    {worker.experience_years} yrs exp
                  </span>
                </div>

                {/* Skills Preview */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Specialized In
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {worker.skills.slice(0, 3).join(' • ')}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{worker.location.area}, {worker.location.city}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => openWorkerModal(worker)}
                  className="flex-1 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-white text-xs font-semibold transition-colors"
                >
                  View Credentials
                </button>
                <button
                  onClick={() => onSelectWorkerForBooking(worker)}
                  className="flex-1 py-2 rounded-lg bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Book Artisan</span>
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
};
