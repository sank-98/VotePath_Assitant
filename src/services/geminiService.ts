/**
 * GEMINI AI SERVICE: Core Intelligence
 * 
 * Orchestrates communication with Google Gemini 1.5 Pro to provide
 * grounded, validated electoral assistance.
 */

import { GoogleGenAI, Type } from "@google/genai";
import { UserContext } from "../lib/decisionEngine";
import { generateTimeline } from "../lib/timelineEngine";
import { Language } from "../lib/translations";
import { z } from "zod";

/**
 * Zod Schema for strict validation of AI electoral assistance responses.
 * Enforces data integrity before displaying to the user.
 */
const AIResponseSchema = z.object({
  /** The specific phase of the election process currently being discussed */
  currentStep: z.string(),
  /** Explanation of what generally happens in this phase */
  whatHappens: z.string(),
  /** Specific actionable instructions for the citizen */
   whatYouMustDo: z.string(),
  /** List of documents (EPIC, Aadhaar, etc.) required for this step */
  requiredDocuments: z.array(z.string()),
  /** Critical dates or timeframes the user must observe */
  timelineDeadlines: z.array(z.string()),
  /** Common pitfalls or errors to watch out for during this step */
  commonMistakes: z.array(z.string()),
  /** The natural sequential step in the process */
  nextStep: z.string(),
  /** Optional interactive prompt to refine the user's status */
  questionForUser: z.string().optional(),
  /** Interactive choices for the user to select from */
  options: z.array(z.string()).optional(),
  /** Indicates if the response was verified with real-world search data */
  isGrounded: z.boolean().optional().default(false),
  /** Source attribution for grounded information */
  sources: z.array(z.object({
    title: z.string(),
    url: z.string()
  })).optional()
});

/**
 * Validated response structure for AI components.
 */
export type AIResponse = z.infer<typeof AIResponseSchema>;

const SYSTEM_PROMPT = (language: Language) => `
You are an Election Process Guide for Indian Elections. Your job is to help users understand elections step-by-step in a clear, structured, and interactive way.

SCOPE:
- Eligibility
- Registration
- Verification
- Voting process
- Counting and results

RULES:
- Do NOT give political opinions or recommendations.
- Focus exclusively on process, timelines, and actions.
- If user is unclear, guide them step-by-step.
- Base your guidance on the Election Commission of India (ECI) and State Election Commission norms.
- Specifically include knowledge about Electronic Voting Machines (EVM) and Voter Verifiable Paper Audit Trail (VVPAT).
- Explain that EVMs are stand-alone machines, not connected to the internet, and are tamper-proof.
- Explain VVPAT: Voters can verify their vote for 7 seconds through the window before the slip falls into the ballot box.

BEHAVIOR:
- Adapt to user level (beginner vs informed).
- Keep explanations simple but precise.
- If data is missing, say "information not available".
- If the user does not specify their stage, you MUST ask: "Which stage are you currently in?" and provide the 4 options: 1. Not registered, 2. Registered but unsure, 3. Ready to vote, 4. Already voted.

LANGUAGE RULES:
- MANDATORY: Respond ONLY in ${language === 'hi' ? 'HINDI' : 'ENGLISH'}.
- ${language === 'hi' ? "Use authentic Indian election terminology (e.g., 'निर्वाचन', 'मतदाता सूची', 'मतदान केंद्र', 'आदर्श आचार संहिता', 'ईवीएम', 'वीवीपैट')." : "Use clear, professional English."}

OUTPUT FORMAT (STRICT JSON):
Your response MUST strictly follow the provided JSON schema. Every field is mandatory except questionForUser and options.
- currentStep: The literal name of the current phase.
- whatHappens: Simple explanation of the phase.
- whatYouMustDo: Clear action items for the user.
- requiredDocuments: List of documents needed.
- timelineDeadlines: Important dates or deadlines.
- commonMistakes: Things to avoid.
- nextStep: What comes after this phase.
- questionForUser: Populate this if you need to ask which stage they are in.
- options: The list of stages (1-4 as specified in rules) if asking for stage.

MANDATORY: Return ONLY valid JSON.
`;

export enum AIErrorType {
  NETWORK = 'NETWORK',
  RATE_LIMIT = 'RATE_LIMIT',
  SAFETY = 'SAFETY',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

export class AIError extends Error {
  constructor(public type: AIErrorType, message: string) {
    super(message);
    this.name = 'AIError';
  }
}

// Shared fallback logic
const getFallback = (language: Language, isGrounded = false): AIResponse => (
  language === 'hi' ? {
    currentStep: "निर्वाचन प्रक्रिया सहायता",
    whatHappens: "हम आपको चुनाव प्रक्रिया के माध्यम से मार्गदर्शन कर रहे हैं।",
    whatYouMustDo: "कृपया अपनी वर्तमान स्थिति स्पष्ट करें या भारत निर्वाचन आयोग (ECI) की आधिकारिक वेबसाइट eci.gov.in देखें।",
    requiredDocuments: ["वोटर आईडी (EPIC)", "आधार कार्ड"],
    timelineDeadlines: ["आधिकारिक कैलेंडर की जाँच करें"],
    commonMistakes: ["अपुष्ट स्रोतों पर विश्वास करना"],
    nextStep: "पंजीकरण या सत्यापन की ओर बढ़ें",
    isGrounded
  } : {
    currentStep: "Election Process Assistance",
    whatHappens: "We are guiding you through the election process.",
    whatYouMustDo: "Please clarify your current stage or visit eci.gov.in for official information.",
    requiredDocuments: ["EPIC Card", "Aadhaar Card"],
    timelineDeadlines: ["Consult the official calendar"],
    commonMistakes: ["Relying on unverified information"],
    nextStep: "Proceed to registration or verification",
    isGrounded
  }
);

// Robust JSON validation/repair layer
function safeParse(text: string, language: Language, isGrounded?: boolean): AIResponse {
  if (!text || text.trim() === "") return getFallback(language, isGrounded);

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanText = jsonMatch ? jsonMatch[0] : text;

    const parsed = JSON.parse(cleanText);
    const validated = AIResponseSchema.parse({
      ...parsed,
      isGrounded: isGrounded || parsed.isGrounded,
    });
    return validated;
  } catch (error) {
    console.error("AI Validation Failure:", error);
    if (text.includes("```json")) {
      try {
        const secondaryMatch = text.split("```json")[1].split("```")[0];
        return safeParse(secondaryMatch, language, isGrounded);
      } catch {
        return getFallback(language, isGrounded);
      }
    }
    return getFallback(language, isGrounded);
  }
}

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    // In Vite, we MUST use this literal for the define replacement
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // We'll try to proceed and let the SDK handle it, but log a specific warning
      console.warn("GEMINI_API_KEY appears to be unconfigured. Please ensure it is set in the Secrets panel.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey as string });
  }
  return aiInstance;
}

/**
 * GENERATES PERSONALIZED BHARAT ELECTORAL GUIDANCE
 * 
 * Interacts with Gemini 1.5 Flash to provide context-aware civic guidance.
 * Uses search grounding to ensure data from 2024-2026 is accurate.
 * 
 * @param context - The analyzed user intent and state context
 * @param originalMessage - The raw user query
 * @param language - Preferred output language (en/hi)
 * @returns A structured, grounded AI response object
 * @throws {AIError} Categorized errors for specific UX handling (safety, rate limit, etc.)
 */
export async function generateAIResponse(context: UserContext, originalMessage: string, language: Language = 'hi'): Promise<AIResponse> {
  try {
    const timeline = generateTimeline(context.flow, language);
    const ai = getAI();
    
    const accessibilityContext = context.isSimplified 
      ? `\nACCESSIBILITY MODE ACTIVE: Use very simple language for a beginner or student level. Language: ${language === 'hi' ? 'Hindi' : 'English'}.` 
      : "";

    const userPrompt = `
Context Data: ${JSON.stringify(context)}
Predefined Path: ${JSON.stringify(timeline)}
User Message: "${originalMessage}"
${accessibilityContext}

INSTRUCTIONS:
1. USE GOOGLE SEARCH if needed to verify latest dates or specific regional rules for 2024-2026.
2. Structure the guidance as JSON following the "Election Process Guide" persona and output format.
3. If the user's message does not clearly indicate their stage (not registered, registered but unsure, ready to vote, already voted), you MUST populate the 'questionForUser' and 'options' fields.
`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT(language),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              currentStep: { type: Type.STRING },
              whatHappens: { type: Type.STRING },
              whatYouMustDo: { type: Type.STRING },
              requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
              timelineDeadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              nextStep: { type: Type.STRING },
              questionForUser: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["currentStep", "whatHappens", "whatYouMustDo", "requiredDocuments", "timelineDeadlines", "commonMistakes", "nextStep"],
          },
          tools: [{ googleSearch: {} }],
          toolConfig: { includeServerSideToolInvocations: true }
        },
      });
    } catch (apiError: unknown) {
      console.error("Gemini API Request Failed:", apiError);
      
      const errorMsg = (apiError as Error)?.message?.toLowerCase() || "";
      if (errorMsg.includes("rate limit") || errorMsg.includes("429")) {
        throw new AIError(AIErrorType.RATE_LIMIT, "API rate limit exceeded");
      }
      if (errorMsg.includes("safety") || errorMsg.includes("blocked")) {
        throw new AIError(AIErrorType.SAFETY, "Content blocked by safety filters");
      }
      if (errorMsg.includes("fetch") || errorMsg.includes("network") || errorMsg.includes("offline")) {
        throw new AIError(AIErrorType.NETWORK, "Network connection error");
      }
      throw new AIError(AIErrorType.UNKNOWN, "Failed to connect to AI service");
    }

    if (!response || !response.text) {
      throw new AIError(AIErrorType.VALIDATION, "Empty response from AI");
    }

    const isGrounded = !!response.candidates?.[0]?.groundingMetadata?.searchEntryPoint || !!response.candidates?.[0]?.groundingMetadata?.groundingChunks?.length;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: { web?: { title?: string; uri?: string } }) => ({
      title: chunk.web?.title || 'Election Source',
      url: chunk.web?.uri || ''
    })).filter((s: { url: string }) => s.url) || [];

    try {
      const parsedData = safeParse(response.text || "", language, isGrounded);
      return {
        ...parsedData,
        sources: sources.length > 0 ? sources : parsedData.sources
      };
    } catch {
      throw new AIError(AIErrorType.VALIDATION, "Failed to parse AI response");
    }
  } catch (error: unknown) {
    console.error("generateAIResponse Error:", error);
    if (error instanceof AIError) throw error;
    throw new AIError(AIErrorType.UNKNOWN, (error as Error)?.message || "An unexpected error occurred");
  }
}
