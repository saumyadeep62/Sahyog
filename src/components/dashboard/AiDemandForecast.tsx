import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Sparkles, TrendingUp, AlertCircle, ArrowUpRight, BrainCircuit, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AiDemandForecast: React.FC = () => {
  const { forecasts } = useMarketplace();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  const chartData = forecasts.map((f) => ({
    name: f.service_category_name.split('&')[0].trim(),
    zone: f.city,
    'Predicted Demand': f.predicted_demand_units,
    'Available Artisans': f.active_workers_available,
    gap: f.deficit_or_surplus,
  }));

  const trendData = [
    { month: 'Jun', Electrical: 380, Plumbing: 310, Caregivers: 290, Cleaning: 220 },
    { month: 'Jul (Monsoon)', Electrical: 540, Plumbing: 490, Caregivers: 310, Cleaning: 350 },
    { month: 'Aug (Current)', Electrical: 590, Plumbing: 510, Caregivers: 320, Cleaning: 480 },
    { month: 'Sep (Festive)', Electrical: 460, Plumbing: 390, Caregivers: 330, Cleaning: 640 },
    { month: 'Oct (Diwali)', Electrical: 510, Plumbing: 420, Caregivers: 350, Cleaning: 790 },
    { month: 'Nov', Electrical: 430, Plumbing: 340, Caregivers: 360, Cleaning: 410 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0C3B2E] text-white p-6 rounded-2xl border border-[#164E3F] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-[#D4A373] to-[#E0A96D] text-[#0C3B2E] font-bold shadow-md">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg font-['Outfit']">AI Workforce Demand Forecasting</h3>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Backed by demand_forecasts Table
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Predictive machine learning models trained on seasonal trends, weather forecasts, and historical job logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-300">Model Confidence:</span>
          <span className="text-xs bg-[#144537] text-[#D4A373] px-3 py-1 rounded-full font-bold border border-[#297762]">
            94.2% Accuracy
          </span>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Trade Demand vs Supply */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Zone-Wise Demand vs Artisan Availability</h4>
              <p className="text-[11px] text-stone-500">Upcoming 14-Day Projections</p>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
              Live Real-time
            </span>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C3B2E', color: '#fff', borderRadius: 8, fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="Predicted Demand" fill="#D4A373" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Available Artisans" fill="#0C3B2E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 6-Month Seasonal Wave Forecast */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Seasonal Spikes Trend Forecast</h4>
            <p className="text-[11px] text-stone-500">Monsoon surges & Festive Deep Clean spikes</p>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C3B2E', color: '#fff', borderRadius: 8, fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                <Line type="monotone" dataKey="Cleaning" stroke="#D4A373" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Electrical" stroke="#0C3B2E" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Plumbing" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION & REALLOCATION ACTION CARDS */}
      <div className="space-y-3">
        <h4 className="font-bold text-stone-900 text-sm font-['Outfit'] uppercase tracking-wider text-xs">
          Automated Federation Workforce Directives
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecasts.map((fc) => {
            const hasDeficit = fc.deficit_or_surplus < 0;

            return (
              <div
                key={fc.id}
                className={`p-5 rounded-2xl border transition-all ${
                  hasDeficit
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-emerald-50/70 border-emerald-300'
                } space-y-3`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{fc.service_category_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          hasDeficit ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        {hasDeficit ? `Deficit: ${Math.abs(fc.deficit_or_surplus)} Workers` : `Surplus: +${fc.deficit_or_surplus}`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">{fc.region} • {fc.period}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-bold">Demand</span>
                    <span className="font-extrabold text-sm text-stone-800">{fc.predicted_demand_units} units</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block text-[11px]">AI Directive</span>
                    <p className="text-[11px] leading-relaxed text-stone-600 mt-0.5">{fc.ai_recommendation}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => alert(`Federation directive executed: ${fc.ai_recommendation}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#0C3B2E] hover:bg-[#164E3F] text-white font-bold text-[11px] shadow-sm transition-colors"
                  >
                    Execute Workforce Dispatch
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
