import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';
const FALLBACK_GEMINI_MODELS = Array.from(
  new Set([DEFAULT_GEMINI_MODEL, 'gemini-2.0-flash', 'gemini-2.5-flash'])
);
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const PERSONA_PROMPTS = {
  hitesh: `You are Hitesh Choudhary, a passionate coding teacher with over 10 years of experience. 
  Respond in Hinglish with occasional use of "chai" references. Use phrases like "hanji to chaliye shuru karte hain" or "aaj ki class mein".
  Teaching style is casual yet thorough. Background: Senior Director at PW, ex-CTO of LearnCodeOnline, taught 350,000+ students.
  Keep responses friendly and practical, like explaining on a YouTube video.`,
  
  piyush: `You are Piyush Garg, a tech educator and founder of Teachyst. 
  Your teaching style is direct and practical. You speak in Hinglish but more professionally.
  Key traits:
  - Start with "Haan bhai" or "Hello doston"
  - Use phrases like "seedha point pe aate hain" or "practical approach dekhte hain"
  - Keep focus on implementation and real-world examples
  - Speak confidently but professionally
  - Avoid over-casual language
  - Use technical terms mixed with simple Hinglish explanations
  
  Example style: "Haan doston, aaj hum dekhenge ki authentication kaise implement karte hain. Seedha code pe chalte hain..."
  
  Background: Content creator, entrepreneur, and technical course creator at Teachyst.
  Keep responses professional yet approachable, like your YouTube tutorials.`
};

const TONE_MODIFIERS = {
  default: "",
  funny: "Be more humorous and entertaining in your responses, while maintaining educational value.",
  advice: "Focus on providing practical advice and recommendations in your responses.",
  educational: "Be more detailed and thorough in your explanations, like giving a lecture."
};

type GeminiErrorDetail = {
  '@type'?: string;
  links?: Array<{
    description?: string;
    url?: string;
  }>;
  retryDelay?: string;
  violations?: Array<{
    quotaMetric?: string;
    quotaId?: string;
    quotaDimensions?: {
      location?: string;
      model?: string;
    };
  }>;
};

type GeminiApiError = Error & {
  status?: number;
  statusText?: string;
  errorDetails?: GeminiErrorDetail[];
};

function isModelResolutionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const apiError = error as Error & { status?: number };
  const message = error.message.toLowerCase();

  return (
    apiError.status === 404 ||
    message.includes('is not found') ||
    message.includes('not supported for generatecontent')
  );
}

function isQuotaExceededError(error: unknown): error is GeminiApiError {
  if (!(error instanceof Error)) {
    return false;
  }

  const apiError = error as GeminiApiError;
  const message = error.message.toLowerCase();

  return (
    apiError.status === 429 ||
    message.includes('quota exceeded') ||
    message.includes('too many requests')
  );
}

function parseRetryDelaySeconds(error: GeminiApiError) {
  const retryInfo = error.errorDetails?.find(
    (detail) => detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
  );

  if (retryInfo?.retryDelay) {
    const seconds = Number.parseFloat(retryInfo.retryDelay.replace(/s$/i, ''));
    if (Number.isFinite(seconds)) {
      return Math.max(1, Math.ceil(seconds));
    }
  }

  const messageMatch = error.message.match(/retry in\s+([0-9.]+)s/i);
  if (!messageMatch) {
    return null;
  }

  const seconds = Number.parseFloat(messageMatch[1]);
  return Number.isFinite(seconds) ? Math.max(1, Math.ceil(seconds)) : null;
}

function getQuotaHelpUrl(error: GeminiApiError) {
  return error.errorDetails
    ?.flatMap((detail) => detail.links ?? [])
    .find((link) => link.url)?.url;
}

function buildQuotaExceededResponse(error: GeminiApiError) {
  const retryAfterSeconds = parseRetryDelaySeconds(error);
  const quotaViolations =
    error.errorDetails
      ?.flatMap((detail) => detail.violations ?? [])
      .filter(Boolean) ?? [];
  const affectedModels = Array.from(
    new Set(
      quotaViolations
        .map((violation) => violation.quotaDimensions?.model)
        .filter((model): model is string => Boolean(model))
    )
  );
  const isFreeTierBlocked =
    quotaViolations.some((violation) => violation.quotaId?.includes('FreeTier')) ||
    error.message.includes('limit: 0');
  const helpUrl =
    getQuotaHelpUrl(error) ?? 'https://ai.google.dev/gemini-api/docs/rate-limits';
  const modelLabel = affectedModels[0] ?? DEFAULT_GEMINI_MODEL;
  const retryLabel = retryAfterSeconds ? ` Retry after about ${retryAfterSeconds} seconds.` : '';
  const userMessage = isFreeTierBlocked
    ? `Gemini quota is unavailable for the current API project on ${modelLabel}.${retryLabel} If this keeps happening, enable billing in Google AI Studio or switch to an API key from a project with paid quota.`
    : `Gemini rate limit reached for ${modelLabel}.${retryLabel}`;

  return NextResponse.json(
    {
      error: 'Gemini quota exceeded',
      code: 'quota_exceeded',
      details: error.message,
      retryAfterSeconds,
      model: modelLabel,
      helpUrl,
      userMessage,
    },
    {
      status: 429,
      headers: retryAfterSeconds ? { 'Retry-After': String(retryAfterSeconds) } : undefined,
    }
  );
}

export async function POST(req: Request) {
  try {
    // Validate API key at runtime
    if (!GEMINI_API_KEY || !genAI) {
      console.error('Missing Gemini API key');
      return NextResponse.json(
        { error: 'API configuration error - Missing API key' },
        { status: 500 }
      );
    }

    const { message, persona, settings } = await req.json();
    
    if (!message || !persona) {
      return NextResponse.json(
        { error: 'Message and persona are required' },
        { status: 400 }
      );
    }

    const toneModifier = TONE_MODIFIERS[settings?.tone as keyof typeof TONE_MODIFIERS] ?? TONE_MODIFIERS.default;
    const prompt = `${PERSONA_PROMPTS[persona as keyof typeof PERSONA_PROMPTS]}
      ${toneModifier}
      
      User: ${message}
      
      Response:`;
    const temperature =
      typeof settings?.temperature === 'number' ? settings.temperature : 0;

    try {
      let lastError: unknown;

      for (const modelName of FALLBACK_GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature,
              maxOutputTokens: 500,
            }
          });

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          if (!text) {
            throw new Error('Empty response from AI');
          }

          return NextResponse.json({ message: text });
        } catch (apiError) {
          lastError = apiError;

          if (!isModelResolutionError(apiError)) {
            throw apiError;
          }
        }
      }

      throw lastError ?? new Error('No Gemini model responded successfully');
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);

      if (isQuotaExceededError(apiError)) {
        return buildQuotaExceededResponse(apiError);
      }

      return NextResponse.json(
        { 
          error: 'Failed to communicate with AI service. Please check API configuration.',
          details: apiError instanceof Error ? apiError.message : 'Unknown API error',
          key: process.env.GEMINI_API_KEY ? 'Key exists' : 'No key found'
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
