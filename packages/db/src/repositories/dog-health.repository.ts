import { and, asc, desc, eq } from 'drizzle-orm';
import type {
  CreateDogHealthRecordInput,
  DeleteDogHealthRecordDocument,
  DogHealthRecord,
  DogHealthRecordCategory,
  DogHealthRecordMutationDocument,
  DogHealthRecordsDocument,
} from '@cane-corso-platform/contracts';
import { getDb, type CaneCorsoDb } from '../client';
import { dogHealthRecords, dogs, profiles } from '../schema';

export interface DogHealthRepository {
  listByDogId(ownerProfileId: string, dogId: string): Promise<DogHealthRecordsDocument>;
  create(ownerProfileId: string, dogId: string, input: CreateDogHealthRecordInput): Promise<DogHealthRecordMutationDocument>;
  delete(ownerProfileId: string, dogId: string, recordId: string): Promise<DeleteDogHealthRecordDocument>;
}

type DogHealthRecordRow = typeof dogHealthRecords.$inferSelect;
type DogRow = typeof dogs.$inferSelect;

const healthCategories = new Set<DogHealthRecordCategory>(['vaccine', 'deworming', 'vet_visit', 'medication', 'note']);

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

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeDate(value: string | null | undefined, fieldName: string, required = false): string | null {
  const normalized = value?.trim();
  if (!normalized) {
    if (required) throw new Error(`INVALID_${fieldName}`);
    return null;
  }

  if (!isIsoDate(normalized)) {
    throw new Error(`INVALID_${fieldName}`);
  }

  return normalized;
}

function normalizeText(value: string | null | undefined, maxLength: number, required = false): string | null {
  const normalized = value?.trim();
  if (!normalized) {
    if (required) throw new Error('HEALTH_TITLE_REQUIRED');
    return null;
  }

  return normalized.slice(0, maxLength);
}

function normalizeUrl(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;

  try {
    const url = new URL(normalized);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('INVALID_DOCUMENT_URL');
    }

    return url.toString().slice(0, 500);
  } catch {
    throw new Error('INVALID_DOCUMENT_URL');
  }
}

function normalizeCategory(value: DogHealthRecordCategory): DogHealthRecordCategory {
  if (!healthCategories.has(value)) {
    throw new Error('INVALID_HEALTH_CATEGORY');
  }

  return value;
}

function mapHealthRecord(row: DogHealthRecordRow): DogHealthRecord {
  return {
    id: row.id,
    dogId: row.dogId,
    recordedByProfileId: row.recordedByProfileId,
    category: normalizeCategory(row.category as DogHealthRecordCategory),
    title: row.title,
    performedAt: toIsoDate(row.performedAt) ?? new Date(0).toISOString().slice(0, 10),
    nextDueAt: toIsoDate(row.nextDueAt),
    veterinarian: row.veterinarian,
    clinic: row.clinic,
    batchNumber: row.batchNumber,
    documentUrl: row.documentUrl,
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

async function listRows(db: CaneCorsoDb, ownerProfileId: string, dogId: string): Promise<DogHealthRecord[]> {
  const rows = await db
    .select()
    .from(dogHealthRecords)
    .where(and(eq(dogHealthRecords.dogId, dogId), eq(dogHealthRecords.recordedByProfileId, ownerProfileId)))
    .orderBy(desc(dogHealthRecords.performedAt), asc(dogHealthRecords.nextDueAt), desc(dogHealthRecords.createdAt));

  return rows.map(mapHealthRecord);
}

class DrizzleDogHealthRepository implements DogHealthRepository {
  async listByDogId(ownerProfileId: string, dogId: string): Promise<DogHealthRecordsDocument> {
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

  async create(ownerProfileId: string, dogId: string, input: CreateDogHealthRecordInput): Promise<DogHealthRecordMutationDocument> {
    const db = getDb();
    await ensureOwnerProfile(db, ownerProfileId);
    await getOwnerDog(db, ownerProfileId, dogId);

    const performedAt = normalizeDate(input.performedAt, 'PERFORMED_AT', true);
    const nextDueAt = normalizeDate(input.nextDueAt, 'NEXT_DUE_AT');
    const title = normalizeText(input.title, 120, true);

    const now = new Date();
    const performedDate = new Date(`${performedAt}T00:00:00Z`);
    const maxFuture = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

    if (performedDate > maxFuture) {
      throw new Error('PERFORMED_AT_IN_FUTURE');
    }

    const [record] = await db
      .insert(dogHealthRecords)
      .values({
        dogId,
        recordedByProfileId: ownerProfileId,
        category: normalizeCategory(input.category),
        title: title ?? 'Health record',
        performedAt: performedAt ?? new Date().toISOString().slice(0, 10),
        nextDueAt,
        veterinarian: normalizeText(input.veterinarian, 120),
        clinic: normalizeText(input.clinic, 140),
        batchNumber: normalizeText(input.batchNumber, 80),
        documentUrl: normalizeUrl(input.documentUrl),
        note: normalizeText(input.note, 320),
      })
      .returning();

    return {
      record: mapHealthRecord(record),
      records: await listRows(db, ownerProfileId, dogId),
    };
  }

  async delete(ownerProfileId: string, dogId: string, recordId: string): Promise<DeleteDogHealthRecordDocument> {
    const db = getDb();
    await ensureOwnerProfile(db, ownerProfileId);
    await getOwnerDog(db, ownerProfileId, dogId);

    const deleted = await db
      .delete(dogHealthRecords)
      .where(
        and(
          eq(dogHealthRecords.id, recordId),
          eq(dogHealthRecords.dogId, dogId),
          eq(dogHealthRecords.recordedByProfileId, ownerProfileId),
        ),
      )
      .returning({ id: dogHealthRecords.id });

    if (!deleted[0]) {
      throw new Error('HEALTH_RECORD_NOT_FOUND');
    }

    return {
      dogId,
      deletedRecordId: recordId,
      records: await listRows(db, ownerProfileId, dogId),
    };
  }
}

export function createDogHealthRepository(): DogHealthRepository {
  return new DrizzleDogHealthRepository();
}
