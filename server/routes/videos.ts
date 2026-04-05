import { Router, Request, Response } from 'express';
import { searchYouTube } from '../lib/youtube.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || 'home repair';
    const results = await searchYouTube(query);
    res.json(results);
  } catch (err) {
    console.error('Video search error:', err);
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

export default router;
