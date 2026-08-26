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
  const { currentUser, currentRole, switchRole, signOut, openAuthModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { notifications, markNotificationRead, openEmergencyModal } = useMarketplace();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

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

  const roles: { role: UserRole; label: string; icon: any; desc: string; badgeColor: string; themeTone: string }[] = [
    {
      role: 'customer',
      label: t('role_customer', 'Customer'),
      icon: Users,
      desc: 'Book verified artisans & track jobs',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      themeTone: 'from-[#0C3B2E] via-[#144537] to-[#1D5C4B]',
    },
    {
      role: 'worker',
      label: t('role_worker', 'Artisan / Worker'),
      icon: Briefcase,
      desc: 'Manage jobs, fair wages & welfare fund',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      themeTone: 'from-[#5C3D2E] via-[#8F5C38] to-[#0C3B2E]',
    },
    {
      role: 'federation_admin',
      label: t('role_admin', 'Federation Admin'),
      icon: Shield,
      desc: 'KYC approval, AI forecasting & payouts',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      themeTone: 'from-[#0F172A] via-[#1E293B] to-[#0D9488]',
    },
    {
      role: 'super_admin',
      label: t('role_super', 'Super Admin'),
      icon: LayoutDashboard,
      desc: 'National oversight & platform metrics',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      themeTone: 'from-[#3B0764] via-[#1E1B4B] to-[#0C3B2E]',
    },
  ];

  const currentRoleInfo = roles.find((r) => r.role === currentRole) || roles[0];

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setIsRoleMenuOpen(false);
    setActiveTab('dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0C3B2E]/95 backdrop-blur-xl text-white shadow-2xl border-b border-[#1D5C4B]/60 transition-all">
      {/* Top Banner: Role-Specific Status Indicator & Cooperative Guarantee */}
      <div className="bg-[#07241C] text-[11px] py-1.5 px-4 sm:px-8 border-b border-[#144537]/80 text-stone-300">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4 overflow-hidden">
          <div className="flex items-center gap-3 whitespace-nowrap overflow-x-auto no-scrollbar">
            {/* Active Mode Pill */}
            <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full bg-[#164E3F] text-[#D4A373] border border-[#297762]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentRole === 'customer'
                ? '🏠 Household Customer Portal'
                : currentRole === 'worker'
                ? '⚡ Artisan Workstation & Job Radar'
                : currentRole === 'federation_admin'
                ? '🏛️ Federation Governance HQ'
                : '🌐 National Super Admin Console'}
            </span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300 hidden sm:inline">
              {t('top_cuts', '0% Aggregator Cuts — 100% Floor Wage to Artisans')}
            </span>
            <span className="text-stone-500 hidden md:inline">•</span>
            <span className="text-emerald-300 font-medium hidden md:inline">
              {t('top_welfare', 'Ayushman Bharat & ₹5 Lakh Accidental Cover')}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-stone-400 text-[11px] whitespace-nowrap">
            <span className="text-[#D4A373] font-medium">Multi-State Cooperative Societies Act</span>
            <span>•</span>
            <span>National Helpdesk: 1800-SAHYOG-COOP</span>
          </div>
        </div>
      </div>

      {/* Extended Single-Line Main Navigation Bar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 lg:gap-8">
          {/* 1. Left: Brand Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer flex-shrink-0 group select-none"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4A373] via-[#E0A96D] to-[#faebd7] flex items-center justify-center shadow-lg text-[#0C3B2E] font-black text-2xl transform group-hover:scale-105 transition-all border border-white/20">
              स
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-xl sm:text-2xl font-['Outfit'] text-white">
                  {t('app_title', 'SAHYOG')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D5C4B] text-[#D4A373] font-bold border border-[#297762]">
                  {language === 'or' ? 'ସହଯୋଗ' : language === 'bn' ? 'সহযোগ' : language === 'ta' ? 'சஹயோக்' : language === 'te' ? 'సహయోగ్' : 'सहयोग'}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/80 font-medium tracking-wider uppercase hidden sm:block">
                {t('app_tagline', 'Cooperative Labour Marketplace')}
              </p>
            </div>
          </div>

          {/* 2. Center: Extended Role-Tailored Navigation Pills */}
          <nav className="hidden xl:flex items-center bg-[#08281F]/80 p-1.5 rounded-2xl border border-[#1D5C4B]/60 shadow-inner backdrop-blur-md gap-1 flex-shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{t('nav_home', 'Home')}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('nav_services', 'Services & Trades')}</span>
            </button>

            {/* Distinct Persona Portal Button */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {currentRole === 'customer' && (
                <>
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('nav_my_bookings', 'My Bookings')}</span>
                </>
              )}
              {currentRole === 'worker' && (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('nav_artisan_portal', 'Artisan Workstation')}</span>
                </>
              )}
              {currentRole === 'federation_admin' && (
                <>
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t('nav_federation_admin', 'Federation Command')}</span>
                </>
              )}
              {currentRole === 'super_admin' && (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t('nav_super_admin', 'Super Admin')}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab('auth')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'auth'
                  ? 'bg-gradient-to-r from-[#1D5C4B] to-[#164E3F] text-[#D4A373] shadow-md border border-[#297762]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('nav_auth', 'Sign In / Sign Up')}</span>
            </button>
          </nav>

          {/* 3. Right: Action Toolbar in One Clean Line */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Emergency SOS Button */}
            <button
              onClick={openEmergencyModal}
              className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap border border-red-400/30"
              title="Fast-track Emergency Artisan Dispatch"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
              <span>SOS Urgent</span>
            </button>

            {/* Role Switcher Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="bg-[#144537] hover:bg-[#1D5C4B] border border-[#297762] text-xs px-3 py-2 rounded-xl flex items-center gap-2 transition-all text-stone-200 whitespace-nowrap shadow-xs"
                title="Switch Persona / Interface Mode"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="hidden sm:inline text-stone-400">Mode:</span>
                <span className="font-bold text-white capitalize">
                  {currentRoleInfo.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-stone-800 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50">
                    <p className="text-xs font-black text-[#0C3B2E] uppercase tracking-wider">
                      Select Platform Interface
                    </p>
                    <p className="text-[11px] text-stone-500">Each role features a specialized workstation & tools</p>
                  </div>
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = currentRole === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => handleRoleSwitch(r.role)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[#F4EFEA] transition-colors ${
                          isSelected ? 'bg-emerald-50 text-[#0C3B2E]' : ''
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected ? 'bg-[#0C3B2E] text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{r.label}</span>
                            {isSelected && (
                              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                                Active Mode
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="p-2 rounded-xl bg-[#144537] hover:bg-[#1D5C4B] border border-[#297762] text-stone-200 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase whitespace-nowrap"
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-[#D4A373]" />
                <span>{language}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-stone-800 rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50">
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

            {/* Notifications Dropdown */}
            <div className="relative">
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
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-stone-800 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50">
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

            {/* User Profile Pill */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('signin')}
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
                <span className="hidden md:inline font-bold text-white max-w-[120px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            </div>

            {/* Mobile / Tablet Menu Drawer Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[#144537] border border-[#297762] text-stone-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="xl:hidden bg-[#08281F] border-t border-[#1D5C4B] px-4 py-4 space-y-2 animate-in fade-in">
          <button
            onClick={() => {
              setActiveTab('home');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#144537] transition-colors"
          >
            {t('nav_home', 'Home')}
          </button>
          <button
            onClick={() => {
              setActiveTab('services');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#144537] transition-colors"
          >
            {t('nav_services', 'Services & Trades')}
          </button>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#144537] transition-colors"
          >
            {currentRole === 'customer'
              ? t('nav_my_bookings', 'My Bookings')
              : currentRole === 'worker'
              ? t('nav_artisan_portal', 'Artisan Workstation')
              : currentRole === 'federation_admin'
              ? t('nav_federation_admin', 'Federation Command')
              : t('nav_super_admin', 'Super Admin')}
          </button>
          <button
            onClick={() => {
              setActiveTab('auth');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#144537] text-[#D4A373] flex items-center gap-2 transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>{t('nav_auth', 'Sign In / Sign Up / Login')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
