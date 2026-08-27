import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MessageSquare,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Zap,
  Building,
  Scale,
  Users,
  FileText,
  Headphones,
  Award,
  ExternalLink,
  Search,
  Check,
  PhoneForwarded,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TiltCard } from '../3d/TiltCard';
import { MultilingualCareSection } from './MultilingualCareSection';

export const CustomerCareSection: React.FC<{ onNavigateHome?: () => void; onOpenChatbot?: () => void }> = ({
  onNavigateHome,
  onOpenChatbot,
}) => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { openEmergencyModal } = useMarketplace();

  // Form State for Ticket Submission
  const [name, setName] = useState(currentUser?.name || '');
  const [contact, setContact] = useState(currentUser?.contact || currentUser?.email || '');
  const [category, setCategory] = useState('booking_issue');
  const [bookingId, setBookingId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Live Ticket Tracker State
  const [searchTicketId, setSearchTicketId] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<{
    id: string;
    category: string;
    status: 'registered' | 'assigned' | 'investigating' | 'tribunal' | 'resolved';
    assignedOfficer: string;
    date: string;
    summary: string;
  } | null>(null);
  const [trackerError, setTrackerError] = useState<string | null>(null);

  // Instant Callback Request State
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackTopic, setCallbackTopic] = useState('booking');
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  // FAQ Active State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<'all' | 'bookings' | 'pricing' | 'welfare' | 'disputes' | 'emergency'>('all');
  const [faqSearch, setFaqSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !message) return;

    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket(ticketNumber);
  };

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicketId.trim()) return;

    const cleanId = searchTicketId.trim().toUpperCase();
    if (cleanId.startsWith('TKT-') || cleanId.startsWith('SHY-') || cleanId.length >= 6) {
      setTrackerError(null);
      setTrackedTicket({
        id: cleanId,
        category: 'Service Quality & Billing Mediation',
        status: 'investigating',
        assignedOfficer: 'Smt. Minati Pradhan (Odisha Joint Registrar)',
        date: 'Today, 09:30 AM',
        summary:
          'Grievance registered and assigned to Regional Tribunal. Field inspection officer assigned. Hearing scheduled within 24 hours under Cooperative Bylaws.',
      });
    } else {
      setTrackerError('Please enter a valid Ticket ID in the format TKT-2026-XXXXX');
      setTrackedTicket(null);
    }
  };

  const handleRequestCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setCallbackSuccess(true);
    setTimeout(() => {
      setCallbackPhone('');
    }, 4000);
  };

  const faqItems = [
    {
      category: 'bookings',
      q: language === 'or' ? 'ମୁଁ କିପରି ଜଣେ ପ୍ରମାଣିତ କାରିଗର ବୁକ୍ କରିବି?' : 'How do I book a certified cooperative artisan?',
      a:
        language === 'or'
          ? 'ଆପଣ "ସେବା ଓ ବୃତ୍ତି" ପୃଷ୍ଠାକୁ ଯାଇ ଆପଣଙ୍କ ପସନ୍ଦର ବୃତ୍ତି (ଯଥା ଇଲେକ୍ଟ୍ରିସିଆନ, ପ୍ଲମ୍ବର ଇତ୍ୟାଦି) ଚୟନ କରି ସିଧାସଳଖ ବୁକ୍ କରିପାରିବେ କିମ୍ବା ଆମ ୩ଡି ସହଯୋଗ AI ଚାଟବଟ୍ କୁ କହିପାରିବେ।'
          : 'You can browse our 10 certified trades from the "Services & Trades" tab, select an artisan, choose your scheduled date/time, and confirm with zero advance platform commission. You can also ask our 3D SAHYOG AI Chatbot directly!',
    },
    {
      category: 'pricing',
      q: language === 'or' ? '୦% କମିଶନ ନିୟମ କିପରି କାମ କରେ?' : 'How does the 0% commission guarantee work?',
      a:
        language === 'or'
          ? 'ଘରୋଇ ଆପ୍ ଭଳି ସହଯୋଗ ୨୫-୩୫% କମିଶନ କାଟେ ନାହିଁ। ଆପଣ ଦେଉଥିବା ୮୮% ମଜୁରୀ ସିଧାସଳଖ କାରିଗରଙ୍କୁ ମିଳେ, ୭% ସ୍ୱାସ୍ଥ୍ୟ ବୀମା ପାଣ୍ଠିକୁ ଏବଂ ୫% ସମବାୟ ପ୍ରଶାସନ ଖର୍ଚ୍ଚକୁ ଯାଏ।'
          : 'Unlike private gig platforms that extract 25-35% commission, SAHYOG charges 0% aggregator cut. 88% goes directly to the worker as living wage, 7% funds their Ayushman Bharat & accident welfare pool, and 5% covers cooperative society audit overhead.',
    },
    {
      category: 'emergency',
      q: language === 'or' ? 'ଜରୁରୀକାଳୀନ SOS ସେବା କେତେ ସମୟ ମଧ୍ୟରେ ପହଞ୍ଚେ?' : 'How fast does the Emergency SOS response arrive?',
      a:
        language === 'or'
          ? 'ଆମର ଜରୁରୀକାଳୀନ SOS ରାଡାର୍ ୫ କିଲୋମିଟର ପରିସର ମଧ୍ୟରେ ଉପଲବ୍ଧ କାରିଗରଙ୍କୁ ୧୫ ମିନିଟ୍ ମଧ୍ୟରେ ପ୍ରେରଣ କରିଥାଏ।'
          : 'Our Emergency SOS Radar dispatches the nearest available certified artisan within a 5 km radius with an average response time of under 15 minutes and a transparent flat emergency fee of ₹100.',
    },
    {
      category: 'disputes',
      q: language === 'or' ? 'ଯଦି ମୋର କାମରେ କୌଣସି ଅସନ୍ତୋଷ ଥାଏ, ମୁଁ କଣ କରିବି?' : 'What happens if I have an issue with the service or billing?',
      a:
        language === 'or'
          ? 'ଆପଣ ଏହି କଷ୍ଟମର କେୟାର ଡେସ୍କ କିମ୍ବା ଆପଣଙ୍କ ବୁକିଂ ଇତିହାସରୁ ତୁରନ୍ତ ଅଭିଯୋଗ ଦାଖଲ କରିପାରିବେ। ଆମର ଗଣତାନ୍ତ୍ରିକ ଟ୍ରିବ୍ୟୁନାଲ୍ ୨୪ ଘଣ୍ଟା ମଧ୍ୟରେ ଏହାର ସମାଧାନ କରେ।'
          : 'You can lodge a ticket through this Customer Care desk or your Bookings dashboard. Our tripartite cooperative dispute tribunal arbitrates all complaints within 24 hours with democratic mediation — no automated black-box penalties.',
    },
    {
      category: 'welfare',
      q: language === 'or' ? 'କାରିଗରମାନେ କିପରି ସ୍ୱାସ୍ଥ୍ୟ ବୀମା ସୁରକ୍ଷା ପାଆନ୍ତି?' : 'How are artisans covered under health & accident insurance?',
      a:
        language === 'or'
          ? 'ପ୍ରତ୍ୟେକ ସକ୍ରିୟ ସମବାୟ କାରିଗର ଆୟୁଷ୍ମାନ ଭାରତ PM-JAY ଏବଂ ₹୫ ଲକ୍ଷ ଦୁର୍ଘଟଣା ସୁରକ୍ଷା କବଚ ଅଧୀନରେ ପଞ୍ଜୀକୃତ।'
          : 'Every active cooperative artisan is covered under Ayushman Bharat PM-JAY with ₹5,00,000 hospitalization and 24/7 on-duty accident protection through our collective welfare fund.',
    },
    {
      category: 'disputes',
      q: language === 'or' ? 'ଟଙ୍କା ଫେରସ୍ତ (Refund) ପ୍ରକ୍ରିୟା କିପରି ହୁଏ?' : 'What is the refund and cancellation policy?',
      a:
        language === 'or'
          ? 'ଯଦି କୌଣସି କାରଣରୁ କାରିଗର ନ ପହଞ୍ଚନ୍ତି କିମ୍ବା ସେବା ରଦ୍ଦ ହୁଏ, ୨ ଘଣ୍ଟା ମଧ୍ୟରେ ୧୦୦% ଟଙ୍କା ଆପଣଙ୍କ ଆକାଉଣ୍ଟକୁ ଫେରସ୍ତ ହୋଇଯାଏ।'
          : 'If a service is cancelled or an artisan is unable to arrive, 100% of the advance is refunded to your original payment method within 2 hours without arbitrary cancellation penalties.',
    },
  ];

  const filteredFaqs = faqItems
    .filter((f) => faqCategory === 'all' || f.category === faqCategory)
    .filter((f) => !faqSearch || f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()));

  const regionalOffices = [
    {
      city: 'Mumbai (National Federation HQ)',
      address: 'Shramik Bhavan, C-Block, Bandra-Kurla Complex (BKC), Mumbai 400051',
      officer: 'Shri Anand V. Kulkarni (Nodal Officer)',
      phone: '+91 (022) 2650-SAHYOG',
      email: 'mumbai.hq@sahyog.coop',
      languages: 'English, Marathi, Hindi',
    },
    {
      city: 'Bhubaneswar (Odisha Regional Directorate)',
      address: 'Samabaya Bhawan, Janpath Road, Unit-3, Bhubaneswar, Odisha 751001',
      officer: 'Smt. Minati Pradhan (Joint Registrar)',
      phone: '+91 (0674) 239-COOP',
      email: 'odisha.care@sahyog.coop',
      languages: 'Odia, English, Hindi',
    },
    {
      city: 'New Delhi (Northern Federation Hub)',
      address: 'Pragati Shramik Kendra, Barakhamba Road, Connaught Place, New Delhi 110001',
      officer: 'Shri Harish Chand Sharma (Grievance Nodal)',
      phone: '+91 (011) 2341-HELP',
      email: 'delhi.desk@sahyog.coop',
      languages: 'Hindi, English, Punjabi',
    },
    {
      city: 'Bengaluru (Tech & Southern Directorate)',
      address: 'Sahakara Soudha, 80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
      officer: 'Shri K. Venkatesh (Operations Lead)',
      phone: '+91 (080) 4120-COOP',
      email: 'bengaluru.care@sahyog.coop',
      languages: 'Kannada, English, Tamil, Telugu',
    },
    {
      city: 'Kolkata (Eastern Federation Directorate)',
      address: 'Shram Kalyan Bhavan, Sector V, Salt Lake, Kolkata 700091',
      officer: 'Shri Debabrata Mukherjee (Arbitration Lead)',
      phone: '+91 (033) 2357-SAHYOG',
      email: 'kolkata.care@sahyog.coop',
      languages: 'Bengali, English, Hindi',
    },
    {
      city: 'Chennai (Tamil Nadu Regional Directorate)',
      address: 'Cooperative Towers, Anna Salai, Teynampet, Chennai 600018',
      officer: 'Smt. Lakshmi Ramanathan (Grievance Officer)',
      phone: '+91 (044) 2435-COOP',
      email: 'chennai.care@sahyog.coop',
      languages: 'Tamil, English',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-in fade-in duration-300">
      {/* 1. HERO & TOP CONTACT CHANNELS */}
      <section className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#1D5C4B] rounded-3xl p-6 sm:p-12 text-white shadow-2xl border border-[#297762]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A373]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08281F]/80 backdrop-blur-md border border-[#297762] text-xs font-bold text-[#D4A373]">
            <Headphones className="w-4 h-4 text-[#D4A373]" />
            <span>24/7 Cooperative Customer Care & Grievance Redressal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] tracking-tight leading-tight">
            We are Here to Support You & Our Artisans.
          </h1>

          <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed">
            Unlike commercial gig platforms with automated bot walls and zero accountability, SAHYOG provides direct human assistance, multi-lingual support, transparent SLA guarantees, and democratic grievance mediation.
          </p>
        </div>

        {/* Quick Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 relative z-10">
          {/* Toll Free Helpline */}
          <TiltCard maxTilt={8} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-300 tracking-wider block">National Toll-Free</span>
              <a
                href="tel:1800724964"
                className="font-black text-lg text-white hover:text-[#D4A373] transition-colors"
              >
                1800-SAHYOG
              </a>
              <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">1800-724-964 • 24/7 Active Helpline</p>
            </div>
          </TiltCard>

          {/* WhatsApp Direct Support */}
          <TiltCard maxTilt={8} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center border border-emerald-500/40">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-300 tracking-wider block">WhatsApp Helpdesk</span>
              <a
                href="https://wa.me/919820072496?text=Hello%20Sahyog%20Support%20Team"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-lg text-white hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>+91 98200-SAHYOG</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-stone-300 font-medium mt-0.5">Instant WhatsApp Response</p>
            </div>
          </TiltCard>

          {/* Dedicated Email Helpdesks */}
          <TiltCard maxTilt={8} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-300 tracking-wider block">Email Assistance</span>
              <a
                href="mailto:care@sahyog.coop"
                className="font-black text-sm text-white hover:text-[#D4A373] transition-colors block truncate"
              >
                care@sahyog.coop
              </a>
              <p className="text-[11px] text-amber-200 font-semibold mt-0.5">& support@sahyog.gov.in</p>
            </div>
          </TiltCard>

          {/* Emergency SOS Dispatch */}
          <TiltCard maxTilt={8} className="bg-red-950/40 backdrop-blur-md rounded-2xl p-5 border border-red-500/40 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md animate-pulse">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-red-300 tracking-wider block">Urgent Fast-Track</span>
              <button
                onClick={openEmergencyModal}
                className="font-black text-base text-white hover:text-amber-300 transition-colors text-left"
              >
                Priority SOS Dispatch →
              </button>
              <p className="text-[11px] text-red-200 font-medium mt-0.5">&lt; 15 Mins Rapid Dispatch</p>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 2. SERVICE LEVEL GUARANTEES (SLAs) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1.5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-[#0C3B2E] font-bold text-xs">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>&lt; 15 Mins</span>
          </div>
          <h4 className="font-black text-stone-900 text-sm">Emergency Dispatch</h4>
          <p className="text-[11px] text-stone-500">Rapid local artisan matching for urgent gas, power & water repairs.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1.5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-[#0C3B2E] font-bold text-xs">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>&lt; 2 Hours</span>
          </div>
          <h4 className="font-black text-stone-900 text-sm">Billing Inquiries</h4>
          <p className="text-[11px] text-stone-500">Fast resolution for 0% commission invoices, refunds & payment receipts.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1.5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-[#0C3B2E] font-bold text-xs">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>&lt; 24 Hours</span>
          </div>
          <h4 className="font-black text-stone-900 text-sm">Tripartite Arbitration</h4>
          <p className="text-[11px] text-stone-500">Democratic dispute tribunal hearing with consumer & artisan representation.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1.5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-[#0C3B2E] font-bold text-xs">
            <Shield className="w-4 h-4 text-[#D4A373]" />
            <span>100% Guaranteed</span>
          </div>
          <h4 className="font-black text-stone-900 text-sm">No Algorithm Bans</h4>
          <p className="text-[11px] text-stone-500">Fair human redressal governed by the Multi-State Co-op Societies Act.</p>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE TICKET TRACKER & INSTANT CALLBACK */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Live Ticket Status Tracker */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <Search className="w-3.5 h-3.5 text-emerald-700" />
                <span>Live Grievance Tracker</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit'] mt-1">
                Track Your Ticket or Complaint Status
              </h3>
            </div>
          </div>

          <form onSubmit={handleTrackTicket} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Ticket ID (e.g. TKT-2026-8812)"
              value={searchTicketId}
              onChange={(e) => setSearchTicketId(e.target.value)}
              className="flex-1 text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50 font-mono uppercase"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#0C3B2E] hover:bg-[#164E3F] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-[#D4A373]" />
              <span>Track Ticket</span>
            </button>
          </form>

          {trackerError && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{trackerError}</span>
            </p>
          )}

          {/* Quick Demo Pre-fill buttons */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Try sample ticket:</span>
            <button
              type="button"
              onClick={() => {
                setSearchTicketId('TKT-2026-4421');
                setTrackerError(null);
                setTrackedTicket({
                  id: 'TKT-2026-4421',
                  category: 'Electrical MCB Work Quality Verification',
                  status: 'investigating',
                  assignedOfficer: 'Shri Anand V. Kulkarni (Mumbai Nodal Officer)',
                  date: 'Today, 11:15 AM',
                  summary:
                    'Master Artisan guild supervisor dispatched for quality verification. No additional fee assessed.',
                });
              }}
              className="font-mono text-emerald-700 hover:underline font-bold bg-emerald-50 px-2 py-0.5 rounded"
            >
              TKT-2026-4421
            </button>
          </div>

          {/* Visual Progress Timeline if Tracked */}
          {trackedTicket && (
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Tracking Reference</span>
                  <p className="font-mono font-black text-stone-900 text-sm">{trackedTicket.id}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                  Stage 3: Field Review in Progress
                </span>
              </div>

              {/* Step Timeline */}
              <div className="space-y-3 py-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">1. Grievance Registered & Timestamped</p>
                    <p className="text-[11px] text-stone-500">Logged under Multi-State Cooperative Societies Rules.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">2. Nodal Officer Appointed</p>
                    <p className="text-[11px] text-stone-500">{trackedTicket.assignedOfficer}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5 animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-900">3. Investigation & Work Inspection (Active)</p>
                    <p className="text-[11px] text-stone-600">{trackedTicket.summary}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-700">4. Tripartite Democratic Mediation</p>
                    <p className="text-[11px] text-stone-400">Fair resolution hearing within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instant Phone Callback Request Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0C3B2E] to-[#144537] text-white rounded-3xl p-6 sm:p-8 border border-[#297762] shadow-xl space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D5C4B] text-[#D4A373] text-xs font-bold uppercase tracking-wider">
              <PhoneForwarded className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Instant Callback Desk</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] mt-2 text-white">
              Request a 5-Minute Phone Callback
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              Prefer speaking over phone? Our cooperative representative will call you back directly.
            </p>
          </div>

          {callbackSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-400/40 text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto" />
              <p className="text-xs font-bold text-white">Callback Request Queued!</p>
              <p className="text-[11px] text-emerald-200">
                A duty officer from our National Helpdesk is dialing your number now (Expected: &lt; 5 minutes).
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestCallback} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-200 mb-1">Your Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-stone-400 focus:ring-2 focus:ring-[#D4A373] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-200 mb-1">Issue Topic</label>
                <select
                  value={callbackTopic}
                  onChange={(e) => setCallbackTopic(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#08281F] border border-white/20 text-stone-200 focus:ring-2 focus:ring-[#D4A373] focus:outline-none"
                >
                  <option value="booking">Booking / Artisan Delay</option>
                  <option value="billing">0% Commission & Invoicing Query</option>
                  <option value="refund">Refund & Dispute Redressal</option>
                  <option value="welfare">Ayushman Health & Accident Cover</option>
                  <option value="society">Society / Housing Complex AMC</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#D4A373] hover:bg-[#E0A96D] text-[#0C3B2E] font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Me Now (&lt; 5 mins)</span>
              </button>
            </form>
          )}

          {/* Quick AI Bot Integration Callout */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <Bot className="w-4 h-4 text-[#D4A373]" />
              <span className="text-[11px]">Instant automated answers?</span>
            </div>
            <button
              onClick={onOpenChatbot}
              className="text-[#D4A373] font-bold hover:underline text-[11px] flex items-center gap-1"
            >
              <span>Ask AI Chatbot</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED MULTILINGUAL CUSTOMER CARE SERVICE SECTION */}
      <MultilingualCareSection onOpenChatbot={onOpenChatbot} />

      {/* 4. TICKET SUBMISSION FORM & LIVE FAQ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Ticket Submission Desk */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
          <div className="space-y-1 border-b border-stone-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>Direct Support Desk</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">Submit a Support Request</h2>
            <p className="text-xs text-stone-500">
              Our cooperative customer service team will respond within 2 hours.
            </p>
          </div>

          {submittedTicket ? (
            <div className="py-8 text-center space-y-4 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <div>
                <h3 className="font-black text-lg text-emerald-950 font-['Outfit']">Ticket Registered Successfully!</h3>
                <p className="text-xs text-emerald-800 font-mono font-bold mt-1">Ticket Reference: {submittedTicket}</p>
                <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto">
                  A representative from the Cooperative Federation Helpdesk has been assigned and will contact you via email/SMS shortly.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  setMessage('');
                  setSubject('');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0C3B2E] text-white font-bold text-xs shadow-md hover:bg-[#164E3F] transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saumyadeep Sutradhar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number or Email *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210 / email@domain.com"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Inquiry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-white font-medium text-stone-700"
                  >
                    <option value="booking_issue">Booking Status & Live Tracking</option>
                    <option value="pricing_invoice">0% Commission & Invoicing Query</option>
                    <option value="artisan_feedback">Artisan Work Feedback / Quality</option>
                    <option value="welfare_claim">Ayushman Bharat & Welfare Fund</option>
                    <option value="society_amc">Housing Society / Campus AMC Contract</option>
                    <option value="other">General Cooperative Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Booking ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. SHY-2026-8812"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Brief summary of your query..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe how we can assist you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0C3B2E] to-[#1D5C4B] hover:from-[#144537] hover:to-[#297762] text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-95"
              >
                <Send className="w-4 h-4 text-[#D4A373]" />
                <span>Submit Ticket to Helpdesk</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Interactive FAQ Center */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
            <div className="space-y-3 border-b border-stone-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Frequently Asked Questions</span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900 font-['Outfit'] mt-1">Instant Answers</h3>
                </div>

                {/* FAQ Category Filter */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setFaqCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      faqCategory === 'all' ? 'bg-[#0C3B2E] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFaqCategory('bookings')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      faqCategory === 'bookings' ? 'bg-[#0C3B2E] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Bookings
                  </button>
                  <button
                    onClick={() => setFaqCategory('pricing')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      faqCategory === 'pricing' ? 'bg-[#0C3B2E] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    0% Cut
                  </button>
                  <button
                    onClick={() => setFaqCategory('disputes')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      faqCategory === 'disputes' ? 'bg-[#0C3B2E] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Refunds
                  </button>
                </div>
              </div>

              {/* Search FAQ input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search FAQ questions..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#0C3B2E]"
                />
              </div>
            </div>

            {/* Accordion list */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-4">No matching questions found.</p>
              ) : (
                filteredFaqs.map((item, idx) => {
                  const isOpened = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-stone-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpened ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 font-extrabold text-xs sm:text-sm text-stone-900 hover:bg-stone-50 transition-colors"
                      >
                        <span>{item.q}</span>
                        {isOpened ? (
                          <ChevronUp className="w-4 h-4 text-[#0C3B2E] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0" />
                        )}
                      </button>

                      {isOpened && (
                        <div className="p-4 pt-0 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. REGIONAL COOPERATIVE SERVICE CENTERS & NODAL OFFICERS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#1D5C4B] text-[#D4A373] text-xs font-bold uppercase tracking-wider">
            Physical Support Desks
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-['Outfit']">
            Regional Cooperative Federations & Nodal Officers
          </h2>
          <p className="text-xs text-stone-600">
            Visit our statutory regional offices or reach out to our appointed Grievance Redressal Officers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionalOffices.map((off, idx) => (
            <TiltCard
              key={idx}
              maxTilt={8}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0C3B2E] font-bold text-xs">
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>{off.city}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">{off.languages}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{off.address}</p>
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Presiding Nodal Officer</span>
                  <p className="text-xs font-bold text-stone-800">{off.officer}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-1 text-xs text-[#0C3B2E]">
                <p className="font-semibold">{off.phone}</p>
                <p className="text-[11px] text-stone-500">{off.email}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>
    </div>
  );
};
