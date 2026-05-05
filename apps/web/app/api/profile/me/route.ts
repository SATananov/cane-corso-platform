import { jsonError, jsonOk } from '@/lib/api-response';
import {
  CurrentProfileNotFoundError,
  getCurrentProfileDocument,
} from '@/lib/member-profile.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const document = await getCurrentProfileDocument({ allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof CurrentProfileNotFoundError) {
      return jsonError('PROFILE_NOT_FOUND', error.message, { status: 404 });
    }

    return jsonError(
      'PROFILE_FETCH_FAILED',
      error instanceof Error ? error.message : 'Unable to load the current profile.',
      { status: 500 },
    );
  }
}
