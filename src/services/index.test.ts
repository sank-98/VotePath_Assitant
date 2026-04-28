import { describe, it, expect } from 'vitest';
import * as services from './index';

describe('services/index', () => {
  it('exports everything', () => {
    expect(services.FirebaseService).toBeDefined();
    expect(services.generateAIResponse).toBeDefined();
  });
});
