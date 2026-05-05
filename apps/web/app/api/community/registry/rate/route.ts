import { NextResponse } from 'next/server';
import { submitCurrentRegistryRating } from '@/lib/registry.server';
import { SessionUnavailableError } from '@/lib/session.server';

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const slug = getField(formData, 'slug');
  const registryEntryId = getField(formData, 'registryEntryId');
  const ratingValue = Number.parseInt(getField(formData, 'rating'), 10);
  const baseUrl = new URL(request.url);

  if (!slug || !registryEntryId) {
    return NextResponse.redirect(new URL('/registry?rating=error', baseUrl), { status: 303 });
  }

  try {
    await submitCurrentRegistryRating(registryEntryId, ratingValue);
    return NextResponse.redirect(new URL(`/registry/${slug}?rating=saved`, baseUrl), { status: 303 });
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      return NextResponse.redirect(new URL('/access?intent=member', baseUrl), { status: 303 });
    }

    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    const status =
      message === 'OWN_ENTRY_NOT_ALLOWED'
        ? 'own'
        : message === 'INVALID_RATING'
          ? 'invalid'
          : message === 'REGISTRY_ENTRY_NOT_FOUND'
            ? 'missing'
            : 'error';

    return NextResponse.redirect(new URL(`/registry/${slug}?rating=${status}`, baseUrl), { status: 303 });
  }
}
