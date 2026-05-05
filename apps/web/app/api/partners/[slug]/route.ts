import { jsonError, jsonOk } from '@/lib/api-response';
import { getPartnerProfileDocument } from '@/lib/partners.server';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    slug: string;
  }> | {
    slug: string;
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await Promise.resolve(context.params);

  try {
    const document = await getPartnerProfileDocument(params.slug);

    if (!document) {
      return jsonError('PARTNER_NOT_FOUND', 'Partner profile was not found.', { status: 404 });
    }

    return jsonOk(document);
  } catch (error) {
    return jsonError(
      'PARTNER_FETCH_FAILED',
      error instanceof Error ? error.message : 'Unable to load partner profile.',
      { status: 500 },
    );
  }
}
