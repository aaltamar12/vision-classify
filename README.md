# vision-classify

AI capability: **GPT-4o vision classification** — labels, scene description, object detection, text extraction (OCR), receipt parsing, and multi-image comparison from base64 images.

## Models used
- `gpt-4o` — vision classification and OCR
- `gpt-4o-mini` — thumbnail labeling (cost-efficient)

## How to run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and upload or paste an image URL.

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `VISION_MODEL` | default: `gpt-4o` |
| `FAST_VISION_MODEL` | default: `gpt-4o-mini` |
| `MAX_IMAGE_DIMENSION` | Resize limit in px (default: 1024) |
| `IMAGE_DETAIL` | `low`, `high`, or `auto` (default: `auto`) |
