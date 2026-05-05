import { NextResponse } from 'next/server';
import { createLocalAuthRepository, LocalAuthRepositoryError } from '@cane-corso-platform/db';
import { jsonError } from '@/lib/api-response';
import { createSessionFromIdentity, getSessionCookieDescriptor } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface SignInBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignInBody;
    const email = body.email?.trim() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return jsonError('INVALID_BODY', 'Email and password are required.', { status: 400 });
    }

    const identity = await createLocalAuthRepository().verifyMemberCredentials({
      email,
      password,
    });

    const session = createSessionFromIdentity(identity);
    const response = NextResponse.json({
      ok: true,
      data: {
        session,
        bootstrap: 'cookie',
      },
      meta: {
        generatedAt: new Date().toISOString(),
      },
    });

    const cookieDescriptor = getSessionCookieDescriptor(session);
    response.cookies.set(cookieDescriptor.name, cookieDescriptor.value, cookieDescriptor.options);

    return response;
  } catch (error) {
    if (error instanceof LocalAuthRepositoryError) {
      return jsonError(error.code, error.message, { status: 401 });
    }

    return jsonError(
      'SIGN_IN_FAILED',
      error instanceof Error ? error.message : 'Unable to sign in with the provided credentials.',
      { status: 500 },
    );
  }
}
