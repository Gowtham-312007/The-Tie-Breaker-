import React from 'react';
import { Award, DoorOpen, GitFork, Compass, Scale, CheckCircle2 } from 'lucide-react';
import { Verdict } from '../types/decision';

interface VerdictBannerProps {
  verdict: Verdict;
  title: string;
  summary: string;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  verdict,
  title,
  summary,
}) => {
  const isTypeTwo = verdict.reversibility.typeClassification.toLowerCase().includes('type 2') ||
    verdict.reversibility.typeClassification.toLowerCase().includes('reversible') ||
    verdict.reversibility.typeClassification.toLowerCase().includes('two-way');

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
      {/* Top Tag & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400">
              The Tiebreaker Verdict
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Calculated Confidence</span>
            <span className="text-sm font-bold text-amber-400">{verdict.confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Core Dilemma Summary */}
      <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
        {summary}
      </p>

      {/* Main Recommended Winner Box */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-slate-800/90 to-slate-800/40 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Recommended Course of Action
            </span>
            <div className="flex items-center gap-2.5 mt-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {verdict.recommendedOption}
              </h3>
            </div>
          </div>
        </div>

        {/* The Decisive Hinge Factor */}
        <div className="mt-4 pt-4 border-t border-slate-700/60">
          <div className="flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                The Decisive Factor (Why the Tie is Broken)
              </span>
              <p className="text-sm text-slate-200 mt-1 font-medium leading-relaxed">
                {verdict.theDecisiveFactor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reversibility & Regret Minimization Frameworks */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reversibility Door */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <DoorOpen className="w-4 h-4 text-sky-400" />
              <span>Door Reversibility</span>
            </div>
            <div className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isTypeTwo ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span>{verdict.reversibility.typeClassification}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {verdict.reversibility.explanation}
            </p>
          </div>
        </div>

        {/* Regret Minimization */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Regret Minimization Horizon (10-Yr Lens)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              &ldquo;{verdict.regretMinimizationTakeaway}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Conditional Branching Rules */}
      <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          <GitFork className="w-4 h-4 text-emerald-400" />
          <span>Conditional Decision Rules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="font-semibold text-emerald-300 block mb-1">
              Choose Recommended Path If:
            </span>
            <p>{verdict.conditionalBranching.rulePrimary}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="font-semibold text-amber-300 block mb-1">
              Choose Alternative Path If:
            </span>
            <p>{verdict.conditionalBranching.ruleSecondary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
