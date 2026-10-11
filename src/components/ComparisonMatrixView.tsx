import React, { useState } from 'react';
import { Sliders, RotateCcw, Info, Trophy, Check } from 'lucide-react';
import { ComparisonMatrix, DecisionOption, MatrixCriterion } from '../types/decision';

interface ComparisonMatrixViewProps {
  matrix: ComparisonMatrix;
  options: DecisionOption[];
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  matrix,
  options,
}) => {
  // Store user-customizable weights for each criterion
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    matrix.criteria.forEach((c) => {
      initial[c.id] = c.weight;
    });
    return initial;
  });

  const [activeJustification, setActiveJustification] = useState<string | null>(null);

  const handleWeightChange = (criterionId: string, newWeight: number) => {
    setWeights((prev) => ({
      ...prev,
      [criterionId]: newWeight,
    }));
  };

  const handleResetWeights = () => {
    const initial: Record<string, number> = {};
    matrix.criteria.forEach((c) => {
      initial[c.id] = c.weight;
    });
    setWeights(initial);
  };

  // Calculate weighted scores for each option
  const optionTotals: Record<string, { rawTotal: number; weightedTotal: number; maxPossible: number }> = {};
  
  options.forEach((opt) => {
    optionTotals[opt.id] = { rawTotal: 0, weightedTotal: 0, maxPossible: 0 };
  });

  matrix.criteria.forEach((criterion) => {
    const weight = weights[criterion.id] ?? criterion.weight;
    criterion.scores.forEach((s) => {
      if (optionTotals[s.optionId]) {
        optionTotals[s.optionId].rawTotal += s.score;
        optionTotals[s.optionId].weightedTotal += s.score * weight;
        optionTotals[s.optionId].maxPossible += 10 * weight;
      }
    });
  });

  // Identify highest scoring option
  let winningOptionId = '';
  let highestWeightedScore = -1;

  Object.entries(optionTotals).forEach(([optId, data]) => {
    if (data.weightedTotal > highestWeightedScore) {
      highestWeightedScore = data.weightedTotal;
      winningOptionId = optId;
    }
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Multi-Criteria Decision Analysis (MCDA)
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Interactive Comparison Table & Scoring Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Adjust the weight sliders to see how your personal priorities shift the quantitative winner.
          </p>
        </div>

        <button
          onClick={handleResetWeights}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset AI Weights</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold w-2/5">
                Evaluation Criterion & Weight
              </th>
              {options.map((opt, idx) => {
                const isWinner = opt.id === winningOptionId;
                return (
                  <th
                    key={opt.id}
                    className={`py-3 px-4 font-bold text-slate-900 text-center transition ${
                      isWinner ? 'bg-amber-50/60 rounded-t-lg' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                          {opt.name}
                        </span>
                      </div>
                      {isWinner && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          <Trophy className="w-3 h-3 text-amber-600" />
                          <span>Leader</span>
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {matrix.criteria.map((criterion: MatrixCriterion) => {
              const currentWeight = weights[criterion.id] ?? criterion.weight;
              return (
                <tr key={criterion.id} className="hover:bg-slate-50/60 transition">
                  {/* Criterion + Slider */}
                  <td className="py-4 px-4 align-top">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {criterion.name}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 px-2 py-0.5 bg-slate-100 rounded">
                          Weight: {currentWeight}×
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {criterion.description}
                      </p>
                      {/* Weight slider */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-slate-400">1 (Low)</span>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={currentWeight}
                          onChange={(e) =>
                            handleWeightChange(criterion.id, parseInt(e.target.value, 10))
                          }
                          className="w-28 sm:w-36 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                        <span className="text-[10px] text-slate-400">5 (Critical)</span>
                      </div>
                    </div>
                  </td>

                  {/* Option Scores for this Criterion */}
                  {options.map((opt) => {
                    const scoreObj = criterion.scores.find((s) => s.optionId === opt.id);
                    const score = scoreObj?.score ?? 5;
                    const isWinner = opt.id === winningOptionId;
                    const isExpanded = activeJustification === `${criterion.id}-${opt.id}`;

                    return (
                      <td
                        key={opt.id}
                        className={`py-4 px-4 align-top text-center transition ${
                          isWinner ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`text-lg font-bold ${
                                score >= 8
                                  ? 'text-emerald-700'
                                  : score >= 5
                                  ? 'text-slate-800'
                                  : 'text-rose-700'
                              }`}
                            >
                              {score}
                            </span>
                            <span className="text-xs text-slate-400">/ 10</span>
                          </div>

                          {/* Mini visual score bar */}
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 8
                                  ? 'bg-emerald-600'
                                  : score >= 5
                                  ? 'bg-slate-700'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>

                          {/* Justification toggle */}
                          {scoreObj?.justification && (
                            <button
                              onClick={() =>
                                setActiveJustification(isExpanded ? null : `${criterion.id}-${opt.id}`)
                              }
                              className="mt-2 text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
                            >
                              <Info className="w-3 h-3" />
                              <span>{isExpanded ? 'Hide' : 'Why'}</span>
                            </button>
                          )}

                          {isExpanded && scoreObj?.justification && (
                            <div className="mt-2 p-2.5 rounded-lg bg-white border border-slate-200 text-left text-xs text-slate-600 shadow-xs max-w-xs animate-in fade-in duration-150">
                              {scoreObj.justification}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 font-bold bg-slate-50">
              <td className="py-4 px-4 text-slate-900">
                <div className="text-sm">Weighted Score Total</div>
                <div className="text-xs font-normal text-slate-500">
                  (Σ Score × Weight across all criteria)
                </div>
              </td>
              {options.map((opt) => {
                const totalData = optionTotals[opt.id] || { weightedTotal: 0, maxPossible: 100 };
                const isWinner = opt.id === winningOptionId;
                const percentage =
                  totalData.maxPossible > 0
                    ? Math.round((totalData.weightedTotal / totalData.maxPossible) * 100)
                    : 0;

                return (
                  <td
                    key={opt.id}
                    className={`py-4 px-4 text-center transition ${
                      isWinner ? 'bg-amber-100/60' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-xl sm:text-2xl font-black text-slate-900">
                        {totalData.weightedTotal}
                      </div>
                      <div className="text-xs font-medium text-slate-500">
                        {percentage}% of maximum
                      </div>
                      {isWinner && (
                        <div className="mt-1 text-[11px] font-bold text-amber-900">
                          Top Scorer
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
