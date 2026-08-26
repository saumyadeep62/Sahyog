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
    actionType: 'book_category' | 'emergency_sos' | 'view_services' | 'view_welfare' | 'open_grievance' | 'switch_role';
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
    };
  }
> = {
  en: {
    welcome: 'Namaste! I am **Sahyog Sahayak** — your 3D Robotic AI Cooperative Guide. Speak or write in any Indian language and I will reply in your language!',
    ask_placeholder: 'Type or tap mic to speak in any language...',
    listening_toast: 'Listening to your voice...',
    speak_now: 'Speak now in your chosen language...',
    read_aloud: 'Listen (Audio)',
    thinking: 'SAHYOG AI is thinking...',
    quick_suggestions: [
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
    },
  },
  or: {
    welcome: 'ନମସ୍କାର! ମୁଁ **ସହଯୋଗ ସହାୟକ (Sahyog AI)** — ଶ୍ରମିକ ସମବାୟ ସେବା ମଞ୍ଚର ୩ଡି ରୋବୋଟିକ୍ ଗାଇଡ୍। ଆପଣ ଯେଉଁ ଭାଷାରେ ଲେଖିବେ ବା କହିବେ, ମୁଁ ସେହି ଭାଷାରେ ଉତ୍ତର ଦେବି!',
    ask_placeholder: 'ଓଡ଼ିଆରେ କହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ...',
    listening_toast: 'ଆପଣଙ୍କ ସ୍ୱର ଶୁଣୁଛି...',
    speak_now: 'ଓଡ଼ିଆ କିମ୍ବା ଅନ୍ୟ କୌଣସି ଭାଷାରେ କୁହନ୍ତୁ...',
    read_aloud: 'ସ୍ୱରରେ ଶୁଣନ୍ତୁ (Audio)',
    thinking: 'ସହଯୋଗ AI ଉତ୍ତର ପ୍ରସ୍ତୁତ କରୁଛି...',
    quick_suggestions: [
      { label: '⚡ ଇଲେକ୍ଟ୍ରିସିଆନ', query: 'ମୋତେ ଇଲେକ୍ଟ୍ରିସିଆନ ଓ ତାର ମରାମତି ଦରକାର' },
      { label: '💧 ପ୍ଲମ୍ବର', query: 'ପାଇପ୍ ଲିକେଜ୍ ପାଇଁ ପ୍ଲମ୍ବର ଆବଶ୍ୟକ' },
      { label: '💰 ୦% କମିଶନ', query: '୦% ମଧ୍ୟସ୍ଥ କଟାଉତି କିପରି କାରିଗରଙ୍କୁ ଲାଭ ଦିଏ?' },
      { label: '🏥 କଲ୍ୟାଣ ପାଣ୍ଠି', query: 'ଆୟୁଷ୍ମାନ ଭାରତ ଓ ଦୁର୍ଘଟଣା ବୀମା ବିଷୟରେ ଜଣାନ୍ତୁ' },
      { label: '🏢 ସୋସାଇଟି ଚୁକ୍ତି', query: 'ହାଉସିଂ ସୋସାଇଟି ପାଇଁ ରକ୍ଷଣାବେକ୍ଷଣ ଚୁକ୍ତି କିପରି କରିବେ?' },
    ],
    actions: {
      book_elec: '⚡ ଇଲେକ୍ଟ୍ରିସିଆନ ବୁକ୍ କରନ୍ତୁ',
      book_plumb: '💧 ପ୍ଲମ୍ବର ବୁକ୍ କରନ୍ତୁ',
      emergency_sos: '🚨 ଜରୁରୀକାଳୀନ SOS ସେବା',
      view_all: '📜 ସମସ୍ତ ୧୦ଟି ବୃତ୍ତି ଦେଖନ୍ତୁ',
      welfare_info: '🛡️ ୦% କମିଶନ ମାନକ',
    },
  },
  hi: {
    welcome: 'नमस्ते! मैं **सहयोग सहायक (Sahyog AI)** हूँ — श्रमिक सहकारी सेवा मंच का 3D रोबोटिक गाइड। आप जिस भाषा में लिखेंगे या बोलेंगे, मैं उसी भाषा में उत्तर दूंगा!',
    ask_placeholder: 'बोलने के लिए माइक दबाएं या लिखें...',
    listening_toast: 'आपकी आवाज सुनी जा रही है...',
    speak_now: 'हिंदी या किसी भी भारतीय भाषा में बोलें...',
    read_aloud: 'ऑडियो सुनें (Audio)',
    thinking: 'सहयोग AI उत्तर तैयार कर रहा है...',
    quick_suggestions: [
      { label: '⚡ इलेक्ट्रीशियन', query: 'मुझे बिजली वायरिंग व शॉर्ट सर्किट ठीक करना है' },
      { label: '💧 प्लंबर', query: 'पानी पाइप लीकेज के लिए प्लंबर चाहिए' },
      { label: '💰 0% कमीशन', query: '0% बिचौलिया कटौती से कारीगरों को क्या लाभ है?' },
      { label: '🏥 कल्याण कोष', query: 'आयुष्मान भारत और ₹5 लाख दुर्घटना सुरक्षा बताएं' },
      { label: '🏢 सोसाइटी अनुबंध', query: 'हाउसिंग सोसाइटी के लिए अनुबंध कैसे लें?' },
    ],
    actions: {
      book_elec: '⚡ इलेक्ट्रीशियन बुक करें',
      book_plumb: '💧 प्लंबर बुक करें',
      emergency_sos: '🚨 आपातकालीन SOS सेवा',
      view_all: '📜 सभी 10 ट्रेड देखें',
      welfare_info: '🛡️ 0% कमीशन मॉडल',
    },
  },
  mr: {
    welcome: 'नमस्कार! मी **सहयोग सहाय्यक (Sahyog AI)** आहे. आपण ज्या भाषेत प्रश्न विचाराल, मी त्याच भाषेत उत्तर देईन!',
    ask_placeholder: 'माइकवर बोलण्यासाठी टॅप करा किंवा लिहा...',
    listening_toast: 'आवाज ऐकत आहे...',
    speak_now: 'मराठी किंवा इतर कोणत्याही भाषेत बोला...',
    read_aloud: 'ऑडिओ ऐका (Audio)',
    thinking: 'सहयोग AI विचार करत आहे...',
    quick_suggestions: [
      { label: '⚡ वायरमन', query: 'वायरिंग आणि शॉर्ट सर्किटसाठी वायरमन हवा आहे' },
      { label: '💧 प्लंबर', query: 'पाईप लिकेज दुरुस्तीसाठी प्लंबर' },
      { label: '💰 0% कमिशन', query: '0% मध्यस्थ कपात कशी कार्य करते?' },
      { label: '🏥 कल्याण निधी', query: 'आयुष्मान भारत आणि अपघात विम्याबद्दल सांगा' },
      { label: '🏢 सोसायटी करार', query: 'सोसायटी देखभाल कराराची माहिती द्या' },
    ],
    actions: {
      book_elec: '⚡ वायरमन निवडा',
      book_plumb: '💧 प्लंबर निवडा',
      emergency_sos: '🚨 तातडीची SOS सेवा',
      view_all: '📜 सर्व १० कौशल्ये पहा',
      welfare_info: '🛡️ 0% कमिशन पद्धती',
    },
  },
  bn: {
    welcome: 'নমস্কার! আমি **সহযোগ সহায়ক (Sahyog AI)**। আপনি যে ভাষায় প্রশ্ন করবেন, আমি সেই ভাষাতেই উত্তর দেব!',
    ask_placeholder: 'কথা বলতে মাইক চাপুন বা লিখুন...',
    listening_toast: 'আপনার কথা শোনা হচ্ছে...',
    speak_now: 'বাংলা বা অন্য যে কোনো ভাষায় কথা বলুন...',
    read_aloud: 'অডিও শুনুন (Audio)',
    thinking: 'সহযোগ AI উত্তর তৈরি করছে...',
    quick_suggestions: [
      { label: '⚡ ইলেকট্রিশিয়ান', query: 'ইলেকট্রিশিয়ান প্রয়োজন ওয়ারিং মেরামতের জন্য' },
      { label: '💧 প্লাম্বার', query: 'পাইপ লিকেজের জন্য প্লাম্বার লাগবে' },
      { label: '💰 ০% কমিশন', query: '০% মধ্যস্থতাকারী কমিশন কর্মীদের কীভাবে সাহায্য করে?' },
      { label: '🏥 কল্যাণ তহবিল', query: 'আয়ুষ্মান স্বাস্থ্য সুরক্ষা সম্পর্কে বলুন' },
      { label: '🏢 সোসাইটি চুক্তি', query: 'সোসাইটি রক্ষণাবেক্ষণ চুক্তি কীভাবে করব?' },
    ],
    actions: {
      book_elec: '⚡ ইলেকট্রিশিয়ান বুক করুন',
      book_plumb: '💧 প্লাম্বার বুক করুন',
      emergency_sos: '🚨 জরুরি SOS পরিষেবা',
      view_all: '📜 সকল ১০টি ট্রেড দেখুন',
      welfare_info: '🛡️ ০% কমিশন নিয়ম',
    },
  },
  ta: {
    welcome: 'வணக்கம்! நான் **சஹயோக் சகாயக் (Sahyog AI)**. நீங்கள் எந்த மொழியில் கேள்வி கேட்டாலும், நான் அதே மொழியில் பதிலளிப்பேன்!',
    ask_placeholder: 'பேச மைக்கை அழுத்தவும் அல்லது எழுதவும்...',
    listening_toast: 'உங்கள் குரலைக் கேட்கிறது...',
    speak_now: 'தமிழில் அல்லது உங்கள் மொழியில் பேசுங்கள்...',
    read_aloud: 'கேட்க (Audio)',
    thinking: 'சஹயோக் AI பதிலளிக்கிறது...',
    quick_suggestions: [
      { label: '⚡ எலக்ட்ரீஷியன்', query: 'மின்சார வயரிங் சரிசெய்ய எலக்ட்ரீஷியன் தேவை' },
      { label: '💧 பிளம்பர்', query: 'குழாய் கசிவை சரிசெய்ய பிளம்பர்' },
      { label: '💰 0% கமிஷன்', query: '0% தரகர் கமிஷன் தொழிலாளர்களுக்கு எவ்வாறு உதவுகிறது?' },
      { label: '🏥 நல நிதி', query: 'ஆயுஷ்மான் மருத்துவ காப்பீடு பற்றி கூறவும்' },
      { label: '🏢 குடியிருப்பு பராமரிப்பு', query: 'அடுக்குமாடி குடியிருப்பு பராமரிப்பு ஒப்பந்தம்' },
    ],
    actions: {
      book_elec: '⚡ எலக்ட்ரீஷியனை முன்பதிவு செய்',
      book_plumb: '💧 பிளம்பரை முன்பதிவு செய்',
      emergency_sos: '🚨 அவசர SOS உதவி',
      view_all: '📜 அனைத்து 10 சேவைகள்',
      welfare_info: '🛡️ 0% கமிஷன் தரம்',
    },
  },
  te: {
    welcome: 'నమస్కారం! నేను **సహయోగ్ సహాయక్ (Sahyog AI)**. మీరు ఏ భాషలో అడిగినా, నేను అదే భాషలో సమాధానం ఇస్తాను!',
    ask_placeholder: 'మాట్లాడటానికి మైక్ నొక్కండి లేదా రాయండి...',
    listening_toast: 'మీ స్వరాన్ని వింటున్నాను...',
    speak_now: 'తెలుగు లేదా మీ భాషలో మాట్లాడండి...',
    read_aloud: 'వినండి (Audio)',
    thinking: 'సహయోగ్ AI సమాధానం సిద్ధం చేస్తోంది...',
    quick_suggestions: [
      { label: '⚡ ఎలక్ట్రీషియన్', query: 'వైరింగ్ మరియు షార్ట్ సర్క్యూట్ కోసం ఎలక్ట్రీషియన్ కావాలి' },
      { label: '💧 ప్లంబర్', query: 'పైప్ లీకేజీ కోసం ప్లంబర్ అవసరం' },
      { label: '💰 0% కమీషన్', query: '0% మధ్యవర్తి కమీషన్ కార్మికులకు ఎలా మేలు చేస్తుంది?' },
      { label: '🏥 సంక్షేమ నిధి', query: 'ఆయుష్మాన్ భారత్ & ప్రమాద బీమా గురించి చెప్పండి' },
      { label: '🏢 సొసైటీ కాంట్రాక్ట్', query: 'హౌసింగ్ సొసైటీ మెయింటెనెన్స్ కాంట్రాక్ట్' },
    ],
    actions: {
      book_elec: '⚡ ఎలక్ట్రీషియన్‌ను బుక్ చేయండి',
      book_plumb: '💧 ప్లంబర్‌ను బుక్ చేయండి',
      emergency_sos: '🚨 అత్యవసర SOS సర్వీస్',
      view_all: '📜 అన్ని 10 వృత్తులు చూడండి',
      welfare_info: '🛡️ 0% కమీషన్ విధానం',
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
    // Check Marathi specific vocabulary
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
  if (lower.includes('darkar') || lower.includes('kemiti') || lower.includes('sahajya') || lower.includes('kariba')) {
    return 'or';
  }
  if (lower.includes('chahiye') || lower.includes('kaise') || lower.includes('batao') || lower.includes('karo') || lower.includes('madad')) {
    return 'hi';
  }

  return currentFallback;
}

export const SahyogChatbot: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { categories, workers, openBookingFlow, openEmergencyModal } = useMarketplace();
  const { language, setLanguage, t } = useLanguage();
  const { currentRole, switchRole } = useAuth();

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

    // Clean markdown characters for crisp synthetic speech
    const cleanText = text
      .replace(/[*_#`[\]()]/g, '')
      .replace(/⚡|🚨|🛡️|📜|💧|🪚|❤️|🧹|⚖️|🏥|🏢|🤝|💵|🏛️|•/g, '')
      .trim();

    const targetLangCode = getSpeechLangCode(msgLang);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLangCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Try finding exact language voice matching regional locale
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
          { label: dict.actions.book_elec, actionType: 'book_category', payload: 'electricians' },
          { label: dict.actions.emergency_sos, actionType: 'emergency_sos' },
          { label: dict.actions.welfare_info, actionType: 'view_welfare' },
          { label: dict.actions.view_all, actionType: 'view_services' },
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

  // Multilingual Response Engine that replies in the exact detected language of the query
  const generateBotReply = (query: string, targetLang: LanguageCode): { text: string; actions?: ChatMessage['actions'] } => {
    const q = query.toLowerCase();

    // 1. Electrician Query
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
          ],
        };
      }
      if (targetLang === 'hi') {
        return {
          text: `⚡ **इलेक्ट्रीशियन एवं वायरिंग गिल्ड**:
- शॉर्ट सर्किट, नई वायरिंग, MCB बॉक्स बदलना एवं बिजली उपकरण मरम्मत।
- **उचित न्यूनतम पारिश्रमिक**: ₹250 – ₹450 (100% कारीगर को सीधा भुगतान)।
- **सुरक्षा**: आयुष्मान भारत व ₹5 लाख सामूहिक दुर्घटना बीमा।`,
          actions: [
            { label: '⚡ इलेक्ट्रीशियन बुक करें', actionType: 'book_category', payload: 'electricians' },
            { label: '🚨 आपातकालीन SOS सेवा', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'mr') {
        return {
          text: `⚡ **वायरमन व विद्युत सेवा गिल्ड**:
- शॉर्ट सर्किट, वायरिंग दुरुस्ती, MCB बदलणे आणि उपकरणे जोडणी.
- **रास्त किमान मोबदला**: ₹250 – ₹450 (100% थेट कामगाराच्या खात्यात).
- **आरोग्य सुरक्षा**: आयुष्मान भारत व गट अपघात विमा.`,
          actions: [
            { label: '⚡ वायरमन निवडा', actionType: 'book_category', payload: 'electricians' },
            { label: '🚨 तातडीची SOS मदत', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'bn') {
        return {
          text: `⚡ **ইলেকট্রিশিয়ান ও ওয়্যারিং সমবায়**:
- শর্ট সার্কিট, নতুন ওয়্যারিং, MCB রিপ্লেসমেন্ট এবং হোম অ্যাপ্লায়েন্স সংযোগ।
- **ন্যায্য ন্যূনতম মজুরি**: ₹২৫০ – ₹৪৫০ (১০০% সরাসরি কারিগরের হাতে)।
- **বীমা সুরক্ষা**: আয়ুষ্মান ভারত ₹৫ লাখ দুর্ঘটনা কভার।`,
          actions: [
            { label: '⚡ ইলেকট্রিশিয়ান বুক করুন', actionType: 'book_category', payload: 'electricians' },
            { label: '🚨 জরুরি SOS সেবা', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'ta') {
        return {
          text: `⚡ **எலக்ட்ரீஷியன் & வயரிங் சங்கம்**:
- ஷார்ட் சர்க்யூட், புதிய வயரிங், MCB பழுது மற்றும் மின்சார சாதனங்கள் இணைப்பு.
- **நியாயமான குறைந்தபட்ச ஊதியம்**: ₹250 – ₹450 (100% நேரடியாக தொழிலாளிக்கு).
- **காப்பீடு**: ஆயுஷ்மான் பாரத் ₹5 லட்சம் விபத்து காப்பீடு.`,
          actions: [
            { label: '⚡ எலக்ட்ரீஷியனை முன்பதிவு செய்', actionType: 'book_category', payload: 'electricians' },
            { label: '🚨 அவசர SOS உதவி', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'te') {
        return {
          text: `⚡ **ఎలక్ట్రీషియన్ & వైరింగ్ గిల్డ్**:
- షార్ట్ సర్క్యూట్, కొత్త వైరింగ్, MCB రీప్లేస్‌మెంట్ మరియు గృహోపకరణాల ఫిక్సింగ్.
- **న్యాయమైన కనీస వేతనం**: ₹250 – ₹450 (100% నేరుగా కార్మికుడికే).
- **బీమా రక్షణ**: ఆయుష్మాన్ భారత్ ₹5 లక్షల ప్రమాద బీమా.`,
          actions: [
            { label: '⚡ ఎలక్ట్రీషియన్‌ను బుక్ చేయండి', actionType: 'book_category', payload: 'electricians' },
            { label: '🚨 అత్యవసర SOS సర్వీస్', actionType: 'emergency_sos' },
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
        ],
      };
    }

    // 2. Plumber Query
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
      if (targetLang === 'hi') {
        return {
          text: `💧 **प्लंबर एवं पाइपलाइन सेवा गिल्ड**:
- पाइप लीकेज, मोटर इंस्टालेशन, बाथरूम फिटिंग और ओवरहेड टैंक सफाई।
- **उचित न्यूनतम पारिश्रमिक**: ₹300 – ₹500। 100% कारीगर को सीधा बैंक क्रेडिट।`,
          actions: [
            { label: '💧 प्लंबर बुक करें', actionType: 'book_category', payload: 'plumbers' },
            { label: '🚨 आपातकालीन SOS सेवा', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'mr') {
        return {
          text: `💧 **प्लंबर व स्वच्छता सेवा**:
- पाईप लिकेज, ड्रेनेज साफ करणे, मोटार बसवणे आणि टॅप दुरुस्ती.
- **रास्त किमान मोबदला**: ₹300 – ₹500।`,
          actions: [
            { label: '💧 प्लंबर निवडा', actionType: 'book_category', payload: 'plumbers' },
            { label: '🚨 तातडीची मदत', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'bn') {
        return {
          text: `💧 **প্লাম্বার ও স্যানিটেশন ব্রিগেড**:
- পাইপ লিকেজ, বাথরুম ফিটিংস, জলের মোটর ইন্সটলেশন ও জলের ট্যাঙ্ক পরিষ্কার।
- **ন্যূনতম মজুরি**: ₹৩০০ – ₹৫০০।`,
          actions: [
            { label: '💧 প্লাম্বার বুক করুন', actionType: 'book_category', payload: 'plumbers' },
            { label: '🚨 জরুরি সেবা', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'ta') {
        return {
          text: `💧 **பிளம்பர் & குழாய் பழுதுபார்ப்பு**:
- குழாய் கசிவு, மோட்டார் பொருத்துதல், தொட்டி சுத்தம் மற்றும் பாத்ரூம் பிட்டிங்ஸ்.
- **குறைந்தபட்ச ஊதியம்**: ₹300 – ₹500.`,
          actions: [
            { label: '💧 பிளம்பரை முன்பதிவு செய்', actionType: 'book_category', payload: 'plumbers' },
            { label: '🚨 அவசர உதவி', actionType: 'emergency_sos' },
          ],
        };
      }
      if (targetLang === 'te') {
        return {
          text: `💧 **ప్లంబర్ & పారిశుద్ధ్య సేవా బృందం**:
- పైపుల లీకేజీ, మోటార్ ఇన్‌స్టాలేషన్, వాటర్ ట్యాంక్ క్లీనింగ్ మరియు ట్యాప్ మరమ్మతులు.
- **కనీస వేతనం**: ₹300 – ₹500.`,
          actions: [
            { label: '💧 ప్లంబర్‌ను బుక్ చేయండి', actionType: 'book_category', payload: 'plumbers' },
            { label: '🚨 అత్యవసర సర్వీస్', actionType: 'emergency_sos' },
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

    // 3. 0% Commission / Pricing breakdown
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
      if (targetLang === 'or') {
        return {
          text: `⚖️ **ସହଯୋଗ ୦% କମିଶନ ନିୟମ**:
- **୦% ମଧ୍ୟସ୍ଥ କଟାଉତି**: ଘରୋଇ ଆପ୍ ୨୫-୩୫% କମିଶନ କାଟନ୍ତି, ସହଯୋଗ ₹୦ କାଟେ।
- **₹୧୦୦ ଟଙ୍କା କେଉଁଠିକୁ ଯାଏ?**
  - 💵 **₹୮୮ (୮୮%)**: ସିଧାସଳଖ କାରିଗରଙ୍କ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟକୁ ଯାଏ।
  - 🏥 **₹୭ (୭%)**: ସାମୂହିକ ଶ୍ରମିକ କଲ୍ୟାଣ ଓ ସ୍ୱାସ୍ଥ୍ୟ ବୀମା ପାଣ୍ଠି।
  - 🏛️ **₹୫ (୫%)**: ସମବାୟ ସମିତି ପ୍ରଶାସନ ଓ ଅଡିଟ୍ ଖର୍ଚ୍ଚ।
- **ଲାଭାଂଶ**: ବାର୍ଷିକ ସମବାୟ ଲାଭ ପଞ୍ଜୀକୃତ ଶ୍ରମିକଙ୍କ ମଧ୍ୟରେ ବଣ୍ଟାଯାଏ।`,
          actions: [
            { label: '📜 ସମସ୍ତ ସେବା ଦେଖନ୍ତୁ', actionType: 'view_services' },
            { label: '🛡️ କଲ୍ୟାଣ ପାଣ୍ଠି ଯାଞ୍ଚ', actionType: 'view_welfare' },
          ],
        };
      }
      if (targetLang === 'hi') {
        return {
          text: `⚖️ **सहयोग 0% बिचौलिया कमीशन मॉडल**:
- **0% प्राइवेट कमीशन**: निजी ऐप्स 25-35% कटौती करते हैं। सहयोग पर ₹0 कमीशन कटता है।
- **₹100 का पारदर्शी विभाजन:**
  - 💵 **₹88 (88%)**: सीधे कारीगर के बैंक खाते में पारिश्रमिक।
  - 🏥 **₹7 (7%)**: सामूहिक श्रमिक कल्याण एवं आयुष्मान स्वास्थ्य कोष।
  - 🏛️ **₹5 (5%)**: सहकारी समिति प्रशासनिक व ऑडिट व्यय।`,
          actions: [
            { label: '📜 सभी ट्रेड देखें', actionType: 'view_services' },
            { label: '🛡️ कल्याण कोष विवरण', actionType: 'view_welfare' },
          ],
        };
      }
      if (targetLang === 'mr') {
        return {
          text: `⚖️ **सहयोग 0% मध्यस्थ कमिशन नियम**:
- खाजगी कंपन्या 25-35% कमिशन कापतात. सहयोगात 0% मध्यस्थ कपात आहे.
- **₹100 चे पारदर्शक वाटप:**
  - 💵 **₹88 (88%)**: थेट कामगाराच्या खात्यात.
  - 🏥 **₹7 (7%)**: कामगार कल्याण व आरोग्य विमा निधी.
  - 🏛️ **₹5 (5%)**: सहकारी संस्था प्रशासन खर्च.`,
          actions: [
            { label: '📜 सर्व सेवा पहा', actionType: 'view_services' },
            { label: '🛡️ कल्याण निधी पहा', actionType: 'view_welfare' },
          ],
        };
      }
      if (targetLang === 'bn') {
        return {
          text: `⚖️ **সহযোগ ০% কমিশন ব্যবস্থা**:
- বাণিজ্যিক অ্যাপ ৩৫% পর্যন্ত কমিশন কাটে। সহযোগে ০% প্ল্যাটফর্ম ফি।
- **প্রতি ₹১০০-র বণ্টন:**
  - 💵 **₹৮৮ (৮৮%)**: সরাসরি কারিগরের ব্যাংক অ্যাকাউন্টে।
  - 🏥 **₹৭ (৭%)**: কর্মী কল্যাণ ও স্বাস্থ্য তহবিল।
  - 🏛️ **₹৫ (৫%)**: সমবায় প্রশাসন ব্যয়।`,
          actions: [
            { label: '📜 সকল সেবা দেখুন', actionType: 'view_services' },
            { label: '🛡️ কল্যাণ তহবিল', actionType: 'view_welfare' },
          ],
        };
      }
      if (targetLang === 'ta') {
        return {
          text: `⚖️ **சஹயோக் 0% இடைத்தரகர் கமிஷன்**:
- தனியார் செயலிகள் 35% வரை கமிஷன் பிடிக்கின்றன. சஹயோக் ₹0 கமிஷன் வசூலிக்கிறது.
- **₹100 எங்கு செல்கிறது?**
  - 💵 **₹88 (88%)**: தொழிலாளியின் நேரடி ஊதியம்.
  - 🏥 **₹7 (7%)**: தொழிலாளர் நல நிதி மற்றும் காப்பீடு.
  - 🏛️ **₹5 (5%)**: கூட்டுறவு நிர்வாக செலவு.`,
          actions: [
            { label: '📜 அனைத்து சேவைகள்', actionType: 'view_services' },
            { label: '🛡️ நல நிதி தகவல்', actionType: 'view_welfare' },
          ],
        };
      }
      if (targetLang === 'te') {
        return {
          text: `⚖️ **సహయోగ్ 0% కమీషన్ విధానం**:
- కార్పొరేట్ యాప్‌లు 35% వరకు కమీషన్ కట్ చేస్తాయి. సహయోగ్ ₹0 కమీషన్ వసూలు చేస్తుంది.
- **₹100 ఎక్కడికి వెళుతుంది?**
  - 💵 **₹88 (88%)**: నేరుగా కార్మికుడి బ్యాంక్ ఖాతాకు.
  - 🏥 **₹7 (7%)**: కార్మిక సంక్షేమం & ఆరోగ్య బీమా పూల్.
  - 🏛️ **₹5 (5%)**: సహకార పరిపాలన ఖర్చులు.`,
          actions: [
            { label: '📜 అన్ని సేవలు చూడండి', actionType: 'view_services' },
            { label: '🛡️ సంక్షేమ నిధి పూల్', actionType: 'view_welfare' },
          ],
        };
      }
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
        ],
      };
    }

    // 4. Welfare / Ayushman / Insurance
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
      if (targetLang === 'or') {
        return {
          text: `🏥 **ସମବାୟ ସାମାଜିକ ସୁରକ୍ଷା ଓ ସହାୟତା**:
- ପ୍ରତ୍ୟେକ ସଦସ୍ୟ କାରିଗର **ଆୟୁଷ୍ମାନ ଭାରତ PM-JAY** ଅଧୀନରେ ₹୫,୦୦,୦୦୦ ଡାକ୍ତରଖାନା ଚିକିତ୍ସା କଭର ପାଆନ୍ତି।
- **ସାର୍ବଜନୀନ ଦୁର୍ଘଟଣା ବୀମା**: ୨୪/୭ କାର୍ଯ୍ୟ କ୍ଷେତ୍ର ସୁରକ୍ଷା।
- **ଜରୁରୀକାଳୀନ କଲ୍ୟାଣ ପାଣ୍ଠି**: ଚିକିତ୍ସା ବା ଯନ୍ତ୍ରାଂଶ କ୍ରୟ ପାଇଁ ତୁରନ୍ତ ଆର୍ଥିକ ସହାୟତା।`,
          actions: [
            { label: '🛡️ କଲ୍ୟାଣ ପାଣ୍ଠି ବିବରଣୀ', actionType: 'view_welfare' },
            { label: '⚡ କାରିଗର ବୁକ୍ କରନ୍ତୁ', actionType: 'view_services' },
          ],
        };
      }
      if (targetLang === 'hi') {
        return {
          text: `🏥 **सहकारी सामाजिक सुरक्षा एवं कल्याण कोष**:
- सभी पंजीकृत कारीगरों को **आयुष्मान भारत PM-JAY** के तहत ₹5,00,000 अस्पताल चिकित्सा सुरक्षा।
- **24/7 दुर्घटना बीमा सुरक्षा** और आपातकालीन चिकित्सा सहायता फंड।`,
          actions: [
            { label: '🛡️ कल्याण कोष जांचें', actionType: 'view_welfare' },
            { label: '⚡ कुशल कारीगर बुक करें', actionType: 'view_services' },
          ],
        };
      }
      if (targetLang === 'mr') {
        return {
          text: `🏥 **सहकारी सामाजिक सुरक्षा व आरोग्य कवच**:
- सर्व कामगारांना **आयुष्मान भारत** अंतर्गत ₹5,00,000 वैद्यकीय उपचार कवच.
- गट अपघात विमा व तात्काळ आर्थिक मदत निधी.`,
          actions: [
            { label: '🛡️ कल्याण निधी पहा', actionType: 'view_welfare' },
            { label: '⚡ कारागीर निवडा', actionType: 'view_services' },
          ],
        };
      }
      if (targetLang === 'bn') {
        return {
          text: `🏥 **সমবায় স্বাস্থ্য ও সামাজিক সুরক্ষা**:
- সকল সক্রিয় কর্মীর জন্য **আয়ুষ্মান ভারত** ₹৫ লাখ চিকিৎসালয় কভার।
- সার্বজনীন দুর্ঘটনা বীমা ও জরুরি পারস্পরিক সহায়তা তহবিল।`,
          actions: [
            { label: '🛡️ কল্যাণ তহবিল দেখুন', actionType: 'view_welfare' },
            { label: '⚡ কারিগর বুক করুন', actionType: 'view_services' },
          ],
        };
      }
      if (targetLang === 'ta') {
        return {
          text: `🏥 **கூட்டுறவு சமூக பாதுகாப்பு & மருத்துவ காப்பீடு**:
- அனைத்து தொழிலாளர்களுக்கும் **ஆயுஷ்மான் பாரத்** ₹5 லட்சம் மருத்துவ சிகிச்சை காப்பீடு.
- முழுமையான விபத்து பாதுகாப்பு மற்றும் அவசர நல உதவி நிதி.`,
          actions: [
            { label: '🛡️ நல நிதி பார்க்க', actionType: 'view_welfare' },
            { label: '⚡ தொழிலாளரை முன்பதிவு செய்', actionType: 'view_services' },
          ],
        };
      }
      if (targetLang === 'te') {
        return {
          text: `🏥 **సహకార సామాజిక భద్రత & సంక్షేమం**:
- ప్రతి కార్మికుడికి **ఆయుష్మాన్ భారత్** క్రింద ₹5,00,000 ఆసుపత్రి వైద్య చికిత్స రక్షణ.
- 24/7 ప్రమాద బీమా మరియు తక్షణ అత్యవసర సహాయ నిధి.`,
          actions: [
            { label: '🛡️ సంక్షేమ నిధి చూడండి', actionType: 'view_welfare' },
            { label: '⚡ ఆర్టిజాన్‌ను బుక్ చేయండి', actionType: 'view_services' },
          ],
        };
      }
      return {
        text: `🏥 **Cooperative Social Security & Mutual Aid**:
- Every active artisan is enrolled under **Ayushman Bharat PM-JAY** with ₹5,00,000 hospitalization coverage.
- **Universal Accidental Protection**: 24/7 on-duty insurance.
- **Mutual Aid Emergency Fund**: Instant liquidity assistance for medical emergencies and tool replacement.`,
        actions: [
          { label: 'View Welfare Details', actionType: 'view_welfare' },
          { label: 'Book Certified Artisan', actionType: 'view_services' },
        ],
      };
    }

    // 5. Emergency / SOS
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
      if (targetLang === 'or') {
        return {
          text: `🚨 **ଜରୁରୀକାଳୀନ SOS ତ୍ୱରିତ ସେବା**:
- ୫ କିଲୋମିଟର ପରିସର ମଧ୍ୟରେ ଉପଲବ୍ଧ କାରିଗରଙ୍କୁ ତୁରନ୍ତ ପଠାଯାଏ।
- ସ୍ୱଚ୍ଛ ଜରୁରୀକାଳୀନ ଭତ୍ତା ₹୧୦୦ (କୌଣସି ଅହେତୁକ ସର୍ଜ ମୂଲ୍ୟ ନାହିଁ)।`,
          actions: [{ label: '🚨 ଜରୁରୀକାଳୀନ SOS ସେବା ଆରମ୍ଭ କରନ୍ତୁ', actionType: 'emergency_sos' }],
        };
      }
      if (targetLang === 'hi') {
        return {
          text: `🚨 **प्राथमिकता आपातकालीन SOS सेवा**:
- 5 किमी के दायरे में उपलब्ध नजदीकी प्रमाणित कारीगरों का तत्काल प्रेषण।
- पारदर्शी आपातकालीन भत्ता ₹100 (निजी ऐप्स की तरह कोई 300% सर्ज लूट नहीं)।`,
          actions: [{ label: '🚨 आपातकालीन SOS सेवा शुरू करें', actionType: 'emergency_sos' }],
        };
      }
      return {
        text: `🚨 **Priority Emergency SOS Dispatch**:
- Fast-tracks immediate dispatch of nearby available artisans within a 5km radius.
- Transparent emergency allowance of ₹100 (0% gouging, unlike 300% surge pricing on private apps).`,
        actions: [{ label: '🚨 Launch Emergency SOS Dispatch', actionType: 'emergency_sos' }],
      };
    }

    // Default Fallback in Target Language
    if (targetLang === 'or') {
      return {
        text: `ମୁଁ ସହଯୋଗ AI! ପ୍ରମାଣିତ କାରିଗର ବୁକିଂ, ଜରୁରୀକାଳୀନ SOS, ଶ୍ରମିକ କଲ୍ୟାଣ କିମ୍ବା ହାଉସିଂ ସୋସାଇଟି ଚୁକ୍ତି ବିଷୟରେ ଯାହା ପଚାରିବାକୁ ଚାହାଁନ୍ତି ପଚାରନ୍ତୁ।`,
        actions: [
          { label: '⚡ ସେବା ବୁକ୍ କରନ୍ତୁ', actionType: 'view_services' },
          { label: '🚨 ଜରୁରୀକାଳୀନ SOS', actionType: 'emergency_sos' },
          { label: '⚖️ ସମବାୟ ମାଲିକାନା ମାନକ', actionType: 'view_welfare' },
        ],
      };
    }
    if (targetLang === 'hi') {
      return {
        text: `मैं सहयोग AI हूँ! प्रमाणित कारीगरों की बुकिंग, आपातकालीन SOS, श्रमिक कल्याण कोष या हाउसिंग अनुबंध के बारे में आप कुछ भी पूछ सकते हैं।`,
        actions: [
          { label: '⚡ सेवा बुक करें', actionType: 'view_services' },
          { label: '🚨 आपातकालीन SOS', actionType: 'emergency_sos' },
          { label: '⚖️ सहकारी मॉडल के लाभ', actionType: 'view_welfare' },
        ],
      };
    }
    if (targetLang === 'mr') {
      return {
        text: `मी सहयोग AI आहे! प्रमाणित कामगार बुकिंग, तातडीची SOS मदत किंवा कल्याण निधीबद्दल आपण विचारू शकता.`,
        actions: [
          { label: '⚡ सेवा निवडा', actionType: 'view_services' },
          { label: '🚨 तातडीची SOS', actionType: 'emergency_sos' },
        ],
      };
    }
    if (targetLang === 'bn') {
      return {
        text: `আমি সহযোগ AI! প্রত্যয়িত কারিগর বুকিং, জরুরি SOS বা কর্মী কল্যাণ তহবিল সম্পর্কিত যে কোনো প্রশ্ন করতে পারেন।`,
        actions: [
          { label: '⚡ সেবা বুক করুন', actionType: 'view_services' },
          { label: '🚨 জরুরি SOS', actionType: 'emergency_sos' },
        ],
      };
    }
    if (targetLang === 'ta') {
      return {
        text: `நான் சஹயோக் AI! சான்றளிக்கப்பட்ட தொழிலாளர் முன்பதிவு, அவசர உதவி அல்லது தொழிலாளர் நலன் பற்றி நீங்கள் கேட்கலாம்.`,
        actions: [
          { label: '⚡ முன்பதிவு செய்', actionType: 'view_services' },
          { label: '🚨 அவசர SOS', actionType: 'emergency_sos' },
        ],
      };
    }
    if (targetLang === 'te') {
      return {
        text: `నేను సహయోగ్ AI! ధృవీకరించబడిన కళాకారుల బుకింగ్, అత్యవసర సేవలు లేదా సంక్షేమ నిధి గురించి మీరు అడగవచ్చు.`,
        actions: [
          { label: '⚡ సేవ బుక్ చేయండి', actionType: 'view_services' },
          { label: '🚨 అత్యవసర SOS', actionType: 'emergency_sos' },
        ],
      };
    }

    return {
      text: `I am here to assist you with skilled trades, booking verified artisans, emergency SOS dispatches, cooperative welfare queries, or housing society contracts. What would you like to explore?`,
      actions: [
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
      // Reply strictly in the detected language of the user's message
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
    } else if (action.actionType === 'switch_role') {
      switchRole(action.payload);
      onNavigateTab?.('dashboard');
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* 1. FLOATING 3D ROBOTIC FACE LAUNCHER BUTTON */}
      {!isOpen && (
        <div className="relative group">
          {/* Notification Ping Badge */}
          {hasUnread && (
            <span className="absolute -top-1.5 -right-1.5 z-10 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#0C3B2E] animate-ping" />
          )}

          <button
            onClick={() => {
              setIsOpen(true);
              setHasUnread(false);
            }}
            className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-[#0C3B2E] via-[#144537] to-[#1D5C4B] text-white flex items-center justify-center shadow-2xl border-2 border-[#D4A373]/80 transform hover:scale-110 active:scale-95 transition-all duration-300 relative group overflow-hidden"
            title="Open SAHYOG AI 3D Robotic Assistant"
          >
            {/* 3D Animated Robotic Face inside launcher */}
            <RobotFace3D size={72} isListening={isListening} isSpeaking={isSpeaking} />

            {/* Glowing particle sheen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
          </button>

          {/* Tooltip callout */}
          <div className="absolute bottom-full right-0 mb-3 hidden sm:flex items-center gap-2 bg-[#0C3B2E]/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-extrabold shadow-2xl border border-[#D4A373]/50 whitespace-nowrap animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>SAHYOG AI • Speak in Any Language</span>
          </div>
        </div>
      )}

      {/* 2. 3D CHAT MODAL WINDOW */}
      {isOpen && (
        <div
          className={`bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-[#1D5C4B]/50 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-80 h-20'
              : 'w-[94vw] sm:w-[450px] h-[620px] sm:h-[680px] max-h-[90vh]'
          }`}
        >
          {/* 3D Interactive Robotic Header */}
          <div className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#1D5C4B] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-lg border-b border-[#164E3F] relative overflow-hidden">
            {/* Background 3D Sheen */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4A373]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              {/* 3D Animated Robot Head in Header */}
              <div className="w-14 h-14 rounded-2xl bg-[#08281F] flex items-center justify-center border border-[#D4A373]/50 shadow-inner overflow-hidden flex-shrink-0">
                <RobotFace3D size={56} isListening={isListening} isSpeaking={isSpeaking} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base font-['Outfit'] tracking-tight">
                    Sahyog Sahayak
                  </h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SAHYOG AI
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-200/80 font-medium">
                  <span>Auto Multi-Language Replies</span>
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
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F5]/90">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-2xl bg-[#0C3B2E] text-[#D4A373] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md border border-[#297762]">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[84%] rounded-3xl p-4 text-xs shadow-md space-y-2.5 leading-relaxed ${
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
                              <ArrowRight className="w-3 h-3" />
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
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#D4A373] to-[#E0A96D] text-[#0C3B2E] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md font-bold text-xs">
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
                    className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-[#0C3B2E] hover:text-[#0C3B2E] text-[11px] font-semibold transition-all shadow-2xs transform hover:scale-105"
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
