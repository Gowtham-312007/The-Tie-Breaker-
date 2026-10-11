import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ShieldAlert, Sparkles, Clock, Check } from 'lucide-react';
import { DecisionOption, ProPoint, ConPoint } from '../types/decision';

interface ProsConsViewProps {
  options: DecisionOption[];
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ options }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  // State to track excluded/toggled items by user
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());

  const currentOption = options.find((opt) => opt.id === selectedOptionId) || options[0];

  const toggleExclude = (id: string) => {
    const next = new Set(excludedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExcludedIds(next);
  };

  // Calculate Net Pro/Con Score for current option
  const activePros = (currentOption?.pros || []).filter((p) => !excludedIds.has(p.id));
  const activeCons = (currentOption?.cons || []).filter((c) => !excludedIds.has(c.id));

  const totalProImpact = activePros.reduce((acc, p) => acc + p.impact, 0);
  const totalConSeverity = activeCons.reduce((acc, c) => acc + c.severity, 0);
  const netScore = totalProImpact - totalConSeverity;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dilemma Breakdown
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Balanced Pros & Cons with Pragmatic Mitigations
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every con includes an AI mitigation to test if the risk can be neutralized.
          </p>
        </div>

        {/* Option Selector Buttons */}
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

      {/* Selected Option Banner & Net Balance Meter */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-slate-900 text-base">{currentOption?.name}</h4>
          <p className="text-xs text-slate-600 mt-0.5">{currentOption?.description}</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-slate-600">
            <span>Pros Weight: </span>
            <span className="font-bold text-emerald-700">+{totalProImpact}</span>
          </div>
          <div className="text-slate-600">
            <span>Cons Burden: </span>
            <span className="font-bold text-rose-700">-{totalConSeverity}</span>
          </div>
          <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-500">Net Delta: </span>
            <span
              className={`font-bold ${
                netScore > 0 ? 'text-emerald-700' : netScore < 0 ? 'text-rose-700' : 'text-slate-700'
              }`}
            >
              {netScore > 0 ? `+${netScore}` : netScore}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Pros & Cons */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pros Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ThumbsUp className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Advantages & Upsides ({currentOption?.pros.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Impact 1–5</span>
          </div>

          <div className="space-y-3">
            {currentOption?.pros.map((pro: ProPoint) => {
              const isExcluded = excludedIds.has(pro.id);
              return (
                <div
                  key={pro.id}
                  className={`p-4 rounded-xl border transition ${
                    isExcluded
                      ? 'bg-slate-50 border-slate-200 opacity-50'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      {pro.point}
                    </p>
                    <button
                      onClick={() => toggleExclude(pro.id)}
                      title={isExcluded ? 'Re-include in calculation' : 'Exclude from calculation'}
                      className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition shrink-0 ml-1"
                    >
                      {isExcluded ? 'Include' : 'Omit'}
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 font-medium">{pro.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{pro.timeframe}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400">Impact:</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <span
                            key={val}
                            className={`w-2 h-2 rounded-xs ${
                              val <= pro.impact ? 'bg-emerald-600' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cons Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center">
                <ThumbsDown className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Disadvantages & Mitigations ({currentOption?.cons.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Severity 1–5</span>
          </div>

          <div className="space-y-3">
            {currentOption?.cons.map((con: ConPoint) => {
              const isExcluded = excludedIds.has(con.id);
              return (
                <div
                  key={con.id}
                  className={`p-4 rounded-xl border transition ${
                    isExcluded
                      ? 'bg-slate-50 border-slate-200 opacity-50'
                      : 'bg-white border-slate-200 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      {con.point}
                    </p>
                    <button
                      onClick={() => toggleExclude(con.id)}
                      title={isExcluded ? 'Re-include in calculation' : 'Exclude from calculation'}
                      className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition shrink-0 ml-1"
                    >
                      {isExcluded ? 'Include' : 'Omit'}
                    </button>
                  </div>

                  {/* Mitigation Insight */}
                  {con.mitigation && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/50 text-xs">
                      <span className="font-semibold text-amber-900 block mb-0.5">
                        Mitigation Strategy:
                      </span>
                      <p className="text-slate-700 leading-relaxed">{con.mitigation}</p>
                    </div>
                  )}

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 font-medium">{con.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{con.timeframe}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400">Severity:</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <span
                            key={val}
                            className={`w-2 h-2 rounded-xs ${
                              val <= con.severity ? 'bg-rose-600' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
