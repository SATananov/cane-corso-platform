import type { EntityId, ISODateTimeString } from '../common/ids';
import type { DogLifecycleStatus } from '../common/status';
import type { DogMedia } from './dog-media.types';
import type { Dog } from './dog.types';

export type DogAdminAssessmentDecision = 'not_reviewed' | 'registry_approved' | 'needs_changes' | 'usg_candidate' | 'usg_certified';

export interface DogAdminAssessment {
  dogId: EntityId;
  reviewerProfileId: EntityId | null;
  registryDecision: DogAdminAssessmentDecision;
  certificateDecision: DogAdminAssessmentDecision;
  breedTypeScore: number | null;
  temperamentScore: number | null;
  pedigreeScore: number | null;
  healthScore: number | null;
  presentationScore: number | null;
  overallScore: number | null;
  publicNote: string | null;
  privateNote: string | null;
  updatedAt: ISODateTimeString | null;
}

export type PublicDogAdminAssessment = Omit<DogAdminAssessment, 'privateNote'>;

export interface UpdateDogAdminAssessmentInput {
  dogId: EntityId;
  registryDecision?: DogAdminAssessmentDecision;
  certificateDecision?: DogAdminAssessmentDecision;
  breedTypeScore?: number | null;
  temperamentScore?: number | null;
  pedigreeScore?: number | null;
  healthScore?: number | null;
  presentationScore?: number | null;
  overallScore?: number | null;
  publicNote?: string | null;
  privateNote?: string | null;
}

export interface UpdateDogAdminAssessmentResult {
  dogId: EntityId;
  assessment: DogAdminAssessment;
  publicSlug: string | null;
  verificationSlug: string | null;
  certificateCode: string | null;
}

export type ReviewQueueStatus = Extract<DogLifecycleStatus, 'submitted' | 'needs_changes' | 'approved' | 'published'>;
export type ReviewDecisionIntent = 'approve' | 'needs_changes';

export interface ReviewQueueOwner {
  profileId: EntityId;
  displayName: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  addressLine: string | null;
  websiteUrl: string | null;
  bio: string | null;
}

export interface ReviewQueueItem {
  submissionId: EntityId;
  dog: Dog;
  owner: ReviewQueueOwner;
  status: ReviewQueueStatus;
  submittedAt: ISODateTimeString;
  lastReviewedAt: ISODateTimeString | null;
  currentReviewNote: string | null;
  publishedAt: ISODateTimeString | null;
  publicRegistrySlug: string | null;
  verificationSlug: string | null;
  certificateCode: string | null;
  certificateImageUrl: string | null;
  ownerMedia: DogMedia[];
  adminAssessment: DogAdminAssessment | null;
}

export interface ReviewQueueSummary {
  total: number;
  submitted: number;
  approved: number;
  needsChanges: number;
  published: number;
}

export interface ReviewQueueDocument {
  items: ReviewQueueItem[];
  summary: ReviewQueueSummary;
}

export interface ReviewSubmissionInput {
  submissionId: EntityId;
  decision: ReviewDecisionIntent;
  note?: string | null;
}

export interface ReviewSubmissionResult {
  submissionId: EntityId;
  dogId: EntityId;
  status: Extract<DogLifecycleStatus, 'approved' | 'needs_changes'>;
  reviewedAt: ISODateTimeString;
  note: string | null;
}

export interface PublishSubmissionInput {
  submissionId: EntityId;
}

export interface PublishSubmissionResult {
  submissionId: EntityId;
  dogId: EntityId;
  status: Extract<DogLifecycleStatus, 'published'>;
  publishedAt: ISODateTimeString;
  publicSlug: string;
  verificationSlug: string | null;
  certificateCode: string | null;
}

export interface IssueCertificateInput {
  dogId: EntityId;
  certificateImageUrl?: string | null;
}

export interface IssueCertificateResult {
  dogId: EntityId;
  certificateCode: string;
  verificationSlug: string;
  certificateImageUrl: string | null;
  publicSlug: string;
  status: 'active';
  issuedAt: ISODateTimeString;
}

export interface UpdateDogMediaAdminControlInput {
  dogId: EntityId;
  mediaId: EntityId;
  makePrimary?: boolean;
  visibleInRegistry?: boolean;
  visibleInUsgGallery?: boolean;
}

export interface UpdateDogMediaAdminControlResult {
  dogId: EntityId;
  mediaId: EntityId;
  media: DogMedia;
  publicSlug: string | null;
  verificationSlug: string | null;
  certificateCode: string | null;
}

export interface RevokeCertificateResult {
  dogId: EntityId;
  status: 'revoked';
  revokedAt: ISODateTimeString;
}

