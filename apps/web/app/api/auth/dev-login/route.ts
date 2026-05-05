import { NextResponse } from 'next/server';
import type { DevSignInDocument, DevSignInRequest } from '@cane-corso-platform/contracts';
import { jsonError } from '@/lib/api-response';
import {
  createSessionFromIdentity,
  getSessionCookieDescriptor,
} from '@/lib/session.server';
import { createProfilesRepository } from '@cane-corso-platform/db';
import { isDevelopmentAccessEnabled } from '@/lib/runtime-env';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isDevelopmentAccessEnabled()) {
    return jsonError('DEV_ACCESS_DISABLED', 'Development access endpoints are disabled.', { status: 403 });
  }

  try {
    const body = (await request.json()) as Partial<DevSignInRequest>;
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return jsonError('INVALID_BODY', 'An email is required to sign in.', { status: 400 });
    }

    const repository = createProfilesRepository();
    const identity = await repository.getIdentityByEmail(email);

    if (!identity) {
      return jsonError('IDENTITY_NOT_FOUND', `No local test identity was found for ${email}.`, { status: 404 });
    }

    const session = createSessionFromIdentity(identity);
    const response = NextResponse.json({
      ok: true,
      data: {
        session,
        bootstrap: 'cookie',
      } satisfies DevSignInDocument,
      meta: {
        generatedAt: new Date().toISOString(),
      },
    });

    const cookieDescriptor = getSessionCookieDescriptor(session);
    response.cookies.set(cookieDescriptor.name, cookieDescriptor.value, cookieDescriptor.options);

    return response;
  } catch (error) {
    return jsonError(
      'DEV_LOGIN_FAILED',
      error instanceof Error ? error.message : 'Unable to create a local test member session.',
      { status: 500 },
    );
  }
}
