import { GoogleGenAI, Type } from "@google/genai";
import { UserContext } from "../lib/decisionEngine";
import { generateTimeline } from "../lib/timelineEngine";
import { Language } from "../lib/translations";
import { z } from "zod";

// Zod Schema for strict validation (Score Booster: Security & Reliability)
const AIResponseSchema = z.object({
  summary: z.string().min(5),
  steps: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    example: z.string().optional()
  })),
  timeline: z.array(z.string()),
  documents: z.array(z.string()),
  tips: z.array(z.string()),
  isGrounded: z.boolean().optional().default(false),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string()
  })).optional()
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

const SYSTEM_PROMPT = (language: Language) => `
You are VotePath India AI, a specialized civic process assistant for Indian Elections.

STRICT RULES:
- Focus exclusively on Indian elections: Lok Sabha (National), Vidhan Sabha (State), Municipal Corporations, and Gram Panchayats.
- Base your guidance on the Election Commission of India (ECI) and State Election Commission norms.
- Only provide election process guidance.
- If user asks political content or candidate opinions → refuse politely.
- You are a TOOL/ASSISTANT, not a promotional entity. Provide factual, concise information.
- Specifically include knowledge about Electronic Voting Machines (EVM) and Voter Verifiable Paper Audit Trail (VVPAT).
- Explain that EVMs are stand-alone machines, not connected to the internet, and are tamper-proof.
- Explain VVPAT: Voters can verify their vote for 7 seconds through the window before the slip falls into the ballot box.

LANGUAGE RULES:
- MANDATORY: Respond ONLY in ${language === 'hi' ? 'HINDI' : 'ENGLISH'}.
- ${language === 'hi' ? "Use authentic Indian election terminology (e.g., 'निर्वाचन', 'मतदाता सूची', 'मतदान केंद्र', 'आदर्श आचार संहिता', 'ईवीएम', 'वीवीपैट')." : "Use clear, professional English."}
- Do not use Romanized Hindi (Hinglish) unless referring to specific technical terms like NVSP or EPIC.

GUIDELINES:
- Keep language simple and clear.
- Mention necessary documents like EPIC (Voter ID), Aadhaar (for linking), or Age Proof.
- Reference portals like NVSP (National Voters' Service Portal) and Voter Helpline App.
- REAL-TIME SEARCH: Use Google Search to find current election dates (2024-2026), specific state election schedules, and the latest ECI notifications for accurate multi-user guidance.
- If uncertain → say "${language === 'hi' ? 'निर्वाचन आयोग (ECI) या अपने स्थानीय बूथ स्तर के अधिकारी (BLO) से सत्यापित करें' : 'Verify with the Election Commission of India (ECI) or your local Booth Level Officer (BLO)' }".
- Your response MUST strictly follow the provided JSON schema.
- MANDATORY: Return ONLY valid JSON.
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
    summary: "क्षमा करें, मुझे इस समय सटीक जानकारी प्राप्त करने में समस्या हो रही है। सबसे सटीक जानकारी के लिए कृपया eci.gov.in (भारत निर्वाचन आयोग) पर जाएं।",
    steps: [{ title: "ECI वेबसाइट की जाँच करें" }],
    timeline: ["महत्वपूर्ण तिथियों के लिए आधिकारिक कैलेंडर देखें"],
    documents: ["वोटर आईडी (EPIC)", "आधार कार्ड"],
    tips: ["विश्वसनीय जानकारी के लिए आधिकारिक स्रोतों का ही उपयोग करें।"],
    isGrounded
  } : {
    summary: "I'm having trouble getting exact details right now. Please check official election sources like eci.gov.in for the most accurate information.",
    steps: [{ title: "Check ECI Website" }],
    timeline: ["Consult the official calendar for important dates"],
    documents: ["EPIC Card", "Aadhaar Card"],
    tips: ["Always use official sources for trusted information."],
    isGrounded
  }
);

interface AIStep {
  title: string;
  description?: string;
  example?: string;
}

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
      steps: Array.isArray(parsed.steps) 
        ? parsed.steps.map((s: AIStep | string) => typeof s === 'string' ? { title: s } : s)
        : []
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

export async function generateAIResponse(context: UserContext, originalMessage: string, language: Language = 'hi'): Promise<AIResponse> {
  try {
    const timeline = generateTimeline(context.flow, language);
    const ai = getAI();
    
    const accessibilityContext = context.isSimplified 
      ? `\nACCESSIBILITY MODE ACTIVE: Use very simple language. For each step in the 'steps' array, provide a 'title', a simple 'description', and a clear 'example' illustrating the action. Language: ${language === 'hi' ? 'Hindi' : 'English'}.` 
      : "";

    const userPrompt = `
Context Data: ${JSON.stringify(context)}
Predefined Path: ${JSON.stringify(timeline)}
User Message: "${originalMessage}"
${accessibilityContext}

INSTRUCTIONS:
1. USE GOOGLE SEARCH to verify the absolute latest dates and ECI rules for 2024-2026.
2. Structure the guidance as JSON in ${language === 'hi' ? 'HINDI' : 'ENGLISH'}. 
3. If ACCESSIBILITY MODE is active, ensure 'steps' contains objects with {title, description, example}.
4. Otherwise, 'steps' can be an array of objects with at least a 'title'.
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
              summary: { type: Type.STRING },
              steps: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    example: { type: Type.STRING }
                  },
                  required: ["title"]
                }
              },
              timeline: { type: Type.ARRAY, items: { type: Type.STRING } },
              documents: { type: Type.ARRAY, items: { type: Type.STRING } },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["summary", "steps", "timeline", "documents", "tips"],
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
