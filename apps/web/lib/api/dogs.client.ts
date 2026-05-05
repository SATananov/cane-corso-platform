import type {
  DogMutationDocument,
  DogProfileDocument,
  DogsCollectionDocument,
  ExecuteDogProfileActionInput,
} from '@cane-corso-platform/contracts';
import { fetchApiDocument } from './fetcher';

export function fetchCurrentMemberDogs() {
  return fetchApiDocument<DogsCollectionDocument>('/api/dogs');
}

export function fetchDogProfileDocument(dogId: string) {
  return fetchApiDocument<DogProfileDocument>(`/api/dogs/${dogId}`);
}

export function mutateDogProfile(input: ExecuteDogProfileActionInput) {
  const dogId = input.profile.dogId;
  const pathname = dogId ? `/api/dogs/${dogId}` : '/api/dogs';
  const method = dogId ? 'PATCH' : 'POST';

  return fetchApiDocument<DogMutationDocument>(pathname, {
    method,
    body: JSON.stringify(input),
  });
}
