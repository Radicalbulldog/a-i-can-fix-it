import { useState, useCallback } from 'react';
import { resizeImage, createPreviewUrl } from '../lib/media';

export function useCamera() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const resized = await Promise.all(newFiles.map(f => resizeImage(f)));
    const newPreviews = resized.map(f => createPreviewUrl(f));
    setFiles(prev => [...prev, ...resized]);
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    previews.forEach(u => URL.revokeObjectURL(u));
    setFiles([]);
    setPreviews([]);
  }, [previews]);

  return { files, previews, addFiles, removeFile, clearFiles };
}
