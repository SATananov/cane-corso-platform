import { jsonError, jsonOk } from '@/lib/api-response';
import { getPublishedRegistryDocument } from '@/lib/registry.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const document = await getPublishedRegistryDocument();
    return jsonOk(document);
  } catch (error) {
    return jsonError('REGISTRY_FETCH_FAILED', error instanceof Error ? error.message : 'Unable to load registry.', { status: 500 });
  }
}
