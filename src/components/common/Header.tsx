import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  AlertTriangle,
  Globe,
  LayoutDashboard,
  Sparkles,
  Users,
  Briefcase,
  Lock,
  Compass,
  ArrowRight,
  FileCheck,
  TrendingUp,
  Scale,
  Receipt,
  KeyRound,
  Headphones,
  PhoneCall,
  MessageSquare,
  ExternalLink,
  HelpCircle,
  Clock,
  Bot,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LanguageCode } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { UserRole } from '../../lib/database.types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    currentRole,
    isAuthenticated,
    signOut,
    openAuthModal,
    openChangePasswordModal,
    openEditProfileModal,
  } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { notifications, markNotificationRead, openEmergencyModal } = useMarketplace();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCareDropdownOpen, setIsCareDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read_status).length;

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0C3B2E]/95 backdrop-blur-xl text-white shadow-2xl border-b border-[#1D5C4B]/60 transition-all">
      {/* Top Banner: Status Indicator & Cooperative Guarantee */}
      <div className="bg-[#07241C] text-[11px] py-1 px-3 sm:px-8 border-b border-[#144537]/80 text-stone-300 overflow-hidden">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
            {/* Active Mode Pill */}
            {currentUser ? (
              <span className="inline-flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-full bg-[#164E3F] text-[#D4A373] border border-[#297762] text-[10px] sm:text-[11px] flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {currentUser.email === 'admin@gmail.com'
                  ? '🏛️ Admin HQ'
                  : currentRole === 'worker'
                  ? '⚡ Workstation'
                  : '🏠 Customer Portal'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-full bg-[#164E3F] text-[#D4A373] border border-[#297762] text-[10px] sm:text-[11px] flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                🌐 Public Utility
              </span>
            )}
            <span className="text-stone-500">•</span>
            <span className="text-stone-300 text-[10px] sm:text-[11px] truncate max-w-[200px] sm:max-w-none">
              {t('top_cuts', '0% Aggregator Cuts — 100% Floor Wage to Artisans')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs flex-shrink-0">
            <a
              href="tel:1800724964"
              className="text-emerald-300 hover:text-white transition-colors flex items-center gap-1 font-bold whitespace-nowrap"
              title="24/7 National Toll-Free Customer Care"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Helpline: </span>
              <span>1800-SAHYOG</span>
            </a>
            <span className="text-stone-600 hidden md:inline">|</span>
            <span className="text-stone-300 hidden md:flex items-center gap-1 font-mono">
              <span className="text-[#D4A373] font-bold">SOS:</span> 1800-SAHYOG-99
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 relative">
        {/* 1. Left: Brand Identity */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#D4A373] via-[#E0A96D] to-[#FAEDCD] flex items-center justify-center text-[#0C3B2E] font-black text-base sm:text-lg shadow-md border border-[#D4A373]/50 group-hover:scale-105 transition-transform flex-shrink-0">
            स
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-base sm:text-xl tracking-tight font-['Outfit'] text-white">
                SAHYOG
              </span>
              <span className="hidden sm:inline text-[#D4A373] text-[10px] sm:text-xs font-semibold">(सहयोग)</span>
            </div>
            <p className="hidden md:block text-[9px] text-stone-300 tracking-wider uppercase font-medium">
              Cooperative Service Marketplace
            </p>
          </div>
        </div>

        {/* 2. Middle: Navigation Links (Desktop: >=1024px) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#08281F]/90 p-1.5 rounded-2xl border border-[#1D5C4B]">
          {/* If Master Admin: Pure Governance HQ Navigation */}
          {currentUser?.email === 'admin@gmail.com' ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-teal-300 shadow-md border border-teal-500/50'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>Cooperative Admin Command HQ</span>
            </button>
          ) : currentRole === 'worker' ? (
            /* If Artisan: Direct pure workstation navigation */
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Artisan Workstation</span>
            </button>
          ) : (
            /* Public / Customer Navigation */
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('nav_home', 'Home')}
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('nav_services', 'Services & Trades')}
              </button>

              {/* Dedicated Customer Service Section with Interactive Dropdown on Navbar */}
              <div
                className="relative"
                onMouseEnter={() => setIsCareDropdownOpen(true)}
                onMouseLeave={() => setIsCareDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    setActiveTab('care');
                    setIsCareDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'care'
                      ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                  aria-expanded={isCareDropdownOpen}
                >
                  <Headphones className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{t('nav_care', 'Customer Service')}</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-black border border-emerald-400/30 animate-pulse">
                    24/7
                  </span>
                  <ChevronDown className={`w-3 h-3 text-stone-300 transition-transform ${isCareDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Customer Service Mega Dropdown */}
                {isCareDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-80 bg-white text-stone-800 rounded-2xl shadow-2xl border border-stone-200 py-2.5 z-50 animate-in fade-in">
                    {/* Header Helpline Banner */}
                    <div className="px-4 py-2.5 mx-2 bg-gradient-to-r from-[#08281F] to-[#0C3B2E] text-white rounded-xl mb-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#D4A373] tracking-wider">National Helpdesk</span>
                        <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold">Live 24x7</span>
                      </div>
                      <a
                        href="tel:1800724964"
                        className="font-black text-sm text-white hover:text-[#D4A373] transition-colors flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                        <span>1800-SAHYOG (1800-724-964)</span>
                      </a>
                    </div>

                    {/* Navigation Options */}
                    <div className="px-2 space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('care');
                          setIsCareDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-stone-100 flex items-center justify-between text-stone-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0C3B2E] flex items-center justify-center">
                            <Headphones className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-stone-900">Customer Care Center</p>
                            <p className="text-[10px] text-stone-500">Tickets, FAQs, Callback & SLAs</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('care');
                          setIsCareDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-stone-100 flex items-center justify-between text-stone-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-stone-900">Multilingual Helplines</p>
                            <p className="text-[10px] text-stone-500">7 Regional Indian Languages</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </button>

                      <a
                        href="https://wa.me/919820072496?text=Hello%20Sahyog%20Support%20Team"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-stone-100 flex items-center justify-between text-stone-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-stone-900">WhatsApp Support Desk</p>
                            <p className="text-[10px] text-stone-500">+91 98200-SAHYOG</p>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Role-gated Dashboard Tab */}
              {currentUser && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>My Bookings</span>
                </button>
              )}
            </>
          )}

          {!currentUser && (
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'auth'
                  ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('nav_auth', 'Log In / Register')}</span>
            </button>
          )}
        </nav>

        {/* 3. Right: Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Emergency SOS Button */}
          <button
            onClick={openEmergencyModal}
            className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl shadow-lg flex items-center gap-1 sm:gap-1.5 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap border border-red-400/30 flex-shrink-0"
            title="Fast-track Emergency Artisan Dispatch"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
            <span>SOS<span className="hidden sm:inline"> Urgent</span></span>
          </button>

          {/* Verified Role Pill (Desktop only: >=1024px) */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#144537] border border-[#297762] text-xs font-semibold text-stone-200 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-stone-400 text-[10px]">Verified:</span>
              <span className="font-bold text-white capitalize">
                {currentUser.email === 'admin@gmail.com'
                  ? 'Admin'
                  : currentRole === 'worker'
                  ? 'Artisan'
                  : 'Customer'}
              </span>
            </div>
          )}

          {/* Language Selector (Desktop only: >=1024px) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="p-2 rounded-xl bg-[#144537] hover:bg-[#1D5C4B] border border-[#297762] text-stone-200 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase whitespace-nowrap"
              title="Select Language"
            >
              <Globe className="w-4 h-4 text-[#D4A373]" />
              <span>{language}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-stone-800 rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase">Select Language</div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-100 ${
                      language === l.code ? 'font-bold text-[#0C3B2E] bg-emerald-50' : ''
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-stone-500 font-normal text-[11px]">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown (Desktop only: >=1024px) */}
          {currentUser && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="p-2 rounded-xl bg-[#144537] hover:bg-[#1D5C4B] border border-[#297762] text-stone-200 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-stone-800 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0C3B2E]">Notifications ({unreadCount} new)</span>
                    <span className="text-[11px] text-[#297762] font-medium">Cooperative Alerts</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-500">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs hover:bg-stone-50 cursor-pointer transition-colors ${
                            !n.read_status ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-800">{n.title}</span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Dropdown (Desktop only: >=1024px) */}
          {currentUser ? (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-[#164E3F] hover:bg-[#1D5C4B] border border-[#297762] px-3 py-1.5 rounded-xl text-xs transition-all shadow-xs whitespace-nowrap"
              >
                {currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-amber-300"
                  />
                ) : (
                  <User className="w-4 h-4 text-amber-300" />
                )}
                <span className="font-bold text-white max-w-[120px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-300" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-stone-800 rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-bold text-xs text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openEditProfileModal();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Edit Profile & Photo</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openChangePasswordModal();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await signOut();
                      setActiveTab('home');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="hidden lg:block px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#E0A96D] text-[#0C3B2E] font-bold text-xs shadow-md hover:opacity-95 transition-opacity whitespace-nowrap"
            >
              Log In
            </button>
          )}

          {/* Mobile / Tablet Quick Profile Icon (Mobile only: <1024px) */}
          {currentUser ? (
            <button
              onClick={openEditProfileModal}
              className="lg:hidden p-1.5 rounded-xl bg-[#144537] border border-[#297762] text-stone-200 hover:bg-[#1D5C4B] transition-colors relative flex-shrink-0"
              title="Click to Edit Profile & Photo"
            >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg object-cover border border-amber-300"
                />
              ) : (
                <User className="w-4 h-4 text-amber-300" />
              )}
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-[#0C3B2E]" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="lg:hidden p-1.5 rounded-xl bg-[#144537] border border-[#297762] text-stone-200 hover:bg-[#1D5C4B] transition-colors flex-shrink-0"
              title="Log In"
            >
              <User className="w-4 h-4 text-amber-300" />
            </button>
          )}

          {/* Mobile / Tablet Menu Drawer Toggle Button (Mobile only: <1024px) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-[#144537] border border-[#297762] text-stone-200 hover:bg-[#1D5C4B] transition-colors flex-shrink-0"
            title="Toggle Menu"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-amber-300" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Structured Mobile Navigation Drawer (<1024px) */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#08281F]/98 backdrop-blur-2xl border-t border-b border-[#1D5C4B] px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[82vh] overflow-y-auto shadow-2xl z-50">
          {/* User Profile Card (if authenticated) */}
          {currentUser ? (
            <div className="bg-[#0C3B2E] p-3.5 rounded-2xl border border-[#1D5C4B] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700/60 border border-emerald-400/40 flex items-center justify-center font-bold text-white text-sm">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-xs text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-stone-400 truncate">{currentUser.email}</p>
                  <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-2 py-0.2 rounded-full font-bold uppercase inline-block mt-0.5">
                    {currentUser.email === 'admin@gmail.com' ? 'Admin' : currentRole === 'worker' ? 'Artisan' : 'Customer'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openEditProfileModal();
                  }}
                  className="px-2 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-white/20"
                >
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openChangePasswordModal();
                  }}
                  className="px-2 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-white/20"
                >
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span>Password</span>
                </button>
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await signOut();
                    setActiveTab('home');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-red-900/40 text-red-300 text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-red-900/60"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setActiveTab('auth');
                setIsMenuOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4A373] to-[#E0A96D] text-[#0C3B2E] font-black text-xs shadow flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Log In / Register</span>
            </button>
          )}

          {/* Navigation Links */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2">Navigation</p>
            {currentUser?.email === 'admin@gmail.com' ? (
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                  activeTab === 'dashboard' ? 'bg-[#144537] text-teal-300 border border-teal-500/40' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Admin Command HQ</span>
              </button>
            ) : currentRole === 'worker' ? (
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                  activeTab === 'dashboard' ? 'bg-[#144537] text-amber-300 border border-amber-500/40' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Artisan Workstation</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                    activeTab === 'home' ? 'bg-[#144537] text-[#D4A373] border border-[#297762]' : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('services');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                    activeTab === 'services' ? 'bg-[#144537] text-[#D4A373] border border-[#297762]' : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Services & Trades</span>
                </button>

                {/* Dedicated Customer Service Section in Mobile Drawer */}
                <div className="bg-[#0C3B2E] p-3 rounded-2xl border border-[#1D5C4B] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#D4A373] font-extrabold text-xs">
                      <Headphones className="w-4 h-4 text-[#D4A373]" />
                      <span>Customer Service (24/7)</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Toll-Free
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:1800724964"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 justify-center"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      <span>1800-SAHYOG</span>
                    </a>
                    <a
                      href="https://wa.me/919820072496?text=Hello%20Sahyog%20Support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 text-[11px] font-bold flex items-center gap-1.5 justify-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('care');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                      activeTab === 'care' ? 'bg-[#1D5C4B] text-[#D4A373] border border-[#297762]' : 'bg-white/5 text-stone-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open Customer Care Hub</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                </div>
                {currentUser && (
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                      activeTab === 'dashboard' ? 'bg-[#144537] text-emerald-300 border border-[#297762]' : 'text-stone-300 hover:bg-white/5'
                    }`}
                  >
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>My Bookings</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Language Selector Grid in Mobile Drawer */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Select Language / भाषा</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    language === l.code
                      ? 'bg-[#144537] text-[#D4A373] border border-[#297762] shadow-xs'
                      : 'bg-black/30 text-stone-300 hover:bg-black/50 border border-white/5'
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="text-[10px] text-stone-400 font-normal">{l.native}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating App Dock (Fixed at bottom on <768px screens) */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-[#08281F]/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-1.5 shadow-2xl flex items-center justify-around text-center">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'home'
              ? 'bg-[#144537] text-[#D4A373] shadow-md border border-[#297762]'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Compass className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#D4A373]' : ''}`} />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        {/* Services & Trades (if customer/guest) */}
        {currentRole !== 'worker' && currentUser?.email !== 'admin@gmail.com' && (
          <button
            onClick={() => setActiveTab('services')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
              activeTab === 'services'
                ? 'bg-[#144537] text-[#D4A373] shadow-md border border-[#297762]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'services' ? 'text-[#D4A373]' : ''}`} />
            <span className="text-[10px] font-bold mt-0.5">Trades</span>
          </button>
        )}

        {/* Customer Care */}
        <button
          onClick={() => setActiveTab('care')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'care'
              ? 'bg-[#144537] text-[#D4A373] shadow-md border border-[#297762]'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Headphones className={`w-4 h-4 ${activeTab === 'care' ? 'text-[#D4A373]' : ''}`} />
          <span className="text-[10px] font-bold mt-0.5">Care</span>
        </button>

        {/* Dashboard / Workstation / HQ */}
        <button
          onClick={() => setActiveTab(currentUser ? 'dashboard' : 'auth')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'dashboard' || activeTab === 'auth'
              ? 'bg-[#144537] text-emerald-300 shadow-md border border-emerald-500/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {currentUser?.email === 'admin@gmail.com' ? (
            <Shield className="w-4 h-4 text-teal-400" />
          ) : currentRole === 'worker' ? (
            <Briefcase className="w-4 h-4 text-amber-400" />
          ) : (
            <Receipt className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-[10px] font-bold mt-0.5">
            {currentUser?.email === 'admin@gmail.com'
              ? 'Admin HQ'
              : currentRole === 'worker'
              ? 'Workstation'
              : currentUser
              ? 'Bookings'
              : 'Log In'}
          </span>
        </button>

        {/* SOS Urgent Action */}
        <button
          onClick={openEmergencyModal}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg border border-red-400/40 animate-pulse"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span className="text-[10px] font-extrabold mt-0.5">SOS</span>
        </button>
      </div>
    </header>
  );
};
