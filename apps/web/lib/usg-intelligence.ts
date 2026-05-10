import type {
  DogLifecycleStatus,
  DogSex,
  UsgIntelligenceActionKey,
  UsgIntelligenceDocument,
  UsgIntelligenceEvidenceKey,
  UsgIntelligenceSignal,
} from '@cane-corso-platform/contracts';

export interface UsgIntelligenceProfileInput {
  dogId?: string | null;
  dogName?: string | null;
  sex: DogSex;
  dateOfBirth?: string | null;
  color?: string | null;
  city?: string | null;
  country?: string | null;
  shortDescription?: string | null;
  mainImageUrl?: string | null;
  galleryImageCount?: number | null;
  pedigreeFilledCount?: number | null;
  pedigreePhotoCount?: number | null;
  lifecycleStatus?: DogLifecycleStatus | null;
  hasPublication?: boolean | null;
  hasCertificate?: boolean | null;
  hasMeasurementArchive?: boolean | null;
  measurementRecordCount?: number | null;
  measurementReadinessScore?: number | null;
  measurementHasEnoughData?: boolean | null;
}

type ReadinessItem = {
  key: UsgIntelligenceEvidenceKey;
  ready: boolean;
  weight: number;
};

const boundaryKeys: UsgIntelligenceDocument['boundaryKeys'] = [
  'not_certificate',
  'not_breed_proof',
  'not_veterinary_diagnosis',
  'not_automatic_admin_decision',
];

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeCount(value: number | null | undefined): number {
  return Math.max(0, Number.isFinite(value ?? 0) ? Math.floor(value ?? 0) : 0);
}

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

function calculateAgeMonths(dateOfBirth?: string | null): number | null {
  if (!dateOfBirth) return null;

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(birthDate.getTime()) || birthDate > today) return null;

  let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  if (today.getDate() < birthDate.getDate()) months -= 1;

  return Math.max(0, months);
}

function scoreReadiness(items: ReadinessItem[]): number {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const ready = items.reduce((sum, item) => sum + (item.ready ? item.weight : 0), 0);
  return total <= 0 ? 0 : clampScore((ready / total) * 100);
}

function getProfileReadinessItems(input: UsgIntelligenceProfileInput): ReadinessItem[] {
  const galleryImageCount = normalizeCount(input.galleryImageCount);
  const pedigreeFilledCount = normalizeCount(input.pedigreeFilledCount);
  const pedigreePhotoCount = normalizeCount(input.pedigreePhotoCount);

  return [
    { key: 'identity_present', ready: hasText(input.dogName), weight: 1.15 },
    { key: 'birth_date_present', ready: hasText(input.dateOfBirth), weight: 1 },
    { key: 'color_present', ready: hasText(input.color), weight: 0.75 },
    { key: 'location_present', ready: hasText(input.city) && hasText(input.country), weight: 0.85 },
    { key: 'description_present', ready: hasText(input.shortDescription), weight: 0.9 },
    { key: 'photos_present', ready: Boolean(input.mainImageUrl) || galleryImageCount > 0, weight: 1.15 },
    { key: 'pedigree_context_present', ready: pedigreeFilledCount > 0 || pedigreePhotoCount > 0, weight: 0.7 },
    { key: 'measurement_archive_available', ready: Boolean(input.hasMeasurementArchive), weight: 0.9 },
  ];
}

function getReadyEvidenceKeys(items: ReadinessItem[]): UsgIntelligenceEvidenceKey[] {
  const evidence = items.filter((item) => item.ready).map((item) => item.key);
  return evidence.length ? evidence : ['measurement_series_needed'];
}

function chooseProfileAction(input: UsgIntelligenceProfileInput, profileScore: number): UsgIntelligenceActionKey {
  const galleryImageCount = normalizeCount(input.galleryImageCount);
  const pedigreeFilledCount = normalizeCount(input.pedigreeFilledCount);
  const pedigreePhotoCount = normalizeCount(input.pedigreePhotoCount);

  if (profileScore < 80) return 'complete_profile';
  if (!input.mainImageUrl && galleryImageCount < 3) return 'add_three_photos';
  if (pedigreeFilledCount === 0 && pedigreePhotoCount === 0) return 'add_pedigree_context';
  return 'keep_human_review';
}

function buildProfileSignal(input: UsgIntelligenceProfileInput, profileScore: number, items: ReadinessItem[]): UsgIntelligenceSignal {
  return {
    key: 'profile_readiness',
    scope: 'profile_readiness',
    status: profileScore >= 80 ? 'ready_for_orientation' : profileScore >= 45 ? 'collecting_data' : 'missing_data',
    confidence: profileScore >= 80 ? 'high' : profileScore >= 45 ? 'medium' : 'low',
    score: profileScore,
    evidenceKeys: getReadyEvidenceKeys(items),
    actionKey: chooseProfileAction(input, profileScore),
  };
}

function buildGrowthSignal(input: UsgIntelligenceProfileInput): UsgIntelligenceSignal {
  const ageMonths = calculateAgeMonths(input.dateOfBirth);
  const recordCount = normalizeCount(input.measurementRecordCount);
  const hasArchive = Boolean(input.hasMeasurementArchive);
  const hasEnoughData = Boolean(input.measurementHasEnoughData) || recordCount >= 2;
  const measurementReadiness = clampScore(input.measurementReadinessScore ?? 0);
  const score = clampScore((ageMonths != null ? 28 : 0) + (hasArchive ? 24 : 0) + Math.min(34, recordCount * 17) + (hasEnoughData ? 14 : 0) + measurementReadiness * 0.08);

  const evidenceKeys: UsgIntelligenceEvidenceKey[] = [];
  if (ageMonths != null) evidenceKeys.push('birth_date_present');
  if (hasArchive) evidenceKeys.push('measurement_archive_available');
  if (!hasEnoughData) evidenceKeys.push('measurement_series_needed');
  evidenceKeys.push('authority_boundary_locked');

  return {
    key: 'growth_orientation',
    scope: 'growth_orientation',
    status: hasEnoughData ? 'ready_for_orientation' : hasArchive ? 'collecting_data' : 'missing_data',
    confidence: hasEnoughData && recordCount >= 3 ? 'high' : hasEnoughData ? 'medium' : 'low',
    score,
    evidenceKeys,
    actionKey: hasEnoughData ? 'keep_human_review' : 'add_measurements',
  };
}

function buildRegressionSignal(input: UsgIntelligenceProfileInput): UsgIntelligenceSignal {
  const recordCount = normalizeCount(input.measurementRecordCount);
  const hasArchive = Boolean(input.hasMeasurementArchive);
  const score = clampScore((hasArchive ? 35 : 0) + Math.min(45, recordCount * 15) + (hasText(input.dateOfBirth) ? 10 : 0) + (input.sex === 'male' || input.sex === 'female' ? 10 : 0));

  return {
    key: 'future_regression',
    scope: 'future_regression',
    status: recordCount >= 3 ? 'ready_for_orientation' : hasArchive ? 'collecting_data' : 'missing_data',
    confidence: 'low',
    score,
    evidenceKeys: [
      hasArchive ? 'measurement_archive_available' : 'measurement_series_needed',
      'regression_not_trained_yet',
      'authority_boundary_locked',
    ],
    actionKey: recordCount >= 3 ? 'keep_human_review' : 'add_measurements',
  };
}

function buildPhenotypeSignal(input: UsgIntelligenceProfileInput): UsgIntelligenceSignal {
  const galleryImageCount = normalizeCount(input.galleryImageCount);
  const pedigreeFilledCount = normalizeCount(input.pedigreeFilledCount);
  const hasVisualContext = Boolean(input.mainImageUrl) || galleryImageCount > 0;
  const score = clampScore((hasVisualContext ? 36 : 0) + (hasText(input.color) ? 18 : 0) + (hasText(input.country) ? 16 : 0) + Math.min(24, pedigreeFilledCount * 4) + 6);

  return {
    key: 'phenotype_observation',
    scope: 'phenotype_observation',
    status: hasVisualContext && hasText(input.color) ? 'human_review_required' : 'collecting_data',
    confidence: hasVisualContext && pedigreeFilledCount > 0 ? 'medium' : 'low',
    score,
    evidenceKeys: [
      ...(hasVisualContext ? ['photos_present' as const] : []),
      ...(hasText(input.color) ? ['color_present' as const] : []),
      ...(hasText(input.country) ? ['location_present' as const] : []),
      ...(pedigreeFilledCount > 0 ? ['pedigree_context_present' as const] : []),
      'human_review_required',
      'authority_boundary_locked',
    ],
    actionKey: 'keep_observational',
  };
}

function buildAdminSupportSignal(input: UsgIntelligenceProfileInput, profileScore: number, growthScore: number): UsgIntelligenceSignal {
  const isSubmittedOrPublished = input.lifecycleStatus && input.lifecycleStatus !== 'draft';
  const authorityScore = input.hasPublication ? 100 : input.hasCertificate ? 88 : isSubmittedOrPublished ? 72 : 42;
  const score = clampScore(profileScore * 0.44 + growthScore * 0.24 + authorityScore * 0.32);

  return {
    key: 'admin_review_support',
    scope: 'admin_review_support',
    status: 'boundary_locked',
    confidence: score >= 80 ? 'high' : score >= 55 ? 'medium' : 'low',
    score,
    evidenceKeys: ['human_review_required', 'authority_boundary_locked'],
    actionKey: 'keep_human_review',
  };
}

export function buildUsgIntelligenceDocument(input: UsgIntelligenceProfileInput): UsgIntelligenceDocument {
  const profileItems = getProfileReadinessItems(input);
  const dataCompleteness = scoreReadiness(profileItems);
  const profileSignal = buildProfileSignal(input, dataCompleteness, profileItems);
  const growthSignal = buildGrowthSignal(input);
  const regressionSignal = buildRegressionSignal(input);
  const phenotypeSignal = buildPhenotypeSignal(input);
  const adminSupportSignal = buildAdminSupportSignal(input, dataCompleteness, growthSignal.score);
  const reviewPreparation = clampScore(dataCompleteness * 0.56 + adminSupportSignal.score * 0.28 + growthSignal.score * 0.16);

  return {
    version: 'step108-foundation-v1',
    dogId: input.dogId?.trim() || null,
    dogName: input.dogName?.trim() || null,
    scores: {
      dataCompleteness,
      growthEvidence: growthSignal.score,
      reviewPreparation,
    },
    signals: [profileSignal, growthSignal, regressionSignal, phenotypeSignal, adminSupportSignal],
    boundaryKeys,
  };
}
