import { describe, it, expect } from 'vitest';
import { sanitizeString, validatePostalCode, calculateDistance } from './validation';

describe('validation utils', () => {
  it('sanitizeString', () => {
    expect(sanitizeString('<script>alert("hi")</script>')).toBe('scriptalert("hi")/script');
    expect(sanitizeString(' normal ')).toBe('normal');
  });

  it('validatePostalCode', () => {
    expect(validatePostalCode('123456')).toBe(true);
    expect(validatePostalCode('023456')).toBe(false);
    expect(validatePostalCode('12345')).toBe(false);
    expect(validatePostalCode('1234567')).toBe(false);
    expect(validatePostalCode('abcdef')).toBe(false);
  });

  it('calculateDistance', () => {
    // New York to London
    const distance = calculateDistance(40.7128, -74.0060, 51.5074, -0.1278);
    expect(Math.floor(distance)).toBe(5570);
    // same point
    expect(calculateDistance(10, 10, 10, 10)).toBe(0);
  });
});
