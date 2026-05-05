import { jsonError, jsonOk } from '@/lib/api-response';
import {
  getAdminEcosystemModerationDocumentForApi,
  publishEcosystemListingForApi,
  reviewEcosystemListingForApi,
} from '@/lib/ecosystem.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const document = await getAdminEcosystemModerationDocumentForApi();
    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    return jsonError('ECOSYSTEM_MODERATION_FETCH_FAILED', error instanceof Error ? error.message : 'Unable to load moderation queue.', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      intent?: 'approve' | 'needs_changes' | 'publish';
      listingId?: string;
    };

    if (!body?.intent || !body.listingId) {
      return jsonError('INVALID_BODY', 'Expected moderation intent and listingId.', { status: 400 });
    }

    if (body.intent !== 'approve' && body.intent !== 'needs_changes' && body.intent !== 'publish') {
      return jsonError('INVALID_INTENT', 'Unsupported ecosystem moderation intent.', { status: 400 });
    }

    const result =
      body.intent === 'publish'
        ? await publishEcosystemListingForApi({ listingId: body.listingId })
        : await reviewEcosystemListingForApi({ listingId: body.listingId, decision: body.intent });

    return jsonOk(result);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    return jsonError('ECOSYSTEM_MODERATION_MUTATION_FAILED', error instanceof Error ? error.message : 'Unable to moderate listing.', { status: 500 });
  }
}
