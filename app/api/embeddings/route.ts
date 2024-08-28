import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: NextRequest,
) {
  try {
    const { text } = await req.json();
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return NextResponse.json({
      embedding: embeddingResponse.data[0].embedding,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
