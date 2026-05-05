import type {
  ApiEnvelope,
  AuthStrategyDocument,
  CurrentProfileDocument,
  DogsCollectionDocument,
  EcosystemDirectoryDocument,
  HealthDocument,
  PartnerDirectoryDocument,
  PublicRegistryDocument,
  PublicRegistryProfileDocument,
  SessionDocument,
  VerificationDocument,
} from '@cane-corso-platform/contracts';

const defaultBaseUrl = 'http://localhost:3000';

function getRuntimeEnv() {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
}

export function getApiBaseUrl() {
  return (getRuntimeEnv().EXPO_PUBLIC_API_BASE_URL ?? defaultBaseUrl).replace(/\/$/, '');
}

function isApiEnvelope<TData>(value: unknown): value is ApiEnvelope<TData> {
  return Boolean(value && typeof value === 'object' && 'ok' in value);
}

async function parseApiEnvelope<TData>(path: string, init?: RequestInit): Promise<ApiEnvelope<TData>> {
  const url = `${getApiBaseUrl()}${path}`;
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch (error) {
    throw new Error(
      `Mobile API request failed for ${path}. Check EXPO_PUBLIC_API_BASE_URL, the Next.js dev server, and whether a physical device can reach your computer IP. ${
        error instanceof Error ? error.message : ''
      }`.trim(),
    );
  }

  const rawBody = await response.text();
  let json: unknown = null;

  try {
    json = rawBody ? (JSON.parse(rawBody) as unknown) : null;
  } catch {
    throw new Error(`API request for ${path} returned non-JSON response ${response.status}.`);
  }

  if (!isApiEnvelope<TData>(json)) {
    throw new Error(`API request for ${path} returned an invalid envelope.`);
  }

  return json;
}

export async function fetchApiDocument<TData>(path: string, init?: RequestInit): Promise<TData> {
  const envelope = await parseApiEnvelope<TData>(path, init);

  if (!envelope.ok) {
    throw new Error(envelope.error.message);
  }

  return envelope.data;
}

export async function fetchOptionalApiDocument<TData>(path: string, init?: RequestInit): Promise<TData | null> {
  const envelope = await parseApiEnvelope<TData>(path, init);
  return envelope.ok ? envelope.data : null;
}

export function fetchCurrentSessionDocument() {
  return fetchApiDocument<SessionDocument>('/api/session');
}

export function fetchCurrentProfileDocument() {
  return fetchApiDocument<CurrentProfileDocument>('/api/profile/me');
}

export function fetchDogsDocument() {
  return fetchApiDocument<DogsCollectionDocument>('/api/dogs');
}

export function fetchHealthDocument() {
  return fetchApiDocument<HealthDocument>('/api/health');
}

export function fetchAuthStrategyDocument() {
  return fetchApiDocument<AuthStrategyDocument>('/api/auth/provider');
}

export function fetchPublicRegistryDocument() {
  return fetchApiDocument<PublicRegistryDocument>('/api/registry');
}

export function fetchPublicRegistryProfileDocument(slug: string) {
  return fetchApiDocument<PublicRegistryProfileDocument>(`/api/registry/${encodeURIComponent(slug)}`);
}

export function fetchOptionalPublicRegistryProfileDocument(slug: string) {
  return fetchOptionalApiDocument<PublicRegistryProfileDocument>(`/api/registry/${encodeURIComponent(slug)}`);
}

export function fetchVerificationDocument(code: string) {
  return fetchApiDocument<VerificationDocument>(`/api/verify/${encodeURIComponent(code)}`);
}

export function fetchOptionalVerificationDocument(code: string) {
  return fetchOptionalApiDocument<VerificationDocument>(`/api/verify/${encodeURIComponent(code)}`);
}

export function fetchPartnerDirectoryDocument() {
  return fetchApiDocument<PartnerDirectoryDocument>('/api/partners');
}

export function fetchEcosystemDirectoryDocument() {
  return fetchApiDocument<EcosystemDirectoryDocument>('/api/ecosystem');
}
