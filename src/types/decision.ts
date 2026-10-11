export interface ProPoint {
  id: string;
  point: string;
  impact: number; // 1 to 5
  timeframe: string;
  category: string;
}

export interface ConPoint {
  id: string;
  point: string;
  severity: number; // 1 to 5
  timeframe: string;
  category: string;
  mitigation: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  pros: ProPoint[];
  cons: ConPoint[];
  swot: SwotAnalysis;
}

export interface MatrixScore {
  optionId: string;
  score: number; // 1 to 10
  justification: string;
}

export interface MatrixCriterion {
  id: string;
  name: string;
  weight: number; // 1 to 5
  description: string;
  scores: MatrixScore[];
}

export interface ComparisonMatrix {
  criteria: MatrixCriterion[];
}

export interface ReversibilityInfo {
  typeClassification: string;
  explanation: string;
}

export interface ConditionalBranching {
  rulePrimary: string;
  ruleSecondary: string;
  ruleWildcard?: string;
}

export interface Verdict {
  recommendedOption: string;
  confidenceScore: number;
  theDecisiveFactor: string;
  reversibility: ReversibilityInfo;
  conditionalBranching: ConditionalBranching;
  regretMinimizationTakeaway: string;
}

export interface BlindspotRisk {
  risk: string;
  likelihood: string;
  hiddenTrapdoor: string;
  probingQuestion: string;
}

export interface ActionStep {
  step: number;
  title: string;
  detail: string;
  timeline: string;
}

export interface DecisionAnalysis {
  title: string;
  summary: string;
  verdict: Verdict;
  options: DecisionOption[];
  comparisonMatrix: ComparisonMatrix;
  blindspotsAndRisks: BlindspotRisk[];
  actionPlan: ActionStep[];
}

export interface DecisionFormInputs {
  question: string;
  options: string[];
  context: string;
  priorities: string[];
  timeHorizon: string;
  riskTolerance: string;
}

export interface StressTestScenario {
  id: string;
  timestamp: string;
  hypothetical: string;
  result: {
    scenarioTitle: string;
    verdictShifted: boolean;
    newRecommendedOption: string;
    shiftExplanation: string;
    impactOnOptions: {
      optionName: string;
      impactSummary: string;
      riskChange: string;
    }[];
    strategicAdvice: string;
  };
}

export interface SavedDecision {
  id: string;
  createdAt: string;
  inputs: DecisionFormInputs;
  analysis: DecisionAnalysis;
  stressTests?: StressTestScenario[];
  userChosenOption?: string;
  userReflection?: string;
  isFavorite?: boolean;
}
