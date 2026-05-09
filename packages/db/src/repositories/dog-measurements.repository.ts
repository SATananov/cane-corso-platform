import { and, desc, eq } from 'drizzle-orm';
import type {
  CreateDogMeasurementInput,
  DeleteDogMeasurementDocument,
  DogMeasurementMutationDocument,
  DogMeasurementRecord,
  DogMeasurementsDocument,
} from '@cane-corso-platform/contracts';
import { getDb, type CaneCorsoDb } from '../client';
import { dogMeasurementRecords, dogs, profiles } from '../schema';

export interface DogMeasurementsRepository {
  listByDogId(ownerProfileId: string, dogId: string): Promise<DogMeasurementsDocument>;
  create(ownerProfileId: string, dogId: string, input: CreateDogMeasurementInput): Promise<DogMeasurementMutationDocument>;
  delete(ownerProfileId: string, dogId: string, recordId: string): Promise<DeleteDogMeasurementDocument>;
}

type DogMeasurementRecordRow = typeof dogMeasurementRecords.$inferSelect;
type DogRow = typeof dogs.$inferSelect;

const measurementKeys = [
  'weightKg',
  'heightWithersCm',
  'bodyLengthCm',
  'chestCircumferenceCm',
  'headLengthCm',
  'muzzleLengthCm',
  'skullLengthCm',
] as const;

function toIsoDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.toISOString().slice(0, 10);
}

function toIsoDateTime(value: string | Date | null | undefined): string {
  if (!value) return new Date(0).toISOString();
  if (typeof value === 'string') return value;
  return value.toISOString();
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeMeasurementNumber(value: number | null | undefined): string | null {
  if (value == null) return null;
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 250) {
    throw new Error('INVALID_MEASUREMENT_VALUE');
  }

  return parsed.toFixed(2);
}

function normalizeNote(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;
  return normalized.slice(0, 240);
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function calculateAgeMonths(dateOfBirth: string | Date | null | undefined, measuredAt: string): number | null {
  const birthIso = toIsoDate(dateOfBirth);
  if (!birthIso || !isIsoDate(birthIso) || !isIsoDate(measuredAt)) return null;

  const birth = new Date(`${birthIso}T00:00:00Z`);
  const measured = new Date(`${measuredAt}T00:00:00Z`);

  if (measured < birth) return null;

  let months = (measured.getUTCFullYear() - birth.getUTCFullYear()) * 12 + (measured.getUTCMonth() - birth.getUTCMonth());

  if (measured.getUTCDate() < birth.getUTCDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

function hasAnyMeasurement(input: CreateDogMeasurementInput): boolean {
  return measurementKeys.some((key) => {
    const value = input[key];
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
  });
}

function mapMeasurementRecord(row: DogMeasurementRecordRow): DogMeasurementRecord {
  return {
    id: row.id,
    dogId: row.dogId,
    recordedByProfileId: row.recordedByProfileId,
    measuredAt: toIsoDate(row.measuredAt) ?? new Date(0).toISOString().slice(0, 10),
    ageMonths: row.ageMonths,
    weightKg: toNumber(row.weightKg),
    heightWithersCm: toNumber(row.heightWithersCm),
    bodyLengthCm: toNumber(row.bodyLengthCm),
    chestCircumferenceCm: toNumber(row.chestCircumferenceCm),
    headLengthCm: toNumber(row.headLengthCm),
    muzzleLengthCm: toNumber(row.muzzleLengthCm),
    skullLengthCm: toNumber(row.skullLengthCm),
    note: row.note,
    createdAt: toIsoDateTime(row.createdAt),
    updatedAt: toIsoDateTime(row.updatedAt),
  };
}

async function ensureOwnerProfile(db: CaneCorsoDb, ownerProfileId: string): Promise<void> {
  const rows = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.id, ownerProfileId)).limit(1);

  if (!rows[0]) {
    throw new Error(`OWNER_PROFILE_NOT_FOUND:${ownerProfileId}`);
  }
}

async function getOwnerDog(db: CaneCorsoDb, ownerProfileId: string, dogId: string): Promise<DogRow> {
  const rows = await db
    .select()
    .from(dogs)
    .where(and(eq(dogs.ownerProfileId, ownerProfileId), eq(dogs.id, dogId)))
    .limit(1);

  if (!rows[0]) {
    throw new Error('DOG_NOT_FOUND');
  }

  return rows[0];
}

async function listRows(db: CaneCorsoDb, ownerProfileId: string, dogId: string): Promise<DogMeasurementRecord[]> {
  const rows = await db
    .select()
    .from(dogMeasurementRecords)
    .where(and(eq(dogMeasurementRecords.dogId, dogId), eq(dogMeasurementRecords.recordedByProfileId, ownerProfileId)))
    .orderBy(desc(dogMeasurementRecords.measuredAt), desc(dogMeasurementRecords.createdAt));

  return rows.map(mapMeasurementRecord);
}

class DrizzleDogMeasurementsRepository implements DogMeasurementsRepository {
  async listByDogId(ownerProfileId: string, dogId: string): Promise<DogMeasurementsDocument> {
    const db = getDb();
    await ensureOwnerProfile(db, ownerProfileId);
    await getOwnerDog(db, ownerProfileId, dogId);

    const records = await listRows(db, ownerProfileId, dogId);

    return {
      dogId,
      records,
      total: records.length,
    };
  }

  async create(ownerProfileId: string, dogId: string, input: CreateDogMeasurementInput): Promise<DogMeasurementMutationDocument> {
    const db = getDb();
    await ensureOwnerProfile(db, ownerProfileId);
    const dog = await getOwnerDog(db, ownerProfileId, dogId);

    if (!input.measuredAt || !isIsoDate(input.measuredAt)) {
      throw new Error('INVALID_MEASURED_AT');
    }

    if (!hasAnyMeasurement(input)) {
      throw new Error('MEASUREMENT_REQUIRED');
    }

    const now = new Date();
    const measuredDate = new Date(`${input.measuredAt}T00:00:00Z`);
    const maxFuture = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

    if (measuredDate > maxFuture) {
      throw new Error('MEASURED_AT_IN_FUTURE');
    }

    const [record] = await db
      .insert(dogMeasurementRecords)
      .values({
        dogId,
        recordedByProfileId: ownerProfileId,
        measuredAt: input.measuredAt,
        ageMonths: calculateAgeMonths(dog.dateOfBirth, input.measuredAt),
        weightKg: normalizeMeasurementNumber(input.weightKg),
        heightWithersCm: normalizeMeasurementNumber(input.heightWithersCm),
        bodyLengthCm: normalizeMeasurementNumber(input.bodyLengthCm),
        chestCircumferenceCm: normalizeMeasurementNumber(input.chestCircumferenceCm),
        headLengthCm: normalizeMeasurementNumber(input.headLengthCm),
        muzzleLengthCm: normalizeMeasurementNumber(input.muzzleLengthCm),
        skullLengthCm: normalizeMeasurementNumber(input.skullLengthCm),
        note: normalizeNote(input.note),
      })
      .returning();

    return {
      record: mapMeasurementRecord(record),
      records: await listRows(db, ownerProfileId, dogId),
    };
  }

  async delete(ownerProfileId: string, dogId: string, recordId: string): Promise<DeleteDogMeasurementDocument> {
    const db = getDb();
    await ensureOwnerProfile(db, ownerProfileId);
    await getOwnerDog(db, ownerProfileId, dogId);

    const deleted = await db
      .delete(dogMeasurementRecords)
      .where(
        and(
          eq(dogMeasurementRecords.id, recordId),
          eq(dogMeasurementRecords.dogId, dogId),
          eq(dogMeasurementRecords.recordedByProfileId, ownerProfileId),
        ),
      )
      .returning({ id: dogMeasurementRecords.id });

    if (!deleted[0]) {
      throw new Error('MEASUREMENT_RECORD_NOT_FOUND');
    }

    return {
      dogId,
      deletedRecordId: recordId,
      records: await listRows(db, ownerProfileId, dogId),
    };
  }
}

export function createDogMeasurementsRepository(): DogMeasurementsRepository {
  return new DrizzleDogMeasurementsRepository();
}
