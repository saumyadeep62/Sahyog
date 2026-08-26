import React from 'react';
import { IndiaMap } from './india-map';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Building2, Users } from 'lucide-react';

export function IndiaMapDemo() {
  return (
    <div className="py-20 sm:py-28 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5] w-full border-y border-[#E5DDD0] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#D4A373]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0C3B2E] text-[#D4A373] text-xs font-bold uppercase tracking-wider shadow-sm mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Pan-India Cooperative Guild Network</span>
        </div>

        <p className="font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#0C3B2E] font-['Outfit'] tracking-tight">
          Nationwide{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A373] via-[#c68b59] to-[#8f5c38]">
            {'Cooperation'.split('').map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>

        <p className="text-xs sm:text-base text-stone-600 max-w-2xl mx-auto py-2 leading-relaxed">
          SAHYOG connects Labour Cooperative Federations and Societies across
          India — bringing verified, skilled workers to households and
          institutions in every region, from metros to small towns.
        </p>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-stone-700">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs font-semibold">
            <Building2 className="w-4 h-4 text-emerald-700" />
            42 Multi-State Federations
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs font-semibold">
            <Users className="w-4 h-4 text-emerald-700" />
            14,280+ Active Guild Masters
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#D4A373]" />
            12 Major Urban & Rural Corridors
          </span>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <IndiaMap
          dots={[
            {
              start: { lat: 28.6139, lng: 77.209 }, // Delhi
              end: { lat: 19.076, lng: 72.8777 }, // Mumbai
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // Delhi
              end: { lat: 26.8467, lng: 80.9462 }, // Lucknow
            },
            {
              start: { lat: 19.076, lng: 72.8777 }, // Mumbai
              end: { lat: 12.9716, lng: 77.5946 }, // Bengaluru
            },
            {
              start: { lat: 12.9716, lng: 77.5946 }, // Bengaluru
              end: { lat: 13.0827, lng: 80.2707 }, // Chennai
            },
            {
              start: { lat: 22.5726, lng: 88.3639 }, // Kolkata
              end: { lat: 25.5941, lng: 85.1376 }, // Patna
            },
            {
              start: { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
              end: { lat: 26.9124, lng: 75.7873 }, // Jaipur
            },
            {
              start: { lat: 17.385, lng: 78.4867 }, // Hyderabad
              end: { lat: 20.2961, lng: 85.8245 }, // Bhubaneswar
            },
          ]}
        />
      </div>
    </div>
  );
}

export default IndiaMapDemo;
