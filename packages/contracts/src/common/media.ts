export type MediaType = 'image' | 'video' | 'document';

export interface StorageAsset {
  storageKey: string;
  url: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
}
