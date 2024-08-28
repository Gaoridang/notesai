"use client";

import TextArea from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const CreateActivityPage = () => {
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
      <h1 className="text-2xl font-bold flex flex-col mb-2">
        <span>오늘 하루도 수고하셨습니다!</span>
        <span>하루 동안 있었던 일을 적어볼까요?</span>
      </h1>
      <p className="text-gray-400">
        어제보다 나은 오늘을 보냈는지 기록하고 확인해보세요.
      </p>
      <div className="mt-12">
        <TextArea
          label="오늘 있었던 일"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
};

export default CreateActivityPage;
