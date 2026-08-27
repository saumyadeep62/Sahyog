import React, { useState } from 'react';
import {
  Globe,
  PhoneCall,
  MessageSquare,
  Volume2,
  VolumeX,
  CheckCircle2,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Bot,
  ArrowRight,
  Headphones,
  UserCheck,
  Scale,
  FileCheck,
} from 'lucide-react';
import { useLanguage, LanguageCode } from '../../context/LanguageContext';

export interface LanguageDesk {
  code: LanguageCode;
  langName: string;
  nativeName: string;
  banner: string;
  tollFree: string;
  rawPhone: string;
  officer: string;
  regions: string;
  hours: string;
  whatsappMessage: string;
  audioGreeting: string;
  ttsCode: string;
  features: string[];
}

export const LANGUAGE_DESKS: LanguageDesk[] = [
  {
    code: 'hi',
    langName: 'Hindi',
    nativeName: 'हिन्दी सहायता केंद्र',
    banner: 'उत्तर एवं मध्य भारत हेल्पडेस्क',
    tollFree: '1800-SAHYOG-HI (Ext: 101)',
    rawPhone: '18007249641',
    officer: 'Shri Harish Chand Sharma (Grievance Nodal)',
    regions: 'Delhi NCR, Uttar Pradesh, MP, Bihar, Rajasthan, Haryana',
    hours: '24/7 Live Agent & Voice Assistance',
    whatsappMessage: 'नमस्ते सहयोग सहायता केंद्र, मुझे सेवा संबंधी सहायता चाहिए।',
    audioGreeting: 'नमस्ते! सहयोग ग्राहक सेवा केंद्र में आपका स्वागत है। हम आपकी क्या सहायता कर सकते हैं?',
    ttsCode: 'hi-IN',
    features: ['24x7 हिन्दी कॉल सेंटर', 'स्थानीय बोली में शिकायत निवारण', 'व्हाट्सएप एवं फोन पर त्वरित समाधान'],
  },
  {
    code: 'or',
    langName: 'Odia',
    nativeName: 'ଓଡ଼ିଆ ଗ୍ରାହକ ସେବା ଡେସ୍କ',
    banner: 'ଓଡ଼ିଶା ରାଜ୍ୟ ସମବାୟ ନିର୍ଦ୍ଦେଶାଳୟ',
    tollFree: '1800-SAHYOG-OR (Ext: 102)',
    rawPhone: '18007249642',
    officer: 'Smt. Minati Pradhan (Joint Registrar & Arbitrator)',
    regions: 'Bhubaneswar, Cuttack, Puri, Rourkela, Berhampur & all Odisha districts',
    hours: '24/7 ପ୍ରତ୍ୟକ୍ଷ ଓଡ଼ିଆ କଲ୍ ସେବା',
    whatsappMessage: 'ନମସ୍କାର ସହଯୋଗ ସହାୟତା ଡେସ୍କ, ମୋତେ ସାହାଯ୍ୟ ଦରକାର।',
    audioGreeting: 'ନମସ୍କାର! ସହଯୋଗ ଗ୍ରାହକ ସେବା କେନ୍ଦ୍ରକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବା?',
    ttsCode: 'or-IN',
    features: ['ଓଡ଼ିଆରେ ସିଧାସଳଖ ଅଭିଯୋଗ ନିବାରଣ', 'ଆୟୁଷ୍ମାନ ଭାରତ ସହାୟତା', 'ସମବାୟ ଟ୍ରିବ୍ୟୁନାଲ୍ ମଧ୍ୟସ୍ଥତା'],
  },
  {
    code: 'mr',
    langName: 'Marathi',
    nativeName: 'मराठी ग्राहक सेवा कक्ष',
    banner: 'महाराष्ट्र व पश्चिम भारत मुख्यालय',
    tollFree: '1800-SAHYOG-MR (Ext: 103)',
    rawPhone: '18007249643',
    officer: 'Shri Anand V. Kulkarni (BKC Mumbai Nodal Lead)',
    regions: 'Mumbai, Pune, Nagpur, Nashik, Aurangabad, Thane & Konkan',
    hours: '24/7 अविरत ग्राहक सहाय्यता',
    whatsappMessage: 'नमस्कार सहयोग ग्राहक सेवा केंद्र, मला कामाविषयी मदत हवी आहे.',
    audioGreeting: 'नमस्कार! सहयोग ग्राहक सेवा कक्षात आपले स्वागत आहे. आम्ही आपल्याला कशी मदत करू शकतो?',
    ttsCode: 'mr-IN',
    features: ['मराठी भाषक ग्राहक प्रतिनिधी', 'मुंबई बीकेसी मुख्यालय थेट समन्वय', '0% कमिशन बिलिंग मदत'],
  },
  {
    code: 'bn',
    langName: 'Bengali',
    nativeName: 'বাংলা গ্রাহক সহায়তা ডেস্ক',
    banner: 'পূর্বাঞ্চল সমবায় সহায়তা কেন্দ্র',
    tollFree: '1800-SAHYOG-BN (Ext: 104)',
    rawPhone: '18007249644',
    officer: 'Shri Debabrata Mukherjee (Arbitration Lead)',
    regions: 'Kolkata, Howrah, Siliguri, Asansol, Durgapur & Eastern region',
    hours: '২৪/৭ সরাসরি বাংলা হেল্পলাইন',
    whatsappMessage: 'নমস্কার সহযোগ গ্রাহক সহায়তা ডেস্ক, আমার বুকিং সম্পর্কে তথ্য প্রয়োজন।',
    audioGreeting: 'নমস্কার! সহযোগ গ্রাহক সহায়তা কেন্দ্রে আপনাকে স্বাগতম। আমরা কীভাবে আপনাকে সাহায্য করতে পারি?',
    ttsCode: 'bn-IN',
    features: ['মাতৃভাষায় সরাসরি পরামর্শ', 'দ্রুত রিফান্ড ও ইনভয়েস সমাধান', 'অভিযোগের গণতান্ত্রিক নিষ্পত্তি'],
  },
  {
    code: 'ta',
    langName: 'Tamil',
    nativeName: 'தமிழ் வாடிக்கையாளர் சேவை',
    banner: 'தமிழ்நாடு பிராந்திய உதவி மையம்',
    tollFree: '1800-SAHYOG-TA (Ext: 105)',
    rawPhone: '18007249645',
    officer: 'Smt. Lakshmi Ramanathan (Grievance Officer)',
    regions: 'Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem',
    hours: '24/7 தமிழ் வாடிக்கையாளர் உதவி',
    whatsappMessage: 'வணக்கம் சஹயோக் வாடிக்கையாளர் மையம், எனக்கு உடனடி உதவி தேவை.',
    audioGreeting: 'வணக்கம்! சஹயோக் வாடிக்கையாளர் சேவை மையத்திற்கு வரவேற்கிறோம். நாங்கள் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    ttsCode: 'ta-IN',
    features: ['தமிழில் நேரடி வாடிக்கையாளர் உதவி', 'தொழிலாளர் நல காப்பீடு ஆதரவு', 'அவசர SOS விரைவு பணி'],
  },
  {
    code: 'te',
    langName: 'Telugu',
    nativeName: 'తెలుగు కస్టమర్ కేర్ డెస్క్',
    banner: 'దక్షిణ భారత సహాయ కేంద్రం',
    tollFree: '1800-SAHYOG-TE (Ext: 106)',
    rawPhone: '18007249646',
    officer: 'Shri K. Venkatesh (Southern Operations Lead)',
    regions: 'Hyderabad, Visakhapatnam, Vijayawada, Guntur, Warangal',
    hours: '24/7 తెలుగు ఫోన్ & చాట్ సపోర్ట్',
    whatsappMessage: 'నమస్కారం సహయోగ్ కస్టమర్ కేర్, నాకు సేవల గురించిన సమాచారం కావాలి.',
    audioGreeting: 'నమస్కారం! సహయోగ్ కస్టమర్ కేర్ సెంటర్‌కు స్వాగతం. మేము మీకు ఎలా సహాయపడగలము?',
    ttsCode: 'te-IN',
    features: ['తెలుగులో తక్షణ సహాయం', '24 గంటల్లో వివాద పరిష్కారం', 'ఆయుష్మాన్ భారత్ క్లెయిమ్ సపోర్ట్'],
  },
  {
    code: 'en',
    langName: 'English',
    nativeName: 'National English Helpline',
    banner: 'National Federation Coordination Desk',
    tollFree: '1800-SAHYOG-EN (Ext: 100)',
    rawPhone: '18007249640',
    officer: 'National Federation Executive Helpdesk',
    regions: 'Pan-India All States & Union Territories',
    hours: '24/7 Active Round-the-Clock',
    whatsappMessage: 'Hello Sahyog Support Desk, I need assistance with a service booking.',
    audioGreeting: 'Welcome to SAHYOG Cooperative Customer Care. How may we assist you today?',
    ttsCode: 'en-IN',
    features: ['Pan-India Institutional & AMC Support', 'Statutory Tribunal Conciliation', '0% Commission Assurance Desk'],
  },
];

export const MultilingualCareSection: React.FC<{ onOpenChatbot?: () => void }> = ({ onOpenChatbot }) => {
  const { language, setLanguage } = useLanguage();
  const [activeCode, setActiveCode] = useState<LanguageCode>(language);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const selectedDesk = LANGUAGE_DESKS.find((d) => d.code === activeCode) || LANGUAGE_DESKS[0];

  const handlePlayGreeting = (desk: LanguageDesk) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is supported in modern browsers (Chrome, Edge, Safari).');
      return;
    }

    if (playingAudio === desk.code) {
      window.speechSynthesis.cancel();
      setPlayingAudio(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(desk.audioGreeting);
    utterance.lang = desk.ttsCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match = voices.find((v) => v.lang === desk.ttsCode || v.lang.includes(desk.code));
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => setPlayingAudio(desk.code);
    utterance.onend = () => setPlayingAudio(null);
    utterance.onerror = () => setPlayingAudio(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100 pb-6 relative z-10">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>7-Language Dedicated Regional Helplines</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-['Outfit'] tracking-tight">
            Multilingual Customer Care & Voice Support Network
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Speak directly with certified cooperative duty officers and grievance arbitrators in your mother tongue. No English or Hindi barrier for consumers or artisan families.
          </p>
        </div>

        {/* Quick Voice AI Trigger */}
        <div className="flex items-center gap-3 bg-[#0C3B2E] text-white p-3.5 rounded-2xl border border-[#297762] shadow-md flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#D4A373] flex items-center justify-center border border-emerald-400/30 flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold">3D Multilingual Voice AI</p>
            <p className="text-[10px] text-stone-300">Voice-to-Voice in 7 Indian Languages</p>
          </div>
          <button
            onClick={onOpenChatbot}
            className="px-3 py-1.5 rounded-xl bg-[#D4A373] hover:bg-[#E0A96D] text-[#0C3B2E] font-black text-xs transition-transform transform hover:scale-105"
          >
            Launch AI
          </button>
        </div>
      </div>

      {/* Language Selector Pills */}
      <div className="space-y-2 relative z-10">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
          Select Your Preferred Language / ਆਪਣୀ ਭାਸ਼ਾ ਚੁਣੋ:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {LANGUAGE_DESKS.map((desk) => {
            const isSelected = desk.code === activeCode;
            return (
              <button
                key={desk.code}
                onClick={() => {
                  setActiveCode(desk.code);
                  setLanguage(desk.code);
                }}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0C3B2E] text-white border-[#0C3B2E] shadow-lg ring-2 ring-[#D4A373]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black uppercase ${isSelected ? 'text-[#D4A373]' : 'text-[#0C3B2E]'}`}>
                    {desk.code}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
                <div className="mt-1">
                  <p className="text-xs font-bold truncate">{desk.langName}</p>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {desk.nativeName.split(' ')[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Language Detailed Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-[#FAF8F5] to-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-inner relative z-10">
        {/* Left: Officer & Extension Details */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#0C3B2E] uppercase tracking-wider">
              {selectedDesk.banner}
            </span>
            <h3 className="text-2xl font-black text-stone-900 font-['Outfit'] flex items-center gap-2">
              <span>{selectedDesk.nativeName}</span>
              <span className="text-sm font-normal text-stone-500">({selectedDesk.langName})</span>
            </h3>
            <p className="text-xs text-stone-600 flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selectedDesk.hours}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Dedicated Extension</span>
              <a
                href={`tel:${selectedDesk.rawPhone}`}
                className="font-black text-sm text-[#0C3B2E] hover:text-emerald-600 transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>{selectedDesk.tollFree}</span>
              </a>
              <p className="text-[10px] text-stone-500">Direct IVR Routing</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Designated Nodal Officer</span>
              <p className="font-bold text-xs text-stone-800 truncate flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>{selectedDesk.officer}</span>
              </p>
              <p className="text-[10px] text-stone-500 truncate">{selectedDesk.regions}</p>
            </div>
          </div>

          {/* Action Buttons: Dial & WhatsApp */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={`tel:${selectedDesk.rawPhone}`}
              className="px-5 py-3 rounded-xl bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#D4A373]" />
              <span>Call {selectedDesk.langName} Helpline</span>
            </a>

            <a
              href={`https://wa.me/919820072496?text=${encodeURIComponent(selectedDesk.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp in {selectedDesk.langName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Audio Greeting Player Button */}
            <button
              type="button"
              onClick={() => handlePlayGreeting(selectedDesk)}
              className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                playingAudio === selectedDesk.code
                  ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
              title="Listen to native language greeting"
            >
              {playingAudio === selectedDesk.code ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-600" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#0C3B2E]" />
                  <span>Listen Greeting (Audio)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Key Multilingual Features Checklist */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#0C3B2E] font-extrabold text-xs mb-3">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Statutory Cooperative Multilingual Guarantees</span>
            </div>
            <ul className="space-y-2.5 text-xs text-stone-700">
              {selectedDesk.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <Scale className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Tribunal arbitration conducted in consumer's preferred language.</span>
              </li>
              <li className="flex items-start gap-2">
                <FileCheck className="w-3.5 h-3.5 text-[#D4A373] mt-0.5 flex-shrink-0" />
                <span>Statutory 0% fee invoices printed with regional language translations.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[11px]">Need urgent SOS artisan?</span>
            <a
              href="tel:1800724964"
              className="text-[#0C3B2E] font-extrabold hover:underline flex items-center gap-1"
            >
              <span>Emergency 1800-SAHYOG-99</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
