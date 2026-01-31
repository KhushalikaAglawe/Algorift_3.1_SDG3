import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a CIAH Diagnostic AI. Predict big diseases from small symptoms. Return JSON: { \"prediction\": \"...\", \"steps\": [\"...\"], \"specialist\": \"...\" }" },
        { role: "user", content: `Sugar: ${body.sugar}, BP: ${body.bp}, Symptoms: ${body.symptoms}, Age: ${body.age}` }
      ],
      response_format: { type: "json_object" }
    });
    return NextResponse.json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    return NextResponse.json({ prediction: "Error fetching AI", steps: ["Check API Key"], specialist: "N/A" });
  }
}