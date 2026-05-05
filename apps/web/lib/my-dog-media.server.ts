import type {
  CreateDogMediaInput,
  DogMedia,
  DogMediaCollectionDocument,
  DogMediaDeleteDocument,
  DogMediaMutationDocument,
  UpdateDogMediaInput,
} from '@cane-corso-platform/contracts';
import {
  DogMediaDogNotFoundError,
  DogMediaItemNotFoundError,
  createDogMediaRepository,
} from '@cane-corso-platform/db';
import { isLocalDogMediaStorageKey, removeDogMediaFile } from '@cane-corso-platform/storage';
import { getCurrentMemberSession } from './session.server';

export { DogMediaDogNotFoundError, DogMediaItemNotFoundError };

export async function getCurrentMemberDogMediaDocument(
  dogId: string,
  options?: { allowDevFallback?: boolean },
): Promise<DogMediaCollectionDocument> {
  const { session } = await getCurrentMemberSession(options);
  const repository = createDogMediaRepository();
  const media = await repository.listByDogId(session.user.profileId, dogId);

  return {
    dogId,
    media,
  };
}

export async function getCurrentMemberDogMediaItem(
  dogId: string,
  mediaId: string,
  options?: { allowDevFallback?: boolean },
): Promise<DogMedia | null> {
  const document = await getCurrentMemberDogMediaDocument(dogId, options);
  return document.media.find((item) => item.id === mediaId) ?? null;
}

export async function createCurrentMemberDogMedia(
  dogId: string,
  input: CreateDogMediaInput,
  options?: { allowDevFallback?: boolean },
): Promise<DogMediaMutationDocument> {
  const { session } = await getCurrentMemberSession(options);
  const repository = createDogMediaRepository();
  const result = await repository.create(session.user.profileId, dogId, input);

  return {
    dogId,
    media: result.media,
    mainImageUrl: result.mainImageUrl,
  };
}

export async function updateCurrentMemberDogMedia(
  dogId: string,
  mediaId: string,
  input: UpdateDogMediaInput,
  options?: { allowDevFallback?: boolean },
): Promise<DogMediaMutationDocument> {
  const { session } = await getCurrentMemberSession(options);
  const repository = createDogMediaRepository();
  const result = await repository.update(session.user.profileId, dogId, mediaId, input);

  return {
    dogId,
    media: result.media,
    mainImageUrl: result.mainImageUrl,
  };
}

export async function removeCurrentMemberDogMedia(
  dogId: string,
  mediaId: string,
  options?: { allowDevFallback?: boolean },
): Promise<DogMediaDeleteDocument> {
  const media = await getCurrentMemberDogMediaItem(dogId, mediaId, options);

  if (!media) {
    throw new DogMediaItemNotFoundError(dogId, mediaId);
  }

  const { session } = await getCurrentMemberSession(options);
  const repository = createDogMediaRepository();
  const result = await repository.remove(session.user.profileId, dogId, mediaId);

  if (isLocalDogMediaStorageKey(media.storageKey)) {
    await removeDogMediaFile(media.storageKey);
  }

  return {
    dogId,
    mediaId,
    deleted: result.deleted,
    mainImageUrl: result.mainImageUrl,
  };
}
