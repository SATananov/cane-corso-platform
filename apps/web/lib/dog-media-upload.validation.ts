const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export interface ValidatedDogMediaUploadForm {
  file: File;
  altText: string | null;
  isPrimary: boolean;
}

function normalizeOptionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeBoolean(value: FormDataEntryValue | null): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return value === 'true' || value === '1' || value.toLowerCase() === 'on';
}

export function validateDogMediaUploadForm(formData: FormData): ValidatedDogMediaUploadForm {
  const fileEntry = formData.get('file');

  if (!(fileEntry instanceof File)) {
    throw new Error('A media file is required.');
  }

  if (fileEntry.size <= 0) {
    throw new Error('The uploaded media file is empty.');
  }

  if (fileEntry.size > MAX_UPLOAD_BYTES) {
    throw new Error('The uploaded media file exceeds the 20 MB limit.');
  }

  return {
    file: fileEntry,
    altText: normalizeOptionalText(formData.get('altText')),
    isPrimary: normalizeBoolean(formData.get('isPrimary')),
  };
}
