import { NextResponse } from 'next/server';
import type { SessionDocument } from '@cane-corso-platform/contracts';
import { jsonError, jsonOk } from '@/lib/api-response';
import { getClearedSessionCookieDescriptor, getCurrentMemberSession } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { session, bootstrap } = await getCurrentMemberSession({ allowDevFallback: false });

    return jsonOk<SessionDocument>({
      session,
      bootstrap,
    });
  } catch (error) {
    return jsonError('SESSION_NOT_AVAILABLE', error instanceof Error ? error.message : 'No session found.', { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    ok: true,
    data: {
      signedOut: true,
    },
    meta: {
      generatedAt: new Date().toISOString(),
    },
  });

  const cookieDescriptor = getClearedSessionCookieDescriptor();
  response.cookies.set(cookieDescriptor.name, cookieDescriptor.value, cookieDescriptor.options);
  return response;
}
