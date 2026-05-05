import type { EntityId, ISODateTimeString } from '../common/ids';
import type { DogLifecycleStatus, SubmissionDecision } from '../common/status';

export interface DogSubmission {
  id: EntityId;
  dogId: EntityId;
  submittedByProfileId: EntityId;
  status: Extract<DogLifecycleStatus, 'submitted' | 'needs_changes' | 'approved' | 'published'>;
  submittedAt: ISODateTimeString;
  lastReviewedAt: ISODateTimeString | null;
  currentReviewNote: string | null;
  publishedAt: ISODateTimeString | null;
}

export interface SubmissionReview {
  id: EntityId;
  submissionId: EntityId;
  reviewerProfileId: EntityId;
  decision: SubmissionDecision;
  note: string | null;
  createdAt: ISODateTimeString;
}

export type {
  DogProfileActionIntent,
  DogProfileDraftPayload,
  DogProfileMutationField,
  DogProfileMutationFieldErrors,
  DogProfileMutationInput,
  DogProfileMutationIntent,
  DogProfileMutationResult,
  ExecuteDogProfileActionInput,
  ExecuteDogProfileActionResult,
  UpsertDogProfileInput,
} from './dog-action.types';
