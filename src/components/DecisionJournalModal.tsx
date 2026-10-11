import React from 'react';
import { X, History, Trash2, ArrowRight, CheckCircle2, Bookmark, Calendar } from 'lucide-react';
import { SavedDecision } from '../types/decision';

interface DecisionJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onSelectDecision: (decision: SavedDecision) => void;
  onDeleteDecision: (id: string) => void;
}

export const DecisionJournalModal: React.FC<DecisionJournalModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Decision Journal & History</h3>
              <p className="text-xs text-slate-500">
                Track past choices, calibrations, and commitments
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
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No decisions saved yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Once you analyze a decision, click &ldquo;Save Decision to Journal&rdquo; to store it here for future calibration.
              </p>
            </div>
          ) : (
            savedDecisions.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => {
                      onSelectDecision(item);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.inputs.timeHorizon}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-800">
                      {item.analysis.title || item.inputs.question}
                    </h4>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                        AI Winner: {item.analysis.verdict.recommendedOption}
                      </span>
                      {item.userChosenOption && (
                        <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-amber-600" />
                          <span>Chosen: {item.userChosenOption}</span>
                        </span>
                      )}
                    </div>

                    {item.userReflection && (
                      <p className="mt-2 text-xs text-slate-600 italic line-clamp-1">
                        &ldquo;{item.userReflection}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDeleteDecision(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Delete from journal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                      title="Open decision"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
