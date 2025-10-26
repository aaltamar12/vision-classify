/**
 * Validates a base64 image string before sending to GPT-4o.
 * Guards against oversized payloads and unsupported formats.
 */

const SUPPORTED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type SupportedMime = (typeof SUPPORTED_MIME_TYPES)[number];

const MAGIC_BYTES: Record<string, SupportedMime> = {
  "/9j/": "image/jpeg",
  iVBOR: "image/png",
  R0lGO: "image/gif",
  UklGR: "image/webp",
};

const MAX_BASE64_BYTES = 20 * 1024 * 1024; // 20 MB

export interface ValidationResult {
  valid: boolean;
  mimeType?: SupportedMime;
  error?: string;
}

export function validateBase64Image(base64: string): ValidationResult {
  // Strip data URI prefix if present
  const raw = base64.replace(/^data:[^;]+;base64,/, "");

  if (raw.length > MAX_BASE64_BYTES) {
    return { valid: false, error: `Image too large: ${(raw.length / 1024 / 1024).toFixed(1)}MB (max 20MB)` };
  }

  const prefix = raw.slice(0, 5);
  const mimeType = Object.entries(MAGIC_BYTES).find(([k]) => prefix.startsWith(k))?.[1];

  if (!mimeType) {
    return { valid: false, error: `Unsupported image format. Supported: ${SUPPORTED_MIME_TYPES.join(", ")}` };
  }

  return { valid: true, mimeType };
}
