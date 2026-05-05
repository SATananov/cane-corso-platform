import type { DevAccessIdentitiesDocument } from '@cane-corso-platform/contracts';
import { createProfilesRepository } from '@cane-corso-platform/db';
import { jsonError, jsonOk } from '@/lib/api-response';
import { isDevelopmentAccessEnabled } from '@/lib/runtime-env';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isDevelopmentAccessEnabled()) {
    return jsonError('DEV_ACCESS_DISABLED', 'Development access endpoints are disabled.', { status: 403 });
  }

  try {
    const repository = createProfilesRepository();
    const identities = await repository.listAccessIdentities();

    return jsonOk<DevAccessIdentitiesDocument>({ identities });
  } catch (error) {
    return jsonError(
      'DEV_IDENTITIES_FETCH_FAILED',
      error instanceof Error ? error.message : 'Unable to load local test identities.',
      { status: 500 },
    );
  }
}
