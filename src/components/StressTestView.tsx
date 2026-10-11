import React, { useState } from 'react';
import { Zap, ArrowRight, Loader2, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { DecisionAnalysis, StressTestScenario } from '../types/decision';

interface StressTestViewProps {
  decision: DecisionAnalysis;
  stressTests: StressTestScenario[];
  onAddStressTest: (test: StressTestScenario) => void;
}

const COMMON_CURVEBALLS = [
  'What if the financial compensation / revenue is 25% lower than projected?',
  'What if the weekly workload or commute increases by 15 hours?',
  'What if key leadership or team members leave after 6 months?',
  'What if macroeconomic conditions worsen significantly next year?',
];

export const StressTestView: React.FC<StressTestViewProps> = ({
  decision,
  stressTests,
  onAddStressTest,
}) => {
  const [hypothetical, setHypothetical] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunSimulation = async (scenarioText: string) => {
    if (!scenarioText.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDecision: decision,
          whatIfScenario: scenarioText.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Stress test simulation failed.');
      }

      const data = await res.json();
      const newTest: StressTestScenario = {
        id: 'test_' + Date.now(),
        timestamp: new Date().toISOString(),
        hypothetical: scenarioText.trim(),
        result: data.result,
      };

      onAddStressTest(newTest);
      setHypothetical('');
    } catch (err: any) {
      setError(err.message || 'Failed to simulate scenario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-800">
              Robustness & Antifragility
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              &ldquo;What-If&rdquo; Stress Test Simulator
            </h3>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Test your decision against unexpected curveballs, market shocks, or changed assumptions.
        </p>
      </div>

      {/* Input Form */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Introduce a Hypothetical Curveball
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={hypothetical}
              onChange={(e) => setHypothetical(e.target.value)}
              placeholder="e.g. What if Option A requires 40% travel instead of 10%?"
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleRunSimulation(hypothetical);
                }
              }}
            />
            <button
              onClick={() => handleRunSimulation(hypothetical)}
              disabled={loading || !hypothetical.trim()}
              className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition flex items-center justify-center gap-1.5 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <span>Simulate Shock</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggested curveballs */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
            Quick Scenarios:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_CURVEBALLS.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleRunSimulation(sc)}
                disabled={loading}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition disabled:opacity-50"
              >
                {sc}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}
      </div>

      {/* Results Feed */}
      {stressTests.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <History className="w-4 h-4" />
            <span>Simulated Stress Scenarios ({stressTests.length})</span>
          </div>

          <div className="space-y-4">
            {stressTests.map((test) => (
              <div
                key={test.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/80 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    &ldquo;{test.hypothetical}&rdquo;
                  </h4>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md self-start sm:self-auto ${
                      test.result.verdictShifted
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {test.result.verdictShifted
                      ? `Verdict Shifted → ${test.result.newRecommendedOption}`
                      : 'Verdict Still Holds'}
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {test.result.shiftExplanation}
                </p>

                {/* Impact per option */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {test.result.impactOnOptions.map((optImpact, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{optImpact.optionName}</span>
                        <span
                          className={`font-semibold ${
                            optImpact.riskChange === 'Increased'
                              ? 'text-rose-600'
                              : optImpact.riskChange === 'Decreased'
                              ? 'text-emerald-600'
                              : 'text-slate-500'
                          }`}
                        >
                          Risk: {optImpact.riskChange}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-snug">{optImpact.impactSummary}</p>
                    </div>
                  ))}
                </div>

                {/* Strategic Advice */}
                <div className="mt-3 p-3 bg-purple-50/60 rounded-lg border border-purple-200/50 text-xs text-purple-950">
                  <span className="font-bold block mb-0.5">Antifragile Strategic Takeaway:</span>
                  <p>{test.result.strategicAdvice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
