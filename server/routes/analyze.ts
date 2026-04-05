import { Router, Request, Response } from 'express';
import multer from 'multer';
import anthropic from '../lib/anthropic.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const router = Router();

const SYSTEM_PROMPT = `You are an expert home repair contractor and inspector with 30+ years of experience. A user has sent you a photo or video frame of a home problem. Analyze the issue and provide a complete repair guide.

You MUST respond with valid JSON matching this exact structure:
{
  "problemDescription": "Clear description of the identified problem",
  "problemTitle": "Short title (3-6 words)",
  "category": "plumbing|electrical|hvac|roofing|flooring|painting|general|exterior",
  "difficulty": 1-5 (1=easy DIY, 2=moderate DIY, 3=intermediate, 4=advanced, 5=professional required),
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
      "required": true/false,
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

If the image is unclear or you need more information, set "needsMoreInfo": true and provide a specific "followUpQuestion". Still provide your best analysis with whatever you can determine.

Be thorough, practical, and safety-conscious. Always mention when a repair should be done by a licensed professional (especially electrical and gas work).`;

router.post('/', upload.array('media', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No media files uploaded' });
      return;
    }

    const imageContent: any[] = [];
    for (const file of files) {
      if (file.mimetype.startsWith('image/')) {
        const base64 = file.buffer.toString('base64');
        const mediaType = file.mimetype as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
        imageContent.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        });
      }
    }

    if (imageContent.length === 0) {
      // For video files, we'd extract a frame - for now, ask for a photo
      res.status(400).json({ error: 'Please upload at least one image. Video analysis coming soon.' });
      return;
    }

    const additionalContext = req.body.context || '';
    imageContent.push({
      type: 'text',
      text: additionalContext
        ? `User's additional context: ${additionalContext}\n\nAnalyze this home repair issue and respond with JSON.`
        : 'Analyze this home repair issue and respond with JSON.',
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: imageContent }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const analysis = JSON.parse(jsonStr);
    res.json(analysis);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze image. Please try again.' });
  }
});

export default router;
