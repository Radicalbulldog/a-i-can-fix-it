import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = { api: { bodyParser: true }, maxDuration: 30 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items } = req.body || {};
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items array is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const itemList = items.map((item: any, i: number) =>
      `${i + 1}. "${item.name}" (search: "${item.searchQuery}", qty: ${item.quantity || '1'})`
    ).join('\n');

    const prompt = `You are a home improvement pricing expert. Estimate current US retail prices for these items at Home Depot, Lowe's, and Ace Hardware.

Items:
${itemList}

Return ONLY a JSON array with one object per item:
[
  {
    "name": "item name",
    "quantity": "1",
    "homeDepot": 12.99,
    "lowes": 13.49,
    "ace": 14.99,
    "bestStore": "Home Depot",
    "bestPrice": 12.99
  }
]

Rules:
- Prices should be realistic 2025-2026 US retail estimates
- Include the per-unit price, not total for quantity
- bestStore and bestPrice should reflect the cheapest option
- Return ONLY the JSON array, no markdown fences, no explanation`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Extract JSON if wrapped in code fences
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) text = jsonMatch[1].trim();

    const prices = JSON.parse(text);
    res.json({ prices });
  } catch (err: any) {
    console.error('Prices error:', err?.message);
    res.status(500).json({ error: 'Failed to estimate prices', detail: err?.message });
  }
}
