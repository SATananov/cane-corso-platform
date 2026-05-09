import type {
  CreateDogMeasurementInput,
  DeleteDogMeasurementDocument,
  DogMeasurementMutationDocument,
  DogMeasurementsDocument,
} from '@cane-corso-platform/contracts';
import { createDogMeasurementsRepository } from '@cane-corso-platform/db';
import { getCurrentMemberSession } from './session.server';

export class DogMeasurementValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'DogMeasurementValidationError';
    this.code = code;
  }
}

function toOptionalNumber(value: unknown): number | null {
  if (value == null || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));

  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 250) {
    throw new DogMeasurementValidationError('INVALID_MEASUREMENT_VALUE', 'Measurement values must be positive numbers within a realistic range.');
  }

  return Number(parsed.toFixed(2));
}

function normalizeMeasuredAt(value: unknown): string {
  const measuredAt = typeof value === 'string' ? value.trim() : '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(measuredAt)) {
    throw new DogMeasurementValidationError('INVALID_MEASURED_AT', 'Measured date must use YYYY-MM-DD format.');
  }

  const date = new Date(`${measuredAt}T00:00:00Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== measuredAt) {
    throw new DogMeasurementValidationError('INVALID_MEASURED_AT', 'Measured date is not valid.');
  }

  return measuredAt;
}

function normalizeCreateInput(body: unknown): CreateDogMeasurementInput {
  const payload = (body ?? {}) as Record<string, unknown>;

  return {
    measuredAt: normalizeMeasuredAt(payload.measuredAt),
    weightKg: toOptionalNumber(payload.weightKg),
    heightWithersCm: toOptionalNumber(payload.heightWithersCm),
    bodyLengthCm: toOptionalNumber(payload.bodyLengthCm),
    chestCircumferenceCm: toOptionalNumber(payload.chestCircumferenceCm),
    headLengthCm: toOptionalNumber(payload.headLengthCm),
    muzzleLengthCm: toOptionalNumber(payload.muzzleLengthCm),
    skullLengthCm: toOptionalNumber(payload.skullLengthCm),
    note: typeof payload.note === 'string' ? payload.note.trim().slice(0, 240) || null : null,
  };
}

function normalizeRecordId(body: unknown): string {
  const payload = (body ?? {}) as Record<string, unknown>;
  const recordId = typeof payload.recordId === 'string' ? payload.recordId.trim() : '';

  if (!recordId) {
    throw new DogMeasurementValidationError('MEASUREMENT_RECORD_REQUIRED', 'Measurement record id is required.');
  }

  return recordId;
}

export async function getCurrentMemberDogMeasurementsDocument(
  dogId: string,
  options?: { allowDevFallback?: boolean },
): Promise<DogMeasurementsDocument> {
  const repository = createDogMeasurementsRepository();
  const { session } = await getCurrentMemberSession(options);
  return repository.listByDogId(session.user.profileId, dogId);
}

export async function createCurrentMemberDogMeasurement(
  dogId: string,
  body: unknown,
  options?: { allowDevFallback?: boolean },
): Promise<DogMeasurementMutationDocument> {
  const repository = createDogMeasurementsRepository();
  const { session } = await getCurrentMemberSession(options);
  return repository.create(session.user.profileId, dogId, normalizeCreateInput(body));
}

export async function deleteCurrentMemberDogMeasurement(
  dogId: string,
  body: unknown,
  options?: { allowDevFallback?: boolean },
): Promise<DeleteDogMeasurementDocument> {
  const repository = createDogMeasurementsRepository();
  const { session } = await getCurrentMemberSession(options);
  return repository.delete(session.user.profileId, dogId, normalizeRecordId(body));
}
