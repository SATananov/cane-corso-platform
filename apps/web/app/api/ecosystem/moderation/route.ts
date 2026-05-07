import { jsonError, jsonOk } from '@/lib/api-response';
import {
  getAdminEcosystemModerationDocumentForApi,
  publishEcosystemListingForApi,
  reviewEcosystemListingForApi,
  reviewEcosystemMatchRequestForApi,
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
      intent?: 'approve' | 'needs_changes' | 'publish' | 'approve_match' | 'decline_match' | 'mark_match_connected';
      listingId?: string;
      requestId?: string;
      adminNote?: string | null;
    };

    if (!body?.intent) {
      return jsonError('INVALID_BODY', 'Expected moderation intent.', { status: 400 });
    }

    if (body.intent === 'approve_match' || body.intent === 'decline_match' || body.intent === 'mark_match_connected') {
      if (!body.requestId) {
        return jsonError('INVALID_BODY', 'Expected requestId for match moderation.', { status: 400 });
      }

      const result = await reviewEcosystemMatchRequestForApi({
        requestId: body.requestId,
        decision:
          body.intent === 'approve_match'
            ? 'approve_to_connect'
            : body.intent === 'mark_match_connected'
              ? 'mark_connected'
              : 'decline',
        adminNote: body.adminNote,
      });

      return jsonOk(result);
    }

    if (!body.listingId) {
      return jsonError('INVALID_BODY', 'Expected listingId for listing moderation.', { status: 400 });
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
