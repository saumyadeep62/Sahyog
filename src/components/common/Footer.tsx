import React from 'react';
import { Shield, HeartHandshake, Award, PhoneCall, Mail, MapPin, Scale } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
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
                <span className="text-stone-300 hover:text-white transition-colors">
                  Electricians & Wiring Guild
                </span>
              </li>
              <li>
                <span className="text-stone-300 hover:text-white transition-colors">
                  Plumbers & Sanitation Brigade
                </span>
              </li>
              <li>
                <span className="text-stone-300 hover:text-white transition-colors">
                  Carpenters & Wood Craftsmen
                </span>
              </li>
              <li>
                <span className="text-stone-300 hover:text-white transition-colors">
                  Elder Care & Palliative Attendants
                </span>
              </li>
              <li>
                <span className="text-stone-300 hover:text-white transition-colors">
                  Domestic Hygiene & Kitchen Support
                </span>
              </li>
              <li>
                <span className="text-stone-300 hover:text-white transition-colors">
                  Appliance Mechanics & HVAC
                </span>
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
              Cooperative Helplines
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Toll-Free Worker Support: 1800-SAHYOG (724-964)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>contact@sahyog.coop / support@sahyog.gov.in</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>National Federation HQ: Shramik Bhavan, Bandra-Kurla Complex, Mumbai 400051</span>
              </li>
              <li className="pt-2">
                <div className="inline-block bg-[#144537] text-amber-200 text-[11px] px-3 py-1 rounded-full border border-[#297762]">
                  Emergency Distress Line: Dial 112 / 100
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#144537] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div>
            © {new Date().getFullYear()} SAHYOG Cooperative Federation. Dignity in Labour, Fairness in Trade.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Cooperative Bylaws</span>
            <span className="hover:text-white cursor-pointer">Welfare Fund Policy</span>
            <span className="hover:text-white cursor-pointer">Grievance Redressal</span>
            <span className="hover:text-white cursor-pointer">Open Source Transparency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
