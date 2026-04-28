/**
 * ELECTION FORM IDENTIFIERS (ECI)
 */
export enum ElectionForm {
  /** Application for inclusion of name in electoral roll */
  VOTER_REGISTRATION = 'Form 6',
  /** Application for shifting/correction/replacement of EPIC */
  CORRECTION_SHIFTING = 'Form 8',
  /** Candidate affidavit */
  CANDIDATE_AFFIDAVIT = 'Form 26',
  /** Application for postal ballot */
  POSTAL_BALLOT = 'Form 12D',
}

/**
 * CORE DESIGN CONSTANTS
 */
export const DESIGN = {
  BENTO_SHADOW: 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
  BENTO_BORDER: 'border-4 border-slate-900',
  BENTO_ROUNDED: 'rounded-[2.5rem]',
};

/**
 * ANALYTICS EVENT NAMES
 */
export enum AnalyticsEvent {
  AI_QUERY = 'ai_query',
  BOOTH_SEARCH = 'booth_search',
  STATE_FOLLOWED = 'state_followed',
  SLIP_DOWNLOAD = 'slip_download',
  MATCH_CALCULATED = 'match_calculated',
}
