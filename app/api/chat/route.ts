import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
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
    const { message, persona, settings } = await req.json();
    
    // Update default temperature to 0
    const temperature = settings?.temperature ?? 0;  // Changed from 0.7 to 0
    const tone = settings?.tone ?? 'default';

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 500,
      }
    });

    const chat = model.startChat({
      history: [],
    });

    const toneModifier = TONE_MODIFIERS[tone as keyof typeof TONE_MODIFIERS];
    const prompt = `${PERSONA_PROMPTS[persona as keyof typeof PERSONA_PROMPTS]}
    ${toneModifier}
    
    User: ${message}
    
    Response:`;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
