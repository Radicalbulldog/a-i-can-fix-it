import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import busboy from 'busboy';
import { Readable } from 'stream';

export const config = { api: { bodyParser: false } };

interface ParsedFile {
  buffer: Buffer;
  mimetype: string;
}

function parseMultipart(req: VercelRequest): Promise<{ files: ParsedFile[]; fields: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const files: ParsedFile[] = [];
    const fields: Record<string, string> = {};

    const bb = busboy({
      headers: req.headers as Record<string, string>,
      limits: { fileSize: 25 * 1024 * 1024 },
    });

    bb.on('file', (_name: string, stream: NodeJS.ReadableStream, info: { mimeType: string }) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => {
        files.push({ buffer: Buffer.concat(chunks), mimetype: info.mimeType });
      });
    });

    bb.on('field', (name: string, val: string) => { fields[name] = val; });
    bb.on('finish', () => resolve({ files, fields }));
    bb.on('error', reject);

    if (req.body && Buffer.isBuffer(req.body)) {
      const readable = new Readable();
      readable.push(req.body);
      readable.push(null);
      readable.pipe(bb);
    } else if (req.body && typeof req.body === 'string') {
      const readable = new Readable();
      readable.push(Buffer.from(req.body, 'binary'));
      readable.push(null);
      readable.pipe(bb);
    } else {
      req.pipe(bb);
    }
  });
}

const SYSTEM_PROMPT = `You are a friendly, expert home repair assistant embedded in the "a. I can fix it" app. You help users diagnose and fix home problems.

When the user asks follow-up questions or provides additional photos:
- Give clear, practical advice
- If you can now provide a more detailed repair plan, include it
- Suggest when professional help is needed
- Be encouraging but honest about difficulty
- If you reference tools or materials, mention them by name so the user can find them

Keep responses conversational but informative. Use numbered steps when giving instructions.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { files, fields } = await parseMultipart(req);
    const messages = fields.messages ? JSON.parse(fields.messages) : [];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Build conversation history for Gemini
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build the last user message with any images
    const parts: any[] = [];
    for (const file of files) {
      if (file.mimetype.startsWith('image/')) {
        parts.push({ inlineData: { data: file.buffer.toString('base64'), mimeType: file.mimetype } });
      }
    }

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && lastUserMsg.role === 'user') {
      parts.push({ text: lastUserMsg.content });
    }

    if (parts.length === 0) {
      parts.push({ text: 'Hello' });
    }

    const result = await chat.sendMessage(parts);
    const text = result.response.text();

    res.json({ role: 'assistant', content: text });
  } catch (err: any) {
    console.error('Chat error:', err?.message);
    res.status(500).json({ error: 'Failed to get response. Please try again.', detail: err?.message });
  }
}
