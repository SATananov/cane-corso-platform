import type { EntityId, ISODateString, ISODateTimeString } from '../common/ids';

export type DogMeasurementNumberField =
  | 'weightKg'
  | 'heightWithersCm'
  | 'bodyLengthCm'
  | 'chestCircumferenceCm'
  | 'headLengthCm'
  | 'muzzleLengthCm'
  | 'skullLengthCm';

export interface DogMeasurementRecord {
  id: EntityId;
  dogId: EntityId;
  recordedByProfileId: EntityId;
  measuredAt: ISODateString;
  ageMonths: number | null;
  weightKg: number | null;
  heightWithersCm: number | null;
  bodyLengthCm: number | null;
  chestCircumferenceCm: number | null;
  headLengthCm: number | null;
  muzzleLengthCm: number | null;
  skullLengthCm: number | null;
  note: string | null;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface DogMeasurementsDocument {
  dogId: EntityId;
  records: DogMeasurementRecord[];
  total: number;
}

export interface CreateDogMeasurementInput {
  measuredAt: ISODateString;
  weightKg?: number | null;
  heightWithersCm?: number | null;
  bodyLengthCm?: number | null;
  chestCircumferenceCm?: number | null;
  headLengthCm?: number | null;
  muzzleLengthCm?: number | null;
  skullLengthCm?: number | null;
  note?: string | null;
}

export interface DogMeasurementMutationDocument {
  record: DogMeasurementRecord;
  records: DogMeasurementRecord[];
}

export interface DeleteDogMeasurementInput {
  recordId: EntityId;
}

export interface DeleteDogMeasurementDocument {
  dogId: EntityId;
  deletedRecordId: EntityId;
  records: DogMeasurementRecord[];
}
