import React from 'react';
import { Shield, HeartHandshake, Award, PhoneCall, Mail, MapPin, Scale, Headphones } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#08281F] text-stone-300 border-t border-[#144537] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Manifesto */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4A373] to-[#E0A96D] flex items-center justify-center text-[#0C3B2E] font-extrabold text-xl shadow-md">
                स
              </div>
              <div>
                <span className="font-extrabold text-xl font-['Outfit'] text-white">SAHYOG</span>
                <span className="text-xs px-2 py-0.5 ml-2 rounded bg-[#1D5C4B] text-[#D4A373] font-semibold">
                  सहयोग
                </span>
                <p className="text-[11px] text-stone-400">Cooperative-Owned Labour Marketplace</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-stone-400">
              Unlike private gig platforms that extract 25-35% commission and commodify labour, SAHYOG is democratically
              owned by Labour Cooperative Federations. Every rupee spent supports living wages, accident safety, and
              mutual welfare.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4A373] font-medium">
              <Shield className="w-4 h-4" />
              <span>Registered under Multi-State Co-op Societies Act</span>
            </div>
          </div>

          {/* Core Cooperative Trades */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4A373]" />
              Certified Trades
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab?.('services')}
                  className="text-stone-300 hover:text-white transition-colors text-left"
                >
                  Electricians & Wiring Guild
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('services')}
                  className="text-stone-300 hover:text-white transition-colors text-left"
                >
                  Plumbers & Sanitation Brigade
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('services')}
                  className="text-stone-300 hover:text-white transition-colors text-left"
                >
                  Carpenters & Wood Craftsmen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('services')}
                  className="text-stone-300 hover:text-white transition-colors text-left"
                >
                  Elder Care & Palliative Attendants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('services')}
                  className="text-stone-300 hover:text-white transition-colors text-left"
                >
                  Domestic Hygiene & Kitchen Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('services')}
                  className="text-stone-300 hover:text-white transition-colors text-left"
                >
                  Gardeners & Landscaping Guild
                </button>
              </li>
            </ul>
          </div>

          {/* Fair Value Distribution */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#D4A373]" />
              Where Does ₹100 Go?
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="bg-[#0C3B2E] p-2.5 rounded-lg border border-[#164E3F]">
                <div className="flex justify-between font-bold text-white">
                  <span>Worker Direct Wage</span>
                  <span className="text-emerald-400">88%</span>
                </div>
                <div className="w-full bg-[#144537] h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full w-[88%]"></div>
                </div>
              </div>
              <div className="bg-[#0C3B2E] p-2.5 rounded-lg border border-[#164E3F]">
                <div className="flex justify-between font-medium text-stone-200">
                  <span>Welfare & Health Fund</span>
                  <span className="text-amber-300">7%</span>
                </div>
                <div className="w-full bg-[#144537] h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-amber-300 h-full rounded-full w-[7%]"></div>
                </div>
              </div>
              <div className="bg-[#0C3B2E] p-2.5 rounded-lg border border-[#164E3F]">
                <div className="flex justify-between font-medium text-stone-200">
                  <span>Society Admin Overhead</span>
                  <span className="text-sky-300">5%</span>
                </div>
                <div className="w-full bg-[#144537] h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-sky-300 h-full rounded-full w-[5%]"></div>
                </div>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <span>✓ Private Aggregator Fee: ₹0.00</span>
              </div>
            </div>
          </div>

          {/* Contact & Helpline */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#D4A373]" />
              24/7 Customer Care & Helpdesk
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <a href="tel:1800724964" className="hover:text-emerald-300 font-bold text-white transition-colors">
                  Toll-Free: 1800-SAHYOG (724-964)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a href="mailto:care@sahyog.coop" className="hover:text-emerald-300 transition-colors">
                  care@sahyog.coop
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>National Federation HQ: Shramik Bhavan, BKC, Mumbai 400051</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigateTab?.('care')}
                  className="w-full py-2 rounded-xl bg-[#144537] hover:bg-[#1D5C4B] text-amber-200 text-[11px] font-bold border border-[#297762] transition-colors flex items-center justify-center gap-2"
                >
                  <Headphones className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open Customer Care Desk →</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#144537] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} SAHYOG Cooperative Federation. Dignity in Labour, Fairness in Trade.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] sm:text-xs">
            <span className="hover:text-white cursor-pointer transition-colors">Cooperative Bylaws</span>
            <span className="hover:text-white cursor-pointer transition-colors">Welfare Policy</span>
            <button
              onClick={() => onNavigateTab?.('care')}
              className="hover:text-emerald-300 cursor-pointer transition-colors"
            >
              Grievance Redressal
            </button>
            <button
              onClick={() => onNavigateTab?.('care')}
              className="hover:text-emerald-300 cursor-pointer transition-colors"
            >
              Customer Care
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
