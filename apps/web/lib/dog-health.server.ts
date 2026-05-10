import type {
  CreateDogHealthRecordInput,
  DeleteDogHealthRecordDocument,
  DogHealthRecordCategory,
  DogHealthRecordMutationDocument,
  DogHealthRecordsDocument,
} from '@cane-corso-platform/contracts';
import { createDogHealthRepository } from '@cane-corso-platform/db';
import { getCurrentMemberSession } from './session.server';

export class DogHealthValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'DogHealthValidationError';
    this.code = code;
  }
}

const categories = new Set<DogHealthRecordCategory>(['vaccine', 'deworming', 'vet_visit', 'medication', 'note']);

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeDate(value: unknown, code: string, required = false): string | null {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) {
    if (required) {
      throw new DogHealthValidationError(code, 'Date is required and must use YYYY-MM-DD format.');
    }

    return null;
  }

  if (!isIsoDate(normalized)) {
    throw new DogHealthValidationError(code, 'Date must use YYYY-MM-DD format.');
  }

  return normalized;
}

function normalizeText(value: unknown, maxLength: number, code: string, required = false): string | null {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) {
    if (required) {
      throw new DogHealthValidationError(code, 'Required field is missing.');
    }

    return null;
  }

  return normalized.slice(0, maxLength);
}

function normalizeCategory(value: unknown): DogHealthRecordCategory {
  const category = typeof value === 'string' ? value.trim() : '';

  if (!categories.has(category as DogHealthRecordCategory)) {
    throw new DogHealthValidationError('INVALID_HEALTH_CATEGORY', 'Health record category is not supported.');
  }

  return category as DogHealthRecordCategory;
}

function normalizeUrl(value: unknown): string | null {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) return null;

  try {
    const url = new URL(normalized);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('unsupported protocol');
    }

    return url.toString().slice(0, 500);
  } catch {
    throw new DogHealthValidationError('INVALID_DOCUMENT_URL', 'Document URL must be a valid http or https URL.');
  }
}

function normalizeCreateInput(body: unknown): CreateDogHealthRecordInput {
  const payload = (body ?? {}) as Record<string, unknown>;
  const performedAt = normalizeDate(payload.performedAt, 'INVALID_PERFORMED_AT', true);

  return {
    category: normalizeCategory(payload.category),
    title: normalizeText(payload.title, 120, 'HEALTH_TITLE_REQUIRED', true) ?? 'Health record',
    performedAt: performedAt ?? new Date().toISOString().slice(0, 10),
    nextDueAt: normalizeDate(payload.nextDueAt, 'INVALID_NEXT_DUE_AT'),
    veterinarian: normalizeText(payload.veterinarian, 120, 'INVALID_VETERINARIAN'),
    clinic: normalizeText(payload.clinic, 140, 'INVALID_CLINIC'),
    batchNumber: normalizeText(payload.batchNumber, 80, 'INVALID_BATCH_NUMBER'),
    documentUrl: normalizeUrl(payload.documentUrl),
    note: normalizeText(payload.note, 320, 'INVALID_HEALTH_NOTE'),
  };
}

function normalizeRecordId(body: unknown): string {
  const payload = (body ?? {}) as Record<string, unknown>;
  const recordId = typeof payload.recordId === 'string' ? payload.recordId.trim() : '';

  if (!recordId) {
    throw new DogHealthValidationError('HEALTH_RECORD_REQUIRED', 'Health record id is required.');
  }

  return recordId;
}

export async function getCurrentMemberDogHealthRecordsDocument(
  dogId: string,
  options?: { allowDevFallback?: boolean },
): Promise<DogHealthRecordsDocument> {
  const repository = createDogHealthRepository();
  const { session } = await getCurrentMemberSession(options);
  return repository.listByDogId(session.user.profileId, dogId);
}

export async function createCurrentMemberDogHealthRecord(
  dogId: string,
  body: unknown,
  options?: { allowDevFallback?: boolean },
): Promise<DogHealthRecordMutationDocument> {
  const repository = createDogHealthRepository();
  const { session } = await getCurrentMemberSession(options);
  return repository.create(session.user.profileId, dogId, normalizeCreateInput(body));
}

export async function deleteCurrentMemberDogHealthRecord(
  dogId: string,
  body: unknown,
  options?: { allowDevFallback?: boolean },
): Promise<DeleteDogHealthRecordDocument> {
  const repository = createDogHealthRepository();
  const { session } = await getCurrentMemberSession(options);
  return repository.delete(session.user.profileId, dogId, normalizeRecordId(body));
}
