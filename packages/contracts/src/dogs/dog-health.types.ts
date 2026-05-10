import type { EntityId, ISODateString, ISODateTimeString } from '../common/ids';

export type DogHealthRecordCategory = 'vaccine' | 'deworming' | 'vet_visit' | 'medication' | 'note';

export interface DogHealthRecord {
  id: EntityId;
  dogId: EntityId;
  recordedByProfileId: EntityId;
  category: DogHealthRecordCategory;
  title: string;
  performedAt: ISODateString;
  nextDueAt: ISODateString | null;
  veterinarian: string | null;
  clinic: string | null;
  batchNumber: string | null;
  documentUrl: string | null;
  note: string | null;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface DogHealthRecordsDocument {
  dogId: EntityId;
  records: DogHealthRecord[];
  total: number;
}

export interface CreateDogHealthRecordInput {
  category: DogHealthRecordCategory;
  title: string;
  performedAt: ISODateString;
  nextDueAt?: ISODateString | null;
  veterinarian?: string | null;
  clinic?: string | null;
  batchNumber?: string | null;
  documentUrl?: string | null;
  note?: string | null;
}

export interface DogHealthRecordMutationDocument {
  record: DogHealthRecord;
  records: DogHealthRecord[];
}

export interface DeleteDogHealthRecordInput {
  recordId: EntityId;
}

export interface DeleteDogHealthRecordDocument {
  dogId: EntityId;
  deletedRecordId: EntityId;
  records: DogHealthRecord[];
}
