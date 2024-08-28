import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const input = `
Please analyze the following text and convert it into a list of bullet points. Follow these guidelines:

1. Separate the text into distinct activities or events.
2. Create a bullet point for each activity or event.
3. Ensure that no information from the original text is omitted.
4. Sould preserve the original wording.
5. Do not add any information that is not present in the original text.
6. Use a simple dash (-) for each bullet point.

Here's an example of the desired output format:

Input: "I woke up at 7 AM and had breakfast. Then I went for a run in the park, which was refreshing."

Output:
- I woke up at 7 AM and had breakfast.
- Then I went for a run in the park, which was refreshing.

Convert the above text into bullet points:
    `;
  const { text } = await request.json();

  const convertedText = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content: input,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  console.log(convertedText.choices[0].message.content);

  return NextResponse.json({
    text: convertedText.choices[0].message.content,
  }, { status: 200 });
}
