import type { DogSex } from '@/lib/dog-form.types';

export type MeasurementStatus = 'missing' | 'below' | 'within' | 'above' | 'watch';

export interface MeasurementRange {
  low: number;
  high: number;
}

export interface UsgMeasurementInput {
  sex: DogSex;
  dateOfBirth?: string | null;
  weightKg?: number | null;
  heightWithersCm?: number | null;
  bodyLengthCm?: number | null;
  chestCircumferenceCm?: number | null;
  headLengthCm?: number | null;
  muzzleLengthCm?: number | null;
  skullLengthCm?: number | null;
}

export interface UsgMeasurementCheck {
  key: 'weight' | 'height' | 'bodyLength' | 'headLength' | 'muzzleSkull' | 'chest';
  status: MeasurementStatus;
  value: number | null;
  expectedRange: MeasurementRange | null;
  expectedValue: number | null;
  difference: number | null;
}

export interface UsgMeasurementResult {
  ageMonths: number | null;
  referenceMonth: number | null;
  lifeStage: 'puppy' | 'junior' | 'young_adult' | 'adult' | 'unknown';
  adultStandard: {
    heightWithersCm: MeasurementRange;
    weightKg: MeasurementRange;
  };
  puppyReference: {
    heightWithersCm: MeasurementRange;
    bodyLengthCm: MeasurementRange;
    chestCircumferenceCm: MeasurementRange;
    headLengthCm: MeasurementRange | null;
    muzzleLengthCm: MeasurementRange | null;
    weightKg: MeasurementRange | null;
  } | null;
  checks: UsgMeasurementCheck[];
  readinessScore: number;
  hasEnoughData: boolean;
}

const puppyGrowthReference = [
  { month: 1, heightWithersCm: [22, 27], bodyLengthCm: [25, 30], chestCircumferenceCm: [36, 45], headLengthCm: [12, 15], muzzleLengthCm: [4, 6], weightKg: [3, 4] },
  { month: 2, heightWithersCm: [33, 40], bodyLengthCm: [37, 44], chestCircumferenceCm: [47, 55], headLengthCm: [16, 19], muzzleLengthCm: [6, 8], weightKg: [8, 10] },
  { month: 3, heightWithersCm: [43, 49], bodyLengthCm: [47, 54], chestCircumferenceCm: [55, 62], headLengthCm: [19.5, 22.5], muzzleLengthCm: [7, 10], weightKg: [12, 14] },
  { month: 4, heightWithersCm: [50, 56], bodyLengthCm: [55, 62], chestCircumferenceCm: [60, 69], headLengthCm: [22, 25], muzzleLengthCm: [9, 11], weightKg: [15, 18] },
  { month: 5, heightWithersCm: [55, 60], bodyLengthCm: [61, 66], chestCircumferenceCm: [65, 74], headLengthCm: [24, 27], muzzleLengthCm: [10, 12.5], weightKg: [20, 23] },
  { month: 6, heightWithersCm: [58, 64], bodyLengthCm: [64, 71], chestCircumferenceCm: [69, 78], headLengthCm: [25, 28], muzzleLengthCm: [11, 13.5], weightKg: [25, 28] },
  { month: 7, heightWithersCm: [60, 66], bodyLengthCm: [66, 73], chestCircumferenceCm: [71, 81], headLengthCm: [26, 29], muzzleLengthCm: [11.5, 14], weightKg: [30, 33] },
  { month: 8, heightWithersCm: [62, 68], bodyLengthCm: [68, 75], chestCircumferenceCm: [74, 83], headLengthCm: [26.5, 29.5], muzzleLengthCm: [12, 15], weightKg: [35, 43] },
  { month: 9, heightWithersCm: [64, 69], bodyLengthCm: [71, 76], chestCircumferenceCm: [75, 85], headLengthCm: [27, 30], muzzleLengthCm: null, weightKg: null },
  { month: 10, heightWithersCm: [65, 70], bodyLengthCm: [72, 77], chestCircumferenceCm: [75, 86], headLengthCm: null, muzzleLengthCm: null, weightKg: null },
  { month: 11, heightWithersCm: [65, 70], bodyLengthCm: [72, 77], chestCircumferenceCm: [78, 88], headLengthCm: null, muzzleLengthCm: null, weightKg: null },
  { month: 12, heightWithersCm: [65, 71], bodyLengthCm: [72, 78], chestCircumferenceCm: [80, 89], headLengthCm: null, muzzleLengthCm: null, weightKg: null },
] as const;

const adultStandardBySex: Record<DogSex, { heightWithersCm: MeasurementRange; weightKg: MeasurementRange }> = {
  male: {
    heightWithersCm: { low: 64, high: 68 },
    weightKg: { low: 45, high: 50 },
  },
  female: {
    heightWithersCm: { low: 60, high: 64 },
    weightKg: { low: 40, high: 45 },
  },
};

function toRange(value: readonly [number, number] | null): MeasurementRange | null {
  return value ? { low: value[0], high: value[1] } : null;
}

function calculateAgeMonths(dateOfBirth?: string | null): number | null {
  if (!dateOfBirth) return null;

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;

  const now = new Date();
  let months = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());

  if (now.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

function getLifeStage(ageMonths: number | null): UsgMeasurementResult['lifeStage'] {
  if (ageMonths == null) return 'unknown';
  if (ageMonths < 6) return 'puppy';
  if (ageMonths < 12) return 'junior';
  if (ageMonths < 24) return 'young_adult';
  return 'adult';
}

function getReferenceMonth(ageMonths: number | null): number | null {
  if (ageMonths == null) return null;
  return Math.min(12, Math.max(1, Math.round(ageMonths)));
}

function getPuppyReference(referenceMonth: number | null): UsgMeasurementResult['puppyReference'] {
  if (referenceMonth == null) return null;

  const row = puppyGrowthReference.find((item) => item.month === referenceMonth);
  if (!row) return null;

  return {
    heightWithersCm: toRange(row.heightWithersCm)!,
    bodyLengthCm: toRange(row.bodyLengthCm)!,
    chestCircumferenceCm: toRange(row.chestCircumferenceCm)!,
    headLengthCm: toRange(row.headLengthCm),
    muzzleLengthCm: toRange(row.muzzleLengthCm),
    weightKg: toRange(row.weightKg),
  };
}

function isNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function midpoint(range: MeasurementRange): number {
  return (range.low + range.high) / 2;
}

function assessRange(value: number | null | undefined, range: MeasurementRange | null, toleranceRatio = 0.08): MeasurementStatus {
  if (!isNumber(value) || !range) return 'missing';

  const tolerance = Math.max(1, midpoint(range) * toleranceRatio);
  if (value < range.low - tolerance) return 'below';
  if (value > range.high + tolerance) return 'above';
  if (value < range.low || value > range.high) return 'watch';
  return 'within';
}

function buildCheck(
  key: UsgMeasurementCheck['key'],
  value: number | null | undefined,
  expectedRange: MeasurementRange | null,
): UsgMeasurementCheck {
  return {
    key,
    status: assessRange(value, expectedRange),
    value: isNumber(value) ? value : null,
    expectedRange,
    expectedValue: expectedRange ? midpoint(expectedRange) : null,
    difference: isNumber(value) && expectedRange ? Number((value - midpoint(expectedRange)).toFixed(1)) : null,
  };
}

function ratioRange(target: number, toleranceRatio = 0.08): MeasurementRange {
  return {
    low: Number((target * (1 - toleranceRatio)).toFixed(1)),
    high: Number((target * (1 + toleranceRatio)).toFixed(1)),
  };
}

function scoreChecks(checks: UsgMeasurementCheck[]): number {
  const completed = checks.filter((check) => check.status !== 'missing');
  if (!completed.length) return 0;

  const score = completed.reduce((total, check) => {
    if (check.status === 'within') return total + 2;
    if (check.status === 'watch') return total + 1;
    return total;
  }, 0);

  return Math.round((score / (completed.length * 2)) * 100);
}

export function evaluateUsgMeasurementAssistant(input: UsgMeasurementInput): UsgMeasurementResult {
  const ageMonths = calculateAgeMonths(input.dateOfBirth);
  const referenceMonth = getReferenceMonth(ageMonths);
  const lifeStage = getLifeStage(ageMonths);
  const adultStandard = adultStandardBySex[input.sex];
  const puppyReference = getPuppyReference(referenceMonth);
  const isAdultReference = lifeStage === 'adult' || lifeStage === 'young_adult';

  const weightRange = isAdultReference ? adultStandard.weightKg : puppyReference?.weightKg ?? null;
  const heightRange = isAdultReference ? adultStandard.heightWithersCm : puppyReference?.heightWithersCm ?? null;
  const bodyLengthRange = isNumber(input.heightWithersCm)
    ? ratioRange(input.heightWithersCm * 1.11)
    : puppyReference?.bodyLengthCm ?? null;
  const headLengthRange = isNumber(input.heightWithersCm)
    ? ratioRange(input.heightWithersCm * 0.36)
    : puppyReference?.headLengthCm ?? null;
  const chestRange = puppyReference?.chestCircumferenceCm ?? null;

  const muzzleSkullExpectedRange = isNumber(input.skullLengthCm)
    ? ratioRange(input.skullLengthCm / 2, 0.12)
    : isNumber(input.headLengthCm)
      ? ratioRange(input.headLengthCm / 3, 0.12)
      : puppyReference?.muzzleLengthCm ?? null;

  const checks: UsgMeasurementCheck[] = [
    buildCheck('weight', input.weightKg, weightRange),
    buildCheck('height', input.heightWithersCm, heightRange),
    buildCheck('bodyLength', input.bodyLengthCm, bodyLengthRange),
    buildCheck('headLength', input.headLengthCm, headLengthRange),
    buildCheck('muzzleSkull', input.muzzleLengthCm, muzzleSkullExpectedRange),
    buildCheck('chest', input.chestCircumferenceCm, chestRange),
  ];

  const hasEnoughData = checks.filter((check) => check.status !== 'missing').length >= 2;

  return {
    ageMonths,
    referenceMonth,
    lifeStage,
    adultStandard,
    puppyReference,
    checks,
    readinessScore: scoreChecks(checks),
    hasEnoughData,
  };
}
