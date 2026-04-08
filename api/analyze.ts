import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import busboy from 'busboy';
import { Readable } from 'stream';

export const config = { api: { bodyParser: false } };

interface ParsedFile {
  buffer: Buffer;
  mimetype: string;
  filename: string;
}

function parseMultipart(req: VercelRequest): Promise<{ files: ParsedFile[]; fields: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const files: ParsedFile[] = [];
    const fields: Record<string, string> = {};

    const bb = busboy({
      headers: req.headers as Record<string, string>,
      limits: { fileSize: 25 * 1024 * 1024 },
    });

    bb.on('file', (_name: string, stream: NodeJS.ReadableStream, info: { filename: string; mimeType: string }) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => {
        files.push({ buffer: Buffer.concat(chunks), mimetype: info.mimeType, filename: info.filename });
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

const SYSTEM_PROMPT = `You are an expert home repair contractor and inspector with 30+ years of experience. A user has sent you a photo of a home problem. Analyze the issue and provide a complete repair guide.

You MUST respond with ONLY valid JSON (no markdown, no code fences) matching this exact structure:
{
  "problemDescription": "Clear description of the identified problem",
  "problemTitle": "Short title (3-6 words)",
  "category": "plumbing|electrical|hvac|roofing|flooring|painting|general|exterior",
  "difficulty": 1-5,
  "estimatedTime": "e.g. 1-2 hours",
  "estimatedCost": "e.g. $50-$150",
  "safetyWarnings": ["array of safety warnings if any"],
  "steps": [
    {
      "number": 1,
      "title": "Step title",
      "description": "Detailed instructions for this step",
      "tip": "Optional pro tip",
      "icon": "measure|cut|drill|apply|connect|remove|clean|inspect|install|sand|paint|seal|tighten|test"
    }
  ],
  "tools": [
    {
      "name": "Tool name",
      "required": true,
      "searchQuery": "search term for buying this tool"
    }
  ],
  "materials": [
    {
      "name": "Material name",
      "quantity": "e.g. 1 tube, 2 feet",
      "estimatedCost": "$X-$Y",
      "searchQuery": "search term for buying this material"
    }
  ],
  "needsMoreInfo": false,
  "followUpQuestion": null,
  "videoSearchQuery": "YouTube search query for this repair"
}

If the image is unclear, set "needsMoreInfo": true and provide a "followUpQuestion". Be thorough, practical, and safety-conscious. Mention when a licensed professional is needed.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { files, fields } = await parseMultipart(req);

    if (files.length === 0) return res.status(400).json({ error: 'No media files uploaded' });

    const imageFiles = files.filter(f => f.mimetype.startsWith('image/'));
    if (imageFiles.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image.' });
    }

    const additionalContext = fields.context || '';
    const provider = process.env.MODEL_PROVIDER === 'claude' ? 'claude' : 'gemini';
    
    let jsonStr = '';

    if (provider === 'claude') {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
      
      const imageContent: any[] = imageFiles.map(f => ({
        type: 'image',
        source: {
          type: 'base64',
          media_type: f.mimetype as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: f.buffer.toString('base64')
        }
      }));
      
      imageContent.push({
        type: 'text',
        text: additionalContext
          ? \`User's additional context: \${additionalContext}\\n\\nAnalyze this home repair issue and respond with JSON only.\`
          : 'Analyze this home repair issue and respond with JSON only.'
      });

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: imageContent }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      jsonStr = text;
    } else {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

      const imageParts = imageFiles.map(f => ({
        inlineData: { data: f.buffer.toString('base64'), mimeType: f.mimetype },
      }));

      const promptText = additionalContext
        ? \`\${SYSTEM_PROMPT}\\n\\nUser's additional context: \${additionalContext}\\n\\nAnalyze this home repair issue and respond with JSON only.\`
        : \`\${SYSTEM_PROMPT}\\n\\nAnalyze this home repair issue and respond with JSON only.\`;

      const result = await model.generateContent([promptText, ...imageParts]);
      jsonStr = result.response.text();
    }

    // Extract JSON from response
    const jsonMatch = jsonStr.match(/\`\`\`(?:json)?\\s*([\\s\\S]*?)\`\`\`/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    // Minor fix: if it starts with ``` it might miss regex if malformed, clean it a bit just in case.
    if (jsonStr.startsWith('\`\`\`')) jsonStr = jsonStr.replace(/\`\`\`(?:json)?/g, '').replace(/\`\`\`/g, '');

    const analysis = JSON.parse(jsonStr);
    res.json(analysis);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Analysis error:', errorMsg);
    res.status(500).json({
      error: 'Failed to analyze image. Please try again.',
      detail: errorMsg,
    });
  }
}
