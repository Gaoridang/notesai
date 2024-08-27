import { createClient } from "@/utils/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createClient();
  const { query } = req.body;

  // Query embedding 생성 로직 호출
  const embeddingResponse = await fetch("/api/generate-embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: query }),
  });

  const { embedding } = await embeddingResponse.json();

  // Supabase RPC 호출
  const { data, error } = await supabase.rpc("hybrid_search", {
    query_text: query,
    query_embedding: embedding,
    match_count: 10,
  });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}
