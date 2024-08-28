// File: app/api/generate-response/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { text, context } = await request.json();

    // GPT-4 API를 호출하여 자연어 답변을 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            `You should answer based on the context. Context: ${context}`,
        },
        { role: "user", content: text },
      ],
      max_tokens: 150, // 답변의 최대 길이 설정
      temperature: 0.7, // 생성의 다양성 조절
    });

    const answer = completion.choices[0]?.message.content || "No response";

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate response" }, {
      status: 500,
    });
  }
}
