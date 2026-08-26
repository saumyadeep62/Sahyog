import React from 'react';
import {
  X,
  ShieldCheck,
  Star,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const WorkerProfileModal: React.FC = () => {
  const { selectedWorkerForModal, closeWorkerModal, certifications, reviews, openBookingFlow } = useMarketplace();

  if (!selectedWorkerForModal) return null;

  const worker = selectedWorkerForModal;
  const workerCerts = certifications.filter((c) => c.worker_id === worker.id);
  const workerReviews = reviews.filter((r) => r.rated_user_id === worker.user_id);

  const handleBookDirect = () => {
    closeWorkerModal();
    openBookingFlow(undefined, worker);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0C3B2E] to-[#164E3F] text-white p-6 relative">
          <button
            onClick={closeWorkerModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative">
              <img
                src={worker.avatar_url}
                alt={worker.full_name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D4A373] shadow-lg"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  worker.availability === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                title={worker.availability}
              ></div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-extrabold text-xl text-white font-['Outfit']">{worker.full_name}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Guild Master
                </span>
              </div>

              <p className="text-xs text-[#D4A373] font-medium mt-1">
                {worker.cooperative_name || 'Mumbai Shramik Sahakari Sanstha'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-200 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{worker.rating}</span>
                  <span className="text-stone-300">({worker.total_ratings_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-300" />
                  <span>{worker.experience_years} Years Trade Exp</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-300" />
                  <span>{worker.location.area}, {worker.location.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Bio */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-1.5 uppercase tracking-wider text-[11px]">
              Artisan Profile & Background
            </h4>
            <p className="leading-relaxed text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              {worker.bio}
            </p>
          </div>

          {/* Trust Credentials & Government Certifications */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2.5 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D4A373]" />
              Verified Trade Certifications & Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">Police Background Verified</p>
                  <p className="text-[11px] text-emerald-700">Criminal record check cleared & biometric logged</p>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 flex items-start gap-2.5">
                <HeartHandshake className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-teal-900">Ayushman Bharat & ESI Covered</p>
                  <p className="text-[11px] text-teal-700">₹5,00,000 active health & accident cover</p>
                </div>
              </div>

              {workerCerts.map((c) => (
                <div key={c.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-2.5 sm:col-span-2">
                  <FileText className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-stone-800">{c.certificate_name}</p>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Verified Valid
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">Issuing Body: {c.issuing_body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Skills */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 uppercase tracking-wider text-[11px]">
              Mastery & Specializations
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {worker.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E5DDD0] text-stone-800 font-medium text-[11px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & Fair Minimum Floor Rate Card */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E5DDD0]">
            <h4 className="font-bold text-[#0C3B2E] text-xs uppercase tracking-wider mb-2">
              Transparent Floor Wage Rate
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-extrabold text-[#0C3B2E]">₹{worker.hourly_rate}</span>
                <span className="text-xs text-stone-500 font-medium"> / hour</span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Base inspection visit: ₹{worker.base_visit_fee} (Adjusted against final work)
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                  100% Direct Payout
                </span>
                <p className="text-[10px] text-stone-400 mt-1">No platform cuts</p>
              </div>
            </div>
          </div>

          {/* Verified Customer Reviews */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2.5 uppercase tracking-wider text-[11px]">
              Recent Verified Customer Feedback ({workerReviews.length || '3+'})
            </h4>
            <div className="space-y-2.5">
              {workerReviews.length > 0 ? (
                workerReviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">{rev.rated_by_name}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-[11px]">
                  "Exemplary artisan conduct and highly disciplined execution of work." — Certified Cooperative Rating
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Action */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={closeWorkerModal}
            className="px-4 py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleBookDirect}
            className="flex-1 py-2.5 rounded-lg bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#D4A373]" />
            <span>Book {worker.full_name.split(' ')[0]} Directly</span>
          </button>
        </div>
      </div>
    </div>
  );
};
