import { useRef } from 'react';
import Button from '../ui/Button';

interface MediaCaptureProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export default function MediaCapture({ onFilesSelected, disabled }: MediaCaptureProps) {
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onFilesSelected(files);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Hidden file inputs */}
      <input ref={photoRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
      <input ref={videoRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={handleChange} />
      <input ref={uploadRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleChange} />

      <Button
        size="lg"
        className="flex-1"
        disabled={disabled}
        onClick={() => photoRef.current?.click()}
      >
        <span className="mr-2">📸</span>
        Take Photo
      </Button>

      <Button
        size="lg"
        variant="secondary"
        className="flex-1"
        disabled={disabled}
        onClick={() => videoRef.current?.click()}
      >
        <span className="mr-2">🎥</span>
        Record Video
      </Button>

      <Button
        size="lg"
        variant="secondary"
        className="flex-1"
        disabled={disabled}
        onClick={() => uploadRef.current?.click()}
      >
        <span className="mr-2">📁</span>
        Upload File
      </Button>
    </div>
  );
}
