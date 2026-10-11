import React from 'react';
import { Scale, History, BookmarkPlus, Sparkles, Printer, Plus } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenPresets: () => void;
  onPrint: () => void;
  savedCount: number;
  hasActiveAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  onOpenPresets,
  onPrint,
  savedCount,
  hasActiveAnalysis,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewDecision}
            className="flex items-center gap-2.5 text-left group transition focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-300 shadow-sm transition group-hover:bg-slate-800">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg text-slate-900 tracking-tight">The Tiebreaker</span>
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">· Decision Intelligence</span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Break deadlocks with multi-angle rational analysis
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            title="Browse sample decision dilemmas"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Sample</span> Scenarios
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            title="Open saved decisions journal"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Journal</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-slate-900 text-white rounded text-[10px] font-semibold">
                {savedCount}
              </span>
            )}
          </button>

          {hasActiveAnalysis && (
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition"
              title="Print or save PDF memo"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export / Print</span>
            </button>
          )}

          <button
            onClick={onNewDecision}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
