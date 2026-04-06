import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  api: { bodyParser: true },
  maxDuration: 30,
};

const PROMPT = `You are a professional infographic illustrator creating step-by-step home repair guides. Create a clean, polished SVG illustration in the style of a modern home improvement manual or professional infographic.

STYLE REFERENCE: Think clean vector infographic — like a professional DIY guide, Bosch tool manual, or home improvement website illustration. Clean shapes, clear visual hierarchy, professional but approachable.

CRITICAL REQUIREMENTS:
- viewBox="0 0 400 300"
- Use a CLEAN, PROFESSIONAL vector illustration style — NOT photorealistic, NOT emoji-like
- Draw recognizable tools, materials, and surfaces with clean geometric shapes and smooth curves
- Show a person or hands performing the action when relevant — use simple but clear human figures (not stick figures, but stylized like infographic people)
- Include environmental context: walls, floors, pipes, fixtures drawn with clean lines
- Use a light background (#f0f4f8 or #e8edf2) with a subtle rounded rectangle frame
- Color palette: #2563eb (primary blue), #3b82f6 (light blue), #1e3a5f (dark blue/outlines), #ffffff (white/highlights), #e2e8f0 (light gray surfaces), #94a3b8 (medium gray), #f97316 (orange accent for action areas), #60a5fa (arrows/motion indicators)
- Stroke widths: 1.5 for details, 2 for main outlines, 0.75 for fine detail
- Use filled shapes with clean outlines — NOT wireframe/line-art only
- Show the KEY action clearly: what tool is being used, what surface is being worked on, what motion is happening
- Include subtle directional arrows (#3b82f6) to show movement or application direction
- Minimum 25 shape elements for sufficient detail
- NO text, NO labels, NO annotations — the illustration must be self-explanatory
- Output ONLY the SVG code, no markdown fences, no explanation

The illustration should clearly communicate the repair action at a glance, like a panel in a professional step-by-step infographic.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { stepTitle, stepDescription, icon } = req.body || {};
    if (!stepTitle) return res.status(400).json({ error: 'stepTitle is required' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `${PROMPT}\n\nRepair step: "${stepTitle}"\nDetailed instructions: "${stepDescription || ''}"\nTool/action category: ${icon || 'general repair'}\n\nGenerate the SVG now:`;

    const result = await model.generateContent(prompt);
    let svg = result.response.text().trim();

    // Extract SVG if wrapped in code fences
    const svgMatch = svg.match(/```(?:svg|xml|html)?\s*([\s\S]*?)```/);
    if (svgMatch) svg = svgMatch[1].trim();

    // Find the SVG element
    if (!svg.startsWith('<svg')) {
      const svgStart = svg.indexOf('<svg');
      if (svgStart >= 0) svg = svg.substring(svgStart);
      else return res.status(500).json({ error: 'Failed to generate illustration' });
    }

    // Trim anything after closing </svg>
    const svgEnd = svg.lastIndexOf('</svg>');
    if (svgEnd >= 0) svg = svg.substring(0, svgEnd + 6);

    res.json({ svg, type: 'svg' });
  } catch (err: any) {
    console.error('Illustration error:', err?.message);
    res.status(500).json({ error: 'Failed to generate illustration', detail: err?.message });
  }
}
