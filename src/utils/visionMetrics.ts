export interface VisionMetric {
  requestId: string;
  model: string;
  imageCount: number;
  detail: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  timestamp: string;
}

const log: VisionMetric[] = [];

export function recordVisionCall(metric: Omit<VisionMetric, "requestId" | "timestamp">): string {
  const requestId = Math.random().toString(36).slice(2, 10);
  log.push({ ...metric, requestId, timestamp: new Date().toISOString() });
  console.info(
    `[vision] id=${requestId} model=${metric.model} images=${metric.imageCount} ` +
      `detail=${metric.detail} tokens=${metric.promptTokens + metric.completionTokens} ` +
      `latency=${metric.latencyMs}ms`
  );
  return requestId;
}

export function getAverageTokensPerImage(): number {
  const withImages = log.filter((m) => m.imageCount > 0);
  if (withImages.length === 0) return 0;
  const total = withImages.reduce((s, m) => s + m.promptTokens / m.imageCount, 0);
  return Math.round(total / withImages.length);
}

export function getLatencyPercentile(p: number): number {
  if (log.length === 0) return 0;
  const sorted = [...log].sort((a, b) => a.latencyMs - b.latencyMs);
  const idx = Math.min(Math.floor((p / 100) * sorted.length), sorted.length - 1);
  return sorted[idx].latencyMs;
}
