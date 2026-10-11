import { DecisionFormInputs } from '../types/decision';

export interface DecisionPreset {
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  inputs: DecisionFormInputs;
}

export const DECISION_PRESETS: DecisionPreset[] = [
  {
    id: 'career-offer',
    badge: 'Career Crossroads',
    title: 'Startup Lead Role vs. Big Tech Principal Security',
    shortDesc: 'Early equity upside and total autonomy vs guaranteed $340k W2, stability, and family predictability.',
    inputs: {
      question: 'Should I accept the Founding Engineer / Lead role at a Series A AI startup or stay as a Senior/Principal at Big Tech?',
      options: [
        'Join Series A Startup (1.2% equity, $185k base, heavy ownership, high risk)',
        'Stay at Big Tech ($345k total comp, 40hr weeks, established promotion track)',
        'Counteroffer Big Tech for internal transfer to emergent GenAI team'
      ],
      context: 'I have 7 years of engineering experience, a partner who works in education, and 9 months of financial runway. I feel comfortable but intellectually restless at my current role. We are thinking about buying a home within 3 years.',
      priorities: [
        'Accelerated career trajectory & ownership',
        'Financial stability for home purchase',
        'Avoid burnout & maintain relationship health',
        'Meaningful technical challenge'
      ],
      timeHorizon: '2-4 years',
      riskTolerance: 'Balanced / Calculated Risk'
    }
  },
  {
    id: 'tech-build-vs-buy',
    badge: 'Product & Tech',
    title: 'Build In-House Auth & Billing vs. SaaS Vendor Stack',
    shortDesc: 'Complete data sovereignty and custom workflows vs 6-month speed-to-market using Stripe & Clerk.',
    inputs: {
      question: 'Should our team build our custom enterprise auth & billing microservices in-house or subscribe to managed SaaS providers (Clerk + Stripe Billing)?',
      options: [
        'Subscribe to Managed SaaS Stack (Clerk + Stripe Billing)',
        'Engineer In-House Custom Auth & Subscription Engine',
        'Hybrid: Managed Auth with Custom In-House Entitlements Database'
      ],
      context: 'We are a 6-person B2B SaaS engineering team aiming for SOC2 compliance. Our runway is 14 months before next financing. Two senior engineers strongly want to build in-house to avoid vendor lock-in and marginal SaaS subscription tier costs at scale.',
      priorities: [
        'Speed to revenue launch',
        'SOC2 compliance simplicity',
        'Engineering bandwidth preservation for core value proposition',
        'Long-term vendor dependency mitigation'
      ],
      timeHorizon: '1-2 years',
      riskTolerance: 'Pragmatic / Speed-First'
    }
  },
  {
    id: 'relocation-dilemma',
    badge: 'Life & Location',
    title: 'Relocate to Coastal Hub vs. Stay in Mid-Sized Low-Cost City',
    shortDesc: 'Density of professional networks and cultural vibrancy vs housing affordability and quiet pace.',
    inputs: {
      question: 'Should I move to New York City to expand my creative network or stay in my current city (Pittsburgh/Columbus) to build financial savings?',
      options: [
        'Relocate to NYC (Sign a 1-year apartment lease, dive into in-person community)',
        'Stay put in current city (Invest savings, travel to NYC quarterly for conferences)',
        'Trial residency (Sublet for 3 months in Brooklyn before permanent commitment)'
      ],
      context: 'I work remotely in design/media. Rent in current city is $1,150/mo; NYC would be $2,800/mo. I feel somewhat isolated socially and feel my professional serendipity has stalled out.',
      priorities: [
        'Serendipity and high-caliber peer group',
        'Budget and personal savings rate',
        'Mental health and lifestyle pace',
        'Reversibility if it does not work out'
      ],
      timeHorizon: '1-3 years',
      riskTolerance: 'Moderate Adventure'
    }
  },
  {
    id: 'education-pivot',
    badge: 'Education & Upskilling',
    title: 'Full-Time MBA / Master’s vs. Self-Directed Bootstrapped Project',
    shortDesc: 'Credential prestige and alumni network vs saving $120k tuition and building a real portfolio asset.',
    inputs: {
      question: 'Should I leave my job to pursue a 2-year graduate degree or spend that time and tuition capital launching my own niche business venture?',
      options: [
        'Attend Top Graduate Program (2 years, $130k debt, powerful institutional credential)',
        'Bootstrap Niche Product while keeping current role part-time/full-time',
        'Quit and dedicate 12-month focused runway to entrepreneurial sprint'
      ],
      context: 'Currently 29 years old. Background in product marketing. I have saved $45,000. Admission offer expires in 4 weeks.',
      priorities: [
        'Long-term executive network access',
        'Avoid crippling debt',
        'Proof of real-world execution capability',
        'Career optionality in down markets'
      ],
      timeHorizon: '3-5 years',
      riskTolerance: 'Calculated Growth'
    }
  }
];
