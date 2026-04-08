import { useState, useEffect } from 'react';
import PageShell from '../components/layout/PageShell';
import VideoResults from '../components/videos/VideoResults';
import { useAppContext } from '../context/AppContext';
import { searchVideos } from '../lib/api';
import type { VideoResult } from '../types/video';

export default function VideosPage() {
  const { analysisResult } = useAppContext();
  const [query, setQuery] = useState(analysisResult?.videoSearchQuery || '');
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const doSearch = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const results = await searchVideos(q);
      setVideos(results);
    } catch {
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) doSearch(query);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">Repair Videos</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Find video tutorials for your repair</p>
        </div>

        <form onSubmit={e => { e.preventDefault(); doSearch(query); }} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for repair videos..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        <VideoResults videos={videos} isLoading={isLoading} query={query} />
      </div>
    </PageShell>
  );
}
