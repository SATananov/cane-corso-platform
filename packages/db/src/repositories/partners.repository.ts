import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import type {
  CommunityRatingSummary,
  CommunityVoteState,
  Partner,
  PartnerApplicationDraftInput,
  PartnerDirectoryDocument,
  PartnerDirectoryEntry,
  PartnerModerationApplicationItem,
  PartnerModerationDocument,
  PartnerProfileDocument,
  PartnerWorkspaceDocument,
  ReviewPartnerApplicationInput,
  ReviewPartnerApplicationResult,
  SubmitPartnerApplicationInput,
  SubmitPartnerApplicationResult,
  UpdatePartnerAdminStateInput,
  UpdatePartnerAdminStateResult,
} from '@cane-corso-platform/contracts';
import { getDb, type CaneCorsoDb } from '../client';
import { auditLogs, ecosystemListings, partnerApplications, partnerRatings, partners, profiles, users } from '../schema';

export interface ListPartnerDirectoryOptions {
  category?: string | null;
}

export interface PartnersRepository {
  listPublicDirectory(options?: ListPartnerDirectoryOptions): Promise<PartnerDirectoryDocument>;
  getPublicPartnerProfile(slug: string, viewerProfileId?: string | null): Promise<PartnerProfileDocument | null>;
  submitPartnerRating(voterProfileId: string, partnerId: string, rating: number): Promise<void>;
  listModerationDocument(): Promise<PartnerModerationDocument>;
  listWorkspaceDocument(ownerProfileId: string): Promise<PartnerWorkspaceDocument>;
  submitApplication(
    ownerProfileId: string,
    input: SubmitPartnerApplicationInput,
  ): Promise<SubmitPartnerApplicationResult>;
  reviewApplication(
    reviewerProfileId: string,
    input: ReviewPartnerApplicationInput,
  ): Promise<ReviewPartnerApplicationResult>;
  updateAdminState(
    reviewerProfileId: string,
    input: UpdatePartnerAdminStateInput,
  ): Promise<UpdatePartnerAdminStateResult>;
}

type PartnerRow = typeof partners.$inferSelect;
type PartnerApplicationRow = typeof partnerApplications.$inferSelect;
type ProfileRow = typeof profiles.$inferSelect;
type UserRow = typeof users.$inferSelect;

type PartnerJoinRow = {
  partner: PartnerRow;
  ownerProfile: ProfileRow;
};

type PartnerApplicationJoinRow = {
  application: PartnerApplicationRow;
  applicantProfile: ProfileRow;
  applicantUser: UserRow;
};

function toIsoDateTime(value: string | Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.toISOString();
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80) || `partner-${Date.now()}`;
}

function normalizeComparableValue(value: string): string {
  return value.trim().toLowerCase();
}

function summarizeMessage(message: string | null | undefined): string | null {
  const normalized = message?.trim();

  if (!normalized) {
    return null;
  }

  return normalized.length > 180 ? `${normalized.slice(0, 177).trimEnd()}...` : normalized;
}

type PartnerServiceEcosystemSyncInput = {
  ownerProfileId: string;
  businessName: string;
  slug: string;
  category: string;
  shortDescription: string | null;
  longDescription: string | null;
  country: string | null;
  city: string | null;
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  status: Partner['status'];
  isFeatured: boolean;
  publishedAt: string | Date | null;
  updatedAt: Date;
};

function buildPartnerServiceCoverageNote(status: Partner['status']): string {
  return status === 'approved'
    ? 'Official Partner / Services profile approved for the Cane Corso ecosystem.'
    : 'Partner / Services profile is currently not publicly visible in the ecosystem.';
}

async function syncPartnerServiceEcosystemListing(
  db: CaneCorsoDb,
  input: PartnerServiceEcosystemSyncInput,
): Promise<void> {
  const ecosystemSlug = `partner-service-${input.slug}`;
  const publicStatus = input.status === 'approved' ? 'published' : 'needs_changes';
  const existingRows = await db
    .select({ id: ecosystemListings.id })
    .from(ecosystemListings)
    .where(eq(ecosystemListings.slug, ecosystemSlug))
    .limit(1);

  const values = {
    ownerProfileId: input.ownerProfileId,
    listingType: 'partner_service',
    submissionChannel: 'official_listing',
    title: input.businessName,
    slug: ecosystemSlug,
    category: input.category,
    shortDescription: input.shortDescription,
    longDescription: input.longDescription,
    country: input.country,
    city: input.city,
    websiteUrl: input.websiteUrl,
    phone: input.phone,
    email: input.email,
    coverageNote: buildPartnerServiceCoverageNote(input.status),
    rulesNote: 'Visible after administrator approval. Community ratings remain separate from official approval.',
    logoUrl: input.logoUrl,
    coverImageUrl: input.coverImageUrl,
    status: publicStatus,
    isFeatured: input.isFeatured,
    submittedAt: input.publishedAt ? new Date(input.publishedAt) : input.updatedAt,
    reviewedAt: input.updatedAt,
    publishedAt: input.status === 'approved' ? input.publishedAt ? new Date(input.publishedAt) : input.updatedAt : null,
    reviewNote:
      input.status === 'approved'
        ? 'Synced from approved Partner / Services application.'
        : 'Synced from Partner / Services admin state.',
    updatedAt: input.updatedAt,
  } as const;

  const existing = existingRows[0];

  if (existing) {
    await db.update(ecosystemListings).set(values).where(eq(ecosystemListings.id, existing.id));
    return;
  }

  await db.insert(ecosystemListings).values({
    ...values,
    createdAt: input.updatedAt,
  });
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function mapPartnerRow(row: PartnerRow): Partner {
  return {
    id: row.id,
    ownerProfileId: row.ownerProfileId,
    businessName: row.businessName,
    slug: row.slug,
    category: row.category,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    country: row.country,
    city: row.city,
    websiteUrl: row.websiteUrl,
    phone: row.phone,
    email: row.email,
    logoUrl: row.logoUrl,
    coverImageUrl: row.coverImageUrl,
    status: row.status as Partner['status'],
    isFeatured: row.isFeatured,
    publishedAt: toIsoDateTime(row.publishedAt),
    createdAt: toIsoDateTime(row.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIsoDateTime(row.updatedAt) ?? new Date(0).toISOString(),
  };
}

function mapDirectoryEntry(row: PartnerJoinRow): PartnerDirectoryEntry {
  return {
    ...mapPartnerRow(row.partner),
    owner: {
      profileId: row.ownerProfile.id,
      displayName: row.ownerProfile.displayName,
      city: row.ownerProfile.city,
      country: row.ownerProfile.country,
    },
    communityRating: buildPartnerCommunitySummary(0, null),
  };
}

function computePartnerCommunityBadge(totalRatings: number, averageRating: number | null): CommunityRatingSummary['badge'] {
  if (!averageRating || totalRatings < 3) {
    return null;
  }

  return averageRating >= 4.6 ? 'top_partner' : null;
}

function buildPartnerCommunitySummary(totalRatings: number, averageRating: number | string | null): CommunityRatingSummary {
  const normalizedAverage = averageRating == null ? null : Number(averageRating);

  return {
    averageRating: normalizedAverage != null && Number.isFinite(normalizedAverage) ? Number(normalizedAverage.toFixed(1)) : null,
    totalRatings,
    badge: computePartnerCommunityBadge(totalRatings, normalizedAverage),
  };
}

function buildPartnerVoteState(viewerProfileId: string | null | undefined, ownerProfileId: string, userRating: number | null): CommunityVoteState {
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

async function attachPartnerCommunityRatings(db: ReturnType<typeof getDb>, entries: PartnerDirectoryEntry[]): Promise<PartnerDirectoryEntry[]> {
  if (entries.length === 0) {
    return entries;
  }

  const partnerIds = entries.map((entry) => entry.id);
  const summaryRows = await db
    .select({
      partnerId: partnerRatings.partnerId,
      averageRating: sql<number | null>`avg(${partnerRatings.rating})::numeric`,
      totalRatings: sql<number>`count(*)::int`,
    })
    .from(partnerRatings)
    .where(inArray(partnerRatings.partnerId, partnerIds))
    .groupBy(partnerRatings.partnerId);

  const summaryByPartnerId = new Map(
    summaryRows.map((row) => [row.partnerId, buildPartnerCommunitySummary(row.totalRatings, row.averageRating ?? null)]),
  );

  return entries.map((entry) => ({
    ...entry,
    communityRating: summaryByPartnerId.get(entry.id) ?? buildPartnerCommunitySummary(0, null),
  }));
}

async function getViewerPartnerRating(db: ReturnType<typeof getDb>, partnerId: string, viewerProfileId: string | null | undefined): Promise<number | null> {
  if (!viewerProfileId) {
    return null;
  }

  const rows = await db
    .select({ rating: partnerRatings.rating })
    .from(partnerRatings)
    .where(and(eq(partnerRatings.partnerId, partnerId), eq(partnerRatings.voterProfileId, viewerProfileId)))
    .limit(1);

  return rows[0]?.rating ?? null;
}

function mapApplicationDraft(row: PartnerApplicationRow): PartnerApplicationDraftInput {
  return {
    businessName: row.businessName,
    category: row.category,
    shortDescription: row.shortDescription ?? '',
    longDescription: row.longDescription ?? '',
    country: row.country,
    city: row.city,
    websiteUrl: row.websiteUrl,
    logoUrl: row.logoUrl,
    coverImageUrl: row.coverImageUrl,
    message: row.message,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
  };
}

function mapModerationApplication(row: PartnerApplicationJoinRow): PartnerModerationApplicationItem {
  return {
    applicationId: row.application.id,
    ...mapApplicationDraft(row.application),
    status: row.application.status as PartnerModerationApplicationItem['status'],
    submittedAt: toIsoDateTime(row.application.submittedAt) ?? new Date(0).toISOString(),
    reviewedAt: toIsoDateTime(row.application.reviewedAt),
    reviewNote: row.application.reviewNote,
    applicant: {
      profileId: row.applicantProfile.id,
      displayName: row.applicantProfile.displayName,
      email: row.applicantUser.email,
      city: row.applicantProfile.city,
      country: row.applicantProfile.country,
    },
  };
}

async function resolveUniquePartnerSlug(desiredSlug: string, currentPartnerId?: string | null): Promise<string> {
  const db = getDb();
  const normalizedBase = desiredSlug.trim() || `partner-${Date.now()}`;
  let candidate = normalizedBase;
  let counter = 2;

  while (true) {
    const existing = await db
      .select({ id: partners.id })
      .from(partners)
      .where(eq(partners.slug, candidate))
      .limit(1);

    if (!existing[0] || existing[0].id === currentPartnerId) {
      return candidate;
    }

    candidate = `${normalizedBase}-${counter}`;
    counter += 1;
  }
}

async function writeAuditLog(actorProfileId: string, entityType: string, entityId: string, action: string, metadata: Record<string, unknown>) {
  const db = getDb();

  await db.insert(auditLogs).values({
    actorProfileId,
    entityType,
    entityId,
    action,
    metadataJson: metadata,
  });
}

function createEmptyDraft(email: string): PartnerApplicationDraftInput {
  return {
    businessName: '',
    category: 'veterinary_clinic',
    shortDescription: '',
    longDescription: '',
    country: null,
    city: null,
    websiteUrl: null,
    logoUrl: null,
    coverImageUrl: null,
    message: null,
    contactEmail: email,
    contactPhone: null,
  };
}

function validateApplicationInput(input: SubmitPartnerApplicationInput) {
  if (!input.businessName.trim()) {
    throw new Error('Business name is required.');
  }

  if (!input.category.trim()) {
    throw new Error('Category is required.');
  }

  if (!input.shortDescription.trim()) {
    throw new Error('Short description is required.');
  }

  if (!input.longDescription.trim()) {
    throw new Error('Long description is required.');
  }

  if (!input.contactEmail.trim()) {
    throw new Error('Contact email is required.');
  }
}

class DrizzlePartnersRepository implements PartnersRepository {
  async listPublicDirectory(options?: ListPartnerDirectoryOptions): Promise<PartnerDirectoryDocument> {
    const db = getDb();
    const activeCategory = options?.category?.trim() || null;
    const rows = await db
      .select({
        partner: partners,
        ownerProfile: profiles,
      })
      .from(partners)
      .innerJoin(profiles, eq(partners.ownerProfileId, profiles.id))
      .where(eq(partners.status, 'approved'))
      .orderBy(desc(partners.isFeatured), desc(partners.publishedAt), desc(partners.createdAt));

    const allEntries = await attachPartnerCommunityRatings(db, rows.map(mapDirectoryEntry));
    const categories = Array.from(new Set(allEntries.map((entry) => entry.category).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b),
    );

    const categorySummaries = categories.map((category) => {
      const entriesForCategory = allEntries.filter((entry) => entry.category === category);

      return {
        key: category,
        total: entriesForCategory.length,
        featured: entriesForCategory.filter((entry) => entry.isFeatured).length,
      };
    });

    const normalizedActiveCategory = activeCategory && categories.includes(activeCategory) ? activeCategory : null;
    const visibleEntries = normalizedActiveCategory
      ? allEntries.filter((entry) => entry.category === normalizedActiveCategory)
      : allEntries;

    return {
      entries: visibleEntries,
      total: visibleEntries.length,
      totalAll: allEntries.length,
      featuredTotal: allEntries.filter((entry) => entry.isFeatured).length,
      activeCategory: normalizedActiveCategory,
      categories: categorySummaries,
    };
  }

  async getPublicPartnerProfile(slug: string, viewerProfileId?: string | null): Promise<PartnerProfileDocument | null> {
    const db = getDb();
    const rows = await db
      .select({
        partner: partners,
        ownerProfile: profiles,
      })
      .from(partners)
      .innerJoin(profiles, eq(partners.ownerProfileId, profiles.id))
      .where(eq(partners.slug, slug))
      .limit(1);

    const selected = rows[0];

    if (!selected || selected.partner.status !== 'approved') {
      return null;
    }

    const [entry] = await attachPartnerCommunityRatings(db, [mapDirectoryEntry(selected)]);
    const relatedRows = await db
      .select({
        partner: partners,
        ownerProfile: profiles,
      })
      .from(partners)
      .innerJoin(profiles, eq(partners.ownerProfileId, profiles.id))
      .where(eq(partners.status, 'approved'))
      .orderBy(desc(partners.isFeatured), desc(partners.publishedAt), desc(partners.createdAt));

    const relatedEntries = (await attachPartnerCommunityRatings(db, relatedRows.map(mapDirectoryEntry)))
      .filter((candidate) => candidate.id !== entry.id && candidate.category === entry.category)
      .slice(0, 3);

    const userRating = await getViewerPartnerRating(db, entry.id, viewerProfileId);

    return {
      entry,
      relatedEntries,
      communityVote: buildPartnerVoteState(viewerProfileId, entry.owner.profileId, userRating),
    };
  }

  async submitPartnerRating(voterProfileId: string, partnerId: string, rating: number): Promise<void> {
    const db = getDb();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('INVALID_RATING');
    }

    const targetRows = await db
      .select({
        partnerId: partners.id,
        ownerProfileId: partners.ownerProfileId,
      })
      .from(partners)
      .where(and(eq(partners.id, partnerId), eq(partners.status, 'approved')))
      .limit(1);

    const target = targetRows[0];

    if (!target) {
      throw new Error('PARTNER_NOT_FOUND');
    }

    if (target.ownerProfileId === voterProfileId) {
      throw new Error('OWN_ENTRY_NOT_ALLOWED');
    }

    const timestamp = new Date();

    await db
      .insert(partnerRatings)
      .values({
        partnerId,
        voterProfileId,
        rating,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .onConflictDoUpdate({
        target: [partnerRatings.partnerId, partnerRatings.voterProfileId],
        set: {
          rating,
          updatedAt: timestamp,
        },
      });
  }

  async listModerationDocument(): Promise<PartnerModerationDocument> {
    const db = getDb();

    const applicationRows = await db
      .select({
        application: partnerApplications,
        applicantProfile: profiles,
        applicantUser: users,
      })
      .from(partnerApplications)
      .innerJoin(profiles, eq(partnerApplications.applicantProfileId, profiles.id))
      .innerJoin(users, eq(profiles.userId, users.id))
      .orderBy(desc(partnerApplications.submittedAt));

    const liveRows = await db
      .select({
        partner: partners,
        ownerProfile: profiles,
      })
      .from(partners)
      .innerJoin(profiles, eq(partners.ownerProfileId, profiles.id))
      .orderBy(desc(partners.isFeatured), desc(partners.publishedAt), desc(partners.createdAt));

    const applications = applicationRows.map(mapModerationApplication);
    const liveEntries = liveRows.map(mapDirectoryEntry);

    return {
      applications,
      liveEntries,
      summary: {
        pendingApplications: applications.filter((item) => item.status === 'pending_review').length,
        approvedApplications: applications.filter((item) => item.status === 'approved').length,
        rejectedApplications: applications.filter((item) => item.status === 'rejected').length,
        approvedPartners: liveEntries.filter((entry) => entry.status === 'approved').length,
        featuredPartners: liveEntries.filter((entry) => entry.isFeatured).length,
        suspendedPartners: liveEntries.filter((entry) => entry.status === 'suspended').length,
      },
    };
  }

  async listWorkspaceDocument(ownerProfileId: string): Promise<PartnerWorkspaceDocument> {
    const db = getDb();

    const ownerRows = await db
      .select({
        profileId: profiles.id,
        displayName: profiles.displayName,
        email: users.email,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.id, ownerProfileId))
      .limit(1);

    const owner = ownerRows[0];

    if (!owner) {
      throw new Error(`Profile ${ownerProfileId} was not found.`);
    }

    const applicationRows = await db
      .select({
        application: partnerApplications,
        applicantProfile: profiles,
        applicantUser: users,
      })
      .from(partnerApplications)
      .innerJoin(profiles, eq(partnerApplications.applicantProfileId, profiles.id))
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(partnerApplications.applicantProfileId, ownerProfileId))
      .orderBy(desc(partnerApplications.submittedAt));

    const liveRows = await db
      .select({
        partner: partners,
        ownerProfile: profiles,
      })
      .from(partners)
      .innerJoin(profiles, eq(partners.ownerProfileId, profiles.id))
      .where(eq(partners.ownerProfileId, ownerProfileId))
      .orderBy(desc(partners.isFeatured), desc(partners.publishedAt), desc(partners.createdAt));

    const applications = applicationRows.map(mapModerationApplication);
    const liveEntries = liveRows.map(mapDirectoryEntry);
    const suggestedSource = applications.find((item) => item.status === 'rejected') ?? applications[0] ?? null;

    return {
      owner,
      applications,
      liveEntries,
      suggestedDraft: suggestedSource
        ? {
            businessName: suggestedSource.businessName,
            category: suggestedSource.category,
            shortDescription: suggestedSource.shortDescription,
            longDescription: suggestedSource.longDescription,
            country: suggestedSource.country,
            city: suggestedSource.city,
            websiteUrl: suggestedSource.websiteUrl,
            logoUrl: suggestedSource.logoUrl,
            coverImageUrl: suggestedSource.coverImageUrl,
            message: suggestedSource.message,
            contactEmail: suggestedSource.contactEmail,
            contactPhone: suggestedSource.contactPhone,
          }
        : createEmptyDraft(owner.email),
      summary: {
        applicationsTotal: applications.length,
        pendingApplications: applications.filter((item) => item.status === 'pending_review').length,
        approvedApplications: applications.filter((item) => item.status === 'approved').length,
        liveEntries: liveEntries.length,
        featuredEntries: liveEntries.filter((item) => item.isFeatured).length,
      },
    };
  }

  async submitApplication(
    ownerProfileId: string,
    input: SubmitPartnerApplicationInput,
  ): Promise<SubmitPartnerApplicationResult> {
    validateApplicationInput(input);

    const db = getDb();
    const submittedAt = new Date();
    const inserted = await db
      .insert(partnerApplications)
      .values({
        applicantProfileId: ownerProfileId,
        businessName: input.businessName.trim(),
        category: input.category.trim(),
        shortDescription: normalizeOptionalText(input.shortDescription),
        longDescription: normalizeOptionalText(input.longDescription),
        country: normalizeOptionalText(input.country),
        city: normalizeOptionalText(input.city),
        websiteUrl: normalizeOptionalText(input.websiteUrl),
        logoUrl: normalizeOptionalText(input.logoUrl),
        coverImageUrl: normalizeOptionalText(input.coverImageUrl),
        message: normalizeOptionalText(input.message),
        contactEmail: input.contactEmail.trim(),
        contactPhone: normalizeOptionalText(input.contactPhone),
        status: 'pending_review',
        submittedAt,
        reviewedAt: null,
        reviewNote: null,
      })
      .returning({
        id: partnerApplications.id,
        submittedAt: partnerApplications.submittedAt,
      });

    const application = inserted[0];

    if (!application) {
      throw new Error('Partner application could not be created.');
    }

    await writeAuditLog(ownerProfileId, 'partner_application', application.id, 'submit', {
      category: input.category.trim(),
      businessName: input.businessName.trim(),
    });

    return {
      applicationId: application.id,
      status: 'pending_review',
      submittedAt: toIsoDateTime(application.submittedAt) ?? submittedAt.toISOString(),
    };
  }

  async reviewApplication(
    reviewerProfileId: string,
    input: ReviewPartnerApplicationInput,
  ): Promise<ReviewPartnerApplicationResult> {
    const db = getDb();
    const rows = await db.select().from(partnerApplications).where(eq(partnerApplications.id, input.applicationId)).limit(1);
    const application = rows[0];

    if (!application) {
      throw new Error(`Partner application ${input.applicationId} was not found.`);
    }

    const reviewedAt = new Date();
    const reviewNote = input.note?.trim() || null;

    await db
      .update(partnerApplications)
      .set({
        status: input.decision === 'approve' ? 'approved' : 'rejected',
        reviewedAt,
        reviewNote,
      })
      .where(eq(partnerApplications.id, input.applicationId));

    let partnerId: string | null = null;
    let partnerSlug: string | null = null;

    if (input.decision === 'approve') {
      const ownerPartners = await db
        .select()
        .from(partners)
        .where(eq(partners.ownerProfileId, application.applicantProfileId));

      const existingPartner = ownerPartners.find(
        (candidate) => normalizeComparableValue(candidate.businessName) === normalizeComparableValue(application.businessName),
      );

      const slug = await resolveUniquePartnerSlug(slugify(application.businessName), existingPartner?.id ?? null);
      const partnerValues = {
        ownerProfileId: application.applicantProfileId,
        businessName: application.businessName,
        slug,
        category: application.category,
        shortDescription:
          normalizeOptionalText(application.shortDescription) ??
          summarizeMessage(application.longDescription ?? application.message),
        longDescription: normalizeOptionalText(application.longDescription) ?? normalizeOptionalText(application.message),
        country: normalizeOptionalText(application.country),
        city: normalizeOptionalText(application.city),
        websiteUrl: normalizeOptionalText(application.websiteUrl),
        phone: application.contactPhone,
        email: application.contactEmail,
        logoUrl: normalizeOptionalText(application.logoUrl),
        coverImageUrl: normalizeOptionalText(application.coverImageUrl),
        status: 'approved' as const,
        isFeatured: existingPartner?.isFeatured ?? false,
        publishedAt: existingPartner?.publishedAt ?? reviewedAt,
        updatedAt: reviewedAt,
      };

      if (existingPartner) {
        await db.update(partners).set(partnerValues).where(eq(partners.id, existingPartner.id));
        partnerId = existingPartner.id;
        partnerSlug = slug;
      } else {
        const inserted = await db
          .insert(partners)
          .values({
            ...partnerValues,
            createdAt: reviewedAt,
          })
          .returning({ id: partners.id, slug: partners.slug });

        partnerId = inserted[0]?.id ?? null;
        partnerSlug = inserted[0]?.slug ?? slug;
      }

      await syncPartnerServiceEcosystemListing(db, {
        ...partnerValues,
        slug,
        status: 'approved',
        updatedAt: reviewedAt,
      });
    }

    await writeAuditLog(reviewerProfileId, 'partner_application', input.applicationId, `review:${input.decision}`, {
      note: reviewNote,
      partnerId,
      partnerSlug,
    });

    if (partnerId) {
      await writeAuditLog(reviewerProfileId, 'partner', partnerId, 'publish_from_application', {
        applicationId: input.applicationId,
        partnerSlug,
      });
    }

    return {
      applicationId: input.applicationId,
      status: input.decision === 'approve' ? 'approved' : 'rejected',
      reviewedAt: reviewedAt.toISOString(),
      partnerId,
      partnerSlug,
    };
  }

  async updateAdminState(
    reviewerProfileId: string,
    input: UpdatePartnerAdminStateInput,
  ): Promise<UpdatePartnerAdminStateResult> {
    const db = getDb();
    const rows = await db.select().from(partners).where(eq(partners.id, input.partnerId)).limit(1);
    const existing = rows[0];

    if (!existing) {
      throw new Error(`Partner ${input.partnerId} was not found.`);
    }

    const nextState = {
      status:
        input.intent === 'suspend'
          ? ('suspended' as const)
          : input.intent === 'restore'
            ? ('approved' as const)
            : (existing.status as UpdatePartnerAdminStateResult['status']),
      isFeatured:
        input.intent === 'feature'
          ? true
          : input.intent === 'unfeature'
            ? false
            : existing.isFeatured,
    };

    const updatedAt = new Date();

    const nextPublishedAt = nextState.status === 'approved' ? existing.publishedAt ?? updatedAt : existing.publishedAt;

    await db
      .update(partners)
      .set({
        status: nextState.status,
        isFeatured: nextState.isFeatured,
        publishedAt: nextPublishedAt,
        updatedAt,
      })
      .where(eq(partners.id, input.partnerId));

    await syncPartnerServiceEcosystemListing(db, {
      ownerProfileId: existing.ownerProfileId,
      businessName: existing.businessName,
      slug: existing.slug,
      category: existing.category,
      shortDescription: existing.shortDescription,
      longDescription: existing.longDescription,
      country: existing.country,
      city: existing.city,
      websiteUrl: existing.websiteUrl,
      phone: existing.phone,
      email: existing.email,
      logoUrl: existing.logoUrl,
      coverImageUrl: existing.coverImageUrl,
      status: nextState.status,
      isFeatured: nextState.isFeatured,
      publishedAt: nextPublishedAt,
      updatedAt,
    });

    await writeAuditLog(reviewerProfileId, 'partner', input.partnerId, `admin:${input.intent}`, {
      previousStatus: existing.status,
      nextStatus: nextState.status,
      isFeatured: nextState.isFeatured,
    });

    return {
      partnerId: input.partnerId,
      status: nextState.status,
      isFeatured: nextState.isFeatured,
      updatedAt: updatedAt.toISOString(),
    };
  }
}

export function createPartnersRepository(): PartnersRepository {
  return new DrizzlePartnersRepository();
}
