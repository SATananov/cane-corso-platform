import { jsonError, jsonOk } from '@/lib/api-response';
import { getPublishedRegistryProfileDocument } from '@/lib/registry.server';

export const dynamic = 'force-dynamic';

interface RegistryRouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RegistryRouteContext) {
  try {
    const { slug } = await context.params;
    const document = await getPublishedRegistryProfileDocument(slug);

    if (!document) {
      return jsonError('REGISTRY_PROFILE_NOT_FOUND', `Registry profile ${slug} was not found.`, { status: 404 });
    }

    return jsonOk(document);
  } catch (error) {
    return jsonError('REGISTRY_PROFILE_FETCH_FAILED', error instanceof Error ? error.message : 'Unable to load registry profile.', { status: 500 });
  }
}
