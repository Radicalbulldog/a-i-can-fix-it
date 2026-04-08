import type { VideoResult } from '../../types/video';
import VideoCard from './VideoCard';
import Spinner from '../ui/Spinner';

interface VideoResultsProps {
  videos: VideoResult[];
  isLoading: boolean;
  query: string;
}

export default function VideoResults({ videos, isLoading, query }: VideoResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (videos.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🎬</div>
        <p className="text-gray-600 dark:text-slate-300 text-sm">No videos found for "{query}"</p>
        <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">AI video generation coming soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
