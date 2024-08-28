// File: app/api/search/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3000";

export async function POST(request: Request) {
  const supabase = createClient();
  const { query } = await request.json();

  // Generate embeddings
  const embeddingResponse = await fetch(`${BASE_URL}/api/generate-embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: query }),
  });

  if (!embeddingResponse.ok) {
    return NextResponse.json({ error: "Failed to generate embeddings" }, {
      status: 500,
    });
  }

  const { embedding } = await embeddingResponse.json();

  // Perform the search
  const { data, error } = await supabase.rpc("hybrid_search", {
    query_text: query,
    query_embedding: embedding,
    match_count: 10,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Generate response using GPT
  const gptResponse = await fetch(`${BASE_URL}/api/response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: query,
      context: data.map((activity: any) => activity.description).join("\n\n"),
    }),
  });

  if (!gptResponse.ok) {
    return NextResponse.json({ error: "Failed to generate GPT response" }, {
      status: 500,
    });
  }

  const { answer } = await gptResponse.json();

  return NextResponse.json({ data, answer });
}
