import { NextResponse } from 'next/server';
import type { SessionDocument } from '@cane-corso-platform/contracts';
import { jsonError } from '@/lib/api-response';
import { getBootstrapMemberSession, getSessionCookieDescriptor } from '@/lib/session.server';
import { isDevBootstrapSessionEnabled } from '@/lib/runtime-env';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!isDevBootstrapSessionEnabled()) {
    return jsonError('BOOTSTRAP_SESSION_DISABLED', 'Bootstrap sessions are disabled for this environment.', { status: 403 });
  }

  try {
    const session = await getBootstrapMemberSession();
    const response = NextResponse.json({
      ok: true,
      data: {
        session,
        bootstrap: 'cookie',
      } satisfies SessionDocument,
      meta: {
        generatedAt: new Date().toISOString(),
      },
    });

    const cookieDescriptor = getSessionCookieDescriptor(session);
    response.cookies.set(cookieDescriptor.name, cookieDescriptor.value, cookieDescriptor.options);

    return response;
  } catch (error) {
    return jsonError(
      'BOOTSTRAP_SESSION_FAILED',
      error instanceof Error ? error.message : 'Unable to issue bootstrap session.',
      { status: 500 },
    );
  }
}
