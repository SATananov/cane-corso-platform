import { NextResponse } from 'next/server';
import type { UpdateCurrentProfileInput } from '@cane-corso-platform/contracts';
import { createProfilesRepository } from '@cane-corso-platform/db';
import { jsonError, jsonOk } from '@/lib/api-response';
import {
  CurrentProfileNotFoundError,
  getCurrentProfileDocument,
} from '@/lib/member-profile.server';
import {
  SessionUnavailableError,
  createSessionFromIdentity,
  getSessionCookieDescriptor,
} from '@/lib/session.server';

export const dynamic = 'force-dynamic';

const MAX_AVATAR_URL_LENGTH = 1_000;
const SUPPORTED_AVATAR_REMOTE_URL = /^https?:\/\//i;
const SUPPORTED_AVATAR_LOCAL_URL = /^\/uploads\//i;

function normalizeOptionalText(value: unknown, maxLength: number): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error('Expected a text value.');
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length > maxLength) {
    throw new Error(`Text value exceeds ${maxLength} characters.`);
  }

  return trimmed;
}

function normalizeAvatarUrl(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error('Avatar URL must be text.');
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length > MAX_AVATAR_URL_LENGTH) {
    throw new Error('Profile photo URL is too long. Upload an image file instead.');
  }

  if (SUPPORTED_AVATAR_REMOTE_URL.test(trimmed) || SUPPORTED_AVATAR_LOCAL_URL.test(trimmed)) {
    return trimmed;
  }

  throw new Error('Profile photo must be an uploaded image or a valid http(s) image URL.');
}

async function parseProfileUpdateInput(request: Request): Promise<UpdateCurrentProfileInput> {
  const body = (await request.json()) as Record<string, unknown>;
  const input: UpdateCurrentProfileInput = {};

  const displayName = normalizeOptionalText(body.displayName, 120);
  if (displayName !== undefined) {
    if (!displayName) {
      throw new Error('Display name cannot be empty.');
    }

    input.displayName = displayName;
  }

  const avatarUrl = normalizeAvatarUrl(body.avatarUrl);
  if (avatarUrl !== undefined) {
    input.avatarUrl = avatarUrl;
  }

  const city = normalizeOptionalText(body.city, 120);
  if (city !== undefined) {
    input.city = city;
  }

  const country = normalizeOptionalText(body.country, 120);
  if (country !== undefined) {
    input.country = country;
  }

  const bio = normalizeOptionalText(body.bio, 800);
  if (bio !== undefined) {
    input.bio = bio;
  }

  const locale = normalizeOptionalText(body.locale, 8);
  if (locale !== undefined) {
    input.locale = locale;
  }

  if (Object.keys(input).length === 0) {
    throw new Error('No profile changes were provided.');
  }

  return input;
}

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

export async function PATCH(request: Request) {
  try {
    const current = await getCurrentProfileDocument({ allowDevFallback: false });
    const input = await parseProfileUpdateInput(request);
    const repository = createProfilesRepository();
    const profile = await repository.updateProfile(current.session.user.profileId, input);

    if (!profile) {
      return jsonError('PROFILE_NOT_FOUND', 'The current profile could not be found.', { status: 404 });
    }

    const identity = await repository.getIdentityByProfileId(profile.id);

    if (!identity) {
      return jsonError('PROFILE_IDENTITY_NOT_FOUND', 'The updated profile identity could not be refreshed.', { status: 404 });
    }

    const session = createSessionFromIdentity(identity);
    const response = NextResponse.json({
      ok: true,
      data: {
        profile,
        session,
        bootstrap: current.bootstrap,
        updated: true,
      },
      meta: {
        generatedAt: new Date().toISOString(),
      },
    });

    const cookieDescriptor = getSessionCookieDescriptor(session);
    response.cookies.set(cookieDescriptor.name, cookieDescriptor.value, cookieDescriptor.options);

    return response;
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    return jsonError(
      'PROFILE_UPDATE_FAILED',
      error instanceof Error ? error.message : 'Unable to update the current profile.',
      { status: 400 },
    );
  }
}
