import React, { useState, useEffect } from 'react';
import { Scale, Sparkles, Brain, ArrowRight, Lightbulb, Compass, ShieldCheck } from 'lucide-react';

interface TiebreakerLoaderProps {
  question?: string;
  options?: string[];
}

const DECISION_MENTAL_MODELS = [
  {
    author: 'Jeff Bezos',
    name: 'Type 1 vs. Type 2 Doors',
    quote: 'Some decisions are irreversible (Type 1) and must be made methodically. Most decisions are two-way doors (Type 2)—if you walk through and dislike it, you can simply walk back. Don\'t treat reversible choices like fatal ones.',
  },
  {
    author: 'Suzy Welch',
    name: 'The 10 / 10 / 10 Rule',
    quote: 'How will you feel about this decision 10 minutes from now? 10 months from now? 10 years from now? This strips away acute emotional anxiety and spotlights genuine long-term consequence.',
  },
  {
    author: 'Charlie Munger',
    name: 'The Inversion Principle',
    quote: 'Invert, always invert. Instead of asking how to make this choice succeed, ask: "What would guarantee catastrophic failure here?" Then ruthlessly avoid doing that.',
  },
  {
    author: 'Annie Duke',
    name: 'Thinking in Bets',
    quote: 'Never judge the quality of a decision purely by its immediate outcome. A brilliant, calculated decision can yield bad luck, and a reckless blunder can get lucky. Focus on process over outcome.',
  },
  {
    author: 'G.K. Chesterton',
    name: 'Chesterton’s Fence',
    quote: 'Never tear down a fence or dismantle a status-quo routine until you fully understand why it was put up in the first place. Respect the hidden benefits of what currently works.',
  },
];

const ANALYSIS_STAGES = [
  { label: 'Formulating decision vectors & candidate constraints', time: 0 },
  { label: 'Weighing granular impact vs. downside severity', time: 2500 },
  { label: 'Calculating MCDA multi-criteria scoring matrix', time: 5500 },
  { label: 'Dissecting SWOT quadrants & second-order trapdoors', time: 8500 },
  { label: 'Synthesizing the decisive hinge & final tiebreaker verdict', time: 11500 },
];

export const TheTiebreakerLoader: React.FC<TiebreakerLoaderProps> = ({ question, options = [] }) => {
  const [tiltAngle, setTiltAngle] = useState(0); // in degrees: -14 to +14
  const [leftWeights, setLeftWeights] = useState(2);
  const [rightWeights, setRightWeights] = useState(2);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);
  const [lastTapped, setLastTapped] = useState<string | null>(null);

  // Oscillate the scale naturally while idle, influenced by weight difference
  useEffect(() => {
    const interval = setInterval(() => {
      const baseTilt = (rightWeights - leftWeights) * 4;
      // Add natural gentle harmonic oscillation
      const oscillation = Math.sin(Date.now() / 600) * 5;
      const target = Math.max(-14, Math.min(14, baseTilt + oscillation));
      setTiltAngle(target);
    }, 80);

    return () => clearInterval(interval);
  }, [leftWeights, rightWeights]);

  // Stage progression timer
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // Calculate active stage
      for (let i = ANALYSIS_STAGES.length - 1; i >= 0; i--) {
        if (elapsed >= ANALYSIS_STAGES[i].time) {
          setCurrentStageIndex(i);
          break;
        }
      }

      // Smooth progress bar up to 96%
      const newPct = Math.min(96, Math.floor(15 + (elapsed / 14000) * 81));
      setProgressPercent(newPct);
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const handleAddLeftWeight = () => {
    setLeftWeights((prev) => prev + 1);
    setLastTapped('left');
  };

  const handleAddRightWeight = () => {
    setRightWeights((prev) => prev + 1);
    setLastTapped('right');
  };

  const handleBalanceEquilibrium = () => {
    setLeftWeights(2);
    setRightWeights(2);
    setTiltAngle(0);
    setLastTapped('reset');
  };

  const currentModel = DECISION_MENTAL_MODELS[quoteIndex];
  const optionALabel = options[0] ? options[0].slice(0, 24) : 'Option A / Upsides';
  const optionBLabel = options[1] ? options[1].slice(0, 24) : 'Option B / Downsides';

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Dilemma Prompt */}
      <div className="text-center max-w-2xl mx-auto pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-xs font-semibold text-amber-300 mb-3 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Tiebreaker Engine is Weighing the Evidence</span>
        </div>

        {question ? (
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight line-clamp-2 px-2">
            &ldquo;{question}&rdquo;
          </h3>
        ) : (
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Calibrating the Decisive Pivot Point...
          </h3>
        )}

        <p className="text-xs text-slate-400 mt-1">
          Evaluating pros, cons, risk asymmetry, criteria matrix, and SWOT profiles.
        </p>
      </div>

      {/* THE INTERACTIVE BALANCE SCALE CANVAS */}
      <div className="my-6 relative py-4 flex flex-col items-center select-none">
        {/* Interactive Tip Banner */}
        <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
          <span>Click the scale pans below to test the balance:</span>
        </div>

        {/* SVG Mechanical Balance Scale */}
        <div className="w-full max-w-md h-52 relative flex items-center justify-center">
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full overflow-visible drop-shadow-lg"
          >
            {/* Base Pillar & Pedestal */}
            <path
              d="M 170 215 L 230 215 L 215 190 L 185 190 Z"
              fill="#334155"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Center Fulcrum Column */}
            <rect
              x="194"
              y="60"
              width="12"
              height="132"
              rx="4"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Center Fulcrum Pivot Sphere & Dial */}
            <circle cx="200" cy="62" r="14" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="200" cy="62" r="5" fill="#0f172a" />

            {/* Pivot Needle Indicator */}
            <line
              x1="200"
              y1="62"
              x2={200 - tiltAngle * 1.5}
              y2="28"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* THE ROTATING BEAM GROUP */}
            <g
              transform={`rotate(${tiltAngle}, 200, 62)`}
              style={{ transition: 'transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              {/* Main Crossbeam */}
              <line
                x1="45"
                y1="62"
                x2="355"
                y2="62"
                stroke="#cbd5e1"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1="55"
                y1="62"
                x2="345"
                y2="62"
                stroke="#f8fafc"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Left End Joint */}
              <circle cx="55" cy="62" r="7" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              {/* Right End Joint */}
              <circle cx="345" cy="62" r="7" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
            </g>

            {/* LEFT PAN (Hanging) - moves opposite to beam angle */}
            {(() => {
              const rad = (tiltAngle * Math.PI) / 180;
              const leftJointX = 200 - 145 * Math.cos(rad);
              const leftJointY = 62 - 145 * Math.sin(rad);
              const panY = leftJointY + 68;

              return (
                <g
                  className="cursor-pointer group"
                  onClick={handleAddLeftWeight}
                >
                  {/* Chains */}
                  <line
                    x1={leftJointX}
                    y1={leftJointY}
                    x2={leftJointX - 28}
                    y2={panY}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1={leftJointX}
                    y1={leftJointY}
                    x2={leftJointX + 28}
                    y2={panY}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  {/* Left Pan Dish */}
                  <path
                    d={`M ${leftJointX - 38} ${panY} Q ${leftJointX} ${panY + 22} ${leftJointX + 38} ${panY} Z`}
                    fill="#1e293b"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    className="group-hover:fill-sky-950 transition"
                  />
                  {/* Stacked weights inside left pan */}
                  {Array.from({ length: Math.min(6, leftWeights) }).map((_, i) => (
                    <rect
                      key={i}
                      x={leftJointX - 18 + i * 2}
                      y={panY - 6 - i * 6}
                      width="34"
                      height="6"
                      rx="2"
                      fill="#38bdf8"
                      stroke="#0284c7"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Pan Click Label */}
                  <text
                    x={leftJointX}
                    y={panY + 36}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontWeight="700"
                  >
                    + Weight A ({leftWeights})
                  </text>
                </g>
              );
            })()}

            {/* RIGHT PAN (Hanging) */}
            {(() => {
              const rad = (tiltAngle * Math.PI) / 180;
              const rightJointX = 200 + 145 * Math.cos(rad);
              const rightJointY = 62 + 145 * Math.sin(rad);
              const panY = rightJointY + 68;

              return (
                <g
                  className="cursor-pointer group"
                  onClick={handleAddRightWeight}
                >
                  {/* Chains */}
                  <line
                    x1={rightJointX}
                    y1={rightJointY}
                    x2={rightJointX - 28}
                    y2={panY}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1={rightJointX}
                    y1={rightJointY}
                    x2={rightJointX + 28}
                    y2={panY}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  {/* Right Pan Dish */}
                  <path
                    d={`M ${rightJointX - 38} ${panY} Q ${rightJointX} ${panY + 22} ${rightJointX + 38} ${panY} Z`}
                    fill="#1e293b"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    className="group-hover:fill-amber-950 transition"
                  />
                  {/* Stacked weights inside right pan */}
                  {Array.from({ length: Math.min(6, rightWeights) }).map((_, i) => (
                    <rect
                      key={i}
                      x={rightJointX - 18 + i * 2}
                      y={panY - 6 - i * 6}
                      width="34"
                      height="6"
                      rx="2"
                      fill="#fbbf24"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Pan Click Label */}
                  <text
                    x={rightJointX}
                    y={panY + 36}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="700"
                  >
                    + Weight B ({rightWeights})
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Interactive Scale Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-10">
          <button
            type="button"
            onClick={handleAddLeftWeight}
            className="px-3 py-1.5 text-xs font-semibold bg-sky-950/80 hover:bg-sky-900 border border-sky-500/50 text-sky-200 rounded-lg transition active:scale-95 shadow-sm"
          >
            Tip Towards {optionALabel}
          </button>
          <button
            type="button"
            onClick={handleBalanceEquilibrium}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition active:scale-95"
          >
            Zero Fulcrum
          </button>
          <button
            type="button"
            onClick={handleAddRightWeight}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 rounded-lg transition active:scale-95 shadow-sm"
          >
            Tip Towards {optionBLabel}
          </button>
        </div>
      </div>

      {/* DYNAMIC PROGRESS BAR & STAGE CHECKLIST */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 max-w-xl mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Brain className="w-3.5 h-3.5 animate-spin" />
            <span>{ANALYSIS_STAGES[currentStageIndex]?.label}</span>
          </span>
          <span className="font-mono text-slate-400 font-bold">{progressPercent}%</span>
        </div>

        {/* Animated Gradient Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Multi-Step Telemetry Dots */}
        <div className="grid grid-cols-5 gap-1 mt-2.5">
          {ANALYSIS_STAGES.map((s, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition ${
                  isCompleted
                    ? 'bg-emerald-400'
                    : isCurrent
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-slate-800'
                }`}
                title={s.label}
              />
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE MENTAL MODELS & WISDOM CAROUSEL */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Decision Wisdom While You Wait</span>
          </div>

          <button
            type="button"
            onClick={() => setQuoteIndex((prev) => (prev + 1) % DECISION_MENTAL_MODELS.length)}
            className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>Next Model</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div
          onClick={() => setQuoteIndex((prev) => (prev + 1) % DECISION_MENTAL_MODELS.length)}
          className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:border-slate-600 transition group"
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-white group-hover:text-amber-300 transition">
              {currentModel.name}
            </span>
            <span className="text-slate-400">· {currentModel.author}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
            &ldquo;{currentModel.quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
