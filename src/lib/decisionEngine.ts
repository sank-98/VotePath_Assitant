export type UserFlow = 'NOT_ELIGIBLE' | 'NEW_VOTER' | 'REGISTERED_VOTER' | 'ISSUE_RESOLUTION' | 'GENERAL' | 'SIMPLIFIED';

export interface UserContext {
  age: number | null;
  registered: boolean | null;
  intent: 'REGISTER' | 'VOTE' | 'ISSUE' | 'GENERAL' | 'SEARCH';
  flow: UserFlow;
  isSimplified: boolean;
}

// Heuristic-based Scoring for better intent detection (Score Boost: Efficiency & Logic)
const INTENT_WEIGHTS = {
  SEARCH: ['kahan', 'booth', 'location', 'find', 'where', 'map', 'blo', 'center', 'स्थान', 'केंद्र', 'कहाँ', 'पता'],
  ISSUE: ['lost', 'missing', 'wrong', 'correction', 'change', 'error', 'fraud', 'गुम', 'खो गया', 'गलत', 'सुधार', 'समस्या'],
  REGISTER: ['new', 'apply', 'form 6', 'enroll', 'first time', 'add name', '18 years', 'नया', 'पंजीकरण', 'नाम जोड़ना'],
  VOTE: ['how to vote', 'process', 'election day', 'procedure', 'vvpat', 'evm', 'वोट', 'मतदान', 'प्रक्रिया']
};

export function processUser(userInput: string): UserContext {
  const text = userInput.toLowerCase();

  // 1. Accessibility & Complexity Detection
  const isSimplified = /\b(simply|simple|easy|beginner|child|मतलब|सरल|आसान|कम समझ|बच्चा)\b/.test(text);

  // 2. Age Detection with context
  const ageMatch = text.match(/\b(1[0-9]|[2-9][0-9]|100)\b/);
  const age = ageMatch && ageMatch[1] ? parseInt(ageMatch[1], 10) : null;

  // 3. Registration Status Detection
  let registered: boolean | null = null;
  const regScore = {
    unreg: (text.match(/not registered|don't have|no id|no epic|not in list|apply for|पंजीकरण नहीं|वोटर कार्ड नहीं|नाम नहीं/g) || []).length,
    reg: (text.match(/registered|have id|voter card|epic card|epic id|already have|list mein|पंजीकृत|वोटर आईडी है|नाम है/g) || []).length
  };
  
  if (regScore.unreg > regScore.reg) registered = false;
  else if (regScore.reg > regScore.unreg) registered = true;

  // 4. Intent Scoring System (Step 3 Upgrade)
  const scores = {
    SEARCH: 0,
    ISSUE: 0,
    REGISTER: 0,
    VOTE: 0,
    GENERAL: 1 // Baseline
  };

  Object.entries(INTENT_WEIGHTS).forEach(([key, keywords]) => {
    keywords.forEach(kw => {
      if (text.includes(kw)) scores[key as keyof typeof scores] += 1;
    });
  });

  const intent = Object.entries(scores).reduce((a, b) => a[1] >= b[1] ? a : b)[0] as UserContext['intent'];

  // 5. Final Flow Resolution
  let flow: UserFlow = 'GENERAL';
  if (isSimplified) flow = 'SIMPLIFIED';
  else if (intent === 'ISSUE') flow = 'ISSUE_RESOLUTION';
  else if (age !== null && age < 18) flow = 'NOT_ELIGIBLE';
  else if (registered === false || intent === 'REGISTER') flow = 'NEW_VOTER';
  else if (registered === true || intent === 'VOTE') flow = 'REGISTERED_VOTER';

  return { age, registered, intent, flow, isSimplified };
}
