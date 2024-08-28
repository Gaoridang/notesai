"use client";

import EmotionSelection from "@/components/EmotionSelection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { formatDate } from "date-fns";
import { useState } from "react";
import { ko } from "date-fns/locale";

const CreateActivityPage = () => {
  const supabase = createClient();
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = async () => {
    // OpenAI API를 통해 임베딩 생성
    const embeddingResponse = await fetch("/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: description }),
    });

    const { embedding } = await embeddingResponse.json();

    // Supabase에 데이터 저장
    const { data: activivty, error: ACTIVITY_ERROR } = await supabase
      .from("activities")
      .insert([
        {
          description,
          metadata: {
            mood: "happy",
            date: formatDate(new Date(), "yyyy-MM-dd", { locale: ko }),
          },
        },
      ])
      .select("*");

    if (ACTIVITY_ERROR) {
      console.error(ACTIVITY_ERROR);
      return;
    }

    const { data: embeddings, error: EMBEDDINGS_ERROR } = await supabase
      .from("activity_embeddings")
      .insert([{ activity_id: activivty[0].id, embedding }])
      .select("*");

    if (EMBEDDINGS_ERROR) {
      console.error(EMBEDDINGS_ERROR);
      return;
    }
  };

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold flex flex-col mb-2 mt-12">
        <span>오늘 하루도 수고하셨습니다!</span>
        <span>하루 동안 있었던 일을 적어볼까요?</span>
      </h1>
      <p className="text-gray-400">
        어제보다 나은 오늘을 보냈는지 기록하고 확인해보세요.
      </p>
      <div className="mt-12">
        <EmotionSelection />
        <Label htmlFor="textarea">오늘 있었던 일</Label>
        <Textarea
          id="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          className="resize-none"
          placeholder="자유로운 형식으로 적어주세요. 단, 자세히 적을수록 좋습니다."
        />
      </div>
      <Button onClick={handleSubmit}>제출</Button>
    </div>
  );
};

export default CreateActivityPage;
