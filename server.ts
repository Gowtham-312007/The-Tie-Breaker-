import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Resilient generation helper with retry and model fallback for high-demand spikes
async function generateContentWithRetry(ai: GoogleGenAI, params: any) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || '';
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('429') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        if (isTransient && attempt < 2) {
          // Wait 1.5 seconds before retrying same model
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        // If still transient, try the next fallback model
        if (isTransient) {
          console.warn(`Model ${model} unavailable (attempt ${attempt}), trying next fallback...`);
          break;
        }
        // If not transient, throw immediately
        throw err;
      }
    }
  }

  throw lastError;
}

// Health endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-3.8-flash',
  });
});

// Primary Decision Analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your environment configuration.',
      });
    }

    const {
      question,
      options = [],
      context = '',
      priorities = [],
      timeHorizon = '1-3 years',
      riskTolerance = 'Balanced',
    } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'A valid decision question is required.' });
    }

    const optionsPrompt = options.length > 0 
      ? `The explicit candidate options provided are:\n${options.map((opt: string, i: number) => `Option ${i + 1}: ${opt}`).join('\n')}`
      : `The user hasn't explicitly separated options. Infer the 2 to 3 most realistic and distinct alternatives for this dilemma (for instance, Proceed vs Maintain Status Quo vs Hybrid/Alternative).`;

    const prioritiesPrompt = priorities.length > 0
      ? `User's key values & decision priorities:\n${priorities.join(', ')}`
      : `Standard balanced priorities (feasibility, long-term reward, stress/friction, opportunity cost).`;

    const systemInstruction = `You are "The Tiebreaker", an elite rational decision strategist, executive coach, and high-stakes analyst.
Your mission is to deliver unflinching clarity to people stuck in decision paralysis.
You dissect dilemmas using four rigorous lenses:
1. Balanced Pros & Cons: Granular, concrete advantages and drawbacks with tangible impact weights and pragmatic mitigations.
2. Side-by-Side Comparison Matrix: 4-6 crucial evaluation criteria (e.g., Financial Upside, Stress/Workload, Autonomy, Risk/Downside, Reversibility, Long-Term Optionality) scored 1-10 with sharp justifications.
3. SWOT Analysis: Systematic Strengths, Weaknesses, Opportunities, and Threats for each alternative.
4. The Definitive Tiebreaker Verdict: A courageous, reasoned ruling. Identify the exact "Decisive Factor" (the hinge upon which the choice truly turns), analyze Reversibility (Type 1 irreversible vs Type 2 reversible doors), formulate conditional rules ("If you prioritize X, pick A; if Y, pick B"), and apply Jeff Bezos's Regret Minimization Framework.

Be analytical, nuanced, honest, and actionable. Avoid generic platitudes. Tailor every point specifically to the user's situation.`;

    const userPrompt = `Analyze this decision dilemma:
DECISION QUESTION: "${question}"

ADDITIONAL CONTEXT & CONSTRAINTS:
${context || 'No special background details provided.'}

${optionsPrompt}

${prioritiesPrompt}
TIME HORIZON: ${timeHorizon}
RISK TOLERANCE: ${riskTolerance}

Provide a comprehensive, deeply reasoned decision dossier formatted strictly in JSON matching the requested schema.`;

    const response = await generateContentWithRetry(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Refined, concise title of the decision dilemma.',
            },
            summary: {
              type: Type.STRING,
              description: 'Executive summary framing the core tension and stakes in 2-3 sentences.',
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOption: {
                  type: Type.STRING,
                  description: 'The exact name of the option recommended as the tiebreaker winner.',
                },
                confidenceScore: {
                  type: Type.INTEGER,
                  description: 'Confidence in recommendation from 1 to 100 based on supplied context.',
                },
                theDecisiveFactor: {
                  type: Type.STRING,
                  description: 'The single most critical hinge or tipping factor that breaks this deadlock.',
                },
                reversibility: {
                  type: Type.OBJECT,
                  properties: {
                    typeClassification: {
                      type: Type.STRING,
                      description: 'E.g., "Type 1 (One-Way Door / Hard to Undo)" or "Type 2 (Two-Way Door / Reversible)".',
                    },
                    explanation: {
                      type: Type.STRING,
                      description: 'Why this decision is or is not easily reversible and how to protect against lock-in.',
                    },
                  },
                  required: ['typeClassification', 'explanation'],
                },
                conditionalBranching: {
                  type: Type.OBJECT,
                  properties: {
                    rulePrimary: {
                      type: Type.STRING,
                      description: 'Choose the recommended option if you value...',
                    },
                    ruleSecondary: {
                      type: Type.STRING,
                      description: 'Choose the alternative option if you value...',
                    },
                    ruleWildcard: {
                      type: Type.STRING,
                      description: 'Choose a compromise or third path if...',
                    },
                  },
                  required: ['rulePrimary', 'ruleSecondary'],
                },
                regretMinimizationTakeaway: {
                  type: Type.STRING,
                  description: 'Looking back from 10 years in the future, which path carries deeper, more toxic regret?',
                },
              },
              required: [
                'recommendedOption',
                'confidenceScore',
                'theDecisiveFactor',
                'reversibility',
                'conditionalBranching',
                'regretMinimizationTakeaway',
              ],
            },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        point: { type: Type.STRING },
                        impact: {
                          type: Type.INTEGER,
                          description: 'Impact rating from 1 (minor perk) to 5 (massive gamechanger)',
                        },
                        timeframe: { type: Type.STRING, description: 'Immediate, Short-term, or Long-term' },
                        category: { type: Type.STRING, description: 'e.g. Financial, Growth, Well-being, Strategic' },
                      },
                      required: ['id', 'point', 'impact', 'timeframe', 'category'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        point: { type: Type.STRING },
                        severity: {
                          type: Type.INTEGER,
                          description: 'Severity rating from 1 (mild annoyance) to 5 (critical risk)',
                        },
                        timeframe: { type: Type.STRING, description: 'Immediate, Short-term, or Long-term' },
                        category: { type: Type.STRING },
                        mitigation: {
                          type: Type.STRING,
                          description: 'Concrete way to eliminate or soften this downside.',
                        },
                      },
                      required: ['id', 'point', 'severity', 'timeframe', 'category', 'mitigation'],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                  },
                },
                required: ['id', 'name', 'description', 'pros', 'cons', 'swot'],
              },
            },
            comparisonMatrix: {
              type: Type.OBJECT,
              properties: {
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      weight: {
                        type: Type.INTEGER,
                        description: 'Importance weight from 1 (nice to have) to 5 (critical factor)',
                      },
                      description: { type: Type.STRING },
                      scores: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionId: { type: Type.STRING },
                            score: {
                              type: Type.INTEGER,
                              description: 'Performance score from 1 (abysmal) to 10 (ideal)',
                            },
                            justification: { type: Type.STRING },
                          },
                          required: ['optionId', 'score', 'justification'],
                        },
                      },
                    },
                    required: ['id', 'name', 'weight', 'description', 'scores'],
                  },
                },
              },
              required: ['criteria'],
            },
            blindspotsAndRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING },
                  likelihood: { type: Type.STRING, description: 'Low, Medium, or High' },
                  hiddenTrapdoor: { type: Type.STRING },
                  probingQuestion: {
                    type: Type.STRING,
                    description: 'Tough self-interrogation question before deciding.',
                  },
                },
                required: ['risk', 'likelihood', 'hiddenTrapdoor', 'probingQuestion'],
              },
            },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING },
                  timeline: { type: Type.STRING },
                },
                required: ['step', 'title', 'detail', 'timeline'],
              },
            },
          },
          required: [
            'title',
            'summary',
            'verdict',
            'options',
            'comparisonMatrix',
            'blindspotsAndRisks',
            'actionPlan',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Received empty response from Gemini API.');
    }

    const parsedData = JSON.parse(text);
    return res.json({
      success: true,
      analysis: parsedData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during decision analysis:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while generating the decision analysis.',
    });
  }
});

// Follow-up What-If / Stress Testing endpoint
app.post('/api/stress-test', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const { currentDecision, whatIfScenario } = req.body;
    if (!whatIfScenario || !currentDecision) {
      return res.status(400).json({ error: 'Missing whatIfScenario or currentDecision.' });
    }

    const systemInstruction = `You are The Tiebreaker's Stress Test Simulator.
Given an existing decision analysis and a new hypothetical curveball or change in conditions ("What if..."),
analyze how this changes the math, alters the balance of pros/cons, and whether it shifts the recommended verdict.`;

    const userPrompt = `ORIGINAL DECISION QUESTION: "${currentDecision.title || 'Dilemma'}"
CURRENT VERDICT: "${currentDecision.verdict?.recommendedOption || 'Unknown'}" (Decisive Factor: "${currentDecision.verdict?.theDecisiveFactor || ''}")
CANDIDATE OPTIONS: ${currentDecision.options?.map((o: any) => o.name).join(', ')}

NEW WHAT-IF HYPOTHETICAL / CONSTRAINT:
"${whatIfScenario}"

Simulate how this new factor alters the decision. Does the winner change? What new risks or upsides emerge?`;

    const response = await generateContentWithRetry(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioTitle: { type: Type.STRING },
            verdictShifted: { type: Type.BOOLEAN },
            newRecommendedOption: { type: Type.STRING },
            shiftExplanation: { type: Type.STRING },
            impactOnOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionName: { type: Type.STRING },
                  impactSummary: { type: Type.STRING },
                  riskChange: { type: Type.STRING, description: 'Increased, Decreased, or Neutral' },
                },
                required: ['optionName', 'impactSummary', 'riskChange'],
              },
            },
            strategicAdvice: { type: Type.STRING },
          },
          required: [
            'scenarioTitle',
            'verdictShifted',
            'newRecommendedOption',
            'shiftExplanation',
            'impactOnOptions',
            'strategicAdvice',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Received empty response from Gemini API for stress test.');
    }

    const parsedData = JSON.parse(text);
    return res.json({
      success: true,
      result: parsedData,
    });
  } catch (error: any) {
    console.error('Error during stress test simulation:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to simulate what-if scenario.',
    });
  }
});

// Vite middleware for dev or static files for prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`The Tiebreaker server running on http://0.0.0.0:${port}`);
});
