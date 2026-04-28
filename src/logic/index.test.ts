import { describe, it, expect } from 'vitest';
import * as logic from './index';

describe('logic/index', () => {
  it('exports everything', () => {
    expect(logic.DecisionEngine).toBeDefined();
  });
});
