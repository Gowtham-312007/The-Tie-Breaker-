import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Sparkles, SlidersHorizontal, HelpCircle, Check, Loader2 } from 'lucide-react';
import { DecisionFormInputs } from '../types/decision';

interface DecisionFormProps {
  onSubmit: (inputs: DecisionFormInputs) => void;
  isLoading: boolean;
  initialInputs?: DecisionFormInputs;
  onOpenPresets: () => void;
}

const COMMON_PRIORITIES = [
  'Financial return & runway',
  'Work-life balance & health',
  'Long-term career growth',
  'Autonomy & freedom',
  'Downside risk minimization',
  'Speed & simplicity',
  'Family & relationship impact',
  'Learning & technical mastery',
];

const TIME_HORIZONS = ['Immediate (weeks)', '6 to 12 Months', '1 to 3 Years', '5+ Years'];
const RISK_TOLERANCES = [
  'Conservative (Protect the downside)',
  'Balanced (Calculated trade-offs)',
  'Aggressive (Maximize upside potential)',
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  initialInputs,
  onOpenPresets,
}) => {
  const [question, setQuestion] = useState(initialInputs?.question || '');
  const [options, setOptions] = useState<string[]>(
    initialInputs?.options && initialInputs.options.length >= 2
      ? initialInputs.options
      : ['', '']
  );
  const [context, setContext] = useState(initialInputs?.context || '');
  const [priorities, setPriorities] = useState<string[]>(initialInputs?.priorities || []);
  const [customPriority, setCustomPriority] = useState('');
  const [timeHorizon, setTimeHorizon] = useState(initialInputs?.timeHorizon || '1 to 3 Years');
  const [riskTolerance, setRiskTolerance] = useState(
    initialInputs?.riskTolerance || 'Balanced (Calculated trade-offs)'
  );
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(initialInputs?.context || initialInputs?.priorities?.length)
  );

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const togglePriority = (p: string) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter((item) => item !== p));
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleAddCustomPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPriority.trim() && !priorities.includes(customPriority.trim())) {
      setPriorities([...priorities, customPriority.trim()]);
      setCustomPriority('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Filter out empty option strings, or keep if provided
    const cleanOptions = options.map((opt) => opt.trim()).filter(Boolean);

    onSubmit({
      question: question.trim(),
      options: cleanOptions,
      context: context.trim(),
      priorities,
      timeHorizon,
      riskTolerance,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Decision Framework
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Frame Your Dilemma
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Provide the choices you are weighing. The Tiebreaker runs deep pros & cons, a comparison matrix, and a SWOT analysis to break the tie.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenPresets}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Load Sample Dilemma</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Core Question */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-900">
              The Decision Question <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Press ↵ Enter to analyze</span>
          </div>
          <input
            id="decision-question-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (question.trim()) {
                  // If options are empty, let user choose to fill or submit
                  const hasAnyOption = options.some((o) => o.trim().length > 0);
                  if (!hasAnyOption) {
                    const optA = document.getElementById('option-input-0');
                    if (optA) {
                      optA.focus();
                      return;
                    }
                  }
                  handleSubmit(e);
                }
              }
            }}
            placeholder="e.g. Should I accept the Founding Lead role at Startup X or stay at Big Tech?"
            className="w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm sm:text-base transition placeholder:text-slate-400"
            required
          />
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            <span>Tip: Specific dilemmas yield sharper decisive factors.</span>
          </div>
        </div>

        {/* Options to Compare */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-900">
              Candidate Options / Paths
            </label>
            <span className="text-xs text-slate-500">
              {options.filter((o) => o.trim()).length} of {options.length} defined · Press ↵ Enter to submit
            </span>
          </div>

          <div className="space-y-2.5">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                  {String.fromCharCode(65 + idx)}
                </div>
                <input
                  id={`option-input-${idx}`}
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // If there is an empty subsequent option, jump to it
                      if (idx < options.length - 1 && !options[idx + 1].trim()) {
                        const nextInput = document.getElementById(`option-input-${idx + 1}`);
                        if (nextInput) {
                          nextInput.focus();
                          return;
                        }
                      }
                      // Otherwise, if question is provided, submit the dilemma!
                      if (question.trim()) {
                        handleSubmit(e);
                      }
                    }
                  }}
                  placeholder={
                    idx === 0
                      ? 'Option A: e.g. Accept new job offer ($190k base + early equity)'
                      : idx === 1
                      ? 'Option B: e.g. Stay at current company ($240k total comp, stability)'
                      : `Option ${String.fromCharCode(65 + idx)}: e.g. Alternative or hybrid compromise`
                  }
                  className="flex-1 px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition placeholder:text-slate-400"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Remove option"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 4 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Path (Option {String.fromCharCode(65 + options.length)})</span>
            </button>
          )}
        </div>

        {/* Toggle Context & Nuance */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {showAdvanced ? 'Hide Additional Context & Values' : 'Add Context, Priorities & Constraints (Recommended)'}
            </span>
          </button>
        </div>

        {showAdvanced && (
          <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-5 animate-in fade-in duration-200">
            {/* Background Details */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Background Context & Key Constraints
              </label>
              <textarea
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Share your personal situation: financial runway, family considerations, risk tolerance, timeline deadlines, or what is currently keeping you up at night..."
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition placeholder:text-slate-400"
              />
            </div>

            {/* Core Values / Priorities */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                What matters most in this decision? (Select or type below)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_PRIORITIES.map((p) => {
                  const selected = priorities.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePriority(p)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                        selected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{p}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom priority input */}
              <div className="mt-2.5 flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={customPriority}
                  onChange={(e) => setCustomPriority(e.target.value)}
                  placeholder="Add custom value (e.g. Relocation speed)"
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomPriority(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomPriority}
                  disabled={!customPriority.trim()}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 rounded-lg transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Time Horizon & Risk Tolerance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Evaluation Horizon
                </label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {TIME_HORIZONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Your Risk Appetite
                </label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {RISK_TOLERANCES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                <span>Weighing Pros, Cons, SWOT & Matrix...</span>
              </>
            ) : (
              <>
                <span>Analyze Dilemma & Break the Tie</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
