import { jsonError, jsonOk } from '@/lib/api-response';
import {
  DogHealthValidationError,
  createCurrentMemberDogHealthRecord,
  deleteCurrentMemberDogHealthRecord,
  getCurrentMemberDogHealthRecordsDocument,
} from '@/lib/dog-health.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface DogHealthRouteContext {
  params: Promise<{
    dogId: string;
  }>;
}

function mapError(error: unknown) {
  if (error instanceof SessionUnavailableError) {
    return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
  }

  if (error instanceof DogHealthValidationError) {
    return jsonError(error.code, error.message, { status: 422 });
  }

  if (error instanceof Error) {
    if (error.message === 'DOG_NOT_FOUND') {
      return jsonError('DOG_NOT_FOUND', 'Dog profile was not found for the current member.', { status: 404 });
    }

    if (error.message === 'HEALTH_TITLE_REQUIRED') {
      return jsonError('HEALTH_TITLE_REQUIRED', 'Add a vaccine, treatment, visit, or note title before saving.', { status: 422 });
    }

    if (error.message === 'PERFORMED_AT_IN_FUTURE') {
      return jsonError('PERFORMED_AT_IN_FUTURE', 'Health record date cannot be in the future.', { status: 422 });
    }

    if (error.message === 'INVALID_HEALTH_CATEGORY') {
      return jsonError('INVALID_HEALTH_CATEGORY', 'Health record category is not supported.', { status: 422 });
    }

    if (error.message === 'INVALID_DOCUMENT_URL') {
      return jsonError('INVALID_DOCUMENT_URL', 'Document URL must be a valid http or https URL.', { status: 422 });
    }

    if (error.message === 'HEALTH_RECORD_NOT_FOUND') {
      return jsonError('HEALTH_RECORD_NOT_FOUND', 'Health record was not found for this dog.', { status: 404 });
    }
  }

  return jsonError('DOG_HEALTH_FAILED', error instanceof Error ? error.message : 'Unable to process health records.', { status: 500 });
}

export async function GET(_request: Request, context: DogHealthRouteContext) {
  try {
    const { dogId } = await context.params;
    const document = await getCurrentMemberDogHealthRecordsDocument(dogId, { allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    return mapError(error);
  }
}

export async function POST(request: Request, context: DogHealthRouteContext) {
  try {
    const { dogId } = await context.params;
    const body = await request.json();
    const document = await createCurrentMemberDogHealthRecord(dogId, body, { allowDevFallback: false });
    return jsonOk(document, { status: 201 });
  } catch (error) {
    return mapError(error);
  }
}

export async function DELETE(request: Request, context: DogHealthRouteContext) {
  try {
    const { dogId } = await context.params;
    const body = await request.json();
    const document = await deleteCurrentMemberDogHealthRecord(dogId, body, { allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    return mapError(error);
  }
}
