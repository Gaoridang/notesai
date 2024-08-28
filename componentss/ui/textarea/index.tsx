import React from "react";
import { TextAreaProps } from "./index.types";
import { cn } from "@/utils/cn";

const TextArea = ({ label, className, ...props }: TextAreaProps) => {
  return (
    <div className="grid gap-2 w-full my-4">
      <label className="text-gray-500" htmlFor="textarea">
        {label}
      </label>
      <textarea
        id="textarea"
        className={cn(
          "min-h-[300px] resize-none p-3 ouline-none focus-within:outline-none bg-neutral-100 rounded-md",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default TextArea;
