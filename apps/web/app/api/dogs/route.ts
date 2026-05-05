import type { ExecuteDogProfileActionInput } from '@cane-corso-platform/contracts';
import { jsonError, jsonOk } from '@/lib/api-response';
import {
  DogProfileValidationError,
  executeCurrentMemberDogAction,
  getCurrentMemberDogsDocument,
} from '@/lib/my-dogs.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const document = await getCurrentMemberDogsDocument({ allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    return jsonError('DOGS_FETCH_FAILED', error instanceof Error ? error.message : 'Unable to load dogs.', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExecuteDogProfileActionInput;

    if (!body?.profile || !body?.intent) {
      return jsonError('INVALID_BODY', 'Expected intent and profile payload.', { status: 400 });
    }

    const { document, created } = await executeCurrentMemberDogAction(body, { allowDevFallback: false });
    return jsonOk(document, { status: created ? 201 : 200 });
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof DogProfileValidationError) {
      return jsonError('DOG_VALIDATION_FAILED', error.message, { status: 422 }, error.fieldErrors);
    }

    return jsonError('DOG_MUTATION_FAILED', error instanceof Error ? error.message : 'Unable to save dog profile.', { status: 500 });
  }
}
