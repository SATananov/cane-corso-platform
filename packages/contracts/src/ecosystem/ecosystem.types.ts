import type { EntityId, ISODateTimeString, Slug } from '../common/ids';
import type { EcosystemSubmissionChannel } from './ecosystem-submission.types';

export const ECOSYSTEM_LISTING_TYPES = [
  'partner_service',
  'transport_relocation',
  'hotel_boarding',
  'walk_play_place',
  'pet_friendly_place',
  'puppy_listing',
  'adoption_new_home',
  'breeding_match',
  'event',
] as const;

export type EcosystemListingType = (typeof ECOSYSTEM_LISTING_TYPES)[number];

export type EcosystemListingStatus =
  | 'draft'
  | 'pending_review'
  | 'needs_changes'
  | 'approved'
  | 'published';

export type EcosystemReviewDecision = 'approve' | 'needs_changes';

export interface EcosystemListing {
  id: EntityId;
  ownerProfileId: EntityId;
  listingType: EcosystemListingType;
  submissionChannel: EcosystemSubmissionChannel;
  title: string;
  slug: Slug;
  category: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  country: string | null;
  city: string | null;
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
  coverageNote: string | null;
  rulesNote: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  googlePlaceId: string | null;
  googlePlaceName: string | null;
  googleFormattedAddress: string | null;
  googleMapsUrl: string | null;
  latitude: string | null;
  longitude: string | null;
  status: EcosystemListingStatus;
  isFeatured: boolean;
  submittedAt: ISODateTimeString | null;
  reviewedAt: ISODateTimeString | null;
  publishedAt: ISODateTimeString | null;
  reviewNote: string | null;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface UpsertEcosystemListingInput {
  listingId?: EntityId | null;
  listingType: EcosystemListingType;
  submissionChannel?: EcosystemSubmissionChannel | null;
  title: string;
  slug: Slug;
  category?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  country?: string | null;
  city?: string | null;
  websiteUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  coverageNote?: string | null;
  rulesNote?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  googlePlaceId?: string | null;
  googlePlaceName?: string | null;
  googleFormattedAddress?: string | null;
  googleMapsUrl?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface EcosystemOwnerWorkspaceDocument {
  summary: {
    total: number;
    drafts: number;
    pendingReview: number;
    needsChanges: number;
    approved: number;
    published: number;
    officialListings: number;
    communityListings: number;
    suggestions: number;
  };
  items: EcosystemListing[];
}

export interface EcosystemDirectoryDocument {
  summary: {
    total: number;
    countries: number;
    featured: number;
    listingTypes: number;
    officialPublished: number;
    communityPublished: number;
  };
  items: EcosystemListing[];
}

export interface EcosystemProfileDocument {
  listing: EcosystemListing;
}

export interface EcosystemModerationOwner {
  profileId: EntityId;
  displayName: string;
  email: string;
  city: string | null;
  country: string | null;
}

export interface EcosystemModerationItem {
  listing: EcosystemListing;
  owner: EcosystemModerationOwner;
}

export interface EcosystemModerationDocument {
  summary: {
    total: number;
    pendingReview: number;
    needsChanges: number;
    approved: number;
    published: number;
    officialListings: number;
    communityListings: number;
    suggestions: number;
  };
  items: EcosystemModerationItem[];
}
