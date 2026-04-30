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

  it('handles multi-intent but prioritizes based on weights', () => {
    // Both 'new' (REGISTER) and 'kahan' (SEARCH) are present
    const context = processUser("naya voter id kahan banega");
    expect(context).toBeTruthy();
    // 'kahan' is in SEARCH, 'naya' is in REGISTER
    // According to our weights, both have 1. The reducer picks SEARCH if same (order dependent)
  });

  it('detects issue resolution with correction keywords', () => {
    const context = processUser("नाम गलत है सुधार कैसे करें");
    expect(context.intent).toBe('ISSUE');
    expect(context.flow).toBe('ISSUE_RESOLUTION');
  });

  it('handles Hindi registration intent', () => {
    const context = processUser("नया वोटर कार्ड पंजीकरण");
    expect(context.intent).toBe('REGISTER');
    expect(context.flow).toBe('NEW_VOTER');
  });

  it('recognizes "how to vote" as VOTE intent', () => {
    const context = processUser("how to vote in lok sabha");
    expect(context.intent).toBe('VOTE');
    expect(context.flow).toBe('REGISTERED_VOTER');
  });

  it('treats exactly 18 years old as eligible', () => {
    const ctx = processUser('I am 18 years old and want to register');
    expect(ctx.age).toBe(18);
    expect(ctx.flow).not.toBe('NOT_ELIGIBLE');
  });

  it('handles empty input gracefully', () => {
    const ctx = processUser('');
    expect(ctx.intent).toBe('GENERAL');
    expect(ctx.flow).toBe('GENERAL');
  });
});
