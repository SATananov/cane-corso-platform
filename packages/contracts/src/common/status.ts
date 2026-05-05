export type Visibility = 'private' | 'public';

export type DogLifecycleStatus =
  | 'draft'
  | 'submitted'
  | 'needs_changes'
  | 'approved'
  | 'published'
  | 'archived';

export type SubmissionDecision =
  | 'approved'
  | 'rejected'
  | 'needs_changes'
  | 'published';

export type PartnerStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type CertificateStatus = 'active' | 'revoked' | 'expired';

export type ContentStatus = 'draft' | 'published' | 'archived';
