import { describe, it, expect } from 'vitest';
import * as validation from './index';

describe('utils/index', () => {
  it('exports validation', () => {
    expect(validation.sanitizeString).toBeDefined();
  });
});
