import { Language } from '../lib/translations';

/**
 * Represents a specific issue category with its user-defined importance.
 */
export interface IssueWeight {
  /** Unique identifier for the issue (e.g., 'economy') */
  id: string;
  /** Internationalized labels for the issue */
  label: { en: string; hi: string };
  /** Importance score assigned by the user, ranging from 1 to 10 */
  weight: number;
}

/**
 * Data structure for a political candidate's portfolio.
 */
export interface CandidateData {
  /** Unique candidate identifier */
  id: string;
  /** Candidate name in supported languages */
  name: { en: string; hi: string };
  /** Political party affiliation */
  party: { en: string; hi: string };
  /** 
   * Performance scores mapped by issue ID. 
   * Each score reflects the candidate's alignment with the issue (1-10).
   */
  scores: Record<string, number>;
  /** Optional URL to candidate profile image */
  image?: string;
}

/**
 * Represents the final alignment calculation for a candidate.
 */
export interface MatchingResult {
  /** Reference to the candidate ID */
  candidateId: string;
  /** Cumulative raw score from all issues */
  totalScore: number;
  /** Percentage match (0.00 to 100.00) based on weighted priorities */
  confidence: number;
  /** Detailed score per issue for explainable AI transparency */
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
   * Calculates matches based on dynamic user priority weights.
   * 
   * @param userWeights - Mapping of issue IDs to their relative importance (1-10)
   * @returns A sorted array of MatchingResults, from highest to lowest alignment
   */
  public calculateMatch(userWeights: Record<string, number>): MatchingResult[] {
    const results = this.candidates.map((candidate: CandidateData): MatchingResult => {
      let totalWeightedScore = 0;
      let maxPossibleScore = 0;
      const breakdown: Record<string, number> = {};

      Object.entries(userWeights).forEach(([issueId, weight]) => {
        // Enforce boundary limits (Security Fix)
        const clampedWeight = Math.max(0, Math.min(10, weight));
        const candidateScore = candidate.scores[issueId] || 0;
        const weightedScore = candidateScore * clampedWeight;
        totalWeightedScore += weightedScore;
        maxPossibleScore += 10 * clampedWeight; 
        breakdown[issueId] = candidateScore;
      });

      const confidence = maxPossibleScore > 0 ? (totalWeightedScore / maxPossibleScore) * 100 : 0;

      return {
        candidateId: candidate.id,
        totalScore: totalWeightedScore,
        confidence: parseFloat(confidence.toFixed(2)),
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
