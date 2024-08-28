// File: app/search/page.tsx

"use client";

import { useState } from "react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [gptAnswer, setGptAnswer] = useState("");

  const handleSearch = async () => {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const { data, answer } = await response.json();
    setResults(data);
    setGptAnswer(answer);
  };

  return (
    <div>
      <h1>검색</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>
      <div>
        <h2>검색 결과</h2>
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              {result.title}: {result.description}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>GPT의 답변</h2>
        <p>{gptAnswer}</p>
      </div>
    </div>
  );
};

export default SearchPage;
