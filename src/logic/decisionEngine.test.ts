import { describe, it, expect, beforeEach } from 'vitest';
import { DecisionEngine } from './decisionEngine';

describe('DecisionEngine Core Logic', () => {
  let engine: DecisionEngine;

  beforeEach(() => {
    engine = new DecisionEngine();
  });

  it('calculates perfect match for aligned weights', () => {
    // Mock user weights focusing on Health (Candidate A is high here)
    const weights = { health: 10, infrastructure: 0, economy: 0 };
    const results = engine.calculateMatch(weights);
    
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].candidateId).toBe('cand-1'); // Dr. Aruna
  });

  it('handles edge case: zero weights', () => {
    const weights = { health: 0, infrastructure: 0, economy: 0 };
    const results = engine.calculateMatch(weights);
    
    results.forEach(res => {
      expect(res.confidence).toBe(0);
    });
  });

  it('clamps weights above 10 (Security Guard)', () => {
    const extremeWeights = { health: 999 };
    const normalWeights = { health: 10 };
    
    const resultsExtreme = engine.calculateMatch(extremeWeights);
    const resultsNormal = engine.calculateMatch(normalWeights);
    
    expect(resultsExtreme[0].confidence).toBe(resultsNormal[0].confidence);
  });
});
