import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

export async function POST(req: Request) {
  try {
    const { message, persona } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
      safetySettings: [
        {
          category: "HARASSMENT",
          threshold: "BLOCK_MEDIUM",
        },
      ],
    });

    const prompt = `${PERSONA_PROMPTS[persona as keyof typeof PERSONA_PROMPTS]}\n\nUser: ${message}\n\nResponse:`;
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
