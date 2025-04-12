import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Add validation for API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

// Initialize the API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

export async function POST(req: Request) {
  try {
    // Validate API key at runtime
    if (!GEMINI_API_KEY) {
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

    // Test API connection before chat
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: settings?.temperature ?? 0,
          maxOutputTokens: 500,
        }
      });

      const chat = model.startChat({
        history: [],
      });

      const toneModifier = TONE_MODIFIERS[settings?.tone as keyof typeof TONE_MODIFIERS] ?? TONE_MODIFIERS.default;
      const prompt = `${PERSONA_PROMPTS[persona as keyof typeof PERSONA_PROMPTS]}
      ${toneModifier}
      
      User: ${message}
      
      Response:`;

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from AI');
      }

      return NextResponse.json({ message: text });
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
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
