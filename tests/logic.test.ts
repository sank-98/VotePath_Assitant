import { describe, it, expect } from 'vitest';
import { processUser } from '../src/lib/decisionEngine';

describe('Decision Engine Logic', () => {
  it('identifies new voter intent from keywords', () => {
    const context = processUser("I don't have voter id and I am 20 years old");
    expect(context.registered).toBe(false);
    expect(context.age).toBe(20);
    expect(context.flow).toBe('NEW_VOTER');
  });

  it('identifies registered voter intent', () => {
    const context = processUser("i have epic card and want to vote");
    expect(context.registered).toBe(true);
    expect(context.flow).toBe('REGISTERED_VOTER');
  });

  it('activates simplified mode for beginners', () => {
    const context = processUser("explain voting simply like for a child");
    expect(context.isSimplified).toBe(true);
    expect(context.flow).toBe('SIMPLIFIED');
  });

  it('handles ineligibility based on age', () => {
    const context = processUser("I am 16 years old");
    expect(context.age).toBe(16);
    expect(context.flow).toBe('NOT_ELIGIBLE');
  });

  it('detects issue resolution intent', () => {
    const context = processUser("lost my voter card how to get new one");
    expect(context.intent).toBe('ISSUE');
    expect(context.flow).toBe('ISSUE_RESOLUTION');
  });

  it('detects search intent for polling booth location', () => {
    const context = processUser("where is my polling booth");
    expect(context.intent).toBe('SEARCH');
  });
});
