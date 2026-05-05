import { jsonError, jsonOk } from '@/lib/api-response';
import { validateUpdateDogMediaInput } from '@/lib/dog-media.validation';
import {
  DogMediaDogNotFoundError,
  DogMediaItemNotFoundError,
  removeCurrentMemberDogMedia,
  updateCurrentMemberDogMedia,
} from '@/lib/my-dog-media.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface DogMediaItemRouteProps {
  params: Promise<{
    dogId: string;
    mediaId: string;
  }>;
}

export async function PATCH(request: Request, { params }: DogMediaItemRouteProps) {
  const { dogId, mediaId } = await params;

  try {
    const body = validateUpdateDogMediaInput(await request.json());
    const document = await updateCurrentMemberDogMedia(dogId, mediaId, body, { allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof DogMediaDogNotFoundError) {
      return jsonError('DOG_NOT_FOUND', error.message, { status: 404 });
    }

    if (error instanceof DogMediaItemNotFoundError) {
      return jsonError('DOG_MEDIA_NOT_FOUND', error.message, { status: 404 });
    }

    if (error instanceof Error && /object|boolean|numeric|text/i.test(error.message)) {
      return jsonError('DOG_MEDIA_VALIDATION_FAILED', error.message, { status: 400 });
    }

    return jsonError('DOG_MEDIA_UPDATE_FAILED', error instanceof Error ? error.message : 'Unable to update dog media.', { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: DogMediaItemRouteProps) {
  const { dogId, mediaId } = await params;

  try {
    const document = await removeCurrentMemberDogMedia(dogId, mediaId, { allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof DogMediaDogNotFoundError) {
      return jsonError('DOG_NOT_FOUND', error.message, { status: 404 });
    }

    if (error instanceof DogMediaItemNotFoundError) {
      return jsonError('DOG_MEDIA_NOT_FOUND', error.message, { status: 404 });
    }

    return jsonError('DOG_MEDIA_DELETE_FAILED', error instanceof Error ? error.message : 'Unable to delete dog media.', { status: 500 });
  }
}
