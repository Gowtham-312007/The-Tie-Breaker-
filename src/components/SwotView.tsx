import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { DecisionOption } from '../types/decision';

interface SwotViewProps {
  options: DecisionOption[];
}

export const SwotView: React.FC<SwotViewProps> = ({ options }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const currentOption = options.find((opt) => opt.id === selectedOptionId) || options[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Strategic Architecture
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            SWOT Analysis Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Internal Strengths & Weaknesses mapped against External Opportunities & Threats.
          </p>
        </div>

        {/* Option Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto self-start sm:self-center">
          {options.map((opt, idx) => {
            const isSelected = opt.id === (currentOption?.id || '');
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <h4 className="text-base font-bold text-slate-900">
            Strategic Profile: {currentOption?.name}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{currentOption?.description}</p>
        </div>

        {/* 4-Quadrant SWOT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths (Internal Positive) */}
          <div className="p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-100 mb-3">
                <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-emerald-950">Strengths (Internal)</h5>
                  <span className="text-[10px] text-emerald-700">Inherent advantages & resources</span>
                </div>
              </div>
              <ul className="space-y-2.5">
                {currentOption?.swot.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Weaknesses (Internal Negative) */}
          <div className="p-5 rounded-xl border border-rose-200/80 bg-rose-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-rose-100 mb-3">
                <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-800 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-rose-950">Weaknesses (Internal)</h5>
                  <span className="text-[10px] text-rose-700">Internal vulnerabilities & blindspots</span>
                </div>
              </div>
              <ul className="space-y-2.5">
                {currentOption?.swot.weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Opportunities (External Positive) */}
          <div className="p-5 rounded-xl border border-sky-200/80 bg-sky-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-sky-100 mb-3">
                <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-sky-950">Opportunities (External)</h5>
                  <span className="text-[10px] text-sky-700">External leverage & future upside</span>
                </div>
              </div>
              <ul className="space-y-2.5">
                {currentOption?.swot.opportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Threats (External Negative) */}
          <div className="p-5 rounded-xl border border-amber-200/80 bg-amber-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-amber-100 mb-3">
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-amber-950">Threats (External)</h5>
                  <span className="text-[10px] text-amber-700">Market, peer, or situational risks</span>
                </div>
              </div>
              <ul className="space-y-2.5">
                {currentOption?.swot.threats.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
