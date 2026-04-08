import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import busboy from 'busboy';
import { Readable } from 'stream';

export const config = { api: { bodyParser: false } };

interface ParsedFile {
  buffer: Buffer;
  mimetype: string;
}

function parseMultipart(req: VercelRequest): Promise<{ files: ParsedFile[] }> {
  return new Promise((resolve, reject) => {
    const files: ParsedFile[] = [];
    const bb = busboy({ headers: req.headers as Record<string, string>, limits: { fileSize: 25 * 1024 * 1024 } });

    bb.on('file', (_name: string, stream: NodeJS.ReadableStream, info: { mimeType: string }) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => files.push({ buffer: Buffer.concat(chunks), mimetype: info.mimeType }));
    });

    bb.on('finish', () => resolve({ files }));
    bb.on('error', reject);

    if (req.body && Buffer.isBuffer(req.body)) {
      const readable = new Readable();
      readable.push(req.body);
      readable.push(null);
      readable.pipe(bb);
    } else {
      req.pipe(bb);
    }
  });
}

const SYSTEM_PROMPT = `You are an expert hardware and tool recognition AI. Analyze this image of a user's tool shed, workbench, or tools.
Identify ALL the physical tools present in the image and return ONLY a valid JSON array of objects.
Each object MUST match this exact structure:
{
  "name": "Short, specific name (e.g. DeWalt 20V Drill, Flathead Screwdriver)",
  "category": "power_tools|hand_tools|measurement|safety|materials",
  "confidence": "green" // return "green" if you are highly certain and it's clearly visible, return "yellow" if it's a blurry guess or partially obscured.
}
Return an empty array [] if no items are found. Do NOT use markdown code blocks, just raw JSON.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { files } = await parseMultipart(req);
    const imageFiles = files.filter(f => f.mimetype.startsWith('image/'));

    if (imageFiles.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image of your tools.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const imageParts = imageFiles.map(f => ({
      inlineData: { data: f.buffer.toString('base64'), mimeType: f.mimetype },
    }));

    const result = await model.generateContent([SYSTEM_PROMPT, ...imageParts]);
    let jsonStr = result.response.text();

    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/```(?:json)?/g, '').replace(/```/g, '');

    const tools = JSON.parse(jsonStr);
    res.json({ tools: Array.isArray(tools) ? tools : [] });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Failed to scan tools.', detail: errorMsg });
  }
}
