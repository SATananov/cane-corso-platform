import { and, asc, desc, eq, sql } from 'drizzle-orm';
import type {
  CreateDogMediaInput,
  DogMedia,
  MediaType,
  UpdateDogMediaInput,
} from '@cane-corso-platform/contracts';
import { getDb, type CaneCorsoDb } from '../client';
import { dogMedia, dogs } from '../schema';

export class DogMediaDogNotFoundError extends Error {
  readonly dogId: string;

  constructor(dogId: string) {
    super(`Dog ${dogId} was not found for the current member.`);
    this.name = 'DogMediaDogNotFoundError';
    this.dogId = dogId;
  }
}

export class DogMediaItemNotFoundError extends Error {
  readonly dogId: string;
  readonly mediaId: string;

  constructor(dogId: string, mediaId: string) {
    super(`Media item ${mediaId} was not found for dog ${dogId}.`);
    this.name = 'DogMediaItemNotFoundError';
    this.dogId = dogId;
    this.mediaId = mediaId;
  }
}

export interface DogMediaRepository {
  listByDogId(ownerProfileId: string, dogId: string): Promise<DogMedia[]>;
  create(ownerProfileId: string, dogId: string, input: CreateDogMediaInput): Promise<{ media: DogMedia; mainImageUrl: string | null }>;
  update(ownerProfileId: string, dogId: string, mediaId: string, input: UpdateDogMediaInput): Promise<{ media: DogMedia; mainImageUrl: string | null }>;
  remove(ownerProfileId: string, dogId: string, mediaId: string): Promise<{ deleted: boolean; mainImageUrl: string | null }>;
}

type DogRow = typeof dogs.$inferSelect;
type DogMediaRow = typeof dogMedia.$inferSelect;

function toIsoDateTime(value: string | Date | null | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }

  return typeof value === 'string' ? value : value.toISOString();
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeMediaType(value: MediaType | undefined): MediaType {
  if (value === 'video' || value === 'document') {
    return value;
  }

  return 'image';
}

function createStorageKey(dogId: string, input?: string | null): string {
  const normalized = input?.trim();

  if (normalized) {
    return normalized;
  }

  return `external/${dogId}/${Date.now()}`;
}

function mapDogMediaRow(row: DogMediaRow): DogMedia {
  return {
    id: row.id,
    dogId: row.dogId,
    storageKey: row.storageKey,
    url: row.publicUrl,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    mediaType: row.mediaType as MediaType,
    altText: row.altText,
    sortOrder: row.sortOrder,
    isPrimary: row.isPrimary,
    isVisibleInRegistry: row.visibleInRegistry,
    isVisibleInUsgGallery: row.visibleInUsgGallery,
    uploadedByProfileId: row.uploadedByProfileId,
    createdAt: toIsoDateTime(row.createdAt),
  };
}

async function getOwnedDog(db: CaneCorsoDb, ownerProfileId: string, dogId: string): Promise<DogRow> {
  const rows = await db
    .select()
    .from(dogs)
    .where(and(eq(dogs.id, dogId), eq(dogs.ownerProfileId, ownerProfileId)))
    .limit(1);

  const dog = rows[0];

  if (!dog) {
    throw new DogMediaDogNotFoundError(dogId);
  }

  return dog;
}

async function getOwnedDogMediaRow(
  db: CaneCorsoDb,
  ownerProfileId: string,
  dogId: string,
  mediaId: string,
): Promise<DogMediaRow> {
  await getOwnedDog(db, ownerProfileId, dogId);

  const rows = await db
    .select({ media: dogMedia })
    .from(dogMedia)
    .innerJoin(dogs, eq(dogMedia.dogId, dogs.id))
    .where(and(eq(dogs.ownerProfileId, ownerProfileId), eq(dogMedia.dogId, dogId), eq(dogMedia.id, mediaId)))
    .limit(1);

  const media = rows[0]?.media;

  if (!media) {
    throw new DogMediaItemNotFoundError(dogId, mediaId);
  }

  return media;
}

async function clearPrimaryFlags(db: CaneCorsoDb, dogId: string) {
  await db
    .update(dogMedia)
    .set({ isPrimary: false })
    .where(eq(dogMedia.dogId, dogId));
}

async function syncDogMainImage(db: CaneCorsoDb, dogId: string, publicUrl: string | null) {
  await db
    .update(dogs)
    .set({ mainImageUrl: publicUrl })
    .where(eq(dogs.id, dogId));
}

async function findNextPrimaryCandidate(db: CaneCorsoDb, dogId: string): Promise<DogMediaRow | null> {
  const rows = await db
    .select()
    .from(dogMedia)
    .where(and(eq(dogMedia.dogId, dogId), eq(dogMedia.mediaType, 'image')))
    .orderBy(asc(dogMedia.sortOrder), asc(dogMedia.createdAt))
    .limit(1);

  return rows[0] ?? null;
}

async function getCurrentMainImageUrl(db: CaneCorsoDb, dogId: string): Promise<string | null> {
  const rows = await db
    .select({ mainImageUrl: dogs.mainImageUrl })
    .from(dogs)
    .where(eq(dogs.id, dogId))
    .limit(1);

  return rows[0]?.mainImageUrl ?? null;
}

class DrizzleDogMediaRepository implements DogMediaRepository {
  async listByDogId(ownerProfileId: string, dogId: string): Promise<DogMedia[]> {
    const db = getDb();
    await getOwnedDog(db, ownerProfileId, dogId);

    const rows = await db
      .select()
      .from(dogMedia)
      .where(eq(dogMedia.dogId, dogId))
      .orderBy(desc(dogMedia.isPrimary), asc(dogMedia.sortOrder), asc(dogMedia.createdAt));

    return rows.map(mapDogMediaRow);
  }

  async create(ownerProfileId: string, dogId: string, input: CreateDogMediaInput) {
    const db = getDb();
    await getOwnedDog(db, ownerProfileId, dogId);

    const [orderInfo] = await db
      .select({ maxSortOrder: sql<number | null>`max(${dogMedia.sortOrder})` })
      .from(dogMedia)
      .where(eq(dogMedia.dogId, dogId));

    const existingPrimaryImage = await db
      .select({ id: dogMedia.id })
      .from(dogMedia)
      .where(and(eq(dogMedia.dogId, dogId), eq(dogMedia.isPrimary, true), eq(dogMedia.mediaType, 'image')))
      .limit(1);

    const normalizedMediaType = normalizeMediaType(input.mediaType);
    const shouldBePrimary = normalizedMediaType === 'image' && (input.isPrimary === true || existingPrimaryImage.length === 0);

    if (input.isPrimary === true && normalizedMediaType !== 'image') {
      throw new Error('Only image assets can become the primary profile media.');
    }

    if (shouldBePrimary) {
      await clearPrimaryFlags(db, dogId);
    }

    const insertedRows = await db
      .insert(dogMedia)
      .values({
        dogId,
        storageKey: createStorageKey(dogId, input.storageKey),
        publicUrl: input.publicUrl,
        mimeType: normalizeOptionalText(input.mimeType),
        sizeBytes: typeof input.sizeBytes === 'number' ? Math.max(0, Math.trunc(input.sizeBytes)) : null,
        mediaType: normalizedMediaType,
        altText: normalizeOptionalText(input.altText),
        sortOrder: (orderInfo?.maxSortOrder ?? -1) + 1,
        isPrimary: shouldBePrimary,
        visibleInRegistry: input.visibleInRegistry ?? true,
        visibleInUsgGallery: input.visibleInUsgGallery ?? false,
        uploadedByProfileId: ownerProfileId,
      })
      .returning();

    const inserted = insertedRows[0];

    if (!inserted) {
      throw new Error('Dog media could not be created.');
    }

    if (shouldBePrimary) {
      await syncDogMainImage(db, dogId, inserted.publicUrl);
    }

    return {
      media: mapDogMediaRow(inserted),
      mainImageUrl: await getCurrentMainImageUrl(db, dogId),
    };
  }

  async update(ownerProfileId: string, dogId: string, mediaId: string, input: UpdateDogMediaInput) {
    const db = getDb();
    const existing = await getOwnedDogMediaRow(db, ownerProfileId, dogId, mediaId);

    const shouldBePrimary = input.isPrimary === true;

    if (shouldBePrimary && existing.mediaType !== 'image') {
      throw new Error('Only image assets can become the primary profile media.');
    }

    if (shouldBePrimary) {
      await clearPrimaryFlags(db, dogId);
    }

    const updatedRows = await db
      .update(dogMedia)
      .set({
        altText: input.altText === undefined ? existing.altText : normalizeOptionalText(input.altText),
        sortOrder:
          typeof input.sortOrder === 'number'
            ? Math.max(0, Math.trunc(input.sortOrder))
            : existing.sortOrder,
        isPrimary: shouldBePrimary ? true : existing.isPrimary,
        visibleInRegistry: input.visibleInRegistry === undefined ? existing.visibleInRegistry : input.visibleInRegistry,
        visibleInUsgGallery: input.visibleInUsgGallery === undefined ? existing.visibleInUsgGallery : input.visibleInUsgGallery,
      })
      .where(eq(dogMedia.id, mediaId))
      .returning();

    const updated = updatedRows[0];

    if (!updated) {
      throw new DogMediaItemNotFoundError(dogId, mediaId);
    }

    if (shouldBePrimary) {
      await syncDogMainImage(db, dogId, updated.publicUrl);
    }

    return {
      media: mapDogMediaRow(updated),
      mainImageUrl: await getCurrentMainImageUrl(db, dogId),
    };
  }

  async remove(ownerProfileId: string, dogId: string, mediaId: string) {
    const db = getDb();
    const existing = await getOwnedDogMediaRow(db, ownerProfileId, dogId, mediaId);

    await db
      .delete(dogMedia)
      .where(eq(dogMedia.id, mediaId));

    if (existing.isPrimary) {
      const nextPrimary = await findNextPrimaryCandidate(db, dogId);

      if (nextPrimary) {
        await clearPrimaryFlags(db, dogId);
        await db
          .update(dogMedia)
          .set({ isPrimary: true })
          .where(eq(dogMedia.id, nextPrimary.id));
        await syncDogMainImage(db, dogId, nextPrimary.publicUrl);
      } else {
        await syncDogMainImage(db, dogId, null);
      }
    }

    return {
      deleted: true,
      mainImageUrl: await getCurrentMainImageUrl(db, dogId),
    };
  }
}

export function createDogMediaRepository(): DogMediaRepository {
  return new DrizzleDogMediaRepository();
}
