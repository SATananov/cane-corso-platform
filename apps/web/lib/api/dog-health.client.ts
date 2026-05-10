import type {
  CreateDogHealthRecordInput,
  DeleteDogHealthRecordDocument,
  DogHealthRecordMutationDocument,
  DogHealthRecordsDocument,
} from '@cane-corso-platform/contracts';
import { fetchApiDocument } from './fetcher';

function healthPath(dogId: string): string {
  return `/api/dogs/${encodeURIComponent(dogId)}/health`;
}

export function listDogHealthRecords(dogId: string): Promise<DogHealthRecordsDocument> {
  return fetchApiDocument<DogHealthRecordsDocument>(healthPath(dogId));
}

export function createDogHealthRecord(
  dogId: string,
  input: CreateDogHealthRecordInput,
): Promise<DogHealthRecordMutationDocument> {
  return fetchApiDocument<DogHealthRecordMutationDocument>(healthPath(dogId), {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteDogHealthRecord(
  dogId: string,
  recordId: string,
): Promise<DeleteDogHealthRecordDocument> {
  return fetchApiDocument<DeleteDogHealthRecordDocument>(healthPath(dogId), {
    method: 'DELETE',
    body: JSON.stringify({ recordId }),
  });
}
