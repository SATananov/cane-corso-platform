import type {
  CreateDogMediaInput,
  DogMediaCollectionDocument,
  DogMediaDeleteDocument,
  DogMediaMutationDocument,
  UpdateDogMediaInput,
} from '@cane-corso-platform/contracts';
import { fetchApiDocument } from './fetcher';

export function fetchDogMediaDocument(dogId: string) {
  return fetchApiDocument<DogMediaCollectionDocument>(`/api/dogs/${dogId}/media`);
}

export function createDogMediaAsset(dogId: string, input: CreateDogMediaInput) {
  return fetchApiDocument<DogMediaMutationDocument>(`/api/dogs/${dogId}/media`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function uploadDogMediaAsset(dogId: string, input: { file: File; altText?: string | null; isPrimary?: boolean }) {
  const formData = new FormData();
  formData.set('file', input.file);

  if (input.altText) {
    formData.set('altText', input.altText);
  }

  if (input.isPrimary) {
    formData.set('isPrimary', 'true');
  }

  return fetchApiDocument<DogMediaMutationDocument>(`/api/dogs/${dogId}/media/upload`, {
    method: 'POST',
    body: formData,
  });
}

export function updateDogMediaAsset(dogId: string, mediaId: string, input: UpdateDogMediaInput) {
  return fetchApiDocument<DogMediaMutationDocument>(`/api/dogs/${dogId}/media/${mediaId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteDogMediaAsset(dogId: string, mediaId: string) {
  return fetchApiDocument<DogMediaDeleteDocument>(`/api/dogs/${dogId}/media/${mediaId}`, {
    method: 'DELETE',
  });
}
