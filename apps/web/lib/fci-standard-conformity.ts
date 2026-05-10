import type {
  DogMeasurementRecord,
  DogSex,
  FciConformityConfidence,
  FciConformityEvidenceKey,
  FciConformityMode,
  FciConformityQualification,
  FciConformityRange,
  FciConformitySection,
  FciConformityStatus,
  FciStandardConformityDocument,
} from '@cane-corso-platform/contracts';

export interface FciStandardConformityInput {
  dogId?: string | null;
  dogName?: string | null;
  sex: DogSex;
  dateOfBirth?: string | null;
  color?: string | null;
  latestMeasurement?: DogMeasurementRecord | null;
}

type NumericField =
  | 'weightKg'
  | 'heightWithersCm'
  | 'bodyLengthCm'
  | 'headLengthCm'
  | 'muzzleLengthCm'
  | 'skullLengthCm';

const FCI_STANDARD: FciStandardConformityDocument['standard'] = {
  number: 'FCI Standard No. 343',
  breed: 'Cane Corso Italiano',
  officialValidDate: '2023-09-25',
  source: 'FCI',
};

const ADULT_HEIGHT_BY_SEX: Record<DogSex, FciConformityRange> = {
  male: { low: 64, high: 68 },
  female: { low: 60, high: 64 },
};

const ADULT_WEIGHT_BY_SEX: Record<DogSex, FciConformityRange> = {
  male: { low: 45, high: 50 },
  female: { low: 40, high: 45 },
};

const sectionWeights: Record<FciConformitySection['key'], number> = {
  height_weight: 25,
  body_proportion: 20,
  head_proportion: 20,
  muzzle_skull_ratio: 15,
  coat_colour: 10,
  faults_boundary: 5,
  evidence_confidence: 5,
};

const acceptedColourValues = new Set([
  'black',
  'black brindle',
  'grey',
  'gray',
  'grey brindle',
  'gray brindle',
  'formentino',
  'fawn',
  'red',
  'blue',
  'slate grey',
  'slate gray',
  'lead grey',
  'lead gray',
  'light grey',
  'light gray',
  'dark fawn',
  'stag red',
  'dark wheat',
  'dark wheat colour',
]);

const reviewColourValues = new Set([
  'chestnut brindle',
  'brindle',
  'light fawn',
  'dark brindle',
]);

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function safeText(value: string | null | undefined): string | null {
  const next = value?.trim();
  return next ? next : null;
}

function expandRange(range: FciConformityRange, amount: number): FciConformityRange {
  return {
    low: Number((range.low - amount).toFixed(1)),
    high: Number((range.high + amount).toFixed(1)),
  };
}

function ratioRange(expected: number, toleranceRatio = 0.08): FciConformityRange {
  return {
    low: Number((expected * (1 - toleranceRatio)).toFixed(1)),
    high: Number((expected * (1 + toleranceRatio)).toFixed(1)),
  };
}

function midpoint(range: FciConformityRange): number {
  return (range.low + range.high) / 2;
}

function scoreRange(value: number | null | undefined, targetRange: FciConformityRange, watchRange: FciConformityRange): {
  status: FciConformityStatus;
  score: number;
  confidence: FciConformityConfidence;
} {
  if (!hasNumber(value)) {
    return { status: 'missing_data', score: 0, confidence: 'low' };
  }

  if (value >= targetRange.low && value <= targetRange.high) {
    return { status: 'within_standard_orientation', score: 100, confidence: 'high' };
  }

  if (value >= watchRange.low && value <= watchRange.high) {
    return { status: 'near_standard_watch', score: 68, confidence: 'medium' };
  }

  return { status: 'outside_standard_review', score: 24, confidence: 'medium' };
}

function calculateAgeMonths(dateOfBirth?: string | null): number | null {
  const dateText = safeText(dateOfBirth);
  if (!dateText) return null;

  const birthDate = new Date(`${dateText}T00:00:00`);
  const today = new Date();
  if (Number.isNaN(birthDate.getTime()) || birthDate > today) return null;

  let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  if (today.getDate() < birthDate.getDate()) months -= 1;
  return Math.max(0, months);
}

function getMode(ageMonths: number | null): FciConformityMode {
  if (ageMonths == null) return 'unknown_age_orientation';
  if (ageMonths < 18) return 'puppy_development_projection';
  if (ageMonths < 24) return 'young_adult_transition';
  return 'adult_standard_orientation';
}

function fieldValue(record: DogMeasurementRecord | null | undefined, field: NumericField): number | null {
  const value = record?.[field];
  return hasNumber(value) ? value : null;
}

function countMeasurementFields(record: DogMeasurementRecord | null | undefined): number {
  if (!record) return 0;
  const fields: NumericField[] = ['weightKg', 'heightWithersCm', 'bodyLengthCm', 'headLengthCm', 'muzzleLengthCm', 'skullLengthCm'];
  return fields.filter((field) => hasNumber(record[field])).length;
}

function buildHeightWeightSection(input: FciStandardConformityInput): FciConformitySection {
  const height = fieldValue(input.latestMeasurement, 'heightWithersCm');
  const weight = fieldValue(input.latestMeasurement, 'weightKg');
  const heightTarget = ADULT_HEIGHT_BY_SEX[input.sex];
  const weightTarget = ADULT_WEIGHT_BY_SEX[input.sex];
  const heightWatch = expandRange(heightTarget, 2);
  const weightWatch = ratioRange(midpoint(weightTarget), 0.12);
  const heightResult = scoreRange(height, heightTarget, heightWatch);
  const weightResult = scoreRange(weight, weightTarget, weightWatch);

  const present = [height, weight].filter(hasNumber).length;
  const score = present === 0 ? 0 : clampScore((heightResult.score + weightResult.score) / 2);
  const status: FciConformityStatus = present === 0
    ? 'missing_data'
    : score >= 85
      ? 'within_standard_orientation'
      : score >= 55
        ? 'near_standard_watch'
        : 'outside_standard_review';

  return {
    key: 'height_weight',
    status,
    score,
    confidence: present === 2 ? 'high' : present === 1 ? 'medium' : 'low',
    value: present ? `${height ?? '—'} cm / ${weight ?? '—'} kg` : null,
    expectedRange: heightTarget,
    expectedTextKey: 'adult_height_range',
    evidenceKeys: [
      'fci_standard_343',
      'adult_height_range',
      'adult_weight_range',
      'height_tolerance_applied',
      input.latestMeasurement ? 'measurement_archive_latest_record' : 'measurement_archive_needed',
    ],
  };
}

function buildBodyProportionSection(input: FciStandardConformityInput): FciConformitySection {
  const height = fieldValue(input.latestMeasurement, 'heightWithersCm');
  const body = fieldValue(input.latestMeasurement, 'bodyLengthCm');
  const expected = hasNumber(height) ? height * 1.11 : null;
  const expectedRange = expected ? ratioRange(expected, 0.08) : null;
  const result = expectedRange ? scoreRange(body, expectedRange, ratioRange(expected!, 0.14)) : { status: 'missing_data' as const, score: 0, confidence: 'low' as const };

  return {
    key: 'body_proportion',
    status: result.status,
    score: result.score,
    confidence: hasNumber(height) && hasNumber(body) ? result.confidence : 'low',
    value: hasNumber(body) ? body : null,
    expectedRange,
    expectedTextKey: 'body_length_11_percent',
    evidenceKeys: ['body_length_11_percent', input.latestMeasurement ? 'measurement_archive_latest_record' : 'measurement_archive_needed'],
  };
}

function buildHeadProportionSection(input: FciStandardConformityInput): FciConformitySection {
  const height = fieldValue(input.latestMeasurement, 'heightWithersCm');
  const head = fieldValue(input.latestMeasurement, 'headLengthCm');
  const expected = hasNumber(height) ? height * 0.36 : null;
  const expectedRange = expected ? ratioRange(expected, 0.08) : null;
  const result = expectedRange ? scoreRange(head, expectedRange, ratioRange(expected!, 0.14)) : { status: 'missing_data' as const, score: 0, confidence: 'low' as const };

  return {
    key: 'head_proportion',
    status: result.status,
    score: result.score,
    confidence: hasNumber(height) && hasNumber(head) ? result.confidence : 'low',
    value: hasNumber(head) ? head : null,
    expectedRange,
    expectedTextKey: 'head_length_36_percent',
    evidenceKeys: ['head_length_36_percent', input.latestMeasurement ? 'measurement_archive_latest_record' : 'measurement_archive_needed'],
  };
}

function buildMuzzleSkullSection(input: FciStandardConformityInput): FciConformitySection {
  const muzzle = fieldValue(input.latestMeasurement, 'muzzleLengthCm');
  const skull = fieldValue(input.latestMeasurement, 'skullLengthCm');
  const expected = hasNumber(skull) ? skull / 2 : null;
  const expectedRange = expected ? ratioRange(expected, 0.12) : null;
  const result = expectedRange ? scoreRange(muzzle, expectedRange, ratioRange(expected!, 0.18)) : { status: 'missing_data' as const, score: 0, confidence: 'low' as const };

  return {
    key: 'muzzle_skull_ratio',
    status: result.status,
    score: result.score,
    confidence: hasNumber(muzzle) && hasNumber(skull) ? result.confidence : 'low',
    value: hasNumber(muzzle) && hasNumber(skull) ? `${muzzle} / ${skull}` : null,
    expectedRange,
    expectedTextKey: 'muzzle_skull_1_to_2',
    evidenceKeys: ['muzzle_skull_1_to_2', input.latestMeasurement ? 'measurement_archive_latest_record' : 'measurement_archive_needed'],
  };
}

function buildColourSection(input: FciStandardConformityInput): FciConformitySection {
  const color = safeText(input.color);
  const normalized = color?.toLowerCase() ?? null;
  const isAccepted = normalized ? acceptedColourValues.has(normalized) : false;
  const needsReview = normalized ? reviewColourValues.has(normalized) : false;
  const isMissing = !normalized;
  const isOther = normalized === 'other';

  const status: FciConformityStatus = isMissing
    ? 'missing_data'
    : isAccepted
      ? 'within_standard_orientation'
      : needsReview
        ? 'near_standard_watch'
        : 'human_review_required';

  const score = isMissing ? 0 : isAccepted ? 100 : needsReview ? 64 : isOther ? 25 : 40;

  return {
    key: 'coat_colour',
    status,
    score,
    confidence: isAccepted ? 'high' : isMissing ? 'low' : 'medium',
    value: color,
    expectedRange: null,
    expectedTextKey: isAccepted ? 'accepted_colour_orientation' : 'colour_needs_review',
    evidenceKeys: [
      'accepted_colour_orientation',
      isAccepted ? 'fci_standard_343' : 'colour_needs_review',
      'human_review_required',
    ],
  };
}

function buildFaultsBoundarySection(input: FciStandardConformityInput): FciConformitySection {
  const hasProfile = Boolean(input.latestMeasurement || safeText(input.color) || safeText(input.dateOfBirth));
  return {
    key: 'faults_boundary',
    status: 'human_review_required',
    score: hasProfile ? 60 : 20,
    confidence: 'low',
    value: null,
    expectedRange: null,
    expectedTextKey: 'disqualifying_faults_not_auto_detected',
    evidenceKeys: [
      'disqualifying_faults_not_auto_detected',
      'human_review_required',
      'official_fci_boundary',
      'usg_certificate_boundary',
    ],
  };
}

function buildEvidenceConfidenceSection(input: FciStandardConformityInput, ageMonths: number | null): FciConformitySection {
  const measurementCount = countMeasurementFields(input.latestMeasurement);
  const hasAge = ageMonths != null;
  const hasColour = Boolean(safeText(input.color));
  const evidenceScore = clampScore(Math.min(70, measurementCount * 14) + (hasAge ? 15 : 0) + (hasColour ? 15 : 0));

  return {
    key: 'evidence_confidence',
    status: evidenceScore >= 70 ? 'within_standard_orientation' : evidenceScore >= 35 ? 'near_standard_watch' : 'missing_data',
    score: evidenceScore,
    confidence: evidenceScore >= 70 ? 'high' : evidenceScore >= 35 ? 'medium' : 'low',
    value: `${measurementCount}/6`,
    expectedRange: null,
    expectedTextKey: input.latestMeasurement ? 'measurement_archive_latest_record' : 'measurement_archive_needed',
    evidenceKeys: [
      hasAge ? 'fci_standard_343' : 'birth_date_needed',
      input.latestMeasurement ? 'measurement_archive_latest_record' : 'measurement_archive_needed',
      'official_fci_boundary',
    ],
  };
}

function scoreSections(sections: FciConformitySection[]): number {
  const totalWeight = sections.reduce((total, section) => total + sectionWeights[section.key], 0);
  const weighted = sections.reduce((total, section) => total + section.score * sectionWeights[section.key], 0);
  return totalWeight > 0 ? clampScore(weighted / totalWeight) : 0;
}

function getConfidence(sections: FciConformitySection[], mode: FciConformityMode): FciConformityConfidence {
  const knownSections = sections.filter((section) => section.status !== 'missing_data' && section.status !== 'not_assessable_from_profile').length;
  if (mode === 'puppy_development_projection') return knownSections >= 5 ? 'medium' : 'low';
  if (knownSections >= 5) return 'high';
  if (knownSections >= 3) return 'medium';
  return 'low';
}

function getQualification(score: number, confidence: FciConformityConfidence, mode: FciConformityMode): FciConformityQualification {
  if (mode === 'puppy_development_projection') return 'development_only';
  if (score >= 80 && confidence !== 'low') return 'candidate_for_usg_review';
  if (score >= 55) return 'human_review_needed';
  if (score > 0) return 'collect_more_data';
  return 'not_ready_for_conformity_orientation';
}

function pickLatestMeasurement(record: DogMeasurementRecord | null | undefined): FciStandardConformityDocument['latestMeasurement'] {
  if (!record) return null;
  return {
    measuredAt: record.measuredAt,
    weightKg: record.weightKg,
    heightWithersCm: record.heightWithersCm,
    bodyLengthCm: record.bodyLengthCm,
    headLengthCm: record.headLengthCm,
    muzzleLengthCm: record.muzzleLengthCm,
    skullLengthCm: record.skullLengthCm,
  };
}

export function buildFciStandardConformityDocument(input: FciStandardConformityInput): FciStandardConformityDocument {
  const ageMonths = calculateAgeMonths(input.dateOfBirth);
  const mode = getMode(ageMonths);
  const sections = [
    buildHeightWeightSection(input),
    buildBodyProportionSection(input),
    buildHeadProportionSection(input),
    buildMuzzleSkullSection(input),
    buildColourSection(input),
    buildFaultsBoundarySection(input),
    buildEvidenceConfidenceSection(input, ageMonths),
  ];
  const measurable = scoreSections(sections.filter((section) => section.key !== 'faults_boundary' && section.key !== 'evidence_confidence'));
  const overall = scoreSections(sections);
  const evidenceConfidence = sections.find((section) => section.key === 'evidence_confidence')?.score ?? 0;
  const confidence = getConfidence(sections, mode);
  const qualification = getQualification(overall, confidence, mode);

  return {
    version: 'step108-1-fci-conformity-v1',
    standard: FCI_STANDARD,
    dogId: input.dogId?.trim() || null,
    dogName: input.dogName?.trim() || null,
    sex: input.sex,
    ageMonths,
    mode,
    qualification,
    confidence,
    latestMeasurement: pickLatestMeasurement(input.latestMeasurement),
    scores: {
      overall,
      measurable,
      evidenceConfidence,
    },
    sections,
    boundaryKeys: [
      'fci_standard_343',
      'official_fci_boundary',
      'usg_certificate_boundary',
      mode === 'puppy_development_projection' ? 'puppy_not_final_standard' : 'human_review_required',
      'disqualifying_faults_not_auto_detected',
    ],
  };
}
