import type { CommunityRatingSummary, CommunityVoteState } from '../common/community.types';
import type { EntityId, ISODateTimeString, Slug } from '../common/ids';
import type { PartnerStatus } from '../common/status';
import type { Partner } from './partner.types';

export interface PartnerDirectoryOwner {
  profileId: EntityId;
  displayName: string;
  city: string | null;
  country: string | null;
}

export interface PartnerDirectoryEntry extends Partner {
  owner: PartnerDirectoryOwner;
  communityRating: CommunityRatingSummary;
}

export interface PartnerCategorySummary {
  key: string;
  total: number;
  featured: number;
}

export interface PartnerDirectoryDocument {
  entries: PartnerDirectoryEntry[];
  total: number;
  totalAll: number;
  featuredTotal: number;
  activeCategory: string | null;
  categories: PartnerCategorySummary[];
}

export interface PartnerProfileDocument {
  entry: PartnerDirectoryEntry;
  relatedEntries: PartnerDirectoryEntry[];
  communityVote: CommunityVoteState;
}

export interface PartnerModerationApplicant {
  profileId: EntityId;
  displayName: string;
  email: string;
  city: string | null;
  country: string | null;
}

export interface PartnerApplicationDraftInput {
  businessName: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  country: string | null;
  city: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  message: string | null;
  contactEmail: string;
  contactPhone: string | null;
}

export interface PartnerModerationApplicationItem extends PartnerApplicationDraftInput {
  applicationId: EntityId;
  status: 'pending_review' | 'approved' | 'rejected';
  submittedAt: ISODateTimeString;
  reviewedAt: ISODateTimeString | null;
  reviewNote: string | null;
  applicant: PartnerModerationApplicant;
}

export interface PartnerModerationSummary {
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  approvedPartners: number;
  featuredPartners: number;
  suspendedPartners: number;
}

export interface PartnerModerationDocument {
  applications: PartnerModerationApplicationItem[];
  liveEntries: PartnerDirectoryEntry[];
  summary: PartnerModerationSummary;
}

export type PartnerApplicationDecision = 'approve' | 'reject';

export interface ReviewPartnerApplicationInput {
  applicationId: EntityId;
  decision: PartnerApplicationDecision;
  note?: string | null;
}

export interface ReviewPartnerApplicationResult {
  applicationId: EntityId;
  status: 'approved' | 'rejected';
  reviewedAt: ISODateTimeString;
  partnerId: EntityId | null;
  partnerSlug: Slug | null;
}

export type PartnerAdminActionIntent = 'feature' | 'unfeature' | 'suspend' | 'restore';

export interface UpdatePartnerAdminStateInput {
  partnerId: EntityId;
  intent: PartnerAdminActionIntent;
}

export interface UpdatePartnerAdminStateResult {
  partnerId: EntityId;
  status: PartnerStatus;
  isFeatured: boolean;
  updatedAt: ISODateTimeString;
}

export interface PartnerWorkspaceOwner {
  profileId: EntityId;
  displayName: string;
  email: string;
}

export interface PartnerWorkspaceSummary {
  applicationsTotal: number;
  pendingApplications: number;
  approvedApplications: number;
  liveEntries: number;
  featuredEntries: number;
}

export interface PartnerWorkspaceDocument {
  owner: PartnerWorkspaceOwner;
  applications: PartnerModerationApplicationItem[];
  liveEntries: PartnerDirectoryEntry[];
  suggestedDraft: PartnerApplicationDraftInput;
  summary: PartnerWorkspaceSummary;
}

export interface SubmitPartnerApplicationInput extends PartnerApplicationDraftInput {}

export interface SubmitPartnerApplicationResult {
  applicationId: EntityId;
  status: 'pending_review';
  submittedAt: ISODateTimeString;
}
