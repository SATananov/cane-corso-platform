import type { ApiEnvelope } from '@cane-corso-platform/contracts';

export class ApiRequestError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, options: { code: string; status: number; details?: unknown }) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}

function isApiEnvelope<TData>(value: unknown): value is ApiEnvelope<TData> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'ok' in value;
}

function shouldAttachJsonContentType(init?: RequestInit): boolean {
  if (!init?.body) {
    return false;
  }

  if (typeof FormData !== 'undefined' && init.body instanceof FormData) {
    return false;
  }

  return true;
}

export async function fetchApiDocument<TData>(input: RequestInfo | URL, init?: RequestInit): Promise<TData> {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(shouldAttachJsonContentType(init) ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
    cache: init?.cache ?? 'no-store',
  });

  let body: unknown = null;

  try {
    body = (await response.json()) as unknown;
  } catch {
    body = null;
  }

  if (!isApiEnvelope<TData>(body)) {
    throw new ApiRequestError('The API returned an unexpected response payload.', {
      code: 'INVALID_API_RESPONSE',
      status: response.status,
    });
  }

  if (!body.ok) {
    throw new ApiRequestError(body.error.message, {
      code: body.error.code,
      status: response.status,
      details: body.error.details,
    });
  }

  return body.data;
}
