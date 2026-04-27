import { Language } from '../lib/translations';

export interface IssueWeight {
  id: string;
  label: { en: string; hi: string };
  weight: number; // 1-10
}

export interface CandidateData {
  id: string;
  name: { en: string; hi: string };
  party: { en: string; hi: string };
  scores: Record<string, number>; // Maps issue ID to performance score (1-10)
  image?: string;
}

export interface MatchingResult {
  candidateId: string;
  totalScore: number;
  confidence: number;
  breakdown: Record<string, number>;
}

/**
 * PRODUCTION-GRADE DECISION ENGINE
 * Uses a weighted sum model to match user concerns to candidate profiles.
 * This provides explainable and traceable voting guidance.
 */
export class DecisionEngine {
  private issues: IssueWeight[] = [
    { id: 'economy', label: { en: 'Economic Growth', hi: 'आर्थिक विकास' }, weight: 5 },
    { id: 'education', label: { en: 'Education Quality', hi: 'शिक्षा की गुणवत्ता' }, weight: 5 },
    { id: 'healthcare', label: { en: 'Healthcare Access', hi: 'स्वास्थ्य सेवाएं' }, weight: 5 },
    { id: 'environment', label: { en: 'Environment', hi: 'पर्यावरण' }, weight: 5 },
    { id: 'security', label: { en: 'National Security', hi: 'राष्ट्रीय सुरक्षा' }, weight: 5 },
  ];

  private candidates: CandidateData[] = [
    {
      id: 'cand-1',
      name: { en: 'Candidate Alpha', hi: 'उम्मीदवार अल्फा' },
      party: { en: 'Progressive Party', hi: 'प्रगतिशील पार्टी' },
      scores: { economy: 8, education: 9, healthcare: 7, environment: 9, security: 5 },
    },
    {
      id: 'cand-2',
      name: { en: 'Candidate Beta', hi: 'उम्मीदवार बीटा' },
      party: { en: 'Nationalist Front', hi: 'राष्ट्रवादी मोर्चा' },
      scores: { economy: 9, education: 6, healthcare: 8, environment: 4, security: 9 },
    },
    {
       id: 'cand-3',
       name: { en: 'Candidate Gamma', hi: 'उम्मीदवार गामा' },
       party: { en: 'People\'s Union', hi: 'पीपल्स यूनियन' },
       scores: { economy: 6, education: 8, healthcare: 10, environment: 7, security: 6 },
    }
  ];

  /**
   * Calculate matches based on dynamic user weights
   */
  public calculateMatch(userWeights: Record<string, number>): MatchingResult[] {
    const results = this.candidates.map(candidate => {
      let totalWeightedScore = 0;
      let maxPossibleScore = 0;
      const breakdown: Record<string, number> = {};

      Object.entries(userWeights).forEach(([issueId, weight]) => {
        const candidateScore = candidate.scores[issueId] || 0;
        const weightedScore = candidateScore * weight;
        totalWeightedScore += weightedScore;
        maxPossibleScore += 10 * weight; // 10 is max score per issue
        breakdown[issueId] = candidateScore;
      });

      const confidence = maxPossibleScore > 0 ? (totalWeightedScore / maxPossibleScore) * 100 : 0;

      return {
        candidateId: candidate.id,
        totalScore: totalWeightedScore,
        confidence,
        breakdown
      };
    });

    return results.sort((a, b) => b.totalScore - a.totalScore);
  }

  public getCandidate(id: string) {
    return this.candidates.find(c => c.id === id);
  }

  public getIssues() {
    return this.issues;
  }
}
