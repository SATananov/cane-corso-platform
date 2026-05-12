// Step 123 — ML-safe Photo Assistant Prototype
// Step 126 — Admin ML-safe Review Assistant Polish
// Deterministic assistant foundation only. No AI/ML breed proof is performed here.

export type UsgAdminPhotoView = 'side' | 'front' | 'head' | 'unknown';
export type UsgAdminPhotoQuality = 'good' | 'usable' | 'needs_better_photo' | 'missing';
export type UsgAssistantConfidence = 'low' | 'medium' | 'high';
export type UsgHumanPhotoLabel = 'good' | 'usable' | 'poor' | 'wrong_angle' | 'missing_view';
export type UsgPhotoReviewReadiness = 'ready_for_human_review' | 'needs_more_photos' | 'needs_better_primary' | 'review_carefully';
export type UsgPhotoReviewNextAction = 'confirm_labels' | 'request_missing_views' | 'request_better_primary' | 'review_extra_photos';

export interface UsgPhotoAssistantInput {
  index: number;
  totalCount: number;
  isPrimary?: boolean;
  isVisibleInRegistry?: boolean;
  isVisibleInUsgGallery?: boolean;
  hasUrl?: boolean;
}

export interface UsgPhotoAssistantSuggestion {
  expectedView: UsgAdminPhotoView;
  assistantQuality: UsgAdminPhotoQuality;
  assistantConfidence: UsgAssistantConfidence;
  humanLabel: UsgHumanPhotoLabel;
  datasetUse: 'training_candidate' | 'review_only' | 'needs_admin_label';
  reasonKey: 'main_side_candidate' | 'front_candidate' | 'head_candidate' | 'missing_set' | 'unclear_extra';
}

export interface UsgPhotoReviewDecisionSupport {
  readiness: UsgPhotoReviewReadiness;
  nextAction: UsgPhotoReviewNextAction;
  readinessScore: number;
  expectedViewsCount: number;
  presentViewsCount: number;
  missingViewsCount: number;
  trainingCandidateCount: number;
  reviewOnlyCount: number;
  needsHumanLabelCount: number;
  canPrepareLearningCandidate: boolean;
}

export function getExpectedPhotoView(index: number): UsgAdminPhotoView {
  if (index === 0) return 'side';
  if (index === 1) return 'front';
  if (index === 2) return 'head';
  return 'unknown';
}

export function buildUsgPhotoAssistantSuggestion(input: UsgPhotoAssistantInput): UsgPhotoAssistantSuggestion {
  const expectedView = getExpectedPhotoView(input.index);

  if (!input.hasUrl) {
    return {
      expectedView,
      assistantQuality: 'missing',
      assistantConfidence: 'low',
      humanLabel: 'missing_view',
      datasetUse: 'needs_admin_label',
      reasonKey: 'missing_set',
    };
  }

  if (input.index === 0) {
    return {
      expectedView,
      assistantQuality: input.isPrimary || input.isVisibleInRegistry ? 'good' : 'usable',
      assistantConfidence: input.isPrimary ? 'high' : 'medium',
      humanLabel: input.isPrimary || input.isVisibleInRegistry ? 'good' : 'usable',
      datasetUse: 'training_candidate',
      reasonKey: 'main_side_candidate',
    };
  }

  if (input.index === 1) {
    return {
      expectedView,
      assistantQuality: 'usable',
      assistantConfidence: 'medium',
      humanLabel: 'usable',
      datasetUse: 'training_candidate',
      reasonKey: 'front_candidate',
    };
  }

  if (input.index === 2) {
    return {
      expectedView,
      assistantQuality: 'usable',
      assistantConfidence: 'medium',
      humanLabel: 'usable',
      datasetUse: 'training_candidate',
      reasonKey: 'head_candidate',
    };
  }

  return {
    expectedView,
    assistantQuality: 'needs_better_photo',
    assistantConfidence: 'low',
    humanLabel: 'poor',
    datasetUse: 'review_only',
    reasonKey: 'unclear_extra',
  };
}


export function buildUsgPhotoReviewDecisionSupport(suggestions: UsgPhotoAssistantSuggestion[]): UsgPhotoReviewDecisionSupport {
  const expectedViews = suggestions.filter((suggestion) => suggestion.expectedView !== 'unknown');
  const missingViewsCount = expectedViews.filter((suggestion) => suggestion.assistantQuality === 'missing').length;
  const presentViewsCount = expectedViews.length - missingViewsCount;
  const trainingCandidateCount = suggestions.filter((suggestion) => suggestion.datasetUse === 'training_candidate').length;
  const reviewOnlyCount = suggestions.filter((suggestion) => suggestion.datasetUse === 'review_only').length;
  const needsHumanLabelCount = suggestions.filter((suggestion) => suggestion.datasetUse === 'needs_admin_label').length;
  const primarySuggestion = suggestions[0];
  const hasWeakPrimary = !primarySuggestion || primarySuggestion.assistantQuality === 'missing' || primarySuggestion.assistantQuality === 'needs_better_photo';
  const readinessScore = Math.round((presentViewsCount / Math.max(1, expectedViews.length)) * 100);

  if (missingViewsCount > 0) {
    return {
      readiness: 'needs_more_photos',
      nextAction: 'request_missing_views',
      readinessScore,
      expectedViewsCount: expectedViews.length,
      presentViewsCount,
      missingViewsCount,
      trainingCandidateCount,
      reviewOnlyCount,
      needsHumanLabelCount,
      canPrepareLearningCandidate: false,
    };
  }

  if (hasWeakPrimary) {
    return {
      readiness: 'needs_better_primary',
      nextAction: 'request_better_primary',
      readinessScore,
      expectedViewsCount: expectedViews.length,
      presentViewsCount,
      missingViewsCount,
      trainingCandidateCount,
      reviewOnlyCount,
      needsHumanLabelCount,
      canPrepareLearningCandidate: false,
    };
  }

  if (reviewOnlyCount > 0) {
    return {
      readiness: 'review_carefully',
      nextAction: 'review_extra_photos',
      readinessScore,
      expectedViewsCount: expectedViews.length,
      presentViewsCount,
      missingViewsCount,
      trainingCandidateCount,
      reviewOnlyCount,
      needsHumanLabelCount,
      canPrepareLearningCandidate: true,
    };
  }

  return {
    readiness: 'ready_for_human_review',
    nextAction: 'confirm_labels',
    readinessScore,
    expectedViewsCount: expectedViews.length,
    presentViewsCount,
    missingViewsCount,
    trainingCandidateCount,
    reviewOnlyCount,
    needsHumanLabelCount,
    canPrepareLearningCandidate: true,
  };
}
