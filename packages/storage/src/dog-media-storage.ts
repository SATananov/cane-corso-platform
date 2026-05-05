import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type StoredDogMediaKind = 'image' | 'video' | 'document';

export interface StoreDogMediaFileInput {
  dogId: string;
  ownerProfileId: string;
  filename: string;
  mimeType: string;
  bytes: Buffer;
}

export interface StoredDogMediaFile {
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  mediaType: StoredDogMediaKind;
}

const DEFAULT_PUBLIC_BASE_PATH = '/uploads';
const DOGS_DIRECTORY = 'dogs';

function getWorkspaceRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, '../../..');
}

function getPublicRootDirectory(): string {
  const explicit = process.env.LOCAL_STORAGE_PUBLIC_DIR?.trim();

  if (explicit) {
    return path.isAbsolute(explicit) ? explicit : path.resolve(getWorkspaceRoot(), explicit);
  }

  return path.resolve(getWorkspaceRoot(), 'apps/web/public');
}

function getPublicBasePath(): string {
  const explicit = process.env.LOCAL_STORAGE_PUBLIC_BASE_PATH?.trim();

  if (!explicit) {
    return DEFAULT_PUBLIC_BASE_PATH;
  }

  const normalized = explicit.startsWith('/') ? explicit : `/${explicit}`;
  return normalized.replace(/\/+$/, '');
}

function getDogBucketName(): string {
  const explicit = process.env.STORAGE_BUCKET_DOGS?.trim();
  return explicit || DOGS_DIRECTORY;
}

function sanitizePathSegment(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/-{2,}/g, '-');
  return normalized.replace(/^-+|-+$/g, '') || 'asset';
}

function sanitizeFileExtension(extension: string): string {
  const normalized = extension.toLowerCase().replace(/[^a-z0-9.]/g, '');
  return normalized.startsWith('.') ? normalized : normalized ? `.${normalized}` : '';
}

function extensionFromMimeType(mimeType: string): string {
  const normalized = mimeType.toLowerCase();

  switch (normalized) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'image/svg+xml':
      return '.svg';
    case 'video/mp4':
      return '.mp4';
    case 'video/webm':
      return '.webm';
    case 'video/quicktime':
      return '.mov';
    case 'application/pdf':
      return '.pdf';
    default:
      return '';
  }
}

function resolveFileExtension(filename: string, mimeType: string): string {
  const fromFilename = sanitizeFileExtension(path.extname(filename));
  return fromFilename || extensionFromMimeType(mimeType) || '.bin';
}

function resolveMediaType(mimeType: string): StoredDogMediaKind {
  const normalized = mimeType.toLowerCase();

  if (normalized.startsWith('image/')) {
    return 'image';
  }

  if (normalized.startsWith('video/')) {
    return 'video';
  }

  return 'document';
}

function buildFileStem(filename: string): string {
  const basename = path.basename(filename, path.extname(filename));
  return sanitizePathSegment(basename);
}

function buildRelativeStoragePath(ownerProfileId: string, dogId: string, filename: string, mimeType: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomPart = Math.random().toString(36).slice(2, 10);
  const extension = resolveFileExtension(filename, mimeType);
  const fileStem = buildFileStem(filename);

  return path.posix.join(
    DOGS_DIRECTORY,
    sanitizePathSegment(ownerProfileId),
    sanitizePathSegment(dogId),
    `${timestamp}-${randomPart}-${fileStem}${extension}`,
  );
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join(path.posix.sep);
}

function buildStorageKey(relativeStoragePath: string): string {
  return `${getDogBucketName()}/local/${toPosixPath(relativeStoragePath)}`;
}

function getAppUrl(): string | null {
  const explicit = process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!explicit) {
    return null;
  }

  return explicit.replace(/\/+$/, '');
}

function buildPublicUrl(relativeStoragePath: string): string {
  const relativeUrl = `${getPublicBasePath()}/${toPosixPath(relativeStoragePath)}`;
  const appUrl = getAppUrl();
  return appUrl ? `${appUrl}${relativeUrl}` : relativeUrl;
}

function resolveAbsolutePublicPath(relativeStoragePath: string): string {
  return path.join(getPublicRootDirectory(), relativeStoragePath);
}

export async function storeDogMediaFile(input: StoreDogMediaFileInput): Promise<StoredDogMediaFile> {
  const relativeStoragePath = buildRelativeStoragePath(input.ownerProfileId, input.dogId, input.filename, input.mimeType);
  const absolutePublicPath = resolveAbsolutePublicPath(relativeStoragePath);

  await fs.mkdir(path.dirname(absolutePublicPath), { recursive: true });
  await fs.writeFile(absolutePublicPath, input.bytes);

  return {
    storageKey: buildStorageKey(relativeStoragePath),
    publicUrl: buildPublicUrl(relativeStoragePath),
    mimeType: input.mimeType,
    sizeBytes: input.bytes.byteLength,
    mediaType: resolveMediaType(input.mimeType),
  };
}

function resolveRelativeStoragePathFromKey(storageKey: string): string | null {
  const prefix = `${getDogBucketName()}/local/`;

  if (!storageKey.startsWith(prefix)) {
    return null;
  }

  return storageKey.slice(prefix.length).replace(/\\/g, '/');
}

export function isLocalDogMediaStorageKey(storageKey: string): boolean {
  return resolveRelativeStoragePathFromKey(storageKey) !== null;
}

export async function removeDogMediaFile(storageKey: string): Promise<void> {
  const relativeStoragePath = resolveRelativeStoragePathFromKey(storageKey);

  if (!relativeStoragePath) {
    return;
  }

  const absolutePublicPath = resolveAbsolutePublicPath(relativeStoragePath);

  try {
    await fs.unlink(absolutePublicPath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code !== 'ENOENT') {
      throw error;
    }
  }
}
