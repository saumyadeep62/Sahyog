import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, Radio, Clock, Phone, AlertCircle, ShieldCheck } from 'lucide-react';

declare const window: any;

export interface LatLng {
  lat: number;
  lng: number;
  label?: string;
  name?: string;
  contact?: string;
}

interface GoogleMapViewerProps {
  customerLocation?: LatLng;
  workerLocation?: LatLng;
  showRoute?: boolean;
  height?: string;
  zoom?: number;
  title?: string;
  onLocationFound?: (loc: LatLng) => void;
}

// Global script loading tracker
let isGoogleMapsLoading = false;
let isGoogleMapsLoaded = false;

export const GoogleMapViewer: React.FC<GoogleMapViewerProps> = ({
  customerLocation,
  workerLocation,
  showRoute = false,
  height = '320px',
  zoom = 13,
  title = 'Live Cooperative Navigation Radar',
  onLocationFound,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiKeyAvailable, setApiKeyAvailable] = useState(false);
  const [etaText, setEtaText] = useState<string>('8-12 mins');
  const [distanceText, setDistanceText] = useState<string>('3.2 km');
  const [currentGps, setCurrentGps] = useState<LatLng | null>(customerLocation || null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 1. Request Browser Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userGps: LatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: 'Your Current Household GPS',
          };
          setCurrentGps(userGps);
          onLocationFound?.(userGps);
        },
        () => {
          // Fallback to Mumbai city center if geolocation denied/unavailable
          const defaultLoc: LatLng = customerLocation || {
            lat: 19.076,
            lng: 72.8777,
            label: 'Bandra West, Mumbai (Co-op Zone A)',
          };
          setCurrentGps(defaultLoc);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // 2. Load Google Maps Script if API key is provided
  useEffect(() => {
    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      setApiKeyAvailable(false);
      return;
    }

    setApiKeyAvailable(true);

    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    if (isGoogleMapsLoading) {
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkInterval);
          setMapLoaded(true);
        }
      }, 100);
      return;
    }

    isGoogleMapsLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isGoogleMapsLoaded = true;
      isGoogleMapsLoading = false;
      setMapLoaded(true);
    };
    script.onerror = () => {
      isGoogleMapsLoading = false;
      setMapLoaded(false);
    };
    document.head.appendChild(script);
  }, [apiKey]);

  // 3. Initialize & Update Real Google Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !window.google?.maps) return;

    const centerPos = currentGps || customerLocation || { lat: 19.076, lng: 72.8777 };

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: centerPos.lat, lng: centerPos.lng },
        zoom,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
          { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
          { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
          { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          { featureType: 'water', stylers: [{ color: '#0C3B2E' }, { lightness: 40 }] },
        ],
      });
    }

    const map = mapInstanceRef.current;

    // Customer Marker
    if (centerPos) {
      new window.google.maps.Marker({
        position: { lat: centerPos.lat, lng: centerPos.lng },
        map,
        title: centerPos.label || 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#0C3B2E',
          fillOpacity: 1,
          strokeColor: '#D4A373',
          strokeWeight: 3,
        },
      });
    }

    // Worker Marker & Directions
    if (workerLocation) {
      new window.google.maps.Marker({
        position: { lat: workerLocation.lat, lng: workerLocation.lng },
        map,
        title: workerLocation.name || 'Artisan Location',
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#D97706',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      if (showRoute && centerPos) {
        if (!directionsRendererRef.current) {
          directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#059669',
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
          });
        }

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: { lat: workerLocation.lat, lng: workerLocation.lng },
            destination: { lat: centerPos.lat, lng: centerPos.lng },
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === 'OK' && result) {
              directionsRendererRef.current.setDirections(result);
              const leg = result.routes[0]?.legs[0];
              if (leg) {
                setDistanceText(leg.distance?.text || '3.2 km');
                setEtaText(leg.duration?.text || '10 mins');
              }
            }
          }
        );
      }
    }
  }, [mapLoaded, currentGps, workerLocation, showRoute]);

  const activeCustomerLoc = currentGps || customerLocation || { lat: 19.076, lng: 72.8777 };
  const activeWorkerLoc = workerLocation || { lat: 19.082, lng: 72.884, name: 'Assigned Artisan' };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-[#08281F]">
      {/* Top Header Controls */}
      <div className="bg-[#0C3B2E]/90 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 border-b border-emerald-800/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 z-10 relative">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse flex-shrink-0" />
          <span className="font-extrabold text-xs font-['Outfit'] tracking-wide truncate">{title}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {showRoute && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30 text-[11px]">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>ETA: {etaText}</span>
              <span className="text-stone-400">({distanceText})</span>
            </span>
          )}

          <button
            onClick={() => {
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${activeCustomerLoc.lat},${activeCustomerLoc.lng}&travelmode=driving`;
              window.open(mapsUrl, '_blank');
            }}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-[11px] shadow flex items-center gap-1 transition-all"
            title="Launch Google Maps App with Turn-by-Turn GPS Navigation"
          >
            <Navigation className="w-3 h-3 fill-stone-950 transform rotate-45" />
            <span>Open GPS App</span>
          </button>

          <span className="text-[11px] font-mono text-stone-300 bg-white/10 px-2.5 py-0.5 rounded-lg hidden sm:inline">
            GPS: {activeCustomerLoc.lat.toFixed(4)}, {activeCustomerLoc.lng.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Map Display Container */}
      {apiKeyAvailable && mapLoaded ? (
        <div ref={mapContainerRef} style={{ height, width: '100%' }} className="relative z-0" />
      ) : (
        /* Visual Satellite Radar Fallback when Google Maps Key is loading / pending */
        <div
          style={{ height }}
          className="relative w-full bg-gradient-to-b from-[#08281F] via-[#0C3B2E] to-[#08281F] flex items-center justify-center overflow-hidden select-none"
        >
          {/* Subtle Grid Matrix */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#164E3F18_1px,transparent_1px),linear-gradient(to_bottom,#164E3F18_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Concentric Radar Rings */}
          <div className="absolute w-[500px] h-[500px] rounded-full border border-emerald-500/10 animate-ping duration-1000" />
          <div className="absolute w-80 h-80 rounded-full border border-emerald-400/20" />
          <div className="absolute w-52 h-52 rounded-full border border-emerald-400/30" />
          <div className="absolute w-24 h-24 rounded-full border border-amber-400/40" />

          {/* Sweep Ray */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/15 via-transparent to-transparent animate-spin opacity-60" />

          {/* Route Trajectory Polyline Simulation */}
          {showRoute && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line
                x1="35%"
                y1="60%"
                x2="65%"
                y2="40%"
                stroke="#10B981"
                strokeWidth="4"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </svg>
          )}

          {/* Customer Marker Icon */}
          <div className="absolute left-[35%] top-[60%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-2xl bg-[#0C3B2E] border-2 border-emerald-400 text-white shadow-xl flex items-center justify-center animate-bounce">
              <MapPin className="w-5 h-5 text-emerald-300 fill-emerald-300/30" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-[#08281F]/90 text-[10px] font-bold text-white border border-emerald-500/40 shadow">
              Your Household GPS
            </span>
          </div>

          {/* Worker Marker Icon (If in Route / Active) */}
          {showRoute && (
            <div className="absolute left-[65%] top-[40%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 border-2 border-white text-stone-900 shadow-xl flex items-center justify-center animate-pulse">
                <Navigation className="w-5 h-5 text-stone-900 fill-stone-900 transform rotate-45" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-amber-950/90 text-[10px] font-bold text-amber-300 border border-amber-500/40 shadow whitespace-nowrap">
                {activeWorkerLoc.name || 'Artisan En Route'} • {etaText}
              </span>
            </div>
          )}

          {/* Bottom Overlay Info Banner */}
          <div className="absolute bottom-3 left-4 right-4 bg-[#08281F]/80 backdrop-blur-md rounded-2xl p-3 border border-emerald-800/60 text-white flex flex-col sm:flex-row items-center justify-between gap-2 z-20 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
              <span className="font-semibold text-stone-200">
                Cooperative Geo-Cluster • Bandra-Khar Regional Zone
              </span>
            </div>
            <span className="text-[11px] text-amber-300 font-mono">
              Live Dispatch Radar Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
