import type { ExecuteDogProfileActionInput } from '@cane-corso-platform/contracts';
import { jsonError, jsonOk } from '@/lib/api-response';
import {
  DogProfileNotFoundError,
  DogProfileValidationError,
  executeCurrentMemberDogAction,
  getCurrentMemberDogProfileDocument,
} from '@/lib/my-dogs.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface DogRouteContext {
  params: Promise<{
    dogId: string;
  }>;
}

export async function GET(_request: Request, context: DogRouteContext) {
  try {
    const { dogId } = await context.params;
    const document = await getCurrentMemberDogProfileDocument(dogId, { allowDevFallback: false });

    if (!document) {
      return jsonError('DOG_NOT_FOUND', `Dog ${dogId} was not found for the current member.`, { status: 404 });
    }

    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    return jsonError('DOG_FETCH_FAILED', error instanceof Error ? error.message : 'Unable to load dog profile.', { status: 500 });
  }
}

export async function PATCH(request: Request, context: DogRouteContext) {
  try {
    const { dogId } = await context.params;
    const body = (await request.json()) as ExecuteDogProfileActionInput;

    if (!body?.profile || !body?.intent) {
      return jsonError('INVALID_BODY', 'Expected intent and profile payload.', { status: 400 });
    }

    const { document } = await executeCurrentMemberDogAction(body, { dogId, allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof DogProfileNotFoundError) {
      return jsonError('DOG_NOT_FOUND', error.message, { status: 404 });
    }

    if (error instanceof DogProfileValidationError) {
      return jsonError('DOG_VALIDATION_FAILED', error.message, { status: 422 }, error.fieldErrors);
    }

    return jsonError('DOG_UPDATE_FAILED', error instanceof Error ? error.message : 'Unable to update dog profile.', { status: 500 });
  }
}
