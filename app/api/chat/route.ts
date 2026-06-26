import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';
const FALLBACK_OPENAI_MODELS = Array.from(
  new Set([DEFAULT_OPENAI_MODEL, 'gpt-4.1-mini', 'gpt-4.1'])
);

const PERSONA_PROMPTS = {
  hitesh: `You are Hitesh Choudhary, a passionate coding teacher with over 10 years of experience.
  Respond in Hinglish with occasional use of "chai" references. Use phrases like "hanji to chaliye shuru karte hain" or "aaj ki class mein".
  Teaching style is casual yet thorough. Background: Senior Director at PW, ex-CTO of LearnCodeOnline, taught 350,000+ students.
  Keep responses friendly and practical, like explaining on a YouTube video.`,

  hitesh_english: `You are Hitesh Choudhary, a passionate coding teacher with over 10 years of experience.
  Respond in clear, professional English. Teaching style is casual yet thorough. Background: Senior Director at PW, ex-CTO of LearnCodeOnline, taught 350,000+ students.
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
  Keep responses professional yet approachable, like your YouTube tutorials.`,

  piyush_english: `You are Piyush Garg, a tech educator and founder of Teachyst.
  Your teaching style is direct and practical. Respond in clear, professional English.
  Keep focus on implementation and real-world examples. Speak confidently but professionally.
  Background: Content creator, entrepreneur, and technical course creator at Teachyst.
  Keep responses professional yet approachable, like your YouTube tutorials.`
};

const TONE_MODIFIERS = {
  default: "",
  funny: "Be more humorous and entertaining in your responses, while maintaining educational value.",
  advice: "Focus on providing practical advice and recommendations in your responses.",
  educational: "Be more detailed and thorough in your explanations, like giving a lecture."
};

type OpenAIErrorBody = {
  error?: {
    code?: string | null;
    message?: string;
    param?: string | null;
    type?: string;
  };
};

type OpenAIChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?:
        | string
        | Array<{
            text?: string;
            type?: string;
          }>;
    };
  }>;
};

type OpenAIApiError = Error & {
  code?: string | null;
  details?: OpenAIErrorBody['error'];
  retryAfterSeconds?: number | null;
  status?: number;
};

function isModelResolutionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const apiError = error as OpenAIApiError;
  const message = error.message.toLowerCase();

  return (
    apiError.status === 404 ||
    apiError.code === 'model_not_found' ||
    (message.includes('model') &&
      (message.includes('not found') ||
        message.includes('does not exist') ||
        message.includes('not available')))
  );
}

function isRateLimitError(error: unknown): error is OpenAIApiError {
  if (!(error instanceof Error)) {
    return false;
  }

  const apiError = error as OpenAIApiError;
  const message = error.message.toLowerCase();

  return (
    apiError.status === 429 ||
    apiError.code === 'rate_limit_exceeded' ||
    message.includes('rate limit') ||
    message.includes('too many requests')
  );
}

function parseRetryAfterSeconds(headers: Headers) {
  const retryAfter = headers.get('retry-after');

  if (!retryAfter) {
    return null;
  }

  const numericSeconds = Number.parseFloat(retryAfter);
  if (Number.isFinite(numericSeconds)) {
    return Math.max(1, Math.ceil(numericSeconds));
  }

  const retryAt = Date.parse(retryAfter);
  if (Number.isNaN(retryAt)) {
    return null;
  }

  const seconds = Math.ceil((retryAt - Date.now()) / 1000);
  return seconds > 0 ? seconds : null;
}

function buildRateLimitResponse(error: OpenAIApiError, modelName: string) {
  const retryAfterSeconds = error.retryAfterSeconds ?? null;
  const retryLabel = retryAfterSeconds ? ` Retry after about ${retryAfterSeconds} seconds.` : '';
  const userMessage = `OpenAI rate limit reached for ${modelName}.${retryLabel} If this keeps happening, check your OpenAI project limits and billing.`;

  return NextResponse.json(
    {
      error: 'OpenAI rate limit exceeded',
      code: 'rate_limit_exceeded',
      details: error.message,
      retryAfterSeconds,
      model: modelName,
      userMessage,
    },
    {
      status: 429,
      headers: retryAfterSeconds ? { 'Retry-After': String(retryAfterSeconds) } : undefined,
    }
  );
}

function extractAssistantMessage(payload: OpenAIChatCompletionResponse) {
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === 'string') {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
}

async function generateChatCompletion({
  instructions,
  message,
  model,
  temperature,
}: {
  instructions: string;
  message: string;
  model: string;
  temperature: number;
}) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'developer',
          content: instructions,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature,
      max_completion_tokens: 2000,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | OpenAIChatCompletionResponse
    | OpenAIErrorBody
    | null;

  if (!response.ok) {
    const apiError = new Error(
      (payload as OpenAIErrorBody | null)?.error?.message ??
        `OpenAI request failed with status ${response.status}`
    ) as OpenAIApiError;

    apiError.status = response.status;
    apiError.code = (payload as OpenAIErrorBody | null)?.error?.code ?? null;
    apiError.details = (payload as OpenAIErrorBody | null)?.error;
    apiError.retryAfterSeconds = parseRetryAfterSeconds(response.headers);

    throw apiError;
  }

  const text = extractAssistantMessage((payload ?? {}) as OpenAIChatCompletionResponse);
  if (!text) {
    throw new Error('Empty response from OpenAI');
  }

  return text;
}

export async function POST(req: Request) {
  try {
    if (!OPENAI_API_KEY) {
      console.error('Missing OpenAI API key');
      return NextResponse.json(
        { error: 'API configuration error - Missing API key' },
        { status: 500 }
      );
    }

    const { message, persona, settings, enableHinglish } = await req.json();

    if (!message || !persona) {
      return NextResponse.json(
        { error: 'Message and persona are required' },
        { status: 400 }
      );
    }

    const promptKey = enableHinglish !== false ? persona : `${persona}_english`;
    const personaPrompt = PERSONA_PROMPTS[promptKey as keyof typeof PERSONA_PROMPTS];
    if (!personaPrompt) {
      return NextResponse.json(
        { error: 'Invalid persona selected' },
        { status: 400 }
      );
    }

    const toneModifier = TONE_MODIFIERS[settings?.tone as keyof typeof TONE_MODIFIERS] ?? TONE_MODIFIERS.default;
    const instructions = [personaPrompt, toneModifier].filter(Boolean).join('\n\n');
    const temperature =
      typeof settings?.temperature === 'number' ? settings.temperature : 0;

    try {
      let lastError: unknown;

      for (const modelName of FALLBACK_OPENAI_MODELS) {
        try {
          const text = await generateChatCompletion({
            instructions,
            message,
            model: modelName,
            temperature,
          });

          return NextResponse.json({ message: text, model: modelName });
        } catch (apiError) {
          lastError = apiError;

          if (isRateLimitError(apiError)) {
            return buildRateLimitResponse(apiError, modelName);
          }

          if (!isModelResolutionError(apiError)) {
            throw apiError;
          }
        }
      }

      throw lastError ?? new Error('No OpenAI model responded successfully');
    } catch (apiError) {
      console.error('OpenAI API Error:', apiError);

      return NextResponse.json(
        { 
          error: 'Failed to communicate with OpenAI. Please check API configuration.',
          details: apiError instanceof Error ? apiError.message : 'Unknown API error',
          key: process.env.OPENAI_API_KEY ? 'Key exists' : 'No key found'
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
