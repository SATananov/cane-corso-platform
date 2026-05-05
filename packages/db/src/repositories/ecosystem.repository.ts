import { and, desc, eq, ne } from 'drizzle-orm';
import type {
  EcosystemDirectoryDocument,
  EcosystemListing,
  EcosystemListingStatus,
  EcosystemListingType,
  EcosystemModerationDocument,
  EcosystemModerationItem,
  EcosystemOwnerWorkspaceDocument,
  EcosystemProfileDocument,
  EcosystemReviewDecision,
  EcosystemSubmissionChannel,
  UpsertEcosystemListingInput,
} from '@cane-corso-platform/contracts';
import {
  isEcosystemSubmissionChannel,
  isListingTypeAllowedForEcosystemChannel,
  resolveDefaultEcosystemSubmissionChannel,
} from '@cane-corso-platform/contracts';
import { getDb, type CaneCorsoDb } from '../client';
import { ecosystemListings, ecosystemReviews, profiles, users } from '../schema';

export interface EcosystemRepository {
  listOwnerWorkspace(ownerProfileId: string): Promise<EcosystemOwnerWorkspaceDocument>;
  saveOwnerDraft(ownerProfileId: string, input: UpsertEcosystemListingInput): Promise<EcosystemListing>;
  submitOwnerListing(ownerProfileId: string, input: UpsertEcosystemListingInput): Promise<EcosystemListing>;
  listPublishedDirectory(): Promise<EcosystemDirectoryDocument>;
  getPublishedListingBySlug(slug: string): Promise<EcosystemProfileDocument | null>;
  listModerationQueue(): Promise<EcosystemModerationDocument>;
  reviewListing(
    reviewerProfileId: string,
    input: { listingId: string; decision: EcosystemReviewDecision; note?: string | null },
  ): Promise<EcosystemListing>;
  publishListing(reviewerProfileId: string, listingId: string): Promise<EcosystemListing>;
}

type ListingRow = typeof ecosystemListings.$inferSelect;
type ModerationRow = {
  listing: typeof ecosystemListings.$inferSelect;
  ownerProfile: typeof profiles.$inferSelect;
  ownerUser: typeof users.$inferSelect;
};

const VALID_TYPES: EcosystemListingType[] = [
  'partner_service',
  'transport_relocation',
  'hotel_boarding',
  'walk_play_place',
  'pet_friendly_place',
  'puppy_listing',
  'adoption_new_home',
  'breeding_match',
  'event',
];

function isValidType(value: string): value is EcosystemListingType {
  return VALID_TYPES.includes(value as EcosystemListingType);
}

function toIsoDateTime(value: string | Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.toISOString();
}

function normalizeText(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80) || `listing-${Date.now()}`;
}

function countByChannel(items: EcosystemListing[], channel: EcosystemSubmissionChannel) {
  return items.filter((item) => item.submissionChannel === channel).length;
}

function mapListingRow(row: ListingRow): EcosystemListing {
  return {
    id: row.id,
    ownerProfileId: row.ownerProfileId,
    listingType: row.listingType as EcosystemListingType,
    submissionChannel: row.submissionChannel as EcosystemSubmissionChannel,
    title: row.title,
    slug: row.slug,
    category: row.category,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    country: row.country,
    city: row.city,
    websiteUrl: row.websiteUrl,
    phone: row.phone,
    email: row.email,
    coverageNote: row.coverageNote,
    rulesNote: row.rulesNote,
    logoUrl: row.logoUrl,
    coverImageUrl: row.coverImageUrl,
    status: row.status as EcosystemListingStatus,
    isFeatured: row.isFeatured,
    submittedAt: toIsoDateTime(row.submittedAt),
    reviewedAt: toIsoDateTime(row.reviewedAt),
    publishedAt: toIsoDateTime(row.publishedAt),
    reviewNote: row.reviewNote,
    createdAt: toIsoDateTime(row.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIsoDateTime(row.updatedAt) ?? new Date(0).toISOString(),
  };
}

function mapModerationItem(row: ModerationRow): EcosystemModerationItem {
  return {
    listing: mapListingRow(row.listing),
    owner: {
      profileId: row.ownerProfile.id,
      displayName: row.ownerProfile.displayName,
      email: row.ownerUser.email,
      city: row.ownerProfile.city,
      country: row.ownerProfile.country,
    },
  };
}

async function ensureOwnerProfile(db: CaneCorsoDb, ownerProfileId: string): Promise<void> {
  const existingProfile = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.id, ownerProfileId)).limit(1);
  if (!existingProfile[0]) {
    throw new Error(`Owner profile ${ownerProfileId} was not found.`);
  }
}

async function resolveUniqueSlug(
  db: CaneCorsoDb,
  desiredSlug: string,
  currentListingId?: string | null,
): Promise<string> {
  const normalizedBase = desiredSlug.trim() || `listing-${Date.now()}`;
  let candidate = normalizedBase;
  let counter = 2;

  while (true) {
    const existing = await db
      .select({ id: ecosystemListings.id })
      .from(ecosystemListings)
      .where(eq(ecosystemListings.slug, candidate))
      .limit(1);

    if (!existing[0] || existing[0].id === currentListingId) {
      return candidate;
    }

    candidate = `${normalizedBase}-${counter}`;
    counter += 1;
  }
}

function normalizeInput(input: UpsertEcosystemListingInput) {
  const listingType = normalizeText(input.listingType) ?? '';
  const title = normalizeText(input.title) ?? '';
  const slugCandidate = normalizeText(input.slug) ?? title;

  if (!isValidType(listingType)) {
    throw new Error('Listing type is required.');
  }

  if (title.length < 3) {
    throw new Error('Listing title must contain at least 3 characters.');
  }

  const normalizedSubmissionChannel = normalizeText(input.submissionChannel ?? null);
  const submissionChannel =
    normalizedSubmissionChannel && isEcosystemSubmissionChannel(normalizedSubmissionChannel)
      ? normalizedSubmissionChannel
      : resolveDefaultEcosystemSubmissionChannel(listingType);

  if (!isListingTypeAllowedForEcosystemChannel(listingType, submissionChannel)) {
    throw new Error('Selected submission path is not allowed for this ecosystem layer.');
  }

  return {
    listingId: normalizeText(input.listingId ?? null),
    listingType,
    submissionChannel,
    title,
    slug: slugify(slugCandidate),
    category: normalizeText(input.category),
    shortDescription: normalizeText(input.shortDescription),
    longDescription: normalizeText(input.longDescription),
    country: normalizeText(input.country),
    city: normalizeText(input.city),
    websiteUrl: normalizeText(input.websiteUrl),
    phone: normalizeText(input.phone),
    email: normalizeText(input.email),
    coverageNote: normalizeText(input.coverageNote),
    rulesNote: normalizeText(input.rulesNote),
    logoUrl: normalizeText(input.logoUrl),
    coverImageUrl: normalizeText(input.coverImageUrl),
  };
}

async function upsertOwnerListing(
  db: CaneCorsoDb,
  ownerProfileId: string,
  input: UpsertEcosystemListingInput,
  mode: 'draft' | 'submit',
): Promise<EcosystemListing> {
  await ensureOwnerProfile(db, ownerProfileId);
  const normalized = normalizeInput(input);
  const now = new Date();

  if (normalized.listingId) {
    const currentRows = await db
      .select()
      .from(ecosystemListings)
      .where(eq(ecosystemListings.id, normalized.listingId))
      .limit(1);

    const current = currentRows[0];

    if (!current || current.ownerProfileId !== ownerProfileId) {
      throw new Error('Listing not found for the current member.');
    }

    if (current.status !== 'draft' && current.status !== 'needs_changes') {
      throw new Error('Only drafts and listings returned for changes can be edited by the owner.');
    }

    const slug = await resolveUniqueSlug(db, normalized.slug, current.id);
    const nextStatus: EcosystemListingStatus = mode === 'submit' ? 'pending_review' : 'draft';

    const updatedRows = await db
      .update(ecosystemListings)
      .set({
        listingType: normalized.listingType,
        submissionChannel: normalized.submissionChannel,
        title: normalized.title,
        slug,
        category: normalized.category,
        shortDescription: normalized.shortDescription,
        longDescription: normalized.longDescription,
        country: normalized.country,
        city: normalized.city,
        websiteUrl: normalized.websiteUrl,
        phone: normalized.phone,
        email: normalized.email,
        coverageNote: normalized.coverageNote,
        rulesNote: normalized.rulesNote,
        logoUrl: normalized.logoUrl,
        coverImageUrl: normalized.coverImageUrl,
        status: nextStatus,
        submittedAt: mode === 'submit' ? now : current.submittedAt,
        reviewedAt: mode === 'submit' ? null : current.reviewedAt,
        reviewNote: mode === 'submit' ? null : current.reviewNote,
        publishedAt: mode === 'submit' ? null : current.publishedAt,
        updatedAt: now,
      })
      .where(eq(ecosystemListings.id, current.id))
      .returning();

    return mapListingRow(updatedRows[0]);
  }

  const slug = await resolveUniqueSlug(db, normalized.slug);
  const insertedRows = await db
    .insert(ecosystemListings)
    .values({
      ownerProfileId,
      listingType: normalized.listingType,
      submissionChannel: normalized.submissionChannel,
      title: normalized.title,
      slug,
      category: normalized.category,
      shortDescription: normalized.shortDescription,
      longDescription: normalized.longDescription,
      country: normalized.country,
      city: normalized.city,
      websiteUrl: normalized.websiteUrl,
      phone: normalized.phone,
      email: normalized.email,
      coverageNote: normalized.coverageNote,
      rulesNote: normalized.rulesNote,
      logoUrl: normalized.logoUrl,
      coverImageUrl: normalized.coverImageUrl,
      status: mode === 'submit' ? 'pending_review' : 'draft',
      submittedAt: mode === 'submit' ? now : null,
    })
    .returning();

  return mapListingRow(insertedRows[0]);
}

class DrizzleEcosystemRepository implements EcosystemRepository {
  async listOwnerWorkspace(ownerProfileId: string): Promise<EcosystemOwnerWorkspaceDocument> {
    const db = getDb();
    const rows = await db
      .select()
      .from(ecosystemListings)
      .where(eq(ecosystemListings.ownerProfileId, ownerProfileId))
      .orderBy(desc(ecosystemListings.updatedAt));

    const items = rows.map(mapListingRow);

    return {
      summary: {
        total: items.length,
        drafts: items.filter((item: EcosystemListing) => item.status === 'draft').length,
        pendingReview: items.filter((item: EcosystemListing) => item.status === 'pending_review').length,
        needsChanges: items.filter((item: EcosystemListing) => item.status === 'needs_changes').length,
        approved: items.filter((item: EcosystemListing) => item.status === 'approved').length,
        published: items.filter((item: EcosystemListing) => item.status === 'published').length,
        officialListings: countByChannel(items, 'official_listing'),
        communityListings: countByChannel(items, 'community_listing'),
        suggestions: countByChannel(items, 'community_suggestion'),
      },
      items,
    };
  }

  async saveOwnerDraft(ownerProfileId: string, input: UpsertEcosystemListingInput): Promise<EcosystemListing> {
    const db = getDb();
    return upsertOwnerListing(db, ownerProfileId, input, 'draft');
  }

  async submitOwnerListing(ownerProfileId: string, input: UpsertEcosystemListingInput): Promise<EcosystemListing> {
    const db = getDb();
    return upsertOwnerListing(db, ownerProfileId, input, 'submit');
  }

  async listPublishedDirectory(): Promise<EcosystemDirectoryDocument> {
    const db = getDb();
    const rows = await db
      .select()
      .from(ecosystemListings)
      .where(and(eq(ecosystemListings.status, 'published'), ne(ecosystemListings.submissionChannel, 'community_suggestion')))
      .orderBy(desc(ecosystemListings.isFeatured), desc(ecosystemListings.publishedAt), desc(ecosystemListings.updatedAt));

    const items = rows.map(mapListingRow);
    const countries = new Set(items.map((item: EcosystemListing) => item.country).filter(Boolean));

    return {
      summary: {
        total: items.length,
        countries: countries.size,
        featured: items.filter((item: EcosystemListing) => item.isFeatured).length,
        listingTypes: new Set(items.map((item: EcosystemListing) => item.listingType)).size,
        officialPublished: countByChannel(items, 'official_listing'),
        communityPublished: countByChannel(items, 'community_listing'),
      },
      items,
    };
  }

  async getPublishedListingBySlug(slug: string): Promise<EcosystemProfileDocument | null> {
    const normalizedSlug = normalizeText(slug);

    if (!normalizedSlug) {
      return null;
    }

    const db = getDb();
    const rows = await db
      .select()
      .from(ecosystemListings)
      .where(
        and(
          eq(ecosystemListings.slug, normalizedSlug),
          eq(ecosystemListings.status, 'published'),
          ne(ecosystemListings.submissionChannel, 'community_suggestion'),
        ),
      )
      .limit(1);

    const listing = rows[0];

    return listing ? { listing: mapListingRow(listing) } : null;
  }

  async listModerationQueue(): Promise<EcosystemModerationDocument> {
    const db = getDb();
    const rows = await db
      .select({
        listing: ecosystemListings,
        ownerProfile: profiles,
        ownerUser: users,
      })
      .from(ecosystemListings)
      .innerJoin(profiles, eq(ecosystemListings.ownerProfileId, profiles.id))
      .innerJoin(users, eq(profiles.userId, users.id))
      .orderBy(desc(ecosystemListings.updatedAt));

    const items = rows.map(mapModerationItem);

    return {
      summary: {
        total: items.length,
        pendingReview: items.filter((item: EcosystemModerationItem) => item.listing.status === 'pending_review').length,
        needsChanges: items.filter((item: EcosystemModerationItem) => item.listing.status === 'needs_changes').length,
        approved: items.filter((item: EcosystemModerationItem) => item.listing.status === 'approved').length,
        published: items.filter((item: EcosystemModerationItem) => item.listing.status === 'published').length,
        officialListings: items.filter((item: EcosystemModerationItem) => item.listing.submissionChannel === 'official_listing').length,
        communityListings: items.filter((item: EcosystemModerationItem) => item.listing.submissionChannel === 'community_listing').length,
        suggestions: items.filter((item: EcosystemModerationItem) => item.listing.submissionChannel === 'community_suggestion').length,
      },
      items,
    };
  }

  async reviewListing(
    reviewerProfileId: string,
    input: { listingId: string; decision: EcosystemReviewDecision; note?: string | null },
  ): Promise<EcosystemListing> {
    const db = getDb();
    const rows = await db
      .select()
      .from(ecosystemListings)
      .where(eq(ecosystemListings.id, input.listingId))
      .limit(1);

    const current = rows[0];
    if (!current) {
      throw new Error('Listing was not found.');
    }

    const nextStatus: EcosystemListingStatus = input.decision === 'approve' ? 'approved' : 'needs_changes';
    const note =
      normalizeText(input.note) ??
      (input.decision === 'approve'
        ? current.submissionChannel === 'community_suggestion'
          ? 'Approved as an internal community suggestion.'
          : 'Approved for publication.'
        : 'Changes requested before publication.');
    const now = new Date();

    const updatedRows = await db
      .update(ecosystemListings)
      .set({
        status: nextStatus,
        reviewedAt: now,
        reviewNote: note,
        updatedAt: now,
      })
      .where(eq(ecosystemListings.id, current.id))
      .returning();

    await db.insert(ecosystemReviews).values({
      listingId: current.id,
      reviewerProfileId,
      decision: input.decision,
      note,
      createdAt: now,
    });

    return mapListingRow(updatedRows[0]);
  }

  async publishListing(reviewerProfileId: string, listingId: string): Promise<EcosystemListing> {
    const db = getDb();
    const rows = await db
      .select()
      .from(ecosystemListings)
      .where(eq(ecosystemListings.id, listingId))
      .limit(1);

    const current = rows[0];
    if (!current) {
      throw new Error('Listing was not found.');
    }

    if (current.submissionChannel === 'community_suggestion') {
      throw new Error('Community suggestions stay internal until an admin converts them into a real listing.');
    }

    if (current.status !== 'approved' && current.status !== 'published') {
      throw new Error('Only approved listings can be published.');
    }

    const now = new Date();

    const updatedRows = await db
      .update(ecosystemListings)
      .set({
        status: 'published',
        reviewedAt: now,
        publishedAt: current.publishedAt ?? now,
        reviewNote:
          current.reviewNote ??
          (current.submissionChannel === 'official_listing'
            ? 'Published as an official ecosystem listing.'
            : 'Published as a community ecosystem listing.'),
        updatedAt: now,
      })
      .where(eq(ecosystemListings.id, current.id))
      .returning();

    await db.insert(ecosystemReviews).values({
      listingId: current.id,
      reviewerProfileId,
      decision: 'publish',
      note:
        current.submissionChannel === 'official_listing'
          ? 'Published as an official ecosystem listing.'
          : 'Published as a community ecosystem listing.',
      createdAt: now,
    });

    return mapListingRow(updatedRows[0]);
  }
}

export function createEcosystemRepository(): EcosystemRepository {
  return new DrizzleEcosystemRepository();
}
