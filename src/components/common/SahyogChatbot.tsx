import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Shield,
  HelpCircle,
  Briefcase,
  Award,
  ChevronDown,
  Minimize2,
  Maximize2,
  RefreshCw,
  PhoneCall,
  ArrowRight,
  HeartHandshake,
  Scale,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Globe,
  Headphones,
  ExternalLink,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage, LanguageCode } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ServiceCategory } from '../../lib/database.types';
import { RobotFace3D } from '../3d/RobotFace3D';
import { TiltCard } from '../3d/TiltCard';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  lang?: LanguageCode;
  actions?: {
    label: string;
    actionType:
      | 'book_category'
      | 'emergency_sos'
      | 'view_services'
      | 'view_welfare'
      | 'open_care'
      | 'call_helpline'
      | 'open_whatsapp';
    payload?: any;
  }[];
}

// Comprehensive 7-Language UI Strings
const BOT_TRANSLATIONS: Record<
  LanguageCode,
  {
    welcome: string;
    ask_placeholder: string;
    listening_toast: string;
    speak_now: string;
    read_aloud: string;
    thinking: string;
    quick_suggestions: { label: string; query: string }[];
    actions: {
      book_elec: string;
      book_plumb: string;
      emergency_sos: string;
      view_all: string;
      welfare_info: string;
      customer_care: string;
    };
  }
> = {
  en: {
    welcome: 'Namaste! I am **Sahyog Sahayak** — your 3D Robotic AI Cooperative Guide & Customer Care Assistant. Speak or type in any language!',
    ask_placeholder: 'Type or tap mic to speak in any language...',
    listening_toast: 'Listening to your voice...',
    speak_now: 'Speak now in your chosen language...',
    read_aloud: 'Listen (Audio)',
    thinking: 'SAHYOG AI is thinking...',
    quick_suggestions: [
      { label: '📞 Customer Care', query: 'I need customer care contact and helpline support' },
      { label: '⚡ Electrician', query: 'I need an electrician for wiring & MCB repair' },
      { label: '💧 Plumber', query: 'Need plumber for pipeline leakage' },
      { label: '💰 0% Commission', query: 'How does 0% aggregator cut benefit workers?' },
      { label: '🏥 Welfare Pool', query: 'Tell me about Ayushman Bharat health & accident cover' },
      { label: '🏢 Housing AMC', query: 'How to request maintenance contract for society?' },
    ],
    actions: {
      book_elec: '⚡ Book Certified Electrician',
      book_plumb: '💧 Book Certified Plumber',
      emergency_sos: '🚨 Emergency SOS Dispatch',
      view_all: '📜 Browse All 10 Trades',
      welfare_info: '🛡️ How 0% Commission Works',
      customer_care: '📞 Open Customer Care Desk',
    },
  },
  or: {
    welcome: 'ନମସ୍କାର! ମୁଁ **ସହଯୋଗ ସହାୟକ (Sahyog AI)** — ଶ୍ରମିକ ସମବାୟ ସେବା ମଞ୍ଚର ୩ଡି ରୋବୋଟିକ୍ ଗାଇଡ୍ ଓ ଗ୍ରାହକ ସେବା ସହାୟକ। ଆପଣ ଯେଉଁ ଭାଷାରେ ଲେଖିବେ ବା କହିବେ, ମୁଁ ସେହି ଭାଷାରେ ଉତ୍ତର ଦେବି!',
    ask_placeholder: 'ଓଡ଼ିଆରେ କହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ...',
    listening_toast: 'ଆପଣଙ୍କ ସ୍ୱର ଶୁଣୁଛି...',
    speak_now: 'ଓଡ଼ିଆ କିମ୍ବା ଅନ୍ୟ କୌଣସି ଭାଷାରେ କୁହନ୍ତୁ...',
    read_aloud: 'ସ୍ୱରରେ ଶୁଣନ୍ତୁ (Audio)',
    thinking: 'ସହଯୋଗ AI ଉତ୍ତର ପ୍ରସ୍ତୁତ କରୁଛି...',
    quick_suggestions: [
      { label: '📞 ଗ୍ରାହକ ସେବା', query: 'ମୋତେ ଗ୍ରାହକ ସେବା ହେଲ୍ପଲାଇନ୍ ନମ୍ବର ଦରକାର' },
      { label: '⚡ ଇଲେକ୍ଟ୍ରିସିଆନ', query: 'ମୋତେ ଇଲେକ୍ଟ୍ରିସିଆନ ଓ ତାର ମରାମତି ଦରକାର' },
      { label: '💧 ପ୍ଲମ୍ବର', query: 'ପାଇପ୍ ଲିକେଜ୍ ପାଇଁ ପ୍ଲମ୍ବର ଆବଶ୍ୟକ' },
      { label: '💰 ୦% କମିଶନ', query: '୦% ମଧ୍ୟସ୍ଥ କଟାଉତି କିପରି କାରିଗରଙ୍କୁ ଲାଭ ଦିଏ?' },
      { label: '🏥 କଲ୍ୟାଣ ପାଣ୍ଠି', query: 'ଆୟୁଷ୍ମାନ ଭାରତ ଓ ଦୁର୍ଘଟଣା ବୀମା ବିଷୟରେ ଜଣାନ୍ତୁ' },
    ],
    actions: {
      book_elec: '⚡ ଇଲେକ୍ଟ୍ରିସିଆନ ବୁକ୍ କରନ୍ତୁ',
      book_plumb: '💧 ପ୍ଲମ୍ବର ବୁକ୍ କରନ୍ତୁ',
      emergency_sos: '🚨 ଜରୁରୀକାଳୀନ SOS ସେବା',
      view_all: '📜 ସମସ୍ତ ୧୦ଟି ବୃତ୍ତି ଦେଖନ୍ତୁ',
      welfare_info: '🛡️ ୦% କମିଶନ ମାନକ',
      customer_care: '📞 ଗ୍ରାହକ ସେବା ଡେସ୍କ',
    },
  },
  hi: {
    welcome: 'नमस्ते! मैं **सहयोग सहायक (Sahyog AI)** हूँ — 3D रोबोटिक गाइड एवं ग्राहक सेवा सहायक। माइक दबाकर बोलें या टाइप करें!',
    ask_placeholder: 'बोलने के लिए माइक दबाएं या लिखें...',
    listening_toast: 'आपकी आवाज सुनी जा रही है...',
    speak_now: 'हिंदी या किसी भी भारतीय भाषा में बोलें...',
    read_aloud: 'ऑडियो सुनें (Audio)',
    thinking: 'सहयोग AI उत्तर तैयार कर रहा है...',
    quick_suggestions: [
      { label: '📞 ग्राहक सेवा', query: 'मुझे ग्राहक सेवा संपर्क व हेल्पलाइन नंबर चाहिए' },
      { label: '⚡ इलेक्ट्रीशियन', query: 'मुझे बिजली वायरिंग व शॉर्ट सर्किट ठीक करना है' },
      { label: '💧 प्लंबर', query: 'पानी पाइप लीकेज के लिए प्लंबर चाहिए' },
      { label: '💰 0% कमीशन', query: '0% बिचौलिया कटौती से कारीगरों को क्या लाभ है?' },
      { label: '🏥 कल्याण कोष', query: 'आयुष्मान भारत और ₹5 लाख दुर्घटना सुरक्षा बताएं' },
    ],
    actions: {
      book_elec: '⚡ इलेक्ट्रीशियन बुक करें',
      book_plumb: '💧 प्लंबर बुक करें',
      emergency_sos: '🚨 आपातकालीन SOS सेवा',
      view_all: '📜 सभी 10 ट्रेड देखें',
      welfare_info: '🛡️ 0% कमीशन मॉडल',
      customer_care: '📞 ग्राहक सेवा डेस्क',
    },
  },
  mr: {
    welcome: 'नमस्कार! मी **सहयोग सहाय्यक (Sahyog AI)** आहे. ग्राहक सेवा, कामगार माहिती व मदतीसाठी बोला किंवा लिहा!',
    ask_placeholder: 'माइकवर बोलण्यासाठी टॅप करा किंवा लिहा...',
    listening_toast: 'आवाज ऐकत आहे...',
    speak_now: 'मराठी किंवा इतर कोणत्याही भाषेत बोला...',
    read_aloud: 'ऑडिओ ऐका (Audio)',
    thinking: 'सहयोग AI विचार करत आहे...',
    quick_suggestions: [
      { label: '📞 ग्राहक सेवा', query: 'मला ग्राहक सेवा हेल्पलाइन क्रमांक हवा आहे' },
      { label: '⚡ वायरमन', query: 'वायरिंग आणि शॉर्ट सर्किटसाठी वायरमन हवा आहे' },
      { label: '💧 प्लंबर', query: 'पाईप लिकेज दुरुस्तीसाठी प्लंबर' },
      { label: '💰 0% कमिशन', query: '0% मध्यस्थ कपात कशी कार्य करते?' },
      { label: '🏥 कल्याण निधी', query: 'आयुष्मान भारत आणि अपघात विम्याबद्दल सांगा' },
    ],
    actions: {
      book_elec: '⚡ वायरमन निवडा',
      book_plumb: '💧 प्लंबर निवडा',
      emergency_sos: '🚨 तातडीची SOS सेवा',
      view_all: '📜 सर्व १० कौशल्ये पहा',
      welfare_info: '🛡️ 0% कमिशन पद्धती',
      customer_care: '📞 ग्राहक सेवा केंद्र',
    },
  },
  bn: {
    welcome: 'নমস্কার! আমি **সহযোগ সহায়ক (Sahyog AI)**। গ্রাহক পরিষেবা ও সহায়তার জন্য মাইকে বলুন বা লিখুন!',
    ask_placeholder: 'কথা বলতে মাইক চাপুন বা লিখুন...',
    listening_toast: 'আপনার কথা শোনা হচ্ছে...',
    speak_now: 'বাংলা বা অন্য যে কোনো ভাষায় কথা বলুন...',
    read_aloud: 'অডিও শুনুন (Audio)',
    thinking: 'সহযোগ AI উত্তর তৈরি করছে...',
    quick_suggestions: [
      { label: '📞 গ্রাহক পরিষেবা', query: 'গ্রাহক সহায়তা হেল্পলাইন নম্বর প্রয়োজন' },
      { label: '⚡ ইলেকট্রিশিয়ান', query: 'ইলেকট্রিশিয়ান প্রয়োজন ওয়ারিং মেরামতের জন্য' },
      { label: '💧 প্লাম্বার', query: 'পাইপ লিকেজের জন্য প্লাম্বার লাগবে' },
      { label: '💰 ০% কমিশন', query: '০% মধ্যস্থতাকারী কমিশন কর্মীদের কীভাবে সাহায্য করে?' },
      { label: '🏥 কল্যাণ তহবিল', query: 'আয়ুষ্মান স্বাস্থ্য সুরক্ষা সম্পর্কে বলুন' },
    ],
    actions: {
      book_elec: '⚡ ইলেকট্রিশিয়ান বুক করুন',
      book_plumb: '💧 প্লাম্বার বুক করুন',
      emergency_sos: '🚨 জরুরি SOS পরিষেবা',
      view_all: '📜 সকল ১০টি ট্রেড দেখুন',
      welfare_info: '🛡️ ০% কমিশন নিয়ম',
      customer_care: '📞 গ্রাহক পরিষেবা ডেস্ক',
    },
  },
  ta: {
    welcome: 'வணக்கம்! நான் **சஹயோக் சகாயக் (Sahyog AI)**. வாடிக்கையாளர் சேவை மற்றும் உதவிக்கு மைக் மூலம் பேசுங்கள் அல்லது எழுதுங்கள்!',
    ask_placeholder: 'பேச மைக்கை அழுத்தவும் அல்லது எழுதவும்...',
    listening_toast: 'உங்கள் குரலைக் கேட்கிறது...',
    speak_now: 'தமிழில் அல்லது உங்கள் மொழியில் பேசுங்கள்...',
    read_aloud: 'கேட்க (Audio)',
    thinking: 'சஹயோக் AI பதிலளிக்கிறது...',
    quick_suggestions: [
      { label: '📞 வாடிக்கையாளர் சேவை', query: 'வாடிக்கையாளர் சேவை தொடர்பு எண் தேவை' },
      { label: '⚡ எலக்ட்ரீஷியன்', query: 'மின்சார வயரிங் சரிசெய்ய எலக்ட்ரீஷியன் தேவை' },
      { label: '💧 பிளம்பர்', query: 'குழாய் கசிவை சரிசெய்ய பிளம்பர்' },
      { label: '💰 0% கமிஷன்', query: '0% தரகர் கமிஷன் தொழிலாளர்களுக்கு எவ்வாறு உதவுகிறது?' },
      { label: '🏥 நல நிதி', query: 'ஆயுஷ்மான் மருத்துவ காப்பீடு பற்றி கூறவும்' },
    ],
    actions: {
      book_elec: '⚡ எலக்ட்ரீஷியனை முன்பதிவு செய்',
      book_plumb: '💧 பிளம்பரை முன்பதிவு செய்',
      emergency_sos: '🚨 அவசர SOS உதவி',
      view_all: '📜 அனைத்து 10 சேவைகள்',
      welfare_info: '🛡️ 0% கமிஷன் தரம்',
      customer_care: '📞 வாடிக்கையாளர் சேவை',
    },
  },
  te: {
    welcome: 'నమస్కారం! నేను **సహయోగ్ సహాయక్ (Sahyog AI)**. కస్టమర్ కేర్ మరియు సేవల సహాయం కోసం మాట్లాడండి లేదా రాయండి!',
    ask_placeholder: 'మాట్లాడటానికి మైక్ నొక్కండి లేదా రాయండి...',
    listening_toast: 'మీ స్వరాన్ని వింటున్నాను...',
    speak_now: 'తెలుగు లేదా మీ భాషలో మాట్లాడండి...',
    read_aloud: 'వినండి (Audio)',
    thinking: 'సహయోగ్ AI సమాధానం సిద్ధం చేస్తోంది...',
    quick_suggestions: [
      { label: '📞 కస్టమర్ కేర్', query: 'కస్టమర్ కేర్ హెల్ప్‌లైన్ నంబర్ కావాలి' },
      { label: '⚡ ఎలక్ట్రీషియన్', query: 'వైరింగ్ మరియు షార్ట్ సర్క్యూట్ కోసం ఎలక్ట్రీషియన్ కావాలి' },
      { label: '💧 ప్లంబర్', query: 'పైప్ లీకేజీ కోసం ప్లంబర్ అవసరం' },
      { label: '💰 0% కమీషన్', query: '0% మధ్యవర్తి కమీషన్ కార్మికులకు ఎలా మేలు చేస్తుంది?' },
      { label: '🏥 సంక్షేమ నిధి', query: 'ఆయుష్మాన్ భారత్ & ప్రమాద బీమా గురించి చెప్పండి' },
    ],
    actions: {
      book_elec: '⚡ ఎలక్ట్రీషియన్‌ను బుక్ చేయండి',
      book_plumb: '💧 ప్లంబర్‌ను బుక్ చేయండి',
      emergency_sos: '🚨 అత్యవసర SOS సర్వీస్',
      view_all: '📜 అన్ని 10 వృత్తులు చూడండి',
      welfare_info: '🛡️ 0% కమీషన్ విధానం',
      customer_care: '📞 కస్టమర్ కేర్ డెస్క్',
    },
  },
};

// Automatic Language Detector for Any User Query
export function detectLanguage(text: string, currentFallback: LanguageCode): LanguageCode {
  // 1. Check Odia Unicode: U+0B00 to U+0B7F
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or';

  // 2. Check Bengali Unicode: U+0980 to U+09FF
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';

  // 3. Check Tamil Unicode: U+0B80 to U+0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';

  // 4. Check Telugu Unicode: U+0C00 to U+0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';

  // 5. Check Devanagari Unicode: U+0900 to U+097F
  if (/[\u0900-\u097F]/.test(text)) {
    if (/(हवा|आहे|कसे|कामगार|वायरमन|सुतार|कल्याण|तातडीची|नाही|काय|करा)/i.test(text)) {
      return 'mr';
    }
    return 'hi';
  }

  // 6. Check Romanized transliterations
  const lower = text.toLowerCase();
  if (lower.includes('dorkar') || lower.includes('kemon') || lower.includes('hobe') || lower.includes('lagbe')) {
    return 'bn';
  }
  if (lower.includes('thevai') || lower.includes('vanakkam') || lower.includes('vendam') || lower.includes('eppadi')) {
    return 'ta';
  }
  if (lower.includes('kavali') || lower.includes('namaskaram') || lower.includes('cheyandi') || lower.includes('ela')) {
    return 'te';
  }
  if (lower.includes('hawa') || lower.includes('ahe') || lower.includes('kase') || lower.includes('sang')) {
    return 'mr';
  }
  if (lower.includes('darkar') || lower.includes('kemiti') || lower.includes('sahajya') || lower.includes('kariba') || lower.includes('seba')) {
    return 'or';
  }
  if (lower.includes('chahiye') || lower.includes('kaise') || lower.includes('batao') || lower.includes('karo') || lower.includes('madad') || lower.includes('shikayat')) {
    return 'hi';
  }

  return currentFallback;
}

export const SahyogChatbot: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { categories, workers, openBookingFlow, openEmergencyModal } = useMarketplace();
  const { language, setLanguage, t } = useLanguage();
  const { currentRole } = useAuth();

  const currentBotText = BOT_TRANSLATIONS[language] || BOT_TRANSLATIONS.en;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // Speech-to-Text & Text-to-Speech States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load available SpeechSynthesis voices for all languages
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initialize Speech Recognition on Mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInterimTranscript(currentTranscript);
        setInputText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Set Speech Recognition & TTS Language Code based on target language
  const getSpeechLangCode = (lang: LanguageCode): string => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'or':
        return 'or-IN';
      case 'mr':
        return 'mr-IN';
      case 'bn':
        return 'bn-IN';
      case 'ta':
        return 'ta-IN';
      case 'te':
        return 'te-IN';
      default:
        return 'en-IN';
    }
  };

  // Toggle Speech-to-Text
  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is supported in Chrome, Edge, Safari, and Brave.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const langCode = getSpeechLangCode(language);
        recognitionRef.current.lang = langCode;
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  // Text-to-Speech (Bot Voice Engine tailored to Message's Language)
  const speakMessage = (text: string, msgLang: LanguageCode = language) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const cleanText = text
      .replace(/[*_#`[\]()]/g, '')
      .replace(/⚡|🚨|🛡️|📜|💧|🪚|❤️|🧹|⚖️|🏥|🏢|🤝|💵|🏛️|•|📞|💬|✉️/g, '')
      .trim();

    const targetLangCode = getSpeechLangCode(msgLang);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLangCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    if (availableVoices.length > 0) {
      const prefix = targetLangCode.split('-')[0];
      const matchedVoice =
        availableVoices.find((v) => v.lang === targetLangCode || v.lang.replace('_', '-').startsWith(prefix)) ||
        availableVoices.find((v) => v.lang.includes('IN') || v.lang.includes('Hindi') || v.lang.includes('India')) ||
        availableVoices[0];

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Initial welcome message in active language
  const getInitialMessages = (): ChatMessage[] => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dict = BOT_TRANSLATIONS[language] || BOT_TRANSLATIONS.en;

    return [
      {
        id: `msg-init-${language}`,
        sender: 'bot',
        text: dict.welcome,
        timestamp: time,
        lang: language,
        actions: [
          { label: dict.actions.customer_care, actionType: 'open_care' },
          { label: dict.actions.book_elec, actionType: 'book_category', payload: 'electricians' },
          { label: dict.actions.emergency_sos, actionType: 'emergency_sos' },
          { label: dict.actions.welfare_info, actionType: 'view_welfare' },
        ],
      },
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);

  useEffect(() => {
    setMessages(getInitialMessages());
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isListening]);

  // Multilingual Response Engine with Full Customer Service Intelligence
  const generateBotReply = (query: string, targetLang: LanguageCode): { text: string; actions?: ChatMessage['actions'] } => {
    const q = query.toLowerCase();

    // 0. TICKET TRACKING INTENT (e.g. TKT-2026-4421 or "track ticket")
    const ticketMatch = query.match(/(TKT-\d{4}-\d{4,6}|SHY-\d{4}-\d{4,6})/i);
    if (ticketMatch || q.includes('track ticket') || q.includes('ticket status') || q.includes('check status')) {
      const ticketNum = ticketMatch ? ticketMatch[0].toUpperCase() : 'TKT-2026-4421';
      return {
        text: `🎫 **Live Support Ticket Status: ${ticketNum}**
- 📌 **Status**: 🟡 Stage 3 — Field Inspection & Verification in Progress
- 👤 **Assigned Nodal Officer**: Smt. Minati Pradhan (Regional Directorate)
- ⏱️ **Expected Resolution**: Within 24 Hours (Guaranteed SLA under Co-op Bylaws)
- ⚖️ **Tribunal Protocol**: Democratic tripartite arbitration without algorithmic penalties.
- Need immediate phone follow-up? Call **1800-SAHYOG (1800-724-964)**.`,
        actions: [
          { label: '📞 Call Nodal Helpline', actionType: 'call_helpline' },
          { label: '📝 Open Full Care Desk', actionType: 'open_care' },
          { label: '💬 WhatsApp Support Desk', actionType: 'open_whatsapp' },
        ],
      };
    }

    // 1. FILE COMPLAINT / GRIEVANCE REGISTRATION INTENT
    if (
      q.includes('file complaint') ||
      q.includes('lodge complaint') ||
      q.includes('register complaint') ||
      q.includes('poor service') ||
      q.includes('bad work') ||
      q.includes('artisan late') ||
      q.includes('worker late') ||
      q.includes('not satisfied') ||
      q.includes('damage') ||
      q.includes('rude') ||
      q.includes('ଅଭିଯୋଗ ଦାଖଲ') ||
      q.includes('शिकायत दर्ज') ||
      q.includes('तक्रार नोंदवा')
    ) {
      const generatedTicket = `TKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      return {
        text: `⚖️ **Cooperative Grievance Registered Successfully!**
- 🎫 **Grievance Reference ID**: **${generatedTicket}**
- 🛡️ **Assigned Tribunal**: Multi-State Co-op Societies Redressal Board
- ⏱️ **Resolution Timeline**: Maximum 24 hours. A supervisor is assigned to inspect the case.
- 💰 **Fairness Guarantee**: If work is defective, 100% free re-work or immediate refund is guaranteed under Cooperative Consumer Bylaws.`,
        actions: [
          { label: `🎫 View Ticket ${generatedTicket}`, actionType: 'open_care' },
          { label: '📞 Call Duty Officer (1800-SAHYOG)', actionType: 'call_helpline' },
          { label: '💬 WhatsApp Evidence & Photos', actionType: 'open_whatsapp' },
        ],
      };
    }

    // 2. REFUND / CANCELLATION / PAYMENT / INVOICING INTENT
    if (
      q.includes('refund') ||
      q.includes('cancel booking') ||
      q.includes('cancellation') ||
      q.includes('invoice') ||
      q.includes('payment receipt') ||
      q.includes('failed payment') ||
      q.includes('money back') ||
      q.includes('ଟଙ୍କା ଫେରସ୍ତ') ||
      q.includes('रिफंड') ||
      q.includes('पैसे परत')
    ) {
      return {
        text: `💳 **SAHYOG 0% Fee Invoicing & Instant Refund Policy**:
- ⏱️ **Auto-Refund Window**: 100% of the advance is refunded within **2 hours** for cancellations or artisan no-shows.
- 🧾 **GST & Statutory Invoice**: Available immediately in your "My Bookings" tab upon job completion.
- 🚫 **Zero Hidden Penalties**: No private surge fees or algorithmic cancellation gouging.
- For manual payment reconciliations, our accounts desk is active 24/7.`,
        actions: [
          { label: '📝 Open Customer Care Desk', actionType: 'open_care' },
          { label: '📞 Call Invoicing Desk (1800-SAHYOG)', actionType: 'call_helpline' },
          { label: '💬 WhatsApp Receipt Support', actionType: 'open_whatsapp' },
        ],
      };
    }

    // 2.5 MULTILINGUAL CUSTOMER CARE & LANGUAGE HELPLINES INTENT
    if (
      q.includes('multilingual') ||
      q.includes('multi language') ||
      q.includes('language') ||
      q.includes('languages') ||
      q.includes('bhasha') ||
      q.includes('mother tongue') ||
      q.includes('odia helpline') ||
      q.includes('hindi helpline') ||
      q.includes('marathi helpline') ||
      q.includes('tamil helpline') ||
      q.includes('telugu helpline') ||
      q.includes('bengali helpline') ||
      q.includes('ଭାଷା') ||
      q.includes('भाषा') ||
      q.includes('மொழி') ||
      q.includes('భాష')
    ) {
      return {
        text: `🌐 **SAHYOG 7-Language Dedicated Regional Helplines**:
- 🇮🇳 **हिन्दी (Hindi)**: **1800-SAHYOG-HI (Ext: 101)** • Nodal: Shri Harish Chand Sharma
- 🇮🇳 **ଓଡ଼ିଆ (Odia)**: **1800-SAHYOG-OR (Ext: 102)** • Nodal: Smt. Minati Pradhan
- 🇮🇳 **मराठी (Marathi)**: **1800-SAHYOG-MR (Ext: 103)** • Nodal: Shri Anand V. Kulkarni
- 🇮🇳 **বাংলা (Bengali)**: **1800-SAHYOG-BN (Ext: 104)** • Nodal: Shri Debabrata Mukherjee
- 🇮🇳 **தமிழ் (Tamil)**: **1800-SAHYOG-TA (Ext: 105)** • Nodal: Smt. Lakshmi Ramanathan
- 🇮🇳 **తెలుగు (Telugu)**: **1800-SAHYOG-TE (Ext: 106)** • Nodal: Shri K. Venkatesh
- 🇮🇳 **English (National)**: **1800-SAHYOG-EN (Ext: 100)** • Central Executive Desk

⚖️ *All consumer disputes and artisan support are heard directly in your mother tongue with zero language barrier.*`,
        actions: [
          { label: '🌐 Open Multilingual Care Desk', actionType: 'open_care' },
          { label: '📞 Call Toll-Free (1800-SAHYOG)', actionType: 'call_helpline' },
          { label: '💬 WhatsApp in Native Language', actionType: 'open_whatsapp' },
        ],
      };
    }

    // 3. HUMAN AGENT / CUSTOMER CARE / HELPLINE / CONTACT INTENT
    if (
      q.includes('customer care') ||
      q.includes('customer service') ||
      q.includes('human') ||
      q.includes('agent') ||
      q.includes('speak to person') ||
      q.includes('helpline') ||
      q.includes('contact') ||
      q.includes('call') ||
      q.includes('phone') ||
      q.includes('whatsapp') ||
      q.includes('support') ||
      q.includes('complaint') ||
      q.includes('grievance') ||
      q.includes('nodal officer') ||
      q.includes('helpdesk') ||
      q.includes('ଗ୍ରାହକ ସେବା') ||
      q.includes('ହେଲ୍ପଲାଇନ୍') ||
      q.includes('ଅଭିଯୋଗ') ||
      q.includes('ग्राहक सेवा') ||
      q.includes('हेल्पलाइन') ||
      q.includes('शिकायत') ||
      q.includes('सपोर्ट') ||
      q.includes('तक्रार') ||
      q.includes('গ্রাহক পরিষেবা') ||
      q.includes('অভিযোগ') ||
      q.includes('வாடிக்கையாளர் சேவை') ||
      q.includes('புகார்') ||
      q.includes('కస్టమర్ కేర్') ||
      q.includes('ఫిర్యాదు')
    ) {
      if (targetLang === 'or') {
        return {
          text: `📞 **ସହଯୋଗ ୨୪/୭ ଗ୍ରାହକ ସେବା ଓ ସହାୟତା ଡେସ୍କ (Customer Care)**:
- 📞 **ଜାତୀୟ ଟୋଲ୍-ଫ୍ରି ହେଲ୍ପଲାଇନ୍**: **1800-SAHYOG (1800-724-964)** [୨୪/୭ ମୁକ୍ତ]
- 💬 **ହ୍ୱାଟସ୍ଆପ୍ ସହାୟତା**: **+91 98200-SAHYOG (+91 98200 72496)**
- ✉️ **ଇମେଲ୍ ସହାୟତା**: **care@sahyog.coop** / **support@sahyog.gov.in**
- 🏛️ **ଭୁବନେଶ୍ୱର ଆଞ୍ଚଳିକ ଡେସ୍କ**: ସମବାୟ ଭବନ, ଜନପଥ, ୟୁନିଟ୍-୩ (ଫୋନ୍: 0674-239-COOP)
- ⚖️ **ଅଭିଯୋଗ ନିବାରଣ ଗ୍ୟାରେଣ୍ଟି**: ସମସ୍ତ ଅଭିଯୋଗ ୨୪ ଘଣ୍ଟା ମଧ୍ୟରେ ଗଣତାନ୍ତ୍ରିକ ଭାବେ ସମାଧାନ କରାଯାଏ।`,
          actions: [
            { label: '📞 1800-SAHYOG କୁ କଲ୍ କରନ୍ତୁ', actionType: 'call_helpline' },
            { label: '💬 ହ୍ୱାଟସ୍ଆପ୍ ସହାୟତା', actionType: 'open_whatsapp' },
            { label: '📝 ଗ୍ରାହକ ସେବା ଡେସ୍କ ଖୋଲନ୍ତୁ', actionType: 'open_care' },
            { label: '🚨 ଜରୁରୀକାଳୀନ SOS', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'hi') {
        return {
          text: `📞 **सहयोग 24/7 ग्राहक सेवा एवं सहायता केंद्र (Customer Care)**:
- 📞 **राष्ट्रीय टोल-फ्री हेल्पलाइन**: **1800-SAHYOG (1800-724-964)** [24x7 सक्रिय]
- 💬 **व्हाट्सएप सहायता**: **+91 98200-SAHYOG (+91 98200 72496)**
- ✉️ **ईमेल सहायता**: **care@sahyog.coop** / **support@sahyog.gov.in**
- 🏛️ **क्षेत्रीय शिकायत निवारण अधिकारी**: 24 घंटे के भीतर लोकतांत्रिक मध्यस्थता से समाधान।`,
          actions: [
            { label: '📞 1800-SAHYOG पर कॉल करें', actionType: 'call_helpline' },
            { label: '💬 व्हाट्सएप सहायता', actionType: 'open_whatsapp' },
            { label: '📝 ग्राहक सेवा डेस्क खोलें', actionType: 'open_care' },
            { label: '🚨 आपातकालीन SOS', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'mr') {
        return {
          text: `📞 **सहयोग 24/7 ग्राहक सेवा व तक्रार निवारण केंद्र (Customer Care)**:
- 📞 **राष्ट्रीय टोल-फ्री हेल्पलाइन**: **1800-SAHYOG (1800-724-964)** [२४ तास सुरू]
- 💬 **व्हॉट्सॲप सपोर्ट**: **+91 98200-SAHYOG (+91 98200 72496)**
- ✉️ **ईमेल**: **care@sahyog.coop**
- 🏛️ **मुंबई मुख्यालय**: श्रमिक भवन, बांद्रा-कुर्ला कॉम्प्लेक्स (BKC).`,
          actions: [
            { label: '📞 1800-SAHYOG ला कॉल करा', actionType: 'call_helpline' },
            { label: '💬 व्हॉट्सॲप मदत', actionType: 'open_whatsapp' },
            { label: '📝 ग्राहक सेवा केंद्र', actionType: 'open_care' },
          ],
        };
      }
      if (targetLang === 'bn') {
        return {
          text: `📞 **সহযোগ ২৪/৭ গ্রাহক পরিষেবা ও সহায়তা ডেস্ক (Customer Care)**:
- 📞 **টোল-ফ্রি হেল্পলাইন**: **1800-SAHYOG (1800-724-964)** [২৪ ঘণ্টা সক্রিয়]
- 💬 **হোয়াটসঅ্যাপ সহায়তা**: **+91 98200-SAHYOG (+91 98200 72496)**
- ✉️ **ইমেল**: **care@sahyog.coop** / **support@sahyog.gov.in**
- ⚖️ **অভিযোগ নিষ্পত্তি**: ২৪ ঘণ্টার মধ্যে ন্যায্য সমাধান।`,
          actions: [
            { label: '📞 1800-SAHYOG কল করুন', actionType: 'call_helpline' },
            { label: '💬 হোয়াটসঅ্যাপ সহায়তা', actionType: 'open_whatsapp' },
            { label: '📝 গ্রাহক সেবা পেজ', actionType: 'open_care' },
          ],
        };
      }
      if (targetLang === 'ta') {
        return {
          text: `📞 **சஹயோக் 24/7 வாடிக்கையாளர் சேவை மையம் (Customer Care)**:
- 📞 **கட்டணமில்லா உதவி எண்**: **1800-SAHYOG (1800-724-964)** [24/7 சேவை]
- 💬 **வாட்ஸ்அப் உதவி**: **+91 98200-SAHYOG (+91 98200 72496)**
- ✉️ **மின்னஞ்சல்**: **care@sahyog.coop**
- ⚖️ **குறைதீர்ப்பு**: 24 மணி நேரத்திற்குள் தீர்வு.`,
          actions: [
            { label: '📞 1800-SAHYOG அழைக்கவும்', actionType: 'call_helpline' },
            { label: '💬 வாட்ஸ்அப் உதவி', actionType: 'open_whatsapp' },
            { label: '📝 வாடிக்கையாளர் பக்கம்', actionType: 'open_care' },
          ],
        };
      }
      if (targetLang === 'te') {
        return {
          text: `📞 **సహయోగ్ 24/7 కస్టమర్ కేర్ హెల్ప్‌లైన్ (Customer Care)**:
- 📞 **టోల్-ఫ్రీ నంబర్**: **1800-SAHYOG (1800-724-964)** [24/7 అందుబాటులో]
- 💬 **వాట్సాప్ సపోర్ట్**: **+91 98200-SAHYOG (+91 98200 72496)**
- ✉️ **ఈమెయిల్**: **care@sahyog.coop**
- ⚖️ **ఫిర్యాదుల పరిష్కారం**: 24 గంటల్లో పరిష్కారం.`,
          actions: [
            { label: '📞 1800-SAHYOG కాల్ చేయండి', actionType: 'call_helpline' },
            { label: '💬 వాట్సాప్ సపోర్ట్', actionType: 'open_whatsapp' },
            { label: '📝 కస్టమర్ కేర్ డెస్క్', actionType: 'open_care' },
          ],
        };
      }
      return {
        text: `📞 **SAHYOG 24/7 Customer Care & Grievance Redressal**:
- 📞 **National Toll-Free Helpline**: **1800-SAHYOG (1800-724-964)** [24/7 Active]
- 💬 **WhatsApp Direct Desk**: **+91 98200-SAHYOG (+91 98200 72496)**
- ✉️ **Email Assistance**: **care@sahyog.coop** / **support@sahyog.gov.in**
- 🏛️ **Cooperative SLAs**: Under 15-min Emergency SOS, under 2-hr billing inquiries, and under 24-hr tripartite tribunal arbitration.`,
        actions: [
          { label: '📞 Call Toll-Free 1800-SAHYOG', actionType: 'call_helpline' },
          { label: '💬 WhatsApp Direct Support', actionType: 'open_whatsapp' },
          { label: '📝 Open Customer Care Desk', actionType: 'open_care' },
          { label: '🚨 Priority Emergency SOS', actionType: 'emergency_sos' },
        ],
      };
    }

    // 4. Electrician Query
    if (
      q.includes('electric') ||
      q.includes('wiring') ||
      q.includes('mcb') ||
      q.includes('switch') ||
      q.includes('ଇଲେକ୍ଟ୍ରିସିଆନ') ||
      q.includes('ତାର') ||
      q.includes('बिजली') ||
      q.includes('इलेक्ट्रिशियन') ||
      q.includes('वायरमन') ||
      q.includes('ইলেকট্রিশিয়ান') ||
      q.includes('எலக்ட்ரீஷியன்') ||
      q.includes('ఎలక్ట్రీషియన్')
    ) {
      if (targetLang === 'or') {
        return {
          text: `⚡ **ଇଲେକ୍ଟ୍ରିସିଆନ ଓ ତାର ଯୋଡ଼ା (Electricians Guild)**:
- ଘରୋଇ ତାର ମରାମତି, ଶର୍ଟ ସର୍କିଟ୍, MCB ପରିବର୍ତ୍ତନ ଓ ଉପକରଣ ସଂଯୋଗ ପାଇଁ ପ୍ରମାଣିତ କାରିଗର।
- **ନ୍ୟାଯ୍ୟ ସର୍ବନିମ୍ନ ଦର**: ₹250 – ₹450 (୧୦୦% ସିଧାସଳଖ କାରିଗରଙ୍କୁ ପ୍ରଦାନ)।
- **ସୁରକ୍ଷା**: ଆୟୁଷ୍ମାନ ଭାରତ ₹୫ ଲକ୍ଷ ଦୁର୍ଘଟଣା ବୀମାଭୁକ୍ତ।`,
          actions: [
            { label: '⚡ ଇଲେକ୍ଟ୍ରିସିଆନ ବୁକ୍ କରନ୍ତୁ', actionType: 'book_category', payload: 'electricians' },
            { label: '🚨 ଜରୁରୀକାଳୀନ SOS', actionType: 'emergency_sos' },
            { label: '📞 ଗ୍ରାହକ ସେବା', actionType: 'open_care' },
          ],
        };
      }
      return {
        text: `⚡ **Electricians & Wiring Guild**:
- Certified for home rewiring, short-circuit troubleshooting, DB box replacement, and appliance hookups.
- **Fair Floor Rate**: ₹250 – ₹450 (100% directly credited to the artisan).
- **Insurance**: Protected under Ayushman Bharat ₹5 Lakh accidental cover.`,
        actions: [
          { label: 'Book Certified Electrician', actionType: 'book_category', payload: 'electricians' },
          { label: 'Emergency SOS Dispatch', actionType: 'emergency_sos' },
          { label: '📞 Customer Support Desk', actionType: 'open_care' },
        ],
      };
    }

    // 5. Plumber Query
    if (
      q.includes('plumb') ||
      q.includes('leak') ||
      q.includes('pipe') ||
      q.includes('drain') ||
      q.includes('tap') ||
      q.includes('ପ୍ଲମ୍ବର') ||
      q.includes('नल') ||
      q.includes('प्लंबर') ||
      q.includes('প্লাম্বার') ||
      q.includes('பிளம்பர்') ||
      q.includes('ప్లంబర్')
    ) {
      if (targetLang === 'or') {
        return {
          text: `💧 **ପ୍ଲମ୍ବର ଓ ପାଇପ୍ ସେବା (Plumbing Brigade)**:
- ପାଇପ୍ ଲିକେଜ୍, ଟ୍ୟାପ୍ ମରାମତି, ମୋଟର ଫିଟିଙ୍ଗ୍ ଓ ଟାଙ୍କି ସଫେଇ ପାଇଁ NSDC ପ୍ରମାଣିତ ପ୍ଲମ୍ବର।
- **ନ୍ୟାଯ୍ୟ ସର୍ବନିମ୍ନ ଦର**: ₹300 – ₹500।`,
          actions: [
            { label: '💧 ପ୍ଲମ୍ବର ବୁକ୍ କରନ୍ତୁ', actionType: 'book_category', payload: 'plumbers' },
            { label: '🚨 ଜରୁରୀକାଳୀନ SOS', actionType: 'emergency_sos' },
          ],
        };
      }
      return {
        text: `💧 **Plumbers & Sanitation Brigade**:
- Specialized in pipe leakages, bathroom fittings, motor installation, overhead tank cleaning, and blockages.
- **Fair Floor Rate**: ₹300 – ₹500 (100% floor wage compliance).
- All artisans carry NSDC / ITI certified plumbing credentials.`,
        actions: [
          { label: 'Book Certified Plumber', actionType: 'book_category', payload: 'plumbers' },
          { label: 'Emergency SOS Plumber', actionType: 'emergency_sos' },
        ],
      };
    }

    // 6. 0% Commission / Pricing breakdown
    if (
      q.includes('commission') ||
      q.includes('pricing') ||
      q.includes('how it work') ||
      q.includes('cut') ||
      q.includes('0%') ||
      q.includes('money') ||
      q.includes('ମଜୁରୀ') ||
      q.includes('कमीशन') ||
      q.includes('कमिशन') ||
      q.includes('কমিশন') ||
      q.includes('கமிஷன்') ||
      q.includes('కమీషన్')
    ) {
      return {
        text: `⚖️ **Cooperative Fairness vs Private Aggregators**:
- **0% Private Aggregator Cut**: Commercial apps extract 25-35% commission. SAHYOG charges ₹0 platform fee.
- **Where Does ₹100 Go?**
  - 💵 **₹88 (88%)**: Direct wage paid straight to the verified artisan.
  - 🏥 **₹7 (7%)**: Collective Worker Welfare & Health Insurance Pool.
  - 🏛️ **₹5 (5%)**: Cooperative Society administration & audit overhead.
- **Surplus Sharing**: Annual cooperative profits are returned to registered workers as dividends.`,
        actions: [
          { label: 'Browse Verified Trades', actionType: 'view_services' },
          { label: 'Check Worker Welfare Fund', actionType: 'view_welfare' },
          { label: '📞 Customer Care Helpdesk', actionType: 'open_care' },
        ],
      };
    }

    // 7. Welfare / Ayushman / Insurance
    if (
      q.includes('welfare') ||
      q.includes('insurance') ||
      q.includes('ayushman') ||
      q.includes('accident') ||
      q.includes('health') ||
      q.includes('ବୀମା') ||
      q.includes('बीमा') ||
      q.includes('विमा') ||
      q.includes('বীমা') ||
      q.includes('காப்பீடு') ||
      q.includes('బీమా')
    ) {
      return {
        text: `🏥 **Cooperative Social Security & Mutual Aid**:
- Every active artisan is enrolled under **Ayushman Bharat PM-JAY** with ₹5,00,000 hospitalization coverage.
- **Universal Accidental Protection**: 24/7 on-duty insurance.
- **Mutual Aid Emergency Fund**: Instant liquidity assistance for medical emergencies and tool replacement.`,
        actions: [
          { label: 'View Welfare Details', actionType: 'view_welfare' },
          { label: 'Book Certified Artisan', actionType: 'view_services' },
          { label: '📞 Welfare Assistance Desk', actionType: 'open_care' },
        ],
      };
    }

    // 8. Emergency / SOS
    if (
      q.includes('emergency') ||
      q.includes('sos') ||
      q.includes('urgent') ||
      q.includes('fire') ||
      q.includes('shock') ||
      q.includes('ଜରୁରୀ') ||
      q.includes('आपातकालीन') ||
      q.includes('तातडीची') ||
      q.includes('জরুরি') ||
      q.includes('அவசரம்') ||
      q.includes('అత్యవసరం')
    ) {
      return {
        text: `🚨 **Priority Emergency SOS Dispatch**:
- Fast-tracks immediate dispatch of nearby available artisans within a 5km radius.
- Transparent emergency allowance of ₹100 (0% gouging, unlike 300% surge pricing on private apps).
- Need immediate phone dispatch? Call our toll-free line: **1800-SAHYOG (1800-724-964)**.`,
        actions: [
          { label: '🚨 Launch Emergency SOS Dispatch', actionType: 'emergency_sos' },
          { label: '📞 Call 1800-SAHYOG Hotline', actionType: 'call_helpline' },
        ],
      };
    }

    // Default Fallback
    return {
      text: `I am **Sahyog Sahayak** — your 24/7 Cooperative AI Customer Care Guide! I can help you with:
- 📞 **24/7 Helpline & Contact Details**
- 🎫 **Support Ticket Tracking & Grievance Registration**
- 💳 **Refunds & 0% Commission Invoicing Queries**
- ⚡ **Booking Verified Artisans & Emergency SOS**

What can I assist you with today?`,
      actions: [
        { label: '📞 24/7 Customer Care Helpdesk', actionType: 'open_care' },
        { label: '⚡ Book a Trade Service', actionType: 'view_services' },
        { label: '🚨 Emergency SOS Dispatch', actionType: 'emergency_sos' },
        { label: '⚖️ Why Cooperative Model Matters', actionType: 'view_welfare' },
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Detect language of the input query
    const detectedLang = detectLanguage(query, language);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lang: detectedLang,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateBotReply(query, detectedLang);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lang: detectedLang,
        actions: reply.actions,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[number]) => {
    if (action.actionType === 'book_category') {
      const cat = categories.find((c) => c.slug === action.payload) || categories[0];
      openBookingFlow(cat);
      setIsOpen(false);
    } else if (action.actionType === 'emergency_sos') {
      openEmergencyModal();
      setIsOpen(false);
    } else if (action.actionType === 'view_services') {
      onNavigateTab?.('services');
      setIsOpen(false);
    } else if (action.actionType === 'view_welfare') {
      onNavigateTab?.('home');
      setIsOpen(false);
    } else if (action.actionType === 'open_care') {
      onNavigateTab?.('care');
      setIsOpen(false);
    } else if (action.actionType === 'call_helpline') {
      window.location.href = 'tel:1800724964';
    } else if (action.actionType === 'open_whatsapp') {
      window.open('https://wa.me/919820072496?text=Hello%20Sahyog%20Support', '_blank');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* 1. FLOATING 3D ROBOTIC FACE LAUNCHER BUTTON */}
      {!isOpen && (
        <div className="relative group">
          {/* Notification Ping Badge */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 z-10 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#0C3B2E] animate-ping" />
          )}

          <button
            onClick={() => {
              setIsOpen(true);
              setHasUnread(false);
            }}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#0C3B2E] via-[#144537] to-[#1D5C4B] text-white flex items-center justify-center shadow-2xl border-2 border-[#D4A373]/80 transform hover:scale-105 active:scale-95 transition-all duration-300 relative group overflow-hidden"
            title="Open SAHYOG AI Customer Care Assistant"
          >
            {/* 3D Animated Robotic Face inside launcher */}
            <RobotFace3D size={52} isListening={isListening} isSpeaking={isSpeaking} />

            {/* Glowing particle sheen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
          </button>

          {/* Tooltip callout (Desktop only) */}
          <div className="absolute bottom-full right-0 mb-3 hidden lg:flex items-center gap-2 bg-[#0C3B2E]/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-extrabold shadow-2xl border border-[#D4A373]/50 whitespace-nowrap animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>SAHYOG AI • 24/7 Customer Care</span>
          </div>
        </div>
      )}

      {/* 2. 3D CHAT MODAL WINDOW */}
      {isOpen && (
        <div
          className={`bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-[#1D5C4B]/50 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-72 sm:w-80 h-16 sm:h-20'
              : 'fixed sm:relative inset-x-2 bottom-2 sm:inset-auto w-auto sm:w-[440px] h-[82vh] sm:h-[680px] max-h-[92vh]'
          }`}
        >
          {/* 3D Interactive Robotic Header */}
          <div className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#1D5C4B] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-lg border-b border-[#164E3F] relative overflow-hidden flex-shrink-0">
            {/* Background 3D Sheen */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4A373]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              {/* 3D Animated Robot Head in Header */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#08281F] flex items-center justify-center border border-[#D4A373]/50 shadow-inner overflow-hidden flex-shrink-0">
                <RobotFace3D size={48} isListening={isListening} isSpeaking={isSpeaking} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base font-['Outfit'] tracking-tight">
                    Sahyog Sahayak
                  </h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    24/7 Care AI
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-200/80 font-medium">
                  <span>Customer Support & Trades</span>
                  <span>•</span>
                  <span className="text-amber-300 font-bold uppercase">{language}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F5]/90">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-2xl bg-[#0C3B2E] text-[#D4A373] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md border border-[#297762]">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[84%] rounded-3xl p-3.5 sm:p-4 text-xs shadow-md space-y-2.5 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#0C3B2E] text-white rounded-tr-none border border-[#1D5C4B]'
                          : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">
                        {msg.text.split('\n').map((line, idx) => (
                          <span key={idx} className="block">
                            {line.startsWith('- ') ? (
                              <span className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{line.replace('- ', '')}</span>
                              </span>
                            ) : (
                              line
                            )}
                          </span>
                        ))}
                      </div>

                      {/* Interactive Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5 border-t border-stone-100">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(act)}
                              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#0C3B2E] hover:text-white text-[11px] font-bold text-stone-700 border border-stone-200 transition-all flex items-center gap-1.5 shadow-xs transform hover:scale-105"
                            >
                              <span>{act.label}</span>
                              {act.actionType === 'open_whatsapp' ? (
                                <ExternalLink className="w-3 h-3" />
                              ) : (
                                <ArrowRight className="w-3 h-3" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Footer Row: Audio Speak button & Timestamp */}
                      <div className="flex items-center justify-between pt-1 border-t border-stone-100/40 text-[9px] text-stone-400">
                        {msg.sender === 'bot' ? (
                          <button
                            onClick={() => speakMessage(msg.text, msg.lang || language)}
                            className="flex items-center gap-1 hover:text-[#0C3B2E] transition-colors font-bold text-[10px]"
                            title={`Read Aloud in ${(msg.lang || language).toUpperCase()}`}
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#D4A373]" />
                            <span>{(BOT_TRANSLATIONS[msg.lang || language] || BOT_TRANSLATIONS.en).read_aloud}</span>
                          </button>
                        ) : (
                          <span />
                        )}
                        <span className={msg.sender === 'user' ? 'text-emerald-200/70' : 'text-stone-400'}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-2xl bg-gradient-to-tr from-[#D4A373] to-[#E0A96D] text-[#0C3B2E] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md font-bold text-xs">
                        U
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-stone-500 text-xs pl-2 bg-white/80 p-2.5 rounded-2xl border border-stone-200 w-fit animate-pulse">
                    <Bot className="w-4 h-4 text-[#0C3B2E] animate-spin" />
                    <span>{currentBotText.thinking}</span>
                  </div>
                )}

                {/* Live Speech Recognition Equalizer Waveform */}
                {isListening && (
                  <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-3.5 rounded-2xl shadow-lg border border-red-400 flex items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <Radio className="w-5 h-5 text-amber-300 animate-ping" />
                      <div>
                        <p className="font-extrabold text-xs">{currentBotText.listening_toast}</p>
                        <p className="text-[11px] text-red-100 italic">
                          {interimTranscript ? `"${interimTranscript}"` : currentBotText.speak_now}
                        </p>
                      </div>
                    </div>
                    {/* Animated Equalizer Wave Bars */}
                    <div className="flex items-center gap-1">
                      <span className="w-1 bg-white rounded-full animate-bounce h-4" />
                      <span className="w-1 bg-amber-300 rounded-full animate-bounce h-6 delay-75" />
                      <span className="w-1 bg-white rounded-full animate-bounce h-3 delay-150" />
                      <span className="w-1 bg-amber-300 rounded-full animate-bounce h-5 delay-100" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions Chips */}
              <div className="px-3 py-2 bg-stone-50 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider pl-1">Ask:</span>
                {currentBotText.quick_suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug.query)}
                    className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-[#0C3B2E] hover:text-[#0C3B2E] text-[11px] font-semibold transition-all shadow-2xs transform hover:scale-105"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>

              {/* Voice + Text Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
              >
                {/* Speech-to-Text Mic Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-2.5 rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300 scale-105'
                      : 'bg-stone-100 text-[#0C3B2E] hover:bg-[#0C3B2E] hover:text-white border border-stone-200'
                  }`}
                  title={isListening ? 'Stop Listening' : `Speak in any language (Speech-to-Text)`}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  placeholder={isListening ? currentBotText.listening_toast : currentBotText.ask_placeholder}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none placeholder:text-stone-400"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-[#0C3B2E] to-[#1D5C4B] hover:from-[#144537] hover:to-[#297762] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md transform hover:scale-105 active:scale-95"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
