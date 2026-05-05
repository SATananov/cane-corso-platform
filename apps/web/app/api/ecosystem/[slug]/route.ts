import { jsonError, jsonOk } from '@/lib/api-response';
import { getPublishedEcosystemProfileDocument } from '@/lib/ecosystem.server';

export const dynamic = 'force-dynamic';

interface EcosystemPublicProfileApiRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: Request, { params }: EcosystemPublicProfileApiRouteProps) {
  const { slug } = await params;
  const normalizedSlug = slug?.trim();

  if (!normalizedSlug) {
    return jsonError('INVALID_ECOSYSTEM_PROFILE_SLUG', 'A public ecosystem profile slug is required.', { status: 400 });
  }

  try {
    const document = await getPublishedEcosystemProfileDocument(normalizedSlug);

    if (!document) {
      return jsonError(
        'ECOSYSTEM_PROFILE_NOT_FOUND',
        'No published public ecosystem profile was found for this slug.',
        { status: 404 },
      );
    }

    return jsonOk(document);
  } catch (error) {
    return jsonError(
      'ECOSYSTEM_PROFILE_FETCH_FAILED',
      error instanceof Error ? error.message : 'Unable to load the public ecosystem profile.',
      { status: 500 },
    );
  }
}
