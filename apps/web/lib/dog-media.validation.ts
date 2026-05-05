import type { CreateDogMediaInput, MediaType, UpdateDogMediaInput } from '@cane-corso-platform/contracts';

function isMediaType(value: unknown): value is MediaType {
  return value === 'image' || value === 'video' || value === 'document';
}

function normalizeNullableText(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error('Expected text input.');
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeBoolean(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'boolean') {
    throw new Error('Expected a boolean value.');
  }

  return value;
}

function normalizeSortOrder(value: unknown): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Expected a numeric sort order.');
  }

  return Math.max(0, Math.trunc(value));
}

export function validateCreateDogMediaInput(value: unknown): CreateDogMediaInput {
  if (!value || typeof value !== 'object') {
    throw new Error('The media request body must be an object.');
  }

  const input = value as Record<string, unknown>;
  const publicUrl = typeof input.publicUrl === 'string' ? input.publicUrl.trim() : '';

  if (!publicUrl) {
    throw new Error('A public media URL is required.');
  }

  try {
    new URL(publicUrl);
  } catch {
    throw new Error('The media URL must be a valid absolute URL.');
  }

  if (input.mediaType !== undefined && !isMediaType(input.mediaType)) {
    throw new Error('The media type must be image, video, or document.');
  }

  const mediaType = (input.mediaType as MediaType | undefined) ?? 'image';

  if (input.isPrimary === true && mediaType !== 'image') {
    throw new Error('Only image assets can become the primary profile media.');
  }

  if (input.sizeBytes !== undefined && input.sizeBytes !== null && typeof input.sizeBytes !== 'number') {
    throw new Error('The media size must be numeric when provided.');
  }

  return {
    publicUrl,
    altText: normalizeNullableText(input.altText),
    mediaType,
    mimeType: normalizeNullableText(input.mimeType),
    sizeBytes: typeof input.sizeBytes === 'number' ? Math.max(0, Math.trunc(input.sizeBytes)) : null,
    storageKey: normalizeNullableText(input.storageKey),
    isPrimary: normalizeBoolean(input.isPrimary),
  };
}

export function validateUpdateDogMediaInput(value: unknown): UpdateDogMediaInput {
  if (!value || typeof value !== 'object') {
    throw new Error('The media update body must be an object.');
  }

  const input = value as Record<string, unknown>;

  return {
    altText: normalizeNullableText(input.altText),
    isPrimary: normalizeBoolean(input.isPrimary),
    sortOrder: normalizeSortOrder(input.sortOrder),
  };
}
