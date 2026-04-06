import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  api: { bodyParser: true },
  maxDuration: 30,
};

const PROMPT = `You are a technical illustrator for a professional home repair manual. Create a DETAILED SVG illustration that shows a person performing a specific repair step. This must look like a reference diagram from a Haynes repair manual or IKEA assembly guide — NOT like an emoji or simple icon.

CRITICAL REQUIREMENTS:
- viewBox="0 0 400 300"
- Draw REALISTIC human hands (with fingers, knuckles, proper proportions) gripping and using the correct tool
- Show the ACTUAL surface being worked on (wood grain for wood, brick texture for brick, pipe shapes for plumbing, etc.)
- Include environmental context: show part of a wall, floor, pipe, or fixture so the viewer knows WHERE this is happening
- Use perspective and depth — items closer should be larger
- Draw the specific tool accurately (a pry bar looks different from a screwdriver, which looks different from a wrench)
- Show motion with directional arrows where the tool/hand is moving
- Use shading with different opacity levels to create depth
- Color palette: #1f2937 (outlines), #f97316 (accent/highlights), #6b7280 (metal/tools), #d4a574 (skin), #a3a3a3 (surfaces), #3b82f6 (arrows/motion), #fbbf24 (warning/attention areas)
- Stroke widths: 1.5 for details, 2.5 for outlines, 1 for fine detail
- Minimum 30 path/shape elements — this should be DETAILED, not minimal
- NO text, NO labels, NO annotations
- Output ONLY the SVG code, no markdown fences, no explanation

The illustration should answer: "What exactly does this look like when someone is doing it?"`;

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
