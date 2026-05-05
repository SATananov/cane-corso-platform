import { jsonError, jsonOk } from '@/lib/api-response';
import { validateCreateDogMediaInput } from '@/lib/dog-media.validation';
import {
  DogMediaDogNotFoundError,
  createCurrentMemberDogMedia,
  getCurrentMemberDogMediaDocument,
} from '@/lib/my-dog-media.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface DogMediaRouteProps {
  params: Promise<{
    dogId: string;
  }>;
}

export async function GET(_request: Request, { params }: DogMediaRouteProps) {
  const { dogId } = await params;

  try {
    const document = await getCurrentMemberDogMediaDocument(dogId, { allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof DogMediaDogNotFoundError) {
      return jsonError('DOG_NOT_FOUND', error.message, { status: 404 });
    }

    return jsonError('DOG_MEDIA_FETCH_FAILED', error instanceof Error ? error.message : 'Unable to load dog media.', { status: 500 });
  }
}

export async function POST(request: Request, { params }: DogMediaRouteProps) {
  const { dogId } = await params;

  try {
    const body = validateCreateDogMediaInput(await request.json());
    const document = await createCurrentMemberDogMedia(dogId, body, { allowDevFallback: false });
    return jsonOk(document, { status: 201 });
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof DogMediaDogNotFoundError) {
      return jsonError('DOG_NOT_FOUND', error.message, { status: 404 });
    }

    if (error instanceof Error && /required|valid absolute URL|media type|numeric/i.test(error.message)) {
      return jsonError('DOG_MEDIA_VALIDATION_FAILED', error.message, { status: 400 });
    }

    return jsonError('DOG_MEDIA_CREATE_FAILED', error instanceof Error ? error.message : 'Unable to create dog media.', { status: 500 });
  }
}
