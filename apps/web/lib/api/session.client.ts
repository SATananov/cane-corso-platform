import type { SessionDocument } from '@cane-corso-platform/contracts';
import { fetchApiDocument } from './fetcher';

export function fetchCurrentSession() {
  return fetchApiDocument<SessionDocument>('/api/session');
}

export function createBootstrapSession() {
  return fetchApiDocument<SessionDocument>('/api/session/bootstrap', {
    method: 'POST',
  });
}

export async function destroyCurrentSession(): Promise<void> {
  await fetchApiDocument<{ signedOut: true }>('/api/session', {
    method: 'DELETE',
  });
}
