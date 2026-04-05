interface MediaPreviewProps {
  previews: string[];
  fileNames: string[];
  onRemove: (index: number) => void;
}

export default function MediaPreview({ previews, fileNames, onRemove }: MediaPreviewProps) {
  if (previews.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {previews.map((url, i) => (
        <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
          <img src={url} alt={fileNames[i]} className="w-full h-full object-cover" />
          <button
            onClick={() => onRemove(i)}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-sm transition-colors"
            aria-label="Remove"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-xs truncate">
            {fileNames[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
