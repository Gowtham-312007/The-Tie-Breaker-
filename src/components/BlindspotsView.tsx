import React from 'react';
import { EyeOff, AlertOctagon, HelpCircle } from 'lucide-react';
import { BlindspotRisk } from '../types/decision';

interface BlindspotsViewProps {
  blindspots: BlindspotRisk[];
}

export const BlindspotsView: React.FC<BlindspotsViewProps> = ({ blindspots }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Trapdoors & Blindspots
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Second-Order Consequences & Gut Checks
            </h3>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Decisions often fail not from obvious flaws, but from unexamined hidden costs and emotional assumptions.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {blindspots.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900">{item.risk}</h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 self-start sm:self-auto">
                Likelihood: {item.likelihood}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  The Hidden Trapdoor
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {item.hiddenTrapdoor}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Probing Question to Ask Yourself:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium italic leading-relaxed">
                  &ldquo;{item.probingQuestion}&rdquo;
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
