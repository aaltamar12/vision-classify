import { NextRequest, NextResponse } from "next/server";
import { classifyImage, classifyImageBase64 } from "@/services/imageClassifier";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) return NextResponse.json({ error: "No image" }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const result = await classifyImageBase64(base64, file.type);
    return NextResponse.json(result);
  }

  const { imageUrl } = await req.json();
  if (!imageUrl) return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
  const result = await classifyImage(imageUrl);
  return NextResponse.json(result);
}
