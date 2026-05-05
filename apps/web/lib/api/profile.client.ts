import type { CurrentProfileDocument } from '@cane-corso-platform/contracts';
import { fetchApiDocument } from './fetcher';

export function fetchCurrentProfileDocument() {
  return fetchApiDocument<CurrentProfileDocument>('/api/profile/me');
}
