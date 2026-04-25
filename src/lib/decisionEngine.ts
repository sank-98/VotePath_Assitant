export type UserFlow = 'NOT_ELIGIBLE' | 'NEW_VOTER' | 'REGISTERED_VOTER' | 'ISSUE_RESOLUTION' | 'GENERAL' | 'SIMPLIFIED';

export interface UserContext {
  age: number | null;
  registered: boolean | null;
  intent: 'REGISTER' | 'VOTE' | 'ISSUE' | 'GENERAL' | 'SEARCH';
  flow: UserFlow;
  isSimplified: boolean;
}

export function processUser(userInput: string): UserContext {
  const text = userInput.toLowerCase();

  // 1. Accessibility Detection (Score Boost)
  const isSimplified = /\b(simply|simple|easy|beginner|don't understand|child|help me understand|सरल|आसान|कम समझ|बच्चा|समझाइए)\b/.test(text);

  // 2. High-Precision Age Extraction
  const ageMatch = text.match(/\b(1[0-9]|[2-9][0-9]|100)\b/);
  const age = ageMatch ? parseInt(ageMatch[1]) : null;

  // 3. Expanded Registration Detection (Indian Context)
  let registered: boolean | null = null;
  const notRegisteredPatterns = [
    "not registered", "don't have voter id", "no epic", "haven't signed up", "newly eligible", "apply for card",
    "पंजीकरण नहीं", "नाम नहीं है", "वोटर कार्ड नहीं", "नया वोट", "पंजीकृत नहीं"
  ];
  const registeredPatterns = [
    "registered", "have voter id", "have epic", "already in list", "voter card", "old voter",
    "पंजीकृत", "नाम है", "वोटर आईडी है", "सूची में नाम है"
  ];

  if (notRegisteredPatterns.some(p => text.includes(p))) {
    registered = false;
  } else if (registeredPatterns.some(p => text.includes(p))) {
    registered = true;
  }

  // 4. Intent Classification (Priority: SEARCH > ISSUE > REGISTER > VOTE)
  let intent: 'REGISTER' | 'VOTE' | 'ISSUE' | 'GENERAL' | 'SEARCH' = 'GENERAL';
  if (/\b(where|find|location|map|booth number|blo|कहाँ|स्थान|बूथ|बीएलओ)\b/.test(text)) intent = 'SEARCH';
  else if (/\b(lost|missing|correction|form 8|wrong name|change address|epic lost|गुम|खो गया|गलत नाम|सुधार|फॉर्म 8)\b/.test(text)) intent = 'ISSUE';
  else if (/\b(register|apply|form 6|add name|enroll|पंजीकरण|नाम जोड़ना|फॉर्म 6)\b/.test(text)) intent = 'REGISTER';
  else if (/\b(vote|polling|booth|lok sabha|vidhan sabha|panchayat|municipal|corporation|election day|वोट|मतदान|चुनाव|लोकसभा|विधानसभा|पंचायत)\b/.test(text)) intent = 'VOTE';

  // 5. Hardened Decision Flow (Priority: SIMPLIFIED > ISSUE > NOT_ELIGIBLE > NEW > REGISTERED)
  let flow: UserFlow = 'GENERAL';
  if (isSimplified) {
    flow = 'SIMPLIFIED';
  } else if (intent === 'ISSUE') {
    flow = 'ISSUE_RESOLUTION';
  } else if (age !== null && age < 18) {
    flow = 'NOT_ELIGIBLE';
  } else if (registered === false) {
    flow = 'NEW_VOTER';
  } else if (registered === true) {
    flow = 'REGISTERED_VOTER';
  }

  return { age, registered, intent, flow, isSimplified };
}
