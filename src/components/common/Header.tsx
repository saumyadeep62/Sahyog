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
  const { currentUser, currentRole, isAuthenticated, signOut, openAuthModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { notifications, markNotificationRead, openEmergencyModal } = useMarketplace();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
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
      <div className="bg-[#07241C] text-[11px] py-1.5 px-4 sm:px-8 border-b border-[#144537]/80 text-stone-300">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4 overflow-hidden">
          <div className="flex items-center gap-3 whitespace-nowrap overflow-x-auto no-scrollbar">
            {/* Active Mode Pill */}
            {currentUser ? (
              <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full bg-[#164E3F] text-[#D4A373] border border-[#297762]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {currentUser.email === 'admin@gmail.com'
                  ? '🏛️ Cooperative Admin Command'
                  : currentRole === 'worker'
                  ? '⚡ Artisan Workstation'
                  : '🏠 Household Customer Portal'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full bg-[#164E3F] text-[#D4A373] border border-[#297762]">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                🌐 Public Cooperative Marketplace
              </span>
            )}
            <span className="text-stone-500">•</span>
            <span className="text-stone-300 hidden sm:inline">
              {t('top_cuts', '0% Aggregator Cuts — 100% Floor Wage to Artisans')}
            </span>
            <span className="text-stone-500 hidden md:inline">•</span>
            <span className="text-stone-400 hidden md:inline text-[10px]">
              Secured under Multi-State Co-op Societies Act, 2002
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-stone-300 flex items-center gap-1 font-mono">
              <span className="text-[#D4A373] font-bold">24x7 SOS:</span> 1800-SAHYOG-99
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* 1. Left: Brand Identity */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4A373] via-[#E0A96D] to-[#FAEDCD] flex items-center justify-center text-[#0C3B2E] font-black text-xl shadow-lg border border-[#D4A373]/50 group-hover:scale-105 transition-transform">
            स
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight font-['Outfit'] text-white">
                SAHYOG
              </span>
              <span className="text-[#D4A373] text-xs font-semibold">(सहयोग)</span>
            </div>
            <p className="text-[10px] text-stone-300 tracking-wider uppercase font-medium">
              Cooperative Service Marketplace
            </p>
          </div>
        </div>

        {/* 2. Middle: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#08281F]/90 p-1.5 rounded-2xl border border-[#1D5C4B]">
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
              <span>{t('nav_auth', 'Sign In / Sign Up')}</span>
            </button>
          )}
        </nav>

        {/* 3. Right: Action Toolbar */}
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

          {/* Verified Role Pill (Read-Only) */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#144537] border border-[#297762] text-xs font-semibold text-stone-200">
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

          {/* Notifications Dropdown (When Logged In) */}
          {currentUser && (
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
          )}

          {/* User Profile / Auth Action */}
          {currentUser ? (
            <div className="relative">
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
                <span className="hidden md:inline font-bold text-white max-w-[120px] truncate">
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
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#E0A96D] text-[#0C3B2E] font-bold text-xs shadow-md hover:opacity-95 transition-opacity"
            >
              Sign In
            </button>
          )}

          {/* Mobile / Tablet Menu Drawer Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#144537] border border-[#297762] text-stone-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="xl:hidden bg-[#08281F] border-t border-[#1D5C4B] px-4 py-4 space-y-2 animate-in fade-in">
          {currentUser?.email === 'admin@gmail.com' ? (
            <>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold bg-[#144537] text-teal-300 transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Cooperative Admin Command HQ</span>
              </button>
              <button
                onClick={async () => {
                  setIsMenuOpen(false);
                  await signOut();
                  setActiveTab('home');
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-900/30 text-red-400 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : currentRole === 'worker' ? (
            <>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold bg-[#144537] text-amber-300 transition-colors flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Artisan Workstation</span>
              </button>
              <button
                onClick={async () => {
                  setIsMenuOpen(false);
                  await signOut();
                  setActiveTab('home');
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-900/30 text-red-400 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
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
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#144537] text-emerald-300 transition-colors"
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await signOut();
                      setActiveTab('home');
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-900/30 text-red-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#144537] text-[#D4A373] flex items-center gap-2 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t('nav_auth', 'Sign In / Sign Up')}</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};
