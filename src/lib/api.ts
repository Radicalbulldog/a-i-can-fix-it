import type { RepairAnalysis } from '../types/analysis';
import type { VideoResult } from '../types/video';
import type { Contractor } from '../types/contractor';

export async function analyzeMedia(files: File[], context?: string): Promise<RepairAnalysis> {
  const formData = new FormData();
  files.forEach(f => formData.append('media', f));
  if (context) formData.append('context', context);

  const res = await fetch('/api/analyze', { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(err.error);
  }
  return res.json();
}

export async function sendChatMessage(
  messages: { role: string; content: string }[],
  images?: File[]
): Promise<{ role: string; content: string }> {
  const formData = new FormData();
  formData.append('messages', JSON.stringify(messages));
  if (images) images.forEach(f => formData.append('media', f));

  const res = await fetch('/api/chat', { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Chat failed' }));
    throw new Error(err.error);
  }
  return res.json();
}

export async function searchVideos(query: string): Promise<VideoResult[]> {
  const res = await fetch(`/api/videos?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Video search failed');
  return res.json();
}

export async function findContractors(lat: number, lng: number, category?: string): Promise<Contractor[]> {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  if (category) params.set('category', category);
  const res = await fetch(`/api/contractors?${params}`);
  if (!res.ok) throw new Error('Contractor search failed');
  return res.json();
}
