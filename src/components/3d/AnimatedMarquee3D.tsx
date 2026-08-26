import React from 'react';
import { Shield, Sparkles, Zap, Award, CheckCircle2, HeartHandshake, Scale } from 'lucide-react';

export const AnimatedMarquee3D: React.FC = () => {
  const items = [
    { icon: Shield, text: '0% Extractive Commission', highlight: 'Worker Retains 100%' },
    { icon: Award, text: 'NSDC & ITI Certified', highlight: 'Skill Verified' },
    { icon: HeartHandshake, text: '₹5 Lakh Accident Shield', highlight: 'Ayushman Bharat' },
    { icon: Scale, text: 'Guaranteed Floor Wages', highlight: 'Statutory Standard' },
    { icon: Zap, text: 'SOS Fast-Track Dispatch', highlight: '3.5 km Radar' },
    { icon: CheckCircle2, text: 'Democratic Dispute Desk', highlight: 'No Algorithm Bans' },
    { icon: Sparkles, text: 'Annual Co-op Dividend', highlight: 'Member Profit Share' },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#0C3B2E] py-4 border-y border-[#1D5C4B] shadow-inner">
      <div className="flex w-max animate-marquee space-x-6">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-md transform hover:scale-105 transition-transform"
            >
              <Icon className="w-4 h-4 text-[#D4A373] flex-shrink-0" />
              <span>{item.text}</span>
              <span className="text-[10px] bg-[#D4A373] text-[#0C3B2E] px-2 py-0.5 rounded-full font-bold">
                {item.highlight}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
