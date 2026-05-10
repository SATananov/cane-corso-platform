import type { DogSex } from '../dogs/dog.types';
import type { DogMeasurementRecord } from '../dogs/dog-measurement.types';

export type FciConformityMode =
  | 'adult_standard_orientation'
  | 'young_adult_transition'
  | 'puppy_development_projection'
  | 'unknown_age_orientation';

export type FciConformityStatus =
  | 'missing_data'
  | 'within_standard_orientation'
  | 'near_standard_watch'
  | 'outside_standard_review'
  | 'human_review_required'
  | 'not_assessable_from_profile';

export type FciConformityConfidence = 'low' | 'medium' | 'high';

export type FciConformitySectionKey =
  | 'height_weight'
  | 'body_proportion'
  | 'head_proportion'
  | 'muzzle_skull_ratio'
  | 'coat_colour'
  | 'faults_boundary'
  | 'evidence_confidence';

export type FciConformityQualification =
  | 'candidate_for_usg_review'
  | 'collect_more_data'
  | 'development_only'
  | 'human_review_needed'
  | 'not_ready_for_conformity_orientation';

export type FciConformityEvidenceKey =
  | 'fci_standard_343'
  | 'official_fci_boundary'
  | 'usg_certificate_boundary'
  | 'adult_height_range'
  | 'adult_weight_range'
  | 'height_tolerance_applied'
  | 'body_length_11_percent'
  | 'head_length_36_percent'
  | 'muzzle_skull_1_to_2'
  | 'accepted_colour_orientation'
  | 'colour_needs_review'
  | 'measurement_archive_latest_record'
  | 'measurement_archive_needed'
  | 'birth_date_needed'
  | 'sex_needed_for_standard_range'
  | 'puppy_not_final_standard'
  | 'disqualifying_faults_not_auto_detected'
  | 'human_review_required';

export interface FciConformityRange {
  low: number;
  high: number;
}

export interface FciConformitySection {
  key: FciConformitySectionKey;
  status: FciConformityStatus;
  score: number;
  confidence: FciConformityConfidence;
  value: number | string | null;
  expectedRange: FciConformityRange | null;
  expectedTextKey: FciConformityEvidenceKey | null;
  evidenceKeys: FciConformityEvidenceKey[];
}

export interface FciConformityScores {
  overall: number;
  measurable: number;
  evidenceConfidence: number;
}

export interface FciStandardConformityDocument {
  version: 'step108-1-fci-conformity-v1';
  standard: {
    number: 'FCI Standard No. 343';
    breed: 'Cane Corso Italiano';
    officialValidDate: '2023-09-25';
    source: 'FCI';
  };
  dogId: string | null;
  dogName: string | null;
  sex: DogSex;
  ageMonths: number | null;
  mode: FciConformityMode;
  qualification: FciConformityQualification;
  confidence: FciConformityConfidence;
  latestMeasurement: Pick<DogMeasurementRecord, 'measuredAt' | 'weightKg' | 'heightWithersCm' | 'bodyLengthCm' | 'headLengthCm' | 'muzzleLengthCm' | 'skullLengthCm'> | null;
  scores: FciConformityScores;
  sections: FciConformitySection[];
  boundaryKeys: FciConformityEvidenceKey[];
}
