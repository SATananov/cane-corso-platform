'use client';

export interface CompactImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
  quality?: number;
}

const DEFAULT_OPTIONS: Required<CompactImageOptions> = {
  maxWidth: 900,
  maxHeight: 900,
  mimeType: 'image/webp',
  quality: 0.72,
};

export function isImageDataUrl(value: string | null | undefined): value is string {
  return Boolean(value && /^data:image\//i.test(value.trim()));
}

async function loadImageSource(source: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to prepare the selected image.'));
    image.src = source;
  });
}

export async function compactImageSourceToDataUrl(
  source: string,
  options?: CompactImageOptions,
): Promise<string> {
  const config = { ...DEFAULT_OPTIONS, ...(options ?? {}) };
  const image = await loadImageSource(source);
  const scale = Math.min(config.maxWidth / image.naturalWidth, config.maxHeight / image.naturalHeight, 1);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to prepare the selected image.');
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL(config.mimeType, config.quality);
}

export async function compactImageFileToDataUrl(
  file: File,
  options?: CompactImageOptions,
): Promise<string> {
  const objectUrl = URL.createObjectURL(file);

  try {
    return await compactImageSourceToDataUrl(objectUrl, options);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function compactImageDataUrlForPayload(
  value: string,
  options?: CompactImageOptions,
): Promise<string> {
  if (!isImageDataUrl(value)) {
    return value;
  }

  try {
    const compacted = await compactImageSourceToDataUrl(value, options);
    return compacted.length < value.length ? compacted : value;
  } catch {
    return value;
  }
}
