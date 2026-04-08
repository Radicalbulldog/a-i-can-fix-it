import type { VercelRequest, VercelResponse } from '@vercel/node';
import ytSearch from 'yt-search';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

async function searchYouTube(query: string, maxResults = 6): Promise<YouTubeVideo[]> {
  // Use yt-search to scrape Google/YouTube without needing an API key!
  const result = await ytSearch(query + ' home repair DIY');
  
  return result.videos.slice(0, maxResults).map((video) => ({
    id: video.videoId,
    title: video.title,
    description: video.description,
    thumbnail: video.image,
    channelTitle: video.author.name,
    publishedAt: video.ago,
  }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const query = (req.query.q as string) || 'home repair';
  try {
    const results = await searchYouTube(query);
    res.json(results);
  } catch (err) {
    console.error('Video search error:', err);
    res.status(500).json({ error: 'Failed to search videos' });
  }
}
