import OpenAI from "openai";
const client = new OpenAI();
export interface ClassificationResult { label: string; confidence: "high" | "medium" | "low"; tags: string[]; description: string }
export async function classifyImage(base64Image: string, mimeType: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg"): Promise<ClassificationResult> {
  const { choices } = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Classify this image. Return JSON: {label: string, confidence: 'high'|'medium'|'low', tags: string[], description: string}" },
        { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}`, detail: "low" } },
      ],
    }],
    max_tokens: 300,
  });
  return JSON.parse(choices[0].message.content!) as ClassificationResult;
}
