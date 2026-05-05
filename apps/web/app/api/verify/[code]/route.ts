import { jsonError, jsonOk } from '@/lib/api-response';
import { getVerificationDocument } from '@/lib/registry.server';

export const dynamic = 'force-dynamic';

interface VerifyRouteContext {
  params: Promise<{ code: string }>;
}

export async function GET(_request: Request, context: VerifyRouteContext) {
  try {
    const { code } = await context.params;
    const document = await getVerificationDocument(code);

    if (!document) {
      return jsonError('VERIFY_RECORD_NOT_FOUND', `Verification record ${code} was not found.`, { status: 404 });
    }

    return jsonOk(document);
  } catch (error) {
    return jsonError('VERIFY_FETCH_FAILED', error instanceof Error ? error.message : 'Unable to load verification record.', { status: 500 });
  }
}
