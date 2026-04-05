import type { VercelRequest, VercelResponse } from '@vercel/node';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

async function searchYouTube(query: string, maxResults = 6): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return getMockVideos(query);

  const params = new URLSearchParams({
    part: 'snippet',
    q: `${query} home repair DIY`,
    type: 'video',
    maxResults: String(maxResults),
    key: apiKey,
    relevanceLanguage: 'en',
  });

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
  if (!res.ok) return getMockVideos(query);

  const data = await res.json();
  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
}

function getMockVideos(query: string): YouTubeVideo[] {
  const topics = [
    { title: `How to Fix ${query} - Complete DIY Guide`, channel: 'Home Repair Tutor' },
    { title: `${query} Repair Made Easy - Step by Step`, channel: 'This Old House' },
    { title: `DIY ${query} Fix - Save Money!`, channel: 'HandyDadTV' },
    { title: `Professional ${query} Repair Tips`, channel: 'Ask This Old House' },
    { title: `${query} - Common Problems & Solutions`, channel: 'Home Mender' },
    { title: `Beginner's Guide to ${query} Repair`, channel: 'See Jane Drill' },
  ];
  return topics.map((t, i) => ({
    id: `mock_${i}_${Date.now()}`,
    title: t.title,
    description: `Learn how to handle ${query} issues with this comprehensive guide.`,
    thumbnail: `https://placehold.co/480x360/f97316/white?text=${encodeURIComponent(query)}`,
    channelTitle: t.channel,
    publishedAt: new Date().toISOString(),
  }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
