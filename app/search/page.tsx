import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

interface Result {
  id: number;
  title: string;
  description: string;
}

const SearchPage = () => {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  const handleSearch = async () => {
    // Query embedding 생성 로직 호출
    const embeddingResponse = await fetch("/api/generateEmbedding", {
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

    if (error) console.error(error);
    setResults(data);
  };

  return (
    <div>
      <h1>활동 검색</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어"
      />
      <button onClick={handleSearch}>검색</button>
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            {result.title}: {result.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
