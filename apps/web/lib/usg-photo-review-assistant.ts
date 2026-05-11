// Step 123 — ML-safe Photo Assistant Prototype
// Deterministic assistant foundation only. No AI/ML breed proof is performed here.

export type UsgAdminPhotoView = 'side' | 'front' | 'head' | 'unknown';
export type UsgAdminPhotoQuality = 'good' | 'usable' | 'needs_better_photo' | 'missing';
export type UsgAssistantConfidence = 'low' | 'medium' | 'high';
export type UsgHumanPhotoLabel = 'good' | 'usable' | 'poor' | 'wrong_angle' | 'missing_view';

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
