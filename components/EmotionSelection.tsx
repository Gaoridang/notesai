import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const EmotionSelection = () => {
  return (
    <Select defaultValue="happy">
      <SelectTrigger>
        <SelectValue placeholder="감정을 선택하세요." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>감정</SelectLabel>
          <SelectItem value="happy">행복</SelectItem>
          <SelectItem value="sad">슬픔</SelectItem>
          <SelectItem value="angry">화남</SelectItem>
          <SelectItem value="surprised">놀람</SelectItem>
          <SelectItem value="etc">기타</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default EmotionSelection;
