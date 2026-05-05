import { jsonError, jsonOk } from '@/lib/api-response';
import { getPartnerDirectoryDocument } from '@/lib/partners.server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const document = await getPartnerDirectoryDocument({ category });
    return jsonOk(document);
  } catch (error) {
    return jsonError(
      'PARTNERS_FETCH_FAILED',
      error instanceof Error ? error.message : 'Unable to load partner directory.',
      { status: 500 },
    );
  }
}
