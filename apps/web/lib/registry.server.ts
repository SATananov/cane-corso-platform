import { createMyDogsRepository } from '@cane-corso-platform/db';
import { requireRequestSessionCookie } from '@/lib/session.server';

export async function getPublishedRegistryDocument() {
  const repository = createMyDogsRepository();
  return repository.listPublishedRegistryEntries();
}

export async function getPublishedRegistryProfileDocument(slug: string, viewerProfileId?: string | null) {
  const repository = createMyDogsRepository();
  return repository.getPublishedRegistryEntryBySlug(slug, viewerProfileId);
}

export async function submitCurrentRegistryRating(registryEntryId: string, rating: number) {
  const repository = createMyDogsRepository();
  const { session } = await requireRequestSessionCookie();
  return repository.submitRegistryEntryRating(session.user.profileId, registryEntryId, rating);
}

export async function getVerificationDocument(code: string) {
  const repository = createMyDogsRepository();
  return repository.getVerificationDocumentByCode(code);
}


export async function getUsgGalleryDocument() {
  const repository = createMyDogsRepository();
  return repository.listUsgGalleryEntries();
}

export async function getUsgCertifiedDocument() {
  const repository = createMyDogsRepository();
  return repository.listUsgCertifiedEntries();
}
