import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ReceiptSchema = z.object({
  vendor: z.string(),
  date: z.string().nullable(),
  total: z.number().nullable(),
  currency: z.string().nullable(),
  items: z.array(z.object({ description: z.string(), amount: z.number() })),
  taxAmount: z.number().nullable(),
  paymentMethod: z.string().nullable(),
  receiptNumber: z.string().nullable(),
});

export async function extractReceiptData(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Extract all data from this receipt. Return JSON with: vendor, date (YYYY-MM-DD), total, currency, items [{description, amount}], taxAmount, paymentMethod, receiptNumber." },
        { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
      ],
    }],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });
  return ReceiptSchema.parse(JSON.parse(response.choices[0].message.content ?? "{}"));
}
