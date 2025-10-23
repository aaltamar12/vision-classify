export interface ClassificationResult {
  imageId: string;
  label: string;
  confidence: "high" | "medium" | "low";
  tags: string[];
  description: string;
  processingMs: number;
}

export type ClassifyFn = (imageBase64: string) => Promise<Omit<ClassificationResult, "imageId" | "processingMs">>;

export interface BatchItem {
  imageId: string;
  imageBase64: string;
}

export async function classifyBatch(
  items: BatchItem[],
  classifyFn: ClassifyFn,
  concurrency = 3
): Promise<ClassificationResult[]> {
  const results: ClassificationResult[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const slice = items.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      slice.map(async ({ imageId, imageBase64 }) => {
        const start = Date.now();
        const result = await classifyFn(imageBase64);
        return { imageId, ...result, processingMs: Date.now() - start } as ClassificationResult;
      })
    );

    for (const outcome of settled) {
      if (outcome.status === "fulfilled") {
        results.push(outcome.value);
      } else {
        console.error("[vision] batch item failed:", outcome.reason);
      }
    }
  }

  return results;
}
