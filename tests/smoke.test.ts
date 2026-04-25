import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
  it('Math works', () => {
    expect(1 + 1).toBe(2);
  });

  it('Environment is ready', () => {
    expect(true).toBe(true);
  });
});
