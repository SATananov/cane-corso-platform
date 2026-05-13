import type { UpsertEcosystemListingInput } from '@cane-corso-platform/contracts';
import { jsonError, jsonOk } from '@/lib/api-response';
import {
  EcosystemValidationError,
  getOwnerEcosystemDocumentForApi,
  getPublishedEcosystemDirectoryDocument,
  saveOwnerEcosystemDraftForApi,
  submitOwnerEcosystemListingForApi,
} from '@/lib/ecosystem.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get('scope');

  try {
    if (scope === 'mine') {
      const document = await getOwnerEcosystemDocumentForApi();
      return jsonOk(document);
    }

    const page = url.searchParams.get('page');
    const pageSize = url.searchParams.get('pageSize');
    const document = await getPublishedEcosystemDirectoryDocument(
      page || pageSize
        ? {
            page: page ? Number(page) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined,
          }
        : undefined,
    );
    return jsonOk(document);
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    return jsonError('ECOSYSTEM_FETCH_FAILED', error instanceof Error ? error.message : 'Unable to load ecosystem.', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      intent?: 'save_draft' | 'submit_for_review';
      listing?: UpsertEcosystemListingInput;
    };

    if (!body?.intent || !body.listing) {
      return jsonError('INVALID_BODY', 'Expected intent and listing payload.', { status: 400 });
    }

    if (body.intent !== 'save_draft' && body.intent !== 'submit_for_review') {
      return jsonError('INVALID_INTENT', 'Unsupported ecosystem mutation intent.', { status: 400 });
    }

    const listing =
      body.intent === 'submit_for_review'
        ? await submitOwnerEcosystemListingForApi(body.listing)
        : await saveOwnerEcosystemDraftForApi(body.listing);

    return jsonOk(listing, { status: body.intent === 'submit_for_review' ? 201 : 200 });
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
    }

    if (error instanceof EcosystemValidationError) {
      return jsonError('ECOSYSTEM_VALIDATION_FAILED', error.message, { status: 422 });
    }

    return jsonError('ECOSYSTEM_MUTATION_FAILED', error instanceof Error ? error.message : 'Unable to store listing.', { status: 500 });
  }
}
