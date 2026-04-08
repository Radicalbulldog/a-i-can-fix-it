import type { VideoResult } from '../../types/video';

export default function VideoCard({ video }: { video: VideoResult }) {
  const isReal = !video.id.startsWith('mock_');
  const url = isReal ? `https://www.youtube.com/watch?v=${video.id}` : '#';

  return (
    <a
      href={url}
      target={isReal ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="block bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-video bg-gray-200 dark:bg-slate-700 relative">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          ▶ YouTube
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 line-clamp-2 mb-1">{video.title}</h4>
        <p className="text-xs text-gray-500 dark:text-slate-400">{video.channelTitle}</p>
      </div>
    </a>
  );
}
