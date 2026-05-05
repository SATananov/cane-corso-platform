import type { CurrentProfileDocument, CurrentProfileMutationDocument, UpdateCurrentProfileInput } from '@cane-corso-platform/contracts';
import { fetchApiDocument } from './fetcher';

export function fetchCurrentProfileDocument() {
  return fetchApiDocument<CurrentProfileDocument>('/api/profile/me');
}

export function updateCurrentProfileDocument(input: UpdateCurrentProfileInput) {
  return fetchApiDocument<CurrentProfileMutationDocument>('/api/profile/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function uploadCurrentProfileAvatar(input: { file: File }) {
  const formData = new FormData();
  formData.set('file', input.file);

  return fetchApiDocument<CurrentProfileMutationDocument>('/api/profile/me/avatar/upload', {
    method: 'POST',
    body: formData,
  });
}
