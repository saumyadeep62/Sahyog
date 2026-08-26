import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface MapDot {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

export interface IndiaMapProps {
  dots?: MapDot[];
  className?: string;
}

// Convert Lat/Lng to SVG coordinates for India bounding box
// India bounds approximately: Lat 8.0 to 37.5 N, Lng 68.0 to 97.5 E
function projectLatLngToSvg(lat: number, lng: number, width: number = 800, height: number = 900) {
  const minLat = 7.5;
  const maxLat = 37.5;
  const minLng = 68.0;
  const maxLng = 97.5;

  const x = ((lng - minLng) / (maxLng - minLng)) * (width * 0.82) + width * 0.09;
  const y = height - ((lat - minLat) / (maxLat - minLat)) * (height * 0.84) - height * 0.08;

  return { x, y };
}

// Key cooperative city hubs
const CITY_HUBS = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.209, coop: 'Delhi Karigar Kalyan Union', members: '3,750 Artisans' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, coop: 'Mumbai Shramik Sahakari', members: '4,280 Artisans' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, coop: 'Bengaluru Skilled Artisans Guild', members: '3,120 Artisans' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, coop: 'Tamil Nadu Labour Federation', members: '2,890 Artisans' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, coop: 'Bengal Shramik Samabay', members: '2,640 Artisans' },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867, coop: 'Telangana Karigar Guild', members: '2,410 Artisans' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, coop: 'Gujarat Mazdoor Sahakari', members: '2,190 Artisans' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, coop: 'Pune Nirman & Seva Sahakari', members: '2,450 Artisans' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, coop: 'Awadh Karigar Samiti', members: '1,890 Artisans' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, coop: 'Rajasthan Shilpkar Union', members: '1,720 Artisans' },
  { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, coop: 'Odisha Shramik Sangha', members: '1,450 Artisans' },
  { name: 'Patna', lat: 25.5941, lng: 85.1376, coop: 'Bihar Mazdoor Kalyan Samiti', members: '1,610 Artisans' },
];

export const IndiaMap: React.FC<IndiaMapProps> = ({ dots = [], className = '' }) => {
  const [hoveredHub, setHoveredHub] = useState<typeof CITY_HUBS[0] | null>(null);

  // Approximate Stylized SVG Polygon Points for India boundary
  const indiaOutlinePath = `
    M 310,45 
    C 330,40 370,40 395,55 
    C 420,70 425,100 410,125 
    C 435,130 460,150 450,180 
    C 475,190 510,195 535,210 
    C 565,225 580,240 610,250 
    C 645,260 690,265 725,290 
    C 745,310 740,335 710,345 
    C 675,350 640,345 615,360 
    C 585,380 570,405 560,430 
    C 555,465 540,495 520,530 
    C 505,560 480,610 460,660 
    C 440,710 425,765 410,810 
    C 395,850 380,875 365,885 
    C 355,875 340,845 330,810 
    C 315,760 295,710 270,660 
    C 250,620 230,580 215,540 
    C 195,490 180,450 170,410 
    C 155,360 145,330 170,305 
    C 190,285 220,270 230,240 
    C 240,210 250,175 260,140 
    C 275,100 290,65 310,45 Z
  `;

  return (
    <div className={`relative w-full max-w-4xl mx-auto flex items-center justify-center p-4 ${className}`}>
      <svg
        viewBox="0 0 800 900"
        className="w-full h-auto max-h-[640px] drop-shadow-2xl overflow-visible select-none"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c3b2e" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#144537" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#08281F" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="arcGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A373" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#E0A96D" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4A373" stopOpacity="0.2" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Radial Grid Pattern */}
          <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#2d6a4f" opacity="0.35" />
          </pattern>
        </defs>

        {/* Background Ambient Glow */}
        <ellipse cx="400" cy="460" rx="360" ry="420" fill="#0C3B2E" opacity="0.15" filter="url(#glow)" />

        {/* Stylized India Landmass Outline */}
        <path
          d={indiaOutlinePath}
          fill="url(#mapBgGrad)"
          stroke="#2D6A4F"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />

        {/* Dot Matrix Pattern inside Landmass */}
        <path d={indiaOutlinePath} fill="url(#gridPattern)" opacity="0.75" />

        {/* Internal Topological Grid / Meridian Lat-Long Lines */}
        <g opacity="0.18" stroke="#52B788" strokeWidth="0.8" strokeDasharray="4 4">
          <line x1="200" y1="200" x2="600" y2="200" />
          <line x1="160" y1="360" x2="640" y2="360" />
          <line x1="180" y1="520" x2="580" y2="520" />
          <line x1="240" y1="680" x2="480" y2="680" />
          <line x1="300" y1="100" x2="300" y2="800" />
          <line x1="450" y1="100" x2="450" y2="800" />
        </g>

        {/* Dynamic Curved Connection Arcs */}
        {dots.map((dot, idx) => {
          const startPt = projectLatLngToSvg(dot.start.lat, dot.start.lng);
          const endPt = projectLatLngToSvg(dot.end.lat, dot.end.lng);

          const midX = (startPt.x + endPt.x) / 2;
          const midY = (startPt.y + endPt.y) / 2;
          const dist = Math.hypot(endPt.x - startPt.x, endPt.y - startPt.y);
          // Arch upward/outward perpendicular to chord
          const arcHeight = Math.min(dist * 0.35, 75);
          const ctrlX = midX - ((endPt.y - startPt.y) / dist) * arcHeight;
          const ctrlY = midY + ((endPt.x - startPt.x) / dist) * arcHeight;

          const pathD = `M ${startPt.x},${startPt.y} Q ${ctrlX},${ctrlY} ${endPt.x},${endPt.y}`;

          return (
            <g key={idx}>
              {/* Static Background Arc */}
              <path
                d={pathD}
                fill="none"
                stroke="#D4A373"
                strokeWidth="1.6"
                strokeOpacity="0.4"
                strokeDasharray="4 3"
              />

              {/* Animated Glowing Foreground Pulse Arc */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#arcGlowGrad)"
                strokeWidth="2.4"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.4,
                }}
              />

              {/* Moving Pulse Particle traveling along the path */}
              <circle r="3.5" fill="#FFE082" filter="url(#glow)">
                <animateMotion path={pathD} dur={`${3 + (idx % 3)}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* City Hub Beacons & Interactive Markers */}
        {CITY_HUBS.map((hub, i) => {
          const pt = projectLatLngToSvg(hub.lat, hub.lng);
          const isHovered = hoveredHub?.name === hub.name;

          return (
            <g
              key={i}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredHub(hub)}
              onMouseLeave={() => setHoveredHub(null)}
            >
              {/* Outer Pulsing Beacon Wave */}
              <circle cx={pt.x} cy={pt.y} r="12" fill="#52B788" opacity="0.25">
                <animate attributeName="r" values="6;18;6" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
              </circle>

              {/* Inner Node Ring */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4}
                fill="#D4A373"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                filter="url(#glow)"
                className="transition-all duration-300"
              />

              {/* Label */}
              <text
                x={pt.x}
                y={pt.y - 10}
                textAnchor="middle"
                fill="#FAF8F5"
                fontSize={isHovered ? 12 : 10}
                fontWeight={isHovered ? 'bold' : '600'}
                className="pointer-events-none drop-shadow-md select-none transition-all"
              >
                {hub.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Interactive Hub Details Tooltip Card */}
      {hoveredHub && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#08281F]/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#D4A373]/40 text-white shadow-2xl text-xs space-y-1 z-30 pointer-events-none min-w-[260px] text-center"
        >
          <div className="flex items-center justify-center gap-2 font-bold text-sm text-[#D4A373]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{hoveredHub.name} Cooperative Zone</span>
          </div>
          <p className="text-stone-300 text-xs font-medium">{hoveredHub.coop}</p>
          <p className="text-emerald-400 text-[11px] font-bold">{hoveredHub.members} Active on Network</p>
        </motion.div>
      )}
    </div>
  );
};

export default IndiaMap;
