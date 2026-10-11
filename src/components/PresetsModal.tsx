import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { DECISION_PRESETS, DecisionPreset } from '../data/presets';
import { DecisionFormInputs } from '../types/decision';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (inputs: DecisionFormInputs) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Explore Sample Scenarios</h3>
              <p className="text-xs text-slate-500">
                Test the Tiebreaker engine with high-stakes, real-world dilemmas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 overflow-y-auto flex-1 pr-1">
          {DECISION_PRESETS.map((preset: DecisionPreset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset.inputs);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white cursor-pointer transition group shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                  {preset.badge}
                </span>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 flex items-center gap-1 transition">
                  <span>Load Dilemma</span>
                  <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-slate-900">
                {preset.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {preset.shortDesc}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span>{preset.inputs.options.length} Paths</span>
                <span aria-hidden="true">·</span>
                <span>Horizon: {preset.inputs.timeHorizon}</span>
                <span aria-hidden="true">·</span>
                <span>{preset.inputs.priorities.length} Key Values</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
