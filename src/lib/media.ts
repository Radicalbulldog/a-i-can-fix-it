const MAX_DIMENSION = 1024;

export function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
        resolve(file);
        return;
      }

      const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (!blob) { reject(new Error('Resize failed')); return; }
          const resized = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
          resolve(resized);
        },
        'image/jpeg',
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // Fall back to original
    };

    img.src = url;
  });
}

export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
