"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const DonePage = () => {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    // OpenAI API를 통해 임베딩 생성
    const embeddingResponse = await fetch("/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: description }),
    });

    const { embedding } = await embeddingResponse.json();

    // Supabase에 데이터 저장
    const { error } = await supabase
      .from("user_activities")
      .insert([{ title, description, embedding }]);

    if (error) console.error(error);
  };

  return (
    <div>
      <h1>활동 입력</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="활동 내용"
      />
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
};

export default DonePage;
