import type { Certificate } from '../certificates/certificate.types';
import type { CommunityRatingSummary, CommunityVoteState } from '../common/community.types';
import type { EntityId, ISODateTimeString, Slug } from '../common/ids';
import type { Dog } from './dog.types';
import type { PublicDogAdminAssessment } from './dog-review.types';

export interface PublicRegistryOwner {
  profileId: EntityId;
  displayName: string;
  avatarUrl: string | null;
  city: string | null;
  country: string | null;
}

export interface PublicRegistryEntry {
  entryId: EntityId;
  dogId: EntityId;
  publicSlug: Slug;
  title: string;
  summary: string | null;
  heroImageUrl: string | null;
  galleryImages: string[];
  publishedAt: ISODateTimeString;
  owner: PublicRegistryOwner;
  dog: Dog;
  certificate: Certificate | null;
  communityRating: CommunityRatingSummary;
  adminAssessment: PublicDogAdminAssessment | null;
}

export interface PublicRegistryDocument {
  entries: PublicRegistryEntry[];
  total: number;
}

export interface PublicUsgGalleryDocument {
  entries: PublicRegistryEntry[];
  total: number;
}

export interface PublicUsgCertifiedDocument {
  entries: PublicRegistryEntry[];
  total: number;
}

export interface PublicRegistryProfileDocument {
  entry: PublicRegistryEntry;
  communityVote: CommunityVoteState;
}

export interface VerificationDocument {
  entry: PublicRegistryEntry;
}
