import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { PresetsModal } from './components/PresetsModal';
import { VerdictBanner } from './components/VerdictBanner';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { SwotView } from './components/SwotView';
import { BlindspotsView } from './components/BlindspotsView';
import { ActionPlanView } from './components/ActionPlanView';
import { StressTestView } from './components/StressTestView';
import { DecisionJournalModal } from './components/DecisionJournalModal';
import { ExportMemoModal } from './components/ExportMemoModal';
import { TheTiebreakerLoader } from './components/TheTiebreakerLoader';
import {
  DecisionAnalysis,
  DecisionFormInputs,
  SavedDecision,
  StressTestScenario,
} from './types/decision';
import {
  Scale,
  Sparkles,
  Layers,
  Award,
  ThumbsUp,
  TableProperties,
  Grid2X2,
  AlertTriangle,
  Zap,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export default function App() {
  const [currentInputs, setCurrentInputs] = useState<DecisionFormInputs | null>(null);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'all' | 'verdict' | 'pros_cons' | 'matrix' | 'swot' | 'blindspots' | 'stress_test'
  >('all');

  const [stressTests, setStressTests] = useState<StressTestScenario[]>([]);
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>([]);
  const [currentSavedId, setCurrentSavedId] = useState<string | null>(null);

  // Modals
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Load saved decisions from localStorage on initial render
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedDecisions(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load saved decisions:', e);
    }
  }, []);

  const saveDecisionsToStorage = (updated: SavedDecision[]) => {
    setSavedDecisions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const handleAnalyze = async (inputs: DecisionFormInputs) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentInputs(inputs);
    setStressTests([]);
    setCurrentSavedId(null);

    // Smoothly scroll to the interactive loader
    setTimeout(() => {
      const loaderEl = document.getElementById('tiebreaker-loader-view');
      if (loaderEl) {
        loaderEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    }, 60);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || 'Failed to analyze decision. Please ensure server is running.'
        );
      }

      const data = await res.json();
      if (!data.analysis) {
        throw new Error('Analysis response was empty.');
      }

      setAnalysis(data.analysis);
      setActiveTab('all');

      // Scroll smoothly to verdict analysis
      setTimeout(() => {
        const verdictEl = document.getElementById('verdict');
        if (verdictEl) {
          verdictEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }
      }, 150);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Something went wrong while analyzing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitDecision = (chosenOption: string, reflectionNotes: string) => {
    if (!analysis || !currentInputs) return;

    const id = currentSavedId || 'dec_' + Date.now();
    const existingIndex = savedDecisions.findIndex((d) => d.id === id);

    const savedRecord: SavedDecision = {
      id,
      createdAt: new Date().toISOString(),
      inputs: currentInputs,
      analysis,
      stressTests,
      userChosenOption: chosenOption,
      userReflection: reflectionNotes,
    };

    let updated: SavedDecision[];
    if (existingIndex >= 0) {
      updated = [...savedDecisions];
      updated[existingIndex] = savedRecord;
    } else {
      updated = [savedRecord, ...savedDecisions];
    }

    setCurrentSavedId(id);
    saveDecisionsToStorage(updated);
  };

  const handleAddStressTest = (test: StressTestScenario) => {
    const updatedTests = [test, ...stressTests];
    setStressTests(updatedTests);

    // If current decision is in journal, update it
    if (currentSavedId) {
      const updated = savedDecisions.map((d) => {
        if (d.id === currentSavedId) {
          return { ...d, stressTests: updatedTests };
        }
        return d;
      });
      saveDecisionsToStorage(updated);
    }
  };

  const handleSelectSaved = (saved: SavedDecision) => {
    setCurrentInputs(saved.inputs);
    setAnalysis(saved.analysis);
    setStressTests(saved.stressTests || []);
    setCurrentSavedId(saved.id);
    setActiveTab('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedDecisions.filter((d) => d.id !== id);
    saveDecisionsToStorage(updated);
    if (currentSavedId === id) {
      setCurrentSavedId(null);
    }
  };

  const handleReset = () => {
    setCurrentInputs(null);
    setAnalysis(null);
    setStressTests([]);
    setErrorMessage(null);
    setCurrentSavedId(null);
    setActiveTab('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        onNewDecision={handleReset}
        onOpenHistory={() => setIsJournalOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onPrint={() => setIsExportOpen(true)}
        savedCount={savedDecisions.length}
        hasActiveAnalysis={Boolean(analysis)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hero Banner when no decision is analyzed yet */}
        {!analysis && !isLoading && (
          <div className="text-center max-w-2xl mx-auto mb-10 no-print">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/70 border border-amber-200/60 rounded-full text-xs font-semibold text-amber-900 mb-4">
              <Scale className="w-3.5 h-3.5 text-amber-700" />
              <span>Break Stalemates · Zero Generic Fluff</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Decide with Conviction.
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              When a choice is 51/49 and every friend gives conflicting advice, The Tiebreaker synthesizes structured Pros & Cons, weighted Comparison Tables, and SWOT analyses to reveal the true hinge factor.
            </p>
          </div>
        )}

        {/* Input Form Section */}
        <section className="mb-10 no-print">
          <DecisionForm
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            initialInputs={currentInputs || undefined}
            onOpenPresets={() => setIsPresetsOpen(true)}
          />
        </section>

        {/* Eye-Catching Interactive Thematic Balance Loader */}
        {isLoading && (
          <section id="tiebreaker-loader-view" className="mb-10 no-print">
            <TheTiebreakerLoader
              question={currentInputs?.question}
              options={currentInputs?.options}
            />
          </section>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 no-print">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Active Analysis Workspace */}
        {analysis && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Navigation Filter Tabs */}
            <div className="sticky top-16 z-20 bg-slate-50/95 backdrop-blur-xs py-3 border-b border-slate-200/80 no-print flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Full Dossier</span>
                </button>

                <button
                  onClick={() => setActiveTab('verdict')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'verdict'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>The Verdict</span>
                </button>

                <button
                  onClick={() => setActiveTab('pros_cons')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'pros_cons'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pros & Cons</span>
                </button>

                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'matrix'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  <TableProperties className="w-3.5 h-3.5 text-blue-500" />
                  <span>Comparison Matrix</span>
                </button>

                <button
                  onClick={() => setActiveTab('swot')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'swot'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  <Grid2X2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>SWOT Analysis</span>
                </button>

                <button
                  onClick={() => setActiveTab('blindspots')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'blindspots'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Trapdoors</span>
                </button>

                <button
                  onClick={() => setActiveTab('stress_test')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'stress_test'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Stress Test</span>
                  {stressTests.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] flex items-center justify-center font-bold">
                      {stressTests.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="px-3 py-1.5 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
                >
                  Export Memo
                </button>
              </div>
            </div>

            {/* Print header visible only in print mode */}
            <div className="hidden print-only mb-6">
              <h1 className="text-2xl font-bold">The Tiebreaker · Decision Dossier</h1>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Verdict Section */}
            {(activeTab === 'all' || activeTab === 'verdict') && (
              <section id="verdict">
                <VerdictBanner
                  verdict={analysis.verdict}
                  title={analysis.title}
                  summary={analysis.summary}
                />
              </section>
            )}

            {/* Pros & Cons Section */}
            {(activeTab === 'all' || activeTab === 'pros_cons') && (
              <section id="pros_cons">
                <ProsConsView options={analysis.options} />
              </section>
            )}

            {/* Comparison Matrix Section */}
            {(activeTab === 'all' || activeTab === 'matrix') && (
              <section id="matrix">
                <ComparisonMatrixView
                  matrix={analysis.comparisonMatrix}
                  options={analysis.options}
                />
              </section>
            )}

            {/* SWOT Analysis Section */}
            {(activeTab === 'all' || activeTab === 'swot') && (
              <section id="swot">
                <SwotView options={analysis.options} />
              </section>
            )}

            {/* Blindspots & Second-Order Risks */}
            {(activeTab === 'all' || activeTab === 'blindspots') && (
              <section id="blindspots">
                <BlindspotsView blindspots={analysis.blindspotsAndRisks} />
              </section>
            )}

            {/* Action Plan & Commitment */}
            {(activeTab === 'all' || activeTab === 'verdict' || activeTab === 'blindspots') && (
              <section id="action_plan">
                <ActionPlanView
                  actionPlan={analysis.actionPlan}
                  options={analysis.options}
                  recommendedOptionName={analysis.verdict.recommendedOption}
                  onCommitDecision={handleCommitDecision}
                  savedChosenOption={
                    savedDecisions.find((d) => d.id === currentSavedId)?.userChosenOption
                  }
                  savedReflection={
                    savedDecisions.find((d) => d.id === currentSavedId)?.userReflection
                  }
                />
              </section>
            )}

            {/* What-If Stress Testing Simulator */}
            {(activeTab === 'all' || activeTab === 'stress_test') && (
              <section id="stress_test" className="no-print">
                <StressTestView
                  decision={analysis}
                  stressTests={stressTests}
                  onAddStressTest={handleAddStressTest}
                />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">The Tiebreaker</span>
            <span>· Decisive Multi-Lens Rational Analysis</span>
          </div>
          <div>
            <span>Powered by Google Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={(presetInputs) => {
          handleAnalyze(presetInputs);
        }}
      />

      <DecisionJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectSaved}
        onDeleteDecision={handleDeleteSaved}
      />

      {analysis && (
        <ExportMemoModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          decision={analysis}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}
