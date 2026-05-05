import { and, asc, desc, eq, inArray, or, sql } from 'drizzle-orm';
import type {
  Certificate,
  CommunityRatingSummary,
  CommunityVoteState,
  DogAdminAssessment,
  DogAdminAssessmentDecision,
  Dog,
  DogMedia,
  ExecuteDogProfileActionInput,
  ExecuteDogProfileActionResult,
  IssueCertificateInput,
  IssueCertificateResult,
  PublicRegistryDocument,
  PublicRegistryEntry,
  PublicUsgCertifiedDocument,
  PublicUsgGalleryDocument,
  PublicRegistryProfileDocument,
  PublishSubmissionResult,
  ReviewQueueDocument,
  ReviewQueueItem,
  ReviewSubmissionInput,
  ReviewSubmissionResult,
  RevokeCertificateResult,
  UpdateDogAdminAssessmentInput,
  UpdateDogAdminAssessmentResult,
  UpdateDogMediaAdminControlInput,
  UpdateDogMediaAdminControlResult,
  UpsertDogProfileInput,
  VerificationDocument,
} from '@cane-corso-platform/contracts';
import { getDb, type CaneCorsoDb } from '../client';
import {
  certificates,
  dogAdminAssessments,
  dogMedia,
  dogs,
  dogSubmissions,
  profiles,
  registryEntries,
  registryEntryRatings,
  submissionReviews,
  users,
} from '../schema';

export interface MyDogsRepository {
  listByOwnerProfileId(ownerProfileId: string): Promise<Dog[]>;
  getProfileInputById(ownerProfileId: string, dogId: string): Promise<UpsertDogProfileInput | null>;
  executeProfileAction(
    ownerProfileId: string,
    input: ExecuteDogProfileActionInput,
  ): Promise<ExecuteDogProfileActionResult>;
  listReviewQueue(): Promise<ReviewQueueDocument>;
  reviewSubmission(reviewerProfileId: string, input: ReviewSubmissionInput): Promise<ReviewSubmissionResult>;
  publishSubmission(reviewerProfileId: string, submissionId: string): Promise<PublishSubmissionResult>;
  issueCertificate(reviewerProfileId: string, input: IssueCertificateInput): Promise<IssueCertificateResult>;
  revokeCertificate(reviewerProfileId: string, dogId: string): Promise<RevokeCertificateResult>;
  updateDogAdminAssessment(
    reviewerProfileId: string,
    input: UpdateDogAdminAssessmentInput,
  ): Promise<UpdateDogAdminAssessmentResult>;
  updateDogMediaAdminControl(
    reviewerProfileId: string,
    input: UpdateDogMediaAdminControlInput,
  ): Promise<UpdateDogMediaAdminControlResult>;
  listPublishedRegistryEntries(): Promise<PublicRegistryDocument>;
  listUsgGalleryEntries(): Promise<PublicUsgGalleryDocument>;
  listUsgCertifiedEntries(): Promise<PublicUsgCertifiedDocument>;
  getPublishedRegistryEntryBySlug(slug: string, viewerProfileId?: string | null): Promise<PublicRegistryProfileDocument | null>;
  getVerificationDocumentByCode(code: string): Promise<VerificationDocument | null>;
  submitRegistryEntryRating(voterProfileId: string, registryEntryId: string, rating: number): Promise<void>;
}

type DogRow = typeof dogs.$inferSelect;
type DogSubmissionRow = typeof dogSubmissions.$inferSelect;
type DogMediaRow = typeof dogMedia.$inferSelect;
type DogAdminAssessmentRow = typeof dogAdminAssessments.$inferSelect;
type RegistryEntryRow = typeof registryEntries.$inferSelect;
type CertificateRow = typeof certificates.$inferSelect;

type OwnerDogRow = {
  dog: typeof dogs.$inferSelect;
  registryEntry: typeof registryEntries.$inferSelect | null;
  certificate: typeof certificates.$inferSelect | null;
};

type ReviewQueueRow = {
  dog: typeof dogs.$inferSelect;
  submission: typeof dogSubmissions.$inferSelect;
  ownerProfile: typeof profiles.$inferSelect;
  ownerUser: typeof users.$inferSelect;
  registryEntry: typeof registryEntries.$inferSelect | null;
  certificate: typeof certificates.$inferSelect | null;
};

type PublicRegistryRow = {
  dog: typeof dogs.$inferSelect;
  registryEntry: typeof registryEntries.$inferSelect;
  ownerProfile: typeof profiles.$inferSelect;
  certificate: typeof certificates.$inferSelect | null;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toIsoDate(value: string | Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  return value.toISOString().slice(0, 10);
}

function toIsoDateTime(value: string | Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  return value.toISOString();
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80) || `dog-${Date.now()}`;
}

function normalizeLookupValue(value: string): string {
  return value.trim().toLowerCase();
}

function buildRegistrySlugCandidates(value: string): string[] {
  let decoded = value.trim();

  try {
    decoded = decodeURIComponent(value).trim();
  } catch {
    decoded = value.trim();
  }

  const normalized = normalizeLookupValue(decoded);
  const slugified = slugify(decoded);

  return Array.from(new Set([decoded, normalized, slugified].filter((candidate) => candidate.length > 0)));
}

function summarizeDog(row: DogRow): string | null {
  const shortCopy = row.shortDescription?.trim();

  if (shortCopy) {
    return shortCopy;
  }

  const longCopy = row.longDescription?.trim();

  if (!longCopy) {
    return null;
  }

  return longCopy.length > 220 ? `${longCopy.slice(0, 217).trimEnd()}...` : longCopy;
}

function buildCertificateCode(dogId: string): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = dogId.replace(/-/g, '').slice(-6).toUpperCase();
  return `USG-${datePart}-${suffix}`;
}


function normalizeCertificateImageUrl(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : null;
}

function formatSnapshotLocation(city: string | null, country: string | null): string | null {
  const parts = [city, country].filter((part): part is string => Boolean(part && part.trim().length > 0));
  return parts.length > 0 ? parts.join(', ') : null;
}

function getPedigreeParentName(row: DogRow, key: 'mother' | 'father'): string | null {
  const pedigree = row.pedigreeJson ?? null;
  const parent = pedigree?.[key];
  return parent?.name?.trim() || null;
}

function buildCertificateSnapshot(input: {
  dog: DogRow;
  ownerProfile: typeof profiles.$inferSelect;
  registryEntry: RegistryEntryRow;
  certificateCode: string;
  verificationSlug: string;
  issueDate: string;
}) {
  return {
    dogName: input.dog.name,
    breed: 'Cane Corso' as const,
    sex: input.dog.sex,
    dateOfBirth: toIsoDate(input.dog.dateOfBirth),
    color: input.dog.color,
    microchipNumber: input.dog.microchipNumber,
    pedigreeNumber: input.dog.pedigreeNumber,
    registryClass: input.dog.registryClass,
    ownerName: input.ownerProfile.displayName,
    location: formatSnapshotLocation(input.ownerProfile.city, input.ownerProfile.country),
    publicSlug: input.registryEntry.publicSlug,
    issueDate: input.issueDate,
    certificateCode: input.certificateCode,
    verificationSlug: input.verificationSlug,
    motherName: getPedigreeParentName(input.dog, 'mother'),
    fatherName: getPedigreeParentName(input.dog, 'father'),
    shortDescription: summarizeDog(input.dog),
  };
}

async function resolveCertificateImageUrl(
  db: CaneCorsoDb,
  dogId: string,
  requestedImageUrl: string | null,
  fallbackMainImageUrl: string | null,
): Promise<string | null> {
  if (requestedImageUrl) {
    const mediaRows = await db
      .select({ id: dogMedia.id })
      .from(dogMedia)
      .where(and(eq(dogMedia.dogId, dogId), eq(dogMedia.mediaType, 'image'), eq(dogMedia.publicUrl, requestedImageUrl)))
      .limit(1);

    if (!mediaRows[0]) {
      throw new Error('CERTIFICATE_IMAGE_NOT_ALLOWED');
    }

    return requestedImageUrl;
  }

  const [firstImageUrl] = await listDogImageUrls(db, dogId, fallbackMainImageUrl);
  return firstImageUrl ?? null;
}

function normalizeProfileGalleryUrls(urls: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const url of urls) {
    const value = url?.trim();

    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    normalized.push(value);

    if (normalized.length === 3) {
      break;
    }
  }

  return normalized;
}

function getProfileGalleryUrlsFromInput(profile: UpsertDogProfileInput): string[] {
  return normalizeProfileGalleryUrls([
    profile.mainImageUrl,
    ...((profile.galleryImageUrls ?? []) as string[]),
  ]);
}

async function listDogImageUrls(
  db: CaneCorsoDb,
  dogId: string,
  fallbackMainImageUrl?: string | null,
): Promise<string[]> {
  const rows = await db
    .select({
      publicUrl: dogMedia.publicUrl,
    })
    .from(dogMedia)
    .where(and(eq(dogMedia.dogId, dogId), eq(dogMedia.mediaType, 'image')))
    .orderBy(desc(dogMedia.isPrimary), asc(dogMedia.sortOrder), asc(dogMedia.createdAt));

  return normalizeProfileGalleryUrls([
    fallbackMainImageUrl,
    ...rows.map((row) => row.publicUrl),
  ]);
}

async function syncProfileGalleryMedia(
  db: CaneCorsoDb,
  ownerProfileId: string,
  dogId: string,
  dogName: string,
  galleryImageUrls: string[],
): Promise<void> {
  // Owner profile gallery images are saved immediately for the owner workspace.
  // Public Registry exposure is gated by active published registry entries,
  // while USG Gallery remains a separate admin-curated layer.
  const managedStoragePrefix = `profile-gallery/${dogId}/`;

  const managedRows = await db
    .select({ id: dogMedia.id })
    .from(dogMedia)
    .where(and(eq(dogMedia.dogId, dogId), sql`${dogMedia.storageKey} like ${`${managedStoragePrefix}%`}`));

  if (managedRows.length > 0) {
    await db
      .delete(dogMedia)
      .where(inArray(dogMedia.id, managedRows.map((row) => row.id)));
  }

  if (galleryImageUrls.length === 0) {
    return;
  }

  await db.insert(dogMedia).values(
    galleryImageUrls.map((url, index) => ({
      dogId,
      storageKey: `${managedStoragePrefix}${index + 1}`,
      publicUrl: url,
      mimeType: url.startsWith('data:image/webp')
        ? 'image/webp'
        : url.startsWith('data:image/png')
          ? 'image/png'
          : url.startsWith('data:image/jpeg') || url.startsWith('data:image/jpg')
            ? 'image/jpeg'
            : null,
      sizeBytes: null,
      mediaType: 'image',
      altText: `${dogName} profile image ${index + 1}`,
      sortOrder: index,
      isPrimary: index === 0,
      visibleInRegistry: true,
      visibleInUsgGallery: false,
      uploadedByProfileId: ownerProfileId,
    })),
  );
}

function mapDogPublication(
  registryEntry: RegistryEntryRow | null,
  certificate: CertificateRow | null,
): Dog['publication'] {
  if (!registryEntry) {
    return null;
  }

  return {
    publicSlug: registryEntry.publicSlug,
    publishedAt: toIsoDateTime(registryEntry.publishedAt) ?? new Date(0).toISOString(),
    certificateCode: certificate?.certificateCode ?? null,
    verificationSlug: certificate?.verificationSlug ?? null,
  };
}

function mapDogRowToDog(
  row: DogRow,
  publication: Dog['publication'] = null,
): Dog {
  return {
    id: row.id,
    ownerProfileId: row.ownerProfileId,
    name: row.name,
    slug: row.slug,
    sex: row.sex as Dog['sex'],
    dateOfBirth: toIsoDate(row.dateOfBirth),
    color: row.color,
    microchipNumber: row.microchipNumber,
    pedigreeNumber: row.pedigreeNumber,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    registryClass: row.registryClass as Dog['registryClass'],
    pedigree: (row.pedigreeJson ?? null) as Dog['pedigree'],
    mainImageUrl: row.mainImageUrl,
    visibility: row.visibility as Dog['visibility'],
    lifecycleStatus: row.lifecycleStatus as Dog['lifecycleStatus'],
    createdAt: toIsoDateTime(row.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIsoDateTime(row.updatedAt) ?? new Date(0).toISOString(),
    publication,
  };
}

function mapDogRowToProfileInput(row: DogRow, galleryImageUrls: string[] = []): UpsertDogProfileInput {
  const normalizedGalleryImageUrls = normalizeProfileGalleryUrls([row.mainImageUrl, ...galleryImageUrls]);

  return {
    dogId: row.id,
    name: row.name,
    slug: row.slug,
    sex: row.sex as UpsertDogProfileInput['sex'],
    dateOfBirth: toIsoDate(row.dateOfBirth),
    color: row.color,
    microchipNumber: row.microchipNumber,
    pedigreeNumber: row.pedigreeNumber,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    registryClass: row.registryClass as UpsertDogProfileInput['registryClass'],
    pedigree: (row.pedigreeJson ?? null) as UpsertDogProfileInput['pedigree'],
    visibility: row.visibility as UpsertDogProfileInput['visibility'],
    lifecycleStatus: row.lifecycleStatus as UpsertDogProfileInput['lifecycleStatus'],
    city: row.city,
    country: row.country,
    bloodlineNote: row.bloodlineNote,
    mainImageUrl: row.mainImageUrl ?? normalizedGalleryImageUrls[0] ?? null,
    galleryImageUrls: normalizedGalleryImageUrls,
  };
}

function mapCertificateRow(row: CertificateRow | null): Certificate | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    dogId: row.dogId,
    certificateCode: row.certificateCode,
    issueDate: toIsoDate(row.issueDate) ?? new Date(0).toISOString().slice(0, 10),
    status: row.status as Certificate['status'],
    verificationSlug: row.verificationSlug,
    certificateImageUrl: row.certificateImageUrl,
    snapshot: row.snapshotJson ?? null,
    issuedByProfileId: row.issuedByProfileId,
    pdfStorageKey: row.pdfStorageKey,
    pdfUrl: row.pdfUrl,
    createdAt: toIsoDateTime(row.createdAt) ?? new Date(0).toISOString(),
  };
}

function mapDogMediaRow(row: DogMediaRow): DogMedia {
  return {
    id: row.id,
    dogId: row.dogId,
    storageKey: row.storageKey,
    url: row.publicUrl,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    mediaType: row.mediaType as DogMedia['mediaType'],
    altText: row.altText,
    sortOrder: row.sortOrder,
    isPrimary: row.isPrimary,
    isVisibleInRegistry: row.visibleInRegistry,
    isVisibleInUsgGallery: row.visibleInUsgGallery,
    uploadedByProfileId: row.uploadedByProfileId,
    createdAt: toIsoDateTime(row.createdAt) ?? new Date(0).toISOString(),
  };
}


const assessmentDecisions = new Set<DogAdminAssessmentDecision>([
  'not_reviewed',
  'registry_approved',
  'needs_changes',
  'usg_candidate',
  'usg_certified',
]);

function normalizeAssessmentDecision(
  value: DogAdminAssessmentDecision | undefined,
  fallback: DogAdminAssessmentDecision,
): DogAdminAssessmentDecision {
  return value && assessmentDecisions.has(value) ? value : fallback;
}

function normalizeAssessmentScore(value: number | null | undefined): number | null {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  const normalized = Number(value);

  if (!Number.isInteger(normalized) || normalized < 1 || normalized > 5) {
    throw new Error('INVALID_ASSESSMENT_SCORE');
  }

  return normalized;
}

function mapDogAdminAssessmentRow(row: DogAdminAssessmentRow | null | undefined): DogAdminAssessment | null {
  if (!row) {
    return null;
  }

  return {
    dogId: row.dogId,
    reviewerProfileId: row.reviewerProfileId,
    registryDecision: normalizeAssessmentDecision(row.registryDecision as DogAdminAssessmentDecision, 'not_reviewed'),
    certificateDecision: normalizeAssessmentDecision(row.certificateDecision as DogAdminAssessmentDecision, 'not_reviewed'),
    breedTypeScore: row.breedTypeScore,
    temperamentScore: row.temperamentScore,
    pedigreeScore: row.pedigreeScore,
    healthScore: row.healthScore,
    presentationScore: row.presentationScore,
    overallScore: row.overallScore,
    publicNote: row.publicNote,
    privateNote: row.privateNote,
    updatedAt: toIsoDateTime(row.updatedAt),
  };
}

function normalizeMediaGalleryUrls(rows: Array<{ publicUrl: string | null }>): string[] {
  return normalizeProfileGalleryUrls(rows.map((row) => row.publicUrl));
}

async function listVisibleRegistryImageUrls(db: CaneCorsoDb, dogId: string): Promise<string[]> {
  const rows = await db
    .select({ publicUrl: dogMedia.publicUrl })
    .from(dogMedia)
    .where(
      and(
        eq(dogMedia.dogId, dogId),
        eq(dogMedia.mediaType, 'image'),
        eq(dogMedia.visibleInRegistry, true),
      ),
    )
    .orderBy(desc(dogMedia.isPrimary), asc(dogMedia.sortOrder), asc(dogMedia.createdAt));

  return normalizeMediaGalleryUrls(rows);
}

async function syncRegistryHeroImage(db: CaneCorsoDb, dogId: string): Promise<string | null> {
  const [heroImageUrl] = await listVisibleRegistryImageUrls(db, dogId);

  await db
    .update(registryEntries)
    .set({ heroImageUrl: heroImageUrl ?? null })
    .where(eq(registryEntries.dogId, dogId));

  return heroImageUrl ?? null;
}

function mapReviewQueueRow(row: ReviewQueueRow): ReviewQueueItem {
  return {
    submissionId: row.submission.id,
    dog: mapDogRowToDog(row.dog, mapDogPublication(row.registryEntry, row.certificate)),
    owner: {
      profileId: row.ownerProfile.id,
      displayName: row.ownerProfile.displayName,
      email: row.ownerUser.email,
      city: row.ownerProfile.city,
      country: row.ownerProfile.country,
    },
    status: row.submission.status as ReviewQueueItem['status'],
    submittedAt: toIsoDateTime(row.submission.submittedAt) ?? new Date(0).toISOString(),
    lastReviewedAt: toIsoDateTime(row.submission.lastReviewedAt),
    currentReviewNote: row.submission.currentReviewNote,
    publishedAt: toIsoDateTime(row.submission.publishedAt),
    publicRegistrySlug: row.registryEntry?.publicSlug ?? null,
    verificationSlug: row.certificate?.verificationSlug ?? null,
    certificateCode: row.certificate?.certificateCode ?? null,
    certificateImageUrl: row.certificate?.certificateImageUrl ?? null,
    ownerMedia: [],
    adminAssessment: null,
  };
}

function mapPublicRegistryRow(row: PublicRegistryRow): PublicRegistryEntry {
  return {
    entryId: row.registryEntry.id,
    dogId: row.dog.id,
    publicSlug: row.registryEntry.publicSlug,
    title: row.registryEntry.title,
    summary: row.registryEntry.summary,
    heroImageUrl: row.registryEntry.heroImageUrl,
    galleryImages: [],
    publishedAt: toIsoDateTime(row.registryEntry.publishedAt) ?? new Date(0).toISOString(),
    owner: {
      profileId: row.ownerProfile.id,
      displayName: row.ownerProfile.displayName,
      city: row.ownerProfile.city,
      country: row.ownerProfile.country,
    },
    dog: mapDogRowToDog(row.dog, mapDogPublication(row.registryEntry, row.certificate)),
    certificate: mapCertificateRow(row.certificate),
    communityRating: buildCommunitySummary(0, null),
    adminAssessment: null,
  };
}

function computeRegistryCommunityBadge(totalRatings: number, averageRating: number | null): CommunityRatingSummary['badge'] {
  if (!averageRating || totalRatings < 3) {
    return null;
  }

  return averageRating >= 4.6 ? 'community_favorite' : null;
}

function buildCommunitySummary(totalRatings: number, averageRating: number | string | null): CommunityRatingSummary {
  const normalizedAverage = averageRating == null ? null : Number(averageRating);

  return {
    averageRating: normalizedAverage != null && Number.isFinite(normalizedAverage) ? Number(normalizedAverage.toFixed(1)) : null,
    totalRatings,
    badge: computeRegistryCommunityBadge(totalRatings, normalizedAverage),
  };
}

function buildVoteState(viewerProfileId: string | null | undefined, ownerProfileId: string, userRating: number | null): CommunityVoteState {
  if (!viewerProfileId) {
    return {
      userRating,
      canRate: false,
      gate: 'member_required',
    };
  }

  if (viewerProfileId === ownerProfileId) {
    return {
      userRating,
      canRate: false,
      gate: 'own_entry',
    };
  }

  return {
    userRating,
    canRate: true,
    gate: 'eligible',
  };
}

async function attachRegistryMedia(
  db: CaneCorsoDb,
  entries: PublicRegistryEntry[],
): Promise<PublicRegistryEntry[]> {
  if (entries.length === 0) {
    return entries;
  }

  const dogIds = entries.map((entry) => entry.dogId);
  const mediaRows = await db
    .select({
      dogId: dogMedia.dogId,
      publicUrl: dogMedia.publicUrl,
    })
    .from(dogMedia)
    .where(
      and(
        inArray(dogMedia.dogId, dogIds),
        eq(dogMedia.mediaType, 'image'),
        eq(dogMedia.visibleInRegistry, true),
      ),
    )
    .orderBy(desc(dogMedia.isPrimary), asc(dogMedia.sortOrder), asc(dogMedia.createdAt));

  const mediaByDogId = new Map<string, string[]>();

  for (const row of mediaRows) {
    if (!row.publicUrl) {
      continue;
    }

    const current = mediaByDogId.get(row.dogId) ?? [];

    if (!current.includes(row.publicUrl)) {
      current.push(row.publicUrl);
      mediaByDogId.set(row.dogId, current);
    }
  }

  return entries.map((entry) => {
    const uniqueGallery = Array.from(new Set(mediaByDogId.get(entry.dogId) ?? [])).slice(0, 3);

    return {
      ...entry,
      galleryImages: uniqueGallery,
      heroImageUrl: uniqueGallery[0] ?? null,
    };
  });
}

async function attachUsgGalleryMedia(
  db: CaneCorsoDb,
  entries: PublicRegistryEntry[],
): Promise<PublicRegistryEntry[]> {
  if (entries.length === 0) {
    return entries;
  }

  const dogIds = entries.map((entry) => entry.dogId);
  const mediaRows = await db
    .select({
      dogId: dogMedia.dogId,
      publicUrl: dogMedia.publicUrl,
    })
    .from(dogMedia)
    .where(
      and(
        inArray(dogMedia.dogId, dogIds),
        eq(dogMedia.mediaType, 'image'),
        eq(dogMedia.visibleInUsgGallery, true),
      ),
    )
    .orderBy(desc(dogMedia.isPrimary), asc(dogMedia.sortOrder), asc(dogMedia.createdAt));

  const mediaByDogId = new Map<string, string[]>();

  for (const row of mediaRows) {
    if (!row.publicUrl) {
      continue;
    }

    const current = mediaByDogId.get(row.dogId) ?? [];

    if (!current.includes(row.publicUrl)) {
      current.push(row.publicUrl);
      mediaByDogId.set(row.dogId, current);
    }
  }

  return entries.map((entry) => {
    const uniqueGallery = Array.from(new Set(mediaByDogId.get(entry.dogId) ?? [])).slice(0, 3);

    return {
      ...entry,
      galleryImages: uniqueGallery,
      heroImageUrl: uniqueGallery[0] ?? null,
    };
  });
}

async function attachReviewQueueMedia(
  db: CaneCorsoDb,
  items: ReviewQueueItem[],
): Promise<ReviewQueueItem[]> {
  if (items.length === 0) {
    return items;
  }

  const dogIds = items.map((item) => item.dog.id);
  const mediaRows = await db
    .select()
    .from(dogMedia)
    .where(and(inArray(dogMedia.dogId, dogIds), eq(dogMedia.mediaType, 'image')))
    .orderBy(desc(dogMedia.isPrimary), asc(dogMedia.sortOrder), asc(dogMedia.createdAt));

  const mediaByDogId = new Map<string, DogMedia[]>();

  for (const row of mediaRows) {
    const current = mediaByDogId.get(row.dogId) ?? [];
    current.push(mapDogMediaRow(row));
    mediaByDogId.set(row.dogId, current);
  }

  return items.map((item) => ({
    ...item,
    ownerMedia: mediaByDogId.get(item.dog.id) ?? [],
  }));
}

async function attachRegistryCommunityRatings(
  db: CaneCorsoDb,
  entries: PublicRegistryEntry[],
): Promise<PublicRegistryEntry[]> {
  if (entries.length === 0) {
    return entries;
  }

  const entryIds = entries.map((entry) => entry.entryId);
  const summaryRows = await db
    .select({
      entryId: registryEntryRatings.registryEntryId,
      averageRating: sql<number | null>`avg(${registryEntryRatings.rating})::numeric`,
      totalRatings: sql<number>`count(*)::int`,
    })
    .from(registryEntryRatings)
    .where(inArray(registryEntryRatings.registryEntryId, entryIds))
    .groupBy(registryEntryRatings.registryEntryId);

  const summaryByEntryId = new Map(
    summaryRows.map((row) => [row.entryId, buildCommunitySummary(row.totalRatings, row.averageRating ?? null)]),
  );

  return entries.map((entry) => ({
    ...entry,
    communityRating: summaryByEntryId.get(entry.entryId) ?? buildCommunitySummary(0, null),
  }));
}


async function attachReviewQueueAssessments(
  db: CaneCorsoDb,
  items: ReviewQueueItem[],
): Promise<ReviewQueueItem[]> {
  if (items.length === 0) {
    return items;
  }

  const dogIds = items.map((item) => item.dog.id);
  const assessmentRows = await db
    .select()
    .from(dogAdminAssessments)
    .where(inArray(dogAdminAssessments.dogId, dogIds));

  const assessmentByDogId = new Map(
    assessmentRows.map((row) => [row.dogId, mapDogAdminAssessmentRow(row)]),
  );

  return items.map((item) => ({
    ...item,
    adminAssessment: assessmentByDogId.get(item.dog.id) ?? null,
  }));
}

async function attachRegistryAdminAssessments(
  db: CaneCorsoDb,
  entries: PublicRegistryEntry[],
): Promise<PublicRegistryEntry[]> {
  if (entries.length === 0) {
    return entries;
  }

  const dogIds = entries.map((entry) => entry.dogId);
  const assessmentRows = await db
    .select()
    .from(dogAdminAssessments)
    .where(inArray(dogAdminAssessments.dogId, dogIds));

  const assessmentByDogId = new Map(
    assessmentRows.map((row) => [row.dogId, mapDogAdminAssessmentRow(row)]),
  );

  return entries.map((entry) => {
    const assessment = assessmentByDogId.get(entry.dogId) ?? null;

    return {
      ...entry,
      adminAssessment: assessment
        ? {
            dogId: assessment.dogId,
            reviewerProfileId: assessment.reviewerProfileId,
            registryDecision: assessment.registryDecision,
            certificateDecision: assessment.certificateDecision,
            breedTypeScore: assessment.breedTypeScore,
            temperamentScore: assessment.temperamentScore,
            pedigreeScore: assessment.pedigreeScore,
            healthScore: assessment.healthScore,
            presentationScore: assessment.presentationScore,
            overallScore: assessment.overallScore,
            publicNote: assessment.publicNote,
            updatedAt: assessment.updatedAt,
          }
        : null,
    };
  });
}

async function getViewerRegistryRating(
  db: CaneCorsoDb,
  registryEntryId: string,
  viewerProfileId: string | null | undefined,
): Promise<number | null> {
  if (!viewerProfileId) {
    return null;
  }

  const rows = await db
    .select({ rating: registryEntryRatings.rating })
    .from(registryEntryRatings)
    .where(and(eq(registryEntryRatings.registryEntryId, registryEntryId), eq(registryEntryRatings.voterProfileId, viewerProfileId)))
    .limit(1);

  return rows[0]?.rating ?? null;
}

async function ensureOwnerProfile(db: CaneCorsoDb, ownerProfileId: string): Promise<void> {
  const existingProfile = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, ownerProfileId))
    .limit(1);

  if (!existingProfile[0]) {
    throw new Error(
      `Owner profile ${ownerProfileId} was not found. Create or restore the member profile before using My Dogs.`,
    );
  }
}

async function getLatestSubmissionForDog(db: CaneCorsoDb, dogId: string) {
  const submissionRows = await db
    .select({ id: dogSubmissions.id })
    .from(dogSubmissions)
    .where(eq(dogSubmissions.dogId, dogId))
    .orderBy(desc(dogSubmissions.submittedAt))
    .limit(1);

  return submissionRows[0] ?? null;
}

async function logSubmissionReviewForDog(
  db: CaneCorsoDb,
  dogId: string,
  reviewerProfileId: string,
  decision: string,
  note: string,
  createdAt: Date,
): Promise<void> {
  const latestSubmission = await getLatestSubmissionForDog(db, dogId);

  if (!latestSubmission) {
    return;
  }

  await db.insert(submissionReviews).values({
    submissionId: latestSubmission.id,
    reviewerProfileId,
    decision,
    note,
    createdAt,
  });
}

async function resolveUniqueSlug(
  db: CaneCorsoDb,
  desiredSlug: string,
  currentDogId?: string | null,
): Promise<string> {
  const normalizedBase = desiredSlug.trim() || `dog-${Date.now()}`;
  let candidate = normalizedBase;
  let counter = 2;

  while (true) {
    const existing = await db
      .select({ id: dogs.id })
      .from(dogs)
      .where(eq(dogs.slug, candidate))
      .limit(1);

    if (!existing[0] || existing[0].id === currentDogId) {
      return candidate;
    }

    candidate = `${normalizedBase}-${counter}`;
    counter += 1;
  }
}

async function resolveUniqueRegistrySlug(
  db: CaneCorsoDb,
  desiredSlug: string,
  currentDogId?: string | null,
): Promise<string> {
  const normalizedBase = slugify(desiredSlug);
  let candidate = normalizedBase;
  let counter = 2;

  while (true) {
    const existing = await db
      .select({ dogId: registryEntries.dogId })
      .from(registryEntries)
      .where(eq(registryEntries.publicSlug, candidate))
      .limit(1);

    if (!existing[0] || existing[0].dogId === currentDogId) {
      return candidate;
    }

    candidate = `${normalizedBase}-${counter}`;
    counter += 1;
  }
}

async function resolveUniqueVerificationSlug(db: CaneCorsoDb, desiredSlug: string, dogId: string): Promise<string> {
  const normalizedBase = slugify(desiredSlug);
  let candidate = normalizedBase;
  let counter = 2;

  while (true) {
    const existing = await db
      .select({ dogId: certificates.dogId })
      .from(certificates)
      .where(eq(certificates.verificationSlug, candidate))
      .limit(1);

    if (!existing[0] || existing[0].dogId === dogId) {
      return candidate;
    }

    candidate = `${normalizedBase}-${counter}`;
    counter += 1;
  }
}

async function resolveUniqueCertificateCode(db: CaneCorsoDb, desiredCode: string, dogId: string): Promise<string> {
  let candidate = desiredCode;
  let counter = 2;

  while (true) {
    const existing = await db
      .select({ dogId: certificates.dogId })
      .from(certificates)
      .where(eq(certificates.certificateCode, candidate))
      .limit(1);

    if (!existing[0] || existing[0].dogId === dogId) {
      return candidate;
    }

    candidate = `${desiredCode}-${counter}`;
    counter += 1;
  }
}

async function getExistingDog(
  db: CaneCorsoDb,
  ownerProfileId: string,
  profile: UpsertDogProfileInput,
): Promise<DogRow | null> {
  if (profile.dogId && isUuid(profile.dogId)) {
    const byId = await db
      .select()
      .from(dogs)
      .where(and(eq(dogs.id, profile.dogId), eq(dogs.ownerProfileId, ownerProfileId)))
      .limit(1);

    if (byId[0]) {
      return byId[0];
    }
  }

  const bySlug = await db
    .select()
    .from(dogs)
    .where(and(eq(dogs.slug, profile.slug), eq(dogs.ownerProfileId, ownerProfileId)))
    .limit(1);

  return bySlug[0] ?? null;
}

async function upsertSubmission(
  db: CaneCorsoDb,
  dogId: string,
  ownerProfileId: string,
): Promise<DogSubmissionRow> {
  const existing = await db
    .select()
    .from(dogSubmissions)
    .where(eq(dogSubmissions.dogId, dogId))
    .orderBy(desc(dogSubmissions.submittedAt))
    .limit(1);

  if (existing[0]) {
    const updated = await db
      .update(dogSubmissions)
      .set({
        status: 'submitted',
        submittedAt: new Date(),
        lastReviewedAt: null,
        currentReviewNote: null,
        publishedAt: null,
      })
      .where(eq(dogSubmissions.id, existing[0].id))
      .returning();

    return updated[0];
  }

  const inserted = await db
    .insert(dogSubmissions)
    .values({
      dogId,
      submittedByProfileId: ownerProfileId,
      status: 'submitted',
    })
    .returning();

  return inserted[0];
}

async function getPublicRegistryRowBySubmissionId(db: CaneCorsoDb, submissionId: string): Promise<PublicRegistryRow | null> {
  const rows = await db
    .select({
      dog: dogs,
      registryEntry: registryEntries,
      ownerProfile: profiles,
      certificate: certificates,
    })
    .from(dogSubmissions)
    .innerJoin(dogs, eq(dogSubmissions.dogId, dogs.id))
    .innerJoin(registryEntries, eq(registryEntries.dogId, dogs.id))
    .innerJoin(profiles, eq(dogs.ownerProfileId, profiles.id))
    .leftJoin(certificates, and(eq(certificates.dogId, dogs.id), eq(certificates.status, 'active')))
    .where(eq(dogSubmissions.id, submissionId))
    .limit(1);

  return rows[0] ?? null;
}

class DrizzleMyDogsRepository implements MyDogsRepository {
  async listByOwnerProfileId(ownerProfileId: string): Promise<Dog[]> {
    const db = getDb();
    await ensureOwnerProfile(db, ownerProfileId);

    const rows = await db
      .select({
        dog: dogs,
        registryEntry: registryEntries,
        certificate: certificates,
      })
      .from(dogs)
      .leftJoin(registryEntries, and(eq(registryEntries.dogId, dogs.id), eq(registryEntries.isActive, true)))
      .leftJoin(certificates, and(eq(certificates.dogId, dogs.id), eq(certificates.status, 'active')))
      .where(eq(dogs.ownerProfileId, ownerProfileId))
      .orderBy(desc(dogs.updatedAt));

    return rows.map((row) => mapDogRowToDog(row.dog, mapDogPublication(row.registryEntry, row.certificate)));
  }

  async getProfileInputById(ownerProfileId: string, dogId: string): Promise<UpsertDogProfileInput | null> {
    const db = getDb();
    await ensureOwnerProfile(db, ownerProfileId);

    const rows = isUuid(dogId)
      ? await db
          .select()
          .from(dogs)
          .where(
            and(
              eq(dogs.ownerProfileId, ownerProfileId),
              or(eq(dogs.id, dogId), eq(dogs.slug, dogId)),
            ),
          )
          .limit(1)
      : await db
          .select()
          .from(dogs)
          .where(and(eq(dogs.ownerProfileId, ownerProfileId), eq(dogs.slug, dogId)))
          .limit(1);

    if (!rows[0]) {
      return null;
    }

    const galleryImageUrls = await listDogImageUrls(db, rows[0].id, rows[0].mainImageUrl);
    return mapDogRowToProfileInput(rows[0], galleryImageUrls);
  }

  async executeProfileAction(
    ownerProfileId: string,
    input: ExecuteDogProfileActionInput,
  ): Promise<ExecuteDogProfileActionResult> {
    const db = getDb();
    await ensureOwnerProfile(db, ownerProfileId);

    const existingDog = await getExistingDog(db, ownerProfileId, input.profile);
    const resolvedSlug = await resolveUniqueSlug(db, input.profile.slug, existingDog?.id ?? input.profile.dogId);
    const lifecycleStatus = input.intent === 'submit_for_review' ? 'submitted' : 'draft';
    const galleryImageUrls = getProfileGalleryUrlsFromInput(input.profile);
    const primaryImageUrl = galleryImageUrls[0] ?? input.profile.mainImageUrl ?? null;

    const persistedRows = existingDog
      ? await db
          .update(dogs)
          .set({
            name: input.profile.name,
            slug: resolvedSlug,
            sex: input.profile.sex,
            dateOfBirth: input.profile.dateOfBirth,
            color: input.profile.color,
            microchipNumber: input.profile.microchipNumber,
            pedigreeNumber: input.profile.pedigreeNumber,
            shortDescription: input.profile.shortDescription,
            longDescription: input.profile.longDescription,
            registryClass: input.profile.registryClass,
            pedigreeJson: input.profile.pedigree ?? {},
            visibility: input.profile.visibility,
            lifecycleStatus,
            city: input.profile.city,
            country: input.profile.country,
            bloodlineNote: input.profile.bloodlineNote,
            mainImageUrl: primaryImageUrl,
            updatedAt: new Date(),
          })
          .where(and(eq(dogs.id, existingDog.id), eq(dogs.ownerProfileId, ownerProfileId)))
          .returning()
      : await db
          .insert(dogs)
          .values({
            ownerProfileId,
            name: input.profile.name,
            slug: resolvedSlug,
            sex: input.profile.sex,
            dateOfBirth: input.profile.dateOfBirth,
            color: input.profile.color,
            microchipNumber: input.profile.microchipNumber,
            pedigreeNumber: input.profile.pedigreeNumber,
            shortDescription: input.profile.shortDescription,
            longDescription: input.profile.longDescription,
            registryClass: input.profile.registryClass,
            pedigreeJson: input.profile.pedigree ?? {},
            visibility: input.profile.visibility,
            lifecycleStatus,
            city: input.profile.city,
            country: input.profile.country,
            bloodlineNote: input.profile.bloodlineNote,
            mainImageUrl: primaryImageUrl,
          })
          .returning();

    const persistedDog = persistedRows[0];

    await syncProfileGalleryMedia(db, ownerProfileId, persistedDog.id, input.profile.name, galleryImageUrls);

    if (input.intent === 'submit_for_review') {
      await upsertSubmission(db, persistedDog.id, ownerProfileId);
    }

    return {
      ok: true,
      intent: input.intent,
      dogId: persistedDog.id,
      lifecycleStatus,
      message:
        input.intent === 'submit_for_review'
          ? 'Dog profile was submitted through the real database workflow.'
          : 'Dog draft was saved through the real database workflow.',
      persistedAt: toIsoDateTime(persistedDog.updatedAt) ?? new Date().toISOString(),
      profile: {
        ...mapDogRowToProfileInput({ ...persistedDog, mainImageUrl: primaryImageUrl }, galleryImageUrls),
        lifecycleStatus,
      },
    };
  }

  async listReviewQueue(): Promise<ReviewQueueDocument> {
    const db = getDb();
    const rows = await db
      .select({
        dog: dogs,
        submission: dogSubmissions,
        ownerProfile: profiles,
        ownerUser: users,
        registryEntry: registryEntries,
        certificate: certificates,
      })
      .from(dogSubmissions)
      .innerJoin(dogs, eq(dogSubmissions.dogId, dogs.id))
      .innerJoin(profiles, eq(dogs.ownerProfileId, profiles.id))
      .innerJoin(users, eq(profiles.userId, users.id))
      .leftJoin(registryEntries, eq(registryEntries.dogId, dogs.id))
      .leftJoin(certificates, and(eq(certificates.dogId, dogs.id), eq(certificates.status, 'active')))
      .orderBy(desc(dogSubmissions.submittedAt));

    const itemsWithMedia: ReviewQueueItem[] = await attachReviewQueueMedia(db, rows.map(mapReviewQueueRow));
    const items = await attachReviewQueueAssessments(db, itemsWithMedia);

    return {
      items,
      summary: {
        total: items.length,
        submitted: items.filter((item) => item.status === 'submitted').length,
        approved: items.filter((item) => item.status === 'approved').length,
        needsChanges: items.filter((item) => item.status === 'needs_changes').length,
        published: items.filter((item) => item.status === 'published').length,
      },
    };
  }

  async reviewSubmission(reviewerProfileId: string, input: ReviewSubmissionInput): Promise<ReviewSubmissionResult> {
    const db = getDb();
    await ensureOwnerProfile(db, reviewerProfileId);

    const existing = await db
      .select({
        dog: dogs,
        submission: dogSubmissions,
      })
      .from(dogSubmissions)
      .innerJoin(dogs, eq(dogSubmissions.dogId, dogs.id))
      .where(eq(dogSubmissions.id, input.submissionId))
      .limit(1);

    if (!existing[0]) {
      throw new Error(`Submission ${input.submissionId} was not found.`);
    }

    const nextStatus = input.decision === 'approve' ? 'approved' : 'needs_changes';
    const reviewNote =
      input.note?.trim() ||
      (input.decision === 'approve'
        ? 'Approved from the admin review queue.'
        : 'Changes requested from the admin review queue.');
    const reviewedAt = new Date();

    const updatedSubmissionRows = await db
      .update(dogSubmissions)
      .set({
        status: nextStatus,
        lastReviewedAt: reviewedAt,
        currentReviewNote: reviewNote,
      })
      .where(eq(dogSubmissions.id, input.submissionId))
      .returning();

    await db
      .update(dogs)
      .set({
        lifecycleStatus: nextStatus,
        updatedAt: reviewedAt,
      })
      .where(eq(dogs.id, existing[0].dog.id));

    await db.insert(submissionReviews).values({
      submissionId: input.submissionId,
      reviewerProfileId,
      decision: input.decision === 'approve' ? 'approved' : 'needs_changes',
      note: reviewNote,
      createdAt: reviewedAt,
    });

    const updatedSubmission = updatedSubmissionRows[0];

    return {
      submissionId: updatedSubmission.id,
      dogId: updatedSubmission.dogId,
      status: nextStatus,
      reviewedAt: toIsoDateTime(updatedSubmission.lastReviewedAt) ?? reviewedAt.toISOString(),
      note: updatedSubmission.currentReviewNote,
    };
  }

  async publishSubmission(reviewerProfileId: string, submissionId: string): Promise<PublishSubmissionResult> {
    const db = getDb();
    await ensureOwnerProfile(db, reviewerProfileId);

    const existing = await db
      .select({
        dog: dogs,
        submission: dogSubmissions,
      })
      .from(dogSubmissions)
      .innerJoin(dogs, eq(dogSubmissions.dogId, dogs.id))
      .where(eq(dogSubmissions.id, submissionId))
      .limit(1);

    const current = existing[0];

    if (!current) {
      throw new Error(`Submission ${submissionId} was not found.`);
    }

    if (!['approved', 'published'].includes(current.submission.status)) {
      throw new Error('Only approved submissions can be published to the public registry.');
    }

    const publishedAt = new Date();
    const existingRegistryRows = await db
      .select()
      .from(registryEntries)
      .where(eq(registryEntries.dogId, current.dog.id))
      .limit(1);
    const existingRegistry = existingRegistryRows[0] ?? null;

    const publicSlug = existingRegistry?.publicSlug ?? await resolveUniqueRegistrySlug(db, current.dog.slug || current.dog.name, current.dog.id);
    const [registryHeroImageUrl] = await listVisibleRegistryImageUrls(db, current.dog.id);
    const heroImageUrl = registryHeroImageUrl ?? null;
    const summary = summarizeDog(current.dog);

    if (existingRegistry) {
      await db
        .update(registryEntries)
        .set({
          publicSlug,
          title: current.dog.name,
          summary,
          heroImageUrl,
          publishedAt,
          isActive: true,
        })
        .where(eq(registryEntries.id, existingRegistry.id));
    } else {
      await db
        .insert(registryEntries)
        .values({
          dogId: current.dog.id,
          publicSlug,
          title: current.dog.name,
          summary,
          heroImageUrl,
          publishedAt,
          isActive: true,
        });
    }

    await db
      .update(dogSubmissions)
      .set({
        status: 'published',
        lastReviewedAt: publishedAt,
        currentReviewNote: 'Published to the public registry.',
        publishedAt,
      })
      .where(eq(dogSubmissions.id, submissionId));

    await db
      .update(dogs)
      .set({
        lifecycleStatus: 'published',
        visibility: 'public',
        updatedAt: publishedAt,
      })
      .where(eq(dogs.id, current.dog.id));

    await db.insert(submissionReviews).values({
      submissionId,
      reviewerProfileId,
      decision: 'published',
      note: 'Published to the public registry.',
      createdAt: publishedAt,
    });

    return {
      submissionId,
      dogId: current.dog.id,
      status: 'published',
      publishedAt: publishedAt.toISOString(),
      publicSlug,
      verificationSlug: null,
      certificateCode: null,
    };
  }

  async issueCertificate(reviewerProfileId: string, input: IssueCertificateInput): Promise<IssueCertificateResult> {
    const db = getDb();
    await ensureOwnerProfile(db, reviewerProfileId);

    const dogId = input.dogId;
    const requestedImageUrl = normalizeCertificateImageUrl(input.certificateImageUrl);

    const rows = await db
      .select({
        dog: dogs,
        registryEntry: registryEntries,
        ownerProfile: profiles,
      })
      .from(dogs)
      .leftJoin(registryEntries, eq(registryEntries.dogId, dogs.id))
      .innerJoin(profiles, eq(dogs.ownerProfileId, profiles.id))
      .where(eq(dogs.id, dogId))
      .limit(1);

    const current = rows[0];

    if (!current) {
      throw new Error(`Dog ${dogId} was not found.`);
    }

    if (current.dog.lifecycleStatus !== 'published' || !current.registryEntry || !current.registryEntry.isActive) {
      throw new Error('Only active public registry profiles can receive a USG certificate.');
    }

    const issuedAt = new Date();
    const existingCertificateRows = await db
      .select()
      .from(certificates)
      .where(eq(certificates.dogId, dogId))
      .orderBy(desc(certificates.createdAt))
      .limit(1);
    const existingCertificate = existingCertificateRows[0] ?? null;

    const certificateCode =
      existingCertificate?.certificateCode ??
      await resolveUniqueCertificateCode(db, buildCertificateCode(dogId), dogId);
    const verificationSlug =
      existingCertificate?.verificationSlug ??
      await resolveUniqueVerificationSlug(db, `${current.registryEntry.publicSlug}-verify`, dogId);
    const issueDate = toIsoDate(issuedAt) ?? issuedAt.toISOString().slice(0, 10);
    const certificateImageUrl = await resolveCertificateImageUrl(
      db,
      dogId,
      requestedImageUrl,
      current.registryEntry.heroImageUrl ?? current.dog.mainImageUrl,
    );
    const snapshotJson = buildCertificateSnapshot({
      dog: current.dog,
      ownerProfile: current.ownerProfile,
      registryEntry: current.registryEntry,
      certificateCode,
      verificationSlug,
      issueDate,
    });

    if (existingCertificate) {
      await db
        .update(certificates)
        .set({
          certificateCode,
          verificationSlug,
          issueDate,
          status: 'active',
          certificateImageUrl,
          snapshotJson,
          issuedByProfileId: reviewerProfileId,
        })
        .where(eq(certificates.id, existingCertificate.id));
    } else {
      await db
        .insert(certificates)
        .values({
          dogId,
          certificateCode,
          issueDate,
          status: 'active',
          verificationSlug,
          certificateImageUrl,
          snapshotJson,
          issuedByProfileId: reviewerProfileId,
        });
    }

    await db
      .insert(dogAdminAssessments)
      .values({
        dogId,
        reviewerProfileId,
        registryDecision: 'registry_approved',
        certificateDecision: 'usg_certified',
        createdAt: issuedAt,
        updatedAt: issuedAt,
      })
      .onConflictDoUpdate({
        target: dogAdminAssessments.dogId,
        set: {
          reviewerProfileId,
          registryDecision: 'registry_approved',
          certificateDecision: 'usg_certified',
          updatedAt: issuedAt,
        },
      });

    await logSubmissionReviewForDog(
      db,
      dogId,
      reviewerProfileId,
      'certificate_issued',
      certificateImageUrl
        ? 'USG certificate issued by admin action with a selected certificate photo.'
        : 'USG certificate issued by admin action without a selected certificate photo.',
      issuedAt,
    );

    return {
      dogId,
      certificateCode,
      verificationSlug,
      certificateImageUrl,
      publicSlug: current.registryEntry.publicSlug,
      status: 'active',
      issuedAt: issuedAt.toISOString(),
    };
  }

  async updateDogAdminAssessment(
    reviewerProfileId: string,
    input: UpdateDogAdminAssessmentInput,
  ): Promise<UpdateDogAdminAssessmentResult> {
    const db = getDb();
    await ensureOwnerProfile(db, reviewerProfileId);

    const dogRows = await db
      .select({ id: dogs.id })
      .from(dogs)
      .where(eq(dogs.id, input.dogId))
      .limit(1);

    if (!dogRows[0]) {
      throw new Error(`Dog ${input.dogId} was not found.`);
    }

    const existingRows = await db
      .select()
      .from(dogAdminAssessments)
      .where(eq(dogAdminAssessments.dogId, input.dogId))
      .limit(1);
    const existing = existingRows[0] ?? null;
    const updatedAt = new Date();
    const values = {
      dogId: input.dogId,
      reviewerProfileId,
      registryDecision: normalizeAssessmentDecision(input.registryDecision, (existing?.registryDecision as DogAdminAssessmentDecision | undefined) ?? 'not_reviewed'),
      certificateDecision: normalizeAssessmentDecision(input.certificateDecision, (existing?.certificateDecision as DogAdminAssessmentDecision | undefined) ?? 'not_reviewed'),
      breedTypeScore: normalizeAssessmentScore(input.breedTypeScore !== undefined ? input.breedTypeScore : existing?.breedTypeScore ?? null),
      temperamentScore: normalizeAssessmentScore(input.temperamentScore !== undefined ? input.temperamentScore : existing?.temperamentScore ?? null),
      pedigreeScore: normalizeAssessmentScore(input.pedigreeScore !== undefined ? input.pedigreeScore : existing?.pedigreeScore ?? null),
      healthScore: normalizeAssessmentScore(input.healthScore !== undefined ? input.healthScore : existing?.healthScore ?? null),
      presentationScore: normalizeAssessmentScore(input.presentationScore !== undefined ? input.presentationScore : existing?.presentationScore ?? null),
      overallScore: normalizeAssessmentScore(input.overallScore !== undefined ? input.overallScore : existing?.overallScore ?? null),
      publicNote: input.publicNote !== undefined ? input.publicNote?.trim() || null : existing?.publicNote ?? null,
      privateNote: input.privateNote !== undefined ? input.privateNote?.trim() || null : existing?.privateNote ?? null,
      updatedAt,
    };

    const updatedRows = await db
      .insert(dogAdminAssessments)
      .values({
        ...values,
        createdAt: updatedAt,
      })
      .onConflictDoUpdate({
        target: dogAdminAssessments.dogId,
        set: values,
      })
      .returning();

    await logSubmissionReviewForDog(
      db,
      input.dogId,
      reviewerProfileId,
      'admin_assessment_updated',
      'Admin assessment updated.',
      updatedAt,
    );

    const registryRows = await db
      .select({ publicSlug: registryEntries.publicSlug })
      .from(registryEntries)
      .where(eq(registryEntries.dogId, input.dogId))
      .limit(1);
    const certificateRows = await db
      .select({
        verificationSlug: certificates.verificationSlug,
        certificateCode: certificates.certificateCode,
      })
      .from(certificates)
      .where(and(eq(certificates.dogId, input.dogId), eq(certificates.status, 'active')))
      .limit(1);

    return {
      dogId: input.dogId,
      assessment: mapDogAdminAssessmentRow(updatedRows[0])!,
      publicSlug: registryRows[0]?.publicSlug ?? null,
      verificationSlug: certificateRows[0]?.verificationSlug ?? null,
      certificateCode: certificateRows[0]?.certificateCode ?? null,
    };
  }

  async updateDogMediaAdminControl(
    reviewerProfileId: string,
    input: UpdateDogMediaAdminControlInput,
  ): Promise<UpdateDogMediaAdminControlResult> {
    const db = getDb();
    await ensureOwnerProfile(db, reviewerProfileId);

    const rows = await db
      .select({ media: dogMedia })
      .from(dogMedia)
      .innerJoin(dogs, eq(dogMedia.dogId, dogs.id))
      .where(and(eq(dogs.id, input.dogId), eq(dogMedia.id, input.mediaId), eq(dogMedia.mediaType, 'image')))
      .limit(1);

    const current = rows[0]?.media ?? null;

    if (!current) {
      throw new Error('MEDIA_NOT_FOUND');
    }

    const visibleInRegistry =
      typeof input.visibleInRegistry === 'boolean' ? input.visibleInRegistry : current.visibleInRegistry;
    const visibleInUsgGallery =
      typeof input.visibleInUsgGallery === 'boolean' ? input.visibleInUsgGallery : current.visibleInUsgGallery;

    if (input.makePrimary) {
      await db.transaction(async (tx) => {
        await tx.update(dogMedia).set({ isPrimary: false }).where(eq(dogMedia.dogId, input.dogId));
        await tx
          .update(dogMedia)
          .set({
            isPrimary: true,
            visibleInRegistry: true,
            visibleInUsgGallery,
          })
          .where(eq(dogMedia.id, input.mediaId));
        await tx
          .update(dogs)
          .set({
            mainImageUrl: current.publicUrl,
            updatedAt: new Date(),
          })
          .where(eq(dogs.id, input.dogId));
      });
    } else {
      await db
        .update(dogMedia)
        .set({
          visibleInRegistry,
          visibleInUsgGallery,
        })
        .where(eq(dogMedia.id, input.mediaId));
    }

    await syncRegistryHeroImage(db, input.dogId);

    const updatedRows = await db.select().from(dogMedia).where(eq(dogMedia.id, input.mediaId)).limit(1);
    const registryRows = await db
      .select({ publicSlug: registryEntries.publicSlug })
      .from(registryEntries)
      .where(eq(registryEntries.dogId, input.dogId))
      .limit(1);
    const certificateRows = await db
      .select({
        verificationSlug: certificates.verificationSlug,
        certificateCode: certificates.certificateCode,
      })
      .from(certificates)
      .where(and(eq(certificates.dogId, input.dogId), eq(certificates.status, 'active')))
      .limit(1);

    const media = updatedRows[0] ?? null;

    if (!media) {
      throw new Error('MEDIA_NOT_FOUND');
    }

    return {
      dogId: input.dogId,
      mediaId: input.mediaId,
      media: mapDogMediaRow(media),
      publicSlug: registryRows[0]?.publicSlug ?? null,
      verificationSlug: certificateRows[0]?.verificationSlug ?? null,
      certificateCode: certificateRows[0]?.certificateCode ?? null,
    };
  }

  async revokeCertificate(reviewerProfileId: string, dogId: string): Promise<RevokeCertificateResult> {
    const db = getDb();
    await ensureOwnerProfile(db, reviewerProfileId);

    const existingCertificateRows = await db
      .select()
      .from(certificates)
      .where(and(eq(certificates.dogId, dogId), eq(certificates.status, 'active')))
      .orderBy(desc(certificates.createdAt))
      .limit(1);
    const existingCertificate = existingCertificateRows[0] ?? null;

    if (!existingCertificate) {
      throw new Error(`Active certificate for dog ${dogId} was not found.`);
    }

    const revokedAt = new Date();

    await db
      .update(certificates)
      .set({
        status: 'revoked',
      })
      .where(eq(certificates.id, existingCertificate.id));

    await db
      .update(dogAdminAssessments)
      .set({
        certificateDecision: 'usg_candidate',
        updatedAt: revokedAt,
      })
      .where(and(eq(dogAdminAssessments.dogId, dogId), eq(dogAdminAssessments.certificateDecision, 'usg_certified')));

    await logSubmissionReviewForDog(
      db,
      dogId,
      reviewerProfileId,
      'certificate_revoked',
      'USG certificate revoked by admin action.',
      revokedAt,
    );

    return {
      dogId,
      status: 'revoked',
      revokedAt: revokedAt.toISOString(),
    };
  }

  async listPublishedRegistryEntries(): Promise<PublicRegistryDocument> {
    const db = getDb();
    const rows = await db
      .select({
        dog: dogs,
        registryEntry: registryEntries,
        ownerProfile: profiles,
        certificate: certificates,
      })
      .from(registryEntries)
      .innerJoin(dogs, eq(registryEntries.dogId, dogs.id))
      .innerJoin(profiles, eq(dogs.ownerProfileId, profiles.id))
      .leftJoin(certificates, and(eq(certificates.dogId, dogs.id), eq(certificates.status, 'active')))
      .where(and(eq(registryEntries.isActive, true), eq(dogs.lifecycleStatus, 'published')))
      .orderBy(desc(registryEntries.publishedAt), desc(dogs.updatedAt));

    const entriesWithMedia = await attachRegistryMedia(db, rows.map(mapPublicRegistryRow));
    const entriesWithRatings = await attachRegistryCommunityRatings(db, entriesWithMedia);
    const entries = await attachRegistryAdminAssessments(db, entriesWithRatings);

    return {
      entries,
      total: entries.length,
    };
  }

  async listUsgGalleryEntries(): Promise<PublicUsgGalleryDocument> {
    const db = getDb();
    const rows = await db
      .select({
        dog: dogs,
        registryEntry: registryEntries,
        ownerProfile: profiles,
        certificate: certificates,
      })
      .from(registryEntries)
      .innerJoin(dogs, eq(registryEntries.dogId, dogs.id))
      .innerJoin(profiles, eq(dogs.ownerProfileId, profiles.id))
      .innerJoin(certificates, and(eq(certificates.dogId, dogs.id), eq(certificates.status, 'active')))
      .where(and(eq(registryEntries.isActive, true), eq(dogs.lifecycleStatus, 'published')))
      .orderBy(desc(registryEntries.publishedAt), desc(dogs.updatedAt));

    const entriesWithMedia = await attachUsgGalleryMedia(db, rows.map(mapPublicRegistryRow));
    const entriesWithRatings = await attachRegistryCommunityRatings(db, entriesWithMedia);
    const entriesWithAssessments = await attachRegistryAdminAssessments(db, entriesWithRatings);
    const entries = entriesWithAssessments.filter((entry) => entry.galleryImages.length > 0);

    return {
      entries,
      total: entries.length,
    };
  }


  async listUsgCertifiedEntries(): Promise<PublicUsgCertifiedDocument> {
    const db = getDb();
    const rows = await db
      .select({
        dog: dogs,
        registryEntry: registryEntries,
        ownerProfile: profiles,
        certificate: certificates,
      })
      .from(registryEntries)
      .innerJoin(dogs, eq(registryEntries.dogId, dogs.id))
      .innerJoin(profiles, eq(dogs.ownerProfileId, profiles.id))
      .innerJoin(certificates, and(eq(certificates.dogId, dogs.id), eq(certificates.status, 'active')))
      .where(and(eq(registryEntries.isActive, true), eq(dogs.lifecycleStatus, 'published')))
      .orderBy(desc(certificates.createdAt), desc(registryEntries.publishedAt));

    const entriesWithMedia = await attachRegistryMedia(db, rows.map(mapPublicRegistryRow));
    const entriesWithRatings = await attachRegistryCommunityRatings(db, entriesWithMedia);
    const entries = await attachRegistryAdminAssessments(db, entriesWithRatings);

    return {
      entries,
      total: entries.length,
    };
  }

  async getPublishedRegistryEntryBySlug(slug: string, viewerProfileId?: string | null): Promise<PublicRegistryProfileDocument | null> {
    const db = getDb();
    const slugCandidates = buildRegistrySlugCandidates(slug);
    const rows = await db
      .select({
        dog: dogs,
        registryEntry: registryEntries,
        ownerProfile: profiles,
        certificate: certificates,
      })
      .from(registryEntries)
      .innerJoin(dogs, eq(registryEntries.dogId, dogs.id))
      .innerJoin(profiles, eq(dogs.ownerProfileId, profiles.id))
      .leftJoin(certificates, and(eq(certificates.dogId, dogs.id), eq(certificates.status, 'active')))
      .where(
        and(
          or(inArray(registryEntries.publicSlug, slugCandidates), inArray(dogs.slug, slugCandidates)),
          eq(registryEntries.isActive, true),
          eq(dogs.lifecycleStatus, 'published'),
        ),
      )
      .limit(1);

    if (!rows[0]) {
      return null;
    }

    const [entryWithMedia] = await attachRegistryMedia(db, [mapPublicRegistryRow(rows[0])]);
    const [entryWithRatings] = await attachRegistryCommunityRatings(db, [entryWithMedia]);
    const [entry] = await attachRegistryAdminAssessments(db, [entryWithRatings]);
    const userRating = await getViewerRegistryRating(db, entry.entryId, viewerProfileId);

    return {
      entry,
      communityVote: buildVoteState(viewerProfileId, entry.owner.profileId, userRating),
    };
  }

  async getVerificationDocumentByCode(code: string): Promise<VerificationDocument | null> {
    const db = getDb();
    const normalizedCode = code.trim();
    const normalizedLookup = normalizeLookupValue(code);

    const rows = await db
      .select({
        dog: dogs,
        registryEntry: registryEntries,
        ownerProfile: profiles,
        certificate: certificates,
      })
      .from(certificates)
      .innerJoin(dogs, eq(certificates.dogId, dogs.id))
      .innerJoin(registryEntries, eq(registryEntries.dogId, dogs.id))
      .innerJoin(profiles, eq(dogs.ownerProfileId, profiles.id))
      .where(
        and(
          eq(registryEntries.isActive, true),
          eq(dogs.lifecycleStatus, 'published'),
          eq(certificates.status, 'active'),
          or(eq(certificates.certificateCode, normalizedCode), eq(certificates.verificationSlug, normalizedLookup)),
        ),
      )
      .limit(1);

    if (!rows[0]) {
      return null;
    }

    const [entryWithMedia] = await attachRegistryMedia(db, [mapPublicRegistryRow(rows[0])]);
    const [entryWithRatings] = await attachRegistryCommunityRatings(db, [entryWithMedia]);
    const [entry] = await attachRegistryAdminAssessments(db, [entryWithRatings]);

    return { entry };
  }

  async submitRegistryEntryRating(voterProfileId: string, registryEntryId: string, rating: number): Promise<void> {
    const db = getDb();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('INVALID_RATING');
    }

    const targetRows = await db
      .select({
        registryEntryId: registryEntries.id,
        ownerProfileId: dogs.ownerProfileId,
      })
      .from(registryEntries)
      .innerJoin(dogs, eq(registryEntries.dogId, dogs.id))
      .where(and(eq(registryEntries.id, registryEntryId), eq(registryEntries.isActive, true), eq(dogs.lifecycleStatus, 'published')))
      .limit(1);

    const target = targetRows[0];

    if (!target) {
      throw new Error('REGISTRY_ENTRY_NOT_FOUND');
    }

    if (target.ownerProfileId === voterProfileId) {
      throw new Error('OWN_ENTRY_NOT_ALLOWED');
    }

    const timestamp = new Date();

    await db
      .insert(registryEntryRatings)
      .values({
        registryEntryId,
        voterProfileId,
        rating,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .onConflictDoUpdate({
        target: [registryEntryRatings.registryEntryId, registryEntryRatings.voterProfileId],
        set: {
          rating,
          updatedAt: timestamp,
        },
      });
  }
}

export function createMyDogsRepository(): MyDogsRepository {
  return new DrizzleMyDogsRepository();
}
