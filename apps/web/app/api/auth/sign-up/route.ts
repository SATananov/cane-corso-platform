import { NextResponse } from 'next/server';
import { createLocalAuthRepository, LocalAuthRepositoryError } from '@cane-corso-platform/db';
import { jsonError } from '@/lib/api-response';
import { createSessionFromIdentity, getSessionCookieDescriptor } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface SignUpBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  locale?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignUpBody;
    const firstName = body.firstName?.trim() ?? '';
    const lastName = body.lastName?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const password = body.password ?? '';

    if (!firstName || !lastName || !email || !password) {
      return jsonError('INVALID_BODY', 'First name, last name, email, and password are required.', { status: 400 });
    }

    const identity = await createLocalAuthRepository().createMemberAccount({
      firstName,
      lastName,
      email,
      password,
      locale: body.locale?.trim() || 'en',
    });

    const session = createSessionFromIdentity(identity);
    const response = NextResponse.json({
      ok: true,
      data: {
        session,
        bootstrap: 'cookie',
        accountCreated: true,
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
      const status = error.code === 'EMAIL_EXISTS' ? 409 : 400;
      return jsonError(error.code, error.message, { status });
    }

    return jsonError(
      'SIGN_UP_FAILED',
      error instanceof Error ? error.message : 'Unable to create the member account.',
      { status: 500 },
    );
  }
}
