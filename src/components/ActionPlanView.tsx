import React, { useState } from 'react';
import { ListOrdered, Calendar, BookmarkCheck, CheckCircle, Save } from 'lucide-react';
import { ActionStep, DecisionOption } from '../types/decision';

interface ActionPlanViewProps {
  actionPlan: ActionStep[];
  options: DecisionOption[];
  recommendedOptionName: string;
  onCommitDecision: (chosenOption: string, reflectionNotes: string) => void;
  savedChosenOption?: string;
  savedReflection?: string;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  actionPlan,
  options,
  recommendedOptionName,
  onCommitDecision,
  savedChosenOption,
  savedReflection,
}) => {
  const [chosenOption, setChosenOption] = useState<string>(
    savedChosenOption || recommendedOptionName || options[0]?.name || ''
  );
  const [reflectionNotes, setReflectionNotes] = useState<string>(savedReflection || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    onCommitDecision(chosenOption, reflectionNotes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Execution Roadmap
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Action Plan & Decision Commitment
            </h3>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          A decision without an execution sequence is just worry. Follow these concrete steps.
        </p>
      </div>

      {/* Action Steps */}
      <div className="mt-6 space-y-3">
        {actionPlan.map((step) => (
          <div
            key={step.step}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {step.step}
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{step.timeline}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Commitment Module */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="p-5 sm:p-6 rounded-xl bg-slate-900 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BookmarkCheck className="w-5 h-5 text-amber-300" />
            <h4 className="text-base sm:text-lg font-bold text-white">
              Commit to Your Decision
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mb-4">
            Record what you decided and why. Revisit this later in your Journal to review your calibration.
          </p>

          <form onSubmit={handleSaveCommitment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Which path are you choosing?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {options.map((opt) => {
                  const isSelected = chosenOption === opt.name;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setChosenOption(opt.name)}
                      className={`p-3 rounded-lg text-left text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-900 border-amber-300'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{opt.name}</span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Personal Rationale & Gut Check Note (Optional)
              </label>
              <textarea
                rows={2}
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="Why did you ultimately pick this? What assumption must hold true for this to be a win?"
                className="w-full px-3 py-2 text-xs text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-300 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                {savedSuccess ? 'Saved to your Journal!' : 'Saved locally in your browser.'}
              </span>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Decision to Journal</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
