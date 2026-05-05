import { NextResponse } from 'next/server';
import { createProfilesRepository } from '@cane-corso-platform/db';
import { storeProfileAvatarFile } from '@cane-corso-platform/storage';
import { jsonError } from '@/lib/api-response';
import {
  SessionUnavailableError,
  createSessionFromIdentity,
  getSessionCookieDescriptor,
  requireRequestSessionCookie,
} from '@/lib/session.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const SUPPORTED_AVATAR_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function getUploadFile(formData: FormData): File {
  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw new Error('Profile photo file is required.');
  }

  if (file.size === 0) {
    throw new Error('Profile photo file is empty.');
  }

  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('Profile photo must be under 5 MB.');
  }

  if (!SUPPORTED_AVATAR_MIME_TYPES.has(file.type)) {
    throw new Error('Profile photo must be a PNG, JPG, or WebP image.');
  }

  return file;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = getUploadFile(formData);
    const { session } = await requireRequestSessionCookie();
    const repository = createProfilesRepository();
    const storedFile = await storeProfileAvatarFile({
      ownerProfileId: session.user.profileId,
      filename: file.name || 'owner-avatar',
      mimeType: file.type,
      bytes: Buffer.from(await file.arrayBuffer()),
    });
    const profile = await repository.updateProfile(session.user.profileId, {
      avatarUrl: storedFile.publicUrl,
    });

    if (!profile) {
      return jsonError('PROFILE_NOT_FOUND', 'The current profile could not be found.', { status: 404 });
    }

    const identity = await repository.getIdentityByProfileId(profile.id);

    if (!identity) {
      return jsonError('PROFILE_IDENTITY_NOT_FOUND', 'The updated profile identity could not be refreshed.', { status: 404 });
    }

    const refreshedSession = createSessionFromIdentity(identity);
    const response = NextResponse.json({
      ok: true,
      data: {
        profile,
        session: refreshedSession,
        bootstrap: 'cookie',
        updated: true,
      },
      meta: {
        generatedAt: new Date().toISOString(),
      },
    }, { status: 201 });

    const cookieDescriptor = getSessionCookieDescriptor(refreshedSession);
    response.cookies.set(cookieDescriptor.name, cookieDescriptor.value, cookieDescriptor.options);

    return response;
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof Error && /required|empty|under 5 mb|png|jpg|webp/i.test(error.message)) {
      return jsonError('PROFILE_AVATAR_UPLOAD_VALIDATION_FAILED', error.message, { status: 400 });
    }

    return jsonError(
      'PROFILE_AVATAR_UPLOAD_FAILED',
      error instanceof Error ? error.message : 'Unable to upload the profile photo.',
      { status: 500 },
    );
  }
}
