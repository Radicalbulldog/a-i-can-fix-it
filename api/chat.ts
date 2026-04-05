import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import busboy from 'busboy';

export const config = { api: { bodyParser: false } };

interface ParsedFile {
  buffer: Buffer;
  mimetype: string;
}

function parseMultipart(req: VercelRequest): Promise<{ files: ParsedFile[]; fields: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const files: ParsedFile[] = [];
    const fields: Record<string, string> = {};
    const bb = busboy({ headers: req.headers as Record<string, string> });

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

    req.pipe(bb);
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { files, fields } = await parseMultipart(req);
    const messages = fields.messages ? JSON.parse(fields.messages) : [];

    const userContent: any[] = [];
    for (const file of files) {
      if (file.mimetype.startsWith('image/')) {
        userContent.push({
          type: 'image',
          source: { type: 'base64', media_type: file.mimetype, data: file.buffer.toString('base64') },
        });
      }
    }

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && lastUserMsg.role === 'user') {
      userContent.push({ type: 'text', text: lastUserMsg.content });
    }

    const claudeMessages = messages.slice(0, -1).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));
    claudeMessages.push({
      role: 'user',
      content: userContent.length > 0 ? userContent : lastUserMsg?.content || 'Hello',
    });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    res.json({ role: 'assistant', content: text });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
}
