export const MAX_DIMENSION = 1024;
export function resizeToMaxDimension(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const { width, height } = canvas;
  const max = Math.max(width, height);
  if (max <= MAX_DIMENSION) return canvas;
  const ratio = MAX_DIMENSION / max;
  const out = document.createElement("canvas");
  out.width = Math.round(width * ratio);
  out.height = Math.round(height * ratio);
  out.getContext("2d")!.drawImage(canvas, 0, 0, out.width, out.height);
  return out;
}
export function canvasToBase64(canvas: HTMLCanvasElement, quality = 0.85): string {
  return canvas.toDataURL("image/jpeg", quality).split(",")[1];
}
