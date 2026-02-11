import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ClassificationSchema = z.object({
  labels: z.array(z.object({
    label: z.string(),
    confidence: z.number().min(0).max(1),
  })),
  description: z.string(),
  dominantColors: z.array(z.string()),
  isNsfw: z.boolean(),
  containsText: z.boolean(),
  extractedText: z.string().optional(),
  objects: z.array(z.string()),
  scene: z.string(),
});

export type ImageClassification = z.infer<typeof ClassificationSchema>;

export async function classifyImage(imageUrl: string): Promise<ImageClassification> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Analyze this image and return JSON with: labels (array of {label, confidence}), description, dominantColors, isNsfw, containsText, extractedText (if text present), objects (array), scene.`,
      },
      {
        role: "user",
        content: [{ type: "image_url", image_url: { url: imageUrl, detail: "high" } }],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 600,
  });
  return ClassificationSchema.parse(JSON.parse(response.choices[0].message.content ?? "{}"));
}

export async function classifyImageBase64(base64: string, mimeType: string): Promise<ImageClassification> {
  const dataUrl = `data:${mimeType};base64,${base64}`;
  return classifyImage(dataUrl);
}

export async function compareImages(imageUrl1: string, imageUrl2: string): Promise<{ similarity: number; differences: string[] }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Compare these two images. Return JSON with: similarity (0-1), differences (array of strings describing key differences)." },
        { type: "image_url", image_url: { url: imageUrl1 } },
        { type: "image_url", image_url: { url: imageUrl2 } },
      ],
    }],
    response_format: { type: "json_object" },
    max_tokens: 400,
  });
  return JSON.parse(response.choices[0].message.content ?? "{}");
}
