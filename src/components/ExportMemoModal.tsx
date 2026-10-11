import React, { useState } from 'react';
import { X, Copy, Check, FileText, Printer } from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';

interface ExportMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: DecisionAnalysis;
  onPrint: () => void;
}

export const ExportMemoModal: React.FC<ExportMemoModalProps> = ({
  isOpen,
  onClose,
  decision,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = (): string => {
    let md = `# THE TIEBREAKER · DECISION DOSSIER\n`;
    md += `## ${decision.title}\n\n`;
    md += `**Executive Summary:** ${decision.summary}\n\n`;
    md += `---\n\n`;
    md += `### 1. THE TIEBREAKER VERDICT\n`;
    md += `- **Recommended Option:** ${decision.verdict.recommendedOption}\n`;
    md += `- **Calculated Confidence:** ${decision.verdict.confidenceScore}%\n`;
    md += `- **The Decisive Factor:** ${decision.verdict.theDecisiveFactor}\n`;
    md += `- **Door Reversibility:** ${decision.verdict.reversibility.typeClassification} — ${decision.verdict.reversibility.explanation}\n`;
    md += `- **Regret Minimization Horizon:** "${decision.verdict.regretMinimizationTakeaway}"\n`;
    md += `- **Primary Conditional Rule:** ${decision.verdict.conditionalBranching.rulePrimary}\n`;
    md += `- **Alternative Conditional Rule:** ${decision.verdict.conditionalBranching.ruleSecondary}\n\n`;

    md += `---\n\n`;
    md += `### 2. BALANCED PROS & CONS\n\n`;
    decision.options.forEach((opt) => {
      md += `#### ${opt.name}\n`;
      md += `*${opt.description}*\n\n`;
      md += `**Advantages (Pros):**\n`;
      opt.pros.forEach((p) => {
        md += `- [Impact ${p.impact}/5] ${p.point} (${p.category}, ${p.timeframe})\n`;
      });
      md += `\n**Disadvantages (Cons & Mitigations):**\n`;
      opt.cons.forEach((c) => {
        md += `- [Severity ${c.severity}/5] ${c.point} (${c.category})\n`;
        if (c.mitigation) {
          md += `  *Mitigation:* ${c.mitigation}\n`;
        }
      });
      md += `\n`;
    });

    md += `---\n\n`;
    md += `### 3. COMPARISON CRITERIA MATRIX\n\n`;
    decision.comparisonMatrix.criteria.forEach((crit) => {
      md += `**${crit.name} (Weight: ${crit.weight}/5):** ${crit.description}\n`;
      crit.scores.forEach((s) => {
        const opt = decision.options.find((o) => o.id === s.optionId);
        md += `  - ${opt?.name || s.optionId}: ${s.score}/10 — ${s.justification}\n`;
      });
      md += `\n`;
    });

    md += `---\n\n`;
    md += `### 4. SWOT MATRIX\n\n`;
    decision.options.forEach((opt) => {
      md += `#### SWOT: ${opt.name}\n`;
      md += `- **Strengths:** ${opt.swot.strengths.join('; ')}\n`;
      md += `- **Weaknesses:** ${opt.swot.weaknesses.join('; ')}\n`;
      md += `- **Opportunities:** ${opt.swot.opportunities.join('; ')}\n`;
      md += `- **Threats:** ${opt.swot.threats.join('; ')}\n\n`;
    });

    md += `---\n\n`;
    md += `### 5. BLINDSPOTS & SECOND-ORDER RISKS\n\n`;
    decision.blindspotsAndRisks.forEach((b) => {
      md += `- **${b.risk} (Likelihood: ${b.likelihood})**\n`;
      md += `  *Hidden Trapdoor:* ${b.hiddenTrapdoor}\n`;
      md += `  *Gut Check:* "${b.probingQuestion}"\n`;
    });

    md += `\n---\n\n`;
    md += `### 6. ACTION & IMPLEMENTATION PLAN\n\n`;
    decision.actionPlan.forEach((step) => {
      md += `${step.step}. **${step.title}** (${step.timeline}): ${step.detail}\n`;
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Export Decision Memo</h3>
              <p className="text-xs text-slate-500">
                Shareable markdown summary or clean printer-friendly dossier
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

        <div className="py-4 flex-1 overflow-y-auto">
          <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto">
            {generateMarkdown()}
          </pre>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onPrint}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Open Print / PDF Preview</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
