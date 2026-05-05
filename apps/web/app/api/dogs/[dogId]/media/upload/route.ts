import { jsonError, jsonOk } from '@/lib/api-response';
import { validateDogMediaUploadForm } from '@/lib/dog-media-upload.validation';
import {
  DogMediaDogNotFoundError,
  createCurrentMemberDogMedia,
} from '@/lib/my-dog-media.server';
import { requireRequestSessionCookie, SessionUnavailableError } from '@/lib/session.server';
import { removeDogMediaFile, storeDogMediaFile } from '@cane-corso-platform/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface DogMediaUploadRouteProps {
  params: Promise<{
    dogId: string;
  }>;
}

export async function POST(request: Request, { params }: DogMediaUploadRouteProps) {
  const { dogId } = await params;

  try {
    const formData = await request.formData();
    const upload = validateDogMediaUploadForm(formData);
    const { session } = await requireRequestSessionCookie();
    const storedFile = await storeDogMediaFile({
      dogId,
      ownerProfileId: session.user.profileId,
      filename: upload.file.name || 'dog-media',
      mimeType: upload.file.type || 'application/octet-stream',
      bytes: Buffer.from(await upload.file.arrayBuffer()),
    });

    try {
      const document = await createCurrentMemberDogMedia(dogId, {
        publicUrl: storedFile.publicUrl,
        altText: upload.altText,
        mediaType: storedFile.mediaType,
        mimeType: storedFile.mimeType,
        sizeBytes: storedFile.sizeBytes,
        storageKey: storedFile.storageKey,
        isPrimary: upload.isPrimary,
      }, { allowDevFallback: false });

      return jsonOk(document, { status: 201 });
    } catch (error) {
      await removeDogMediaFile(storedFile.storageKey);
      throw error;
    }
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof DogMediaDogNotFoundError) {
      return jsonError('DOG_NOT_FOUND', error.message, { status: 404 });
    }

    if (error instanceof Error && /required|empty|20 mb|primary|media/i.test(error.message)) {
      return jsonError('DOG_MEDIA_UPLOAD_VALIDATION_FAILED', error.message, { status: 400 });
    }

    return jsonError('DOG_MEDIA_UPLOAD_FAILED', error instanceof Error ? error.message : 'Unable to upload dog media.', {
      status: 500,
    });
  }
}
