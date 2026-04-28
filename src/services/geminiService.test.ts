import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAIResponse, AIError, AIErrorType } from './geminiService';
import { GoogleGenAI } from "@google/genai";

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent
      };
    },
    Type: { OBJECT: 'object', STRING: 'string', ARRAY: 'array' }
  };
});

describe('geminiService', () => {
  let aiInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    aiInstance = new GoogleGenAI({ apiKey: 'test' });
  });

  const getMockGenerateContent = () => {
    // use mockGenerateContent directly
  };

  it('generates successful AI response without grounding', async () => {
    const mockContentResponse = {
      text: JSON.stringify({
        currentStep: 'Registration',
        whatHappens: 'Process of adding name',
        whatYouMustDo: 'Fill form 6',
        requiredDocuments: ['Aadhaar'],
        timelineDeadlines: ['30th Jan'],
        commonMistakes: ['Skipping dob proof'],
        nextStep: 'Verification'
      })
    };
    mockGenerateContent.mockResolvedValue(mockContentResponse);

    const result = await generateAIResponse('How to register?', { id: 'test', language: 'en', ageCode: 'first-time' }, 'en');
    expect(result.currentStep).toBe('Registration');
    expect(result.isGrounded).toBe(false);
  });

  it('generates successful AI response with grounding', async () => {
    const mockContentResponse = {
      text: JSON.stringify({
        currentStep: 'Registration',
        whatHappens: 'Process of adding name',
        whatYouMustDo: 'Fill form 6',
        requiredDocuments: ['Aadhaar'],
        timelineDeadlines: ['30th Jan'],
        commonMistakes: ['Skipping dob proof'],
        nextStep: 'Verification'
      }),
      candidates: [{
        groundingMetadata: {
          searchEntryPoint: { renderedContent: 'asdf' },
          groundingChunks: [{ web: { title: 'ECI', uri: 'https://eci.gov.in' } }]
        }
      }]
    };
    mockGenerateContent.mockResolvedValue(mockContentResponse);

    const result = await generateAIResponse('How to register?', { id: 'test', language: 'en', ageCode: 'first-time' }, 'en');
    expect(result.isGrounded).toBe(true);
    expect(result.sources?.[0].title).toBe('ECI');
  });

  it('throws Rate Limit AIError', async () => {
    mockGenerateContent.mockRejectedValue(new Error('rate limit 429'));
    await expect(generateAIResponse('hi', {} as any, 'en')).rejects.toThrow(AIError);
    await expect(generateAIResponse('hi', {} as any, 'en')).rejects.toMatchObject({ type: AIErrorType.RATE_LIMIT });
  });

  it('throws Safety AIError', async () => {
    mockGenerateContent.mockRejectedValue(new Error('content blocked by safety'));
    await expect(generateAIResponse('hi', {} as any, 'en')).rejects.toMatchObject({ type: AIErrorType.SAFETY });
  });
  
  it('throws Network AIError', async () => {
    mockGenerateContent.mockRejectedValue(new Error('network error offline'));
    await expect(generateAIResponse('hi', {} as any, 'en')).rejects.toMatchObject({ type: AIErrorType.NETWORK });
  });

  it('throws unknown AIError', async () => {
    mockGenerateContent.mockRejectedValue(new Error('weird error'));
    await expect(generateAIResponse('hi', {} as any, 'en')).rejects.toMatchObject({ type: AIErrorType.UNKNOWN });
  });

  it('throws Validation error on empty response', async () => {
    mockGenerateContent.mockResolvedValue({});
    await expect(generateAIResponse('hi', {} as any, 'en')).rejects.toMatchObject({ type: AIErrorType.VALIDATION });
  });

  it('returns fallback instead of Validation error on invalid JSON', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'invalid json' });
    const result = await generateAIResponse('hi', {} as any, 'en');
    expect(result.currentStep).toBe('Election Process Assistance');
  });

  it('parses markdown json blocks correctly', async () => {
    const validJson = JSON.stringify({
      currentStep: 'Markdown',
      whatHappens: 'Testing markdown parsing',
      whatYouMustDo: 'Wait for parser',
      requiredDocuments: [],
      timelineDeadlines: [],
      commonMistakes: [],
      nextStep: 'Done'
    });
    mockGenerateContent.mockResolvedValue({ text: `\`\`\`json
${validJson}
\`\`\`` });
    const result = await generateAIResponse('hi', {} as any, 'en');
    expect(result.currentStep).toBe('Markdown');
  });

  it('returns fallback for invalid json in markdown block', async () => {
    mockGenerateContent.mockResolvedValue({ text: '```json\n { invalid \n```' });
    const result = await generateAIResponse('hi', {} as any, 'en');
    expect(result.currentStep).toBe('Election Process Assistance');
  });
});

