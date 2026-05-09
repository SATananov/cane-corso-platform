import type {
  CreateDogMeasurementInput,
  DeleteDogMeasurementDocument,
  DogMeasurementMutationDocument,
  DogMeasurementsDocument,
} from '@cane-corso-platform/contracts';
import { fetchApiDocument } from './fetcher';

function measurementsPath(dogId: string): string {
  return `/api/dogs/${encodeURIComponent(dogId)}/measurements`;
}

export function listDogMeasurements(dogId: string): Promise<DogMeasurementsDocument> {
  return fetchApiDocument<DogMeasurementsDocument>(measurementsPath(dogId));
}

export function createDogMeasurement(
  dogId: string,
  input: CreateDogMeasurementInput,
): Promise<DogMeasurementMutationDocument> {
  return fetchApiDocument<DogMeasurementMutationDocument>(measurementsPath(dogId), {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteDogMeasurement(
  dogId: string,
  recordId: string,
): Promise<DeleteDogMeasurementDocument> {
  return fetchApiDocument<DeleteDogMeasurementDocument>(measurementsPath(dogId), {
    method: 'DELETE',
    body: JSON.stringify({ recordId }),
  });
}
