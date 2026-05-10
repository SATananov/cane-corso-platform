export type UsgIntelligenceScope =
  | 'profile_readiness'
  | 'growth_orientation'
  | 'future_regression'
  | 'phenotype_observation'
  | 'admin_review_support';

export type UsgIntelligenceSignalStatus =
  | 'missing_data'
  | 'collecting_data'
  | 'ready_for_orientation'
  | 'human_review_required'
  | 'boundary_locked';

export type UsgIntelligenceConfidence = 'low' | 'medium' | 'high';

export type UsgIntelligenceSignalKey =
  | 'profile_readiness'
  | 'growth_orientation'
  | 'future_regression'
  | 'phenotype_observation'
  | 'admin_review_support';

export type UsgIntelligenceEvidenceKey =
  | 'identity_present'
  | 'birth_date_present'
  | 'color_present'
  | 'location_present'
  | 'description_present'
  | 'photos_present'
  | 'pedigree_context_present'
  | 'measurement_archive_available'
  | 'measurement_series_needed'
  | 'authority_boundary_locked'
  | 'regression_not_trained_yet'
  | 'human_review_required';

export type UsgIntelligenceActionKey =
  | 'complete_profile'
  | 'add_three_photos'
  | 'add_measurements'
  | 'add_pedigree_context'
  | 'keep_human_review'
  | 'keep_observational';

export type UsgIntelligenceBoundaryKey =
  | 'not_certificate'
  | 'not_breed_proof'
  | 'not_veterinary_diagnosis'
  | 'not_automatic_admin_decision';

export interface UsgIntelligenceSignal {
  key: UsgIntelligenceSignalKey;
  scope: UsgIntelligenceScope;
  status: UsgIntelligenceSignalStatus;
  confidence: UsgIntelligenceConfidence;
  score: number;
  evidenceKeys: UsgIntelligenceEvidenceKey[];
  actionKey: UsgIntelligenceActionKey;
}

export interface UsgIntelligenceScores {
  dataCompleteness: number;
  growthEvidence: number;
  reviewPreparation: number;
}

export interface UsgIntelligenceDocument {
  version: 'step108-foundation-v1';
  dogId: string | null;
  dogName: string | null;
  scores: UsgIntelligenceScores;
  signals: UsgIntelligenceSignal[];
  boundaryKeys: UsgIntelligenceBoundaryKey[];
}
