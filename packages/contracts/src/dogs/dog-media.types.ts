import type { EntityId, ISODateTimeString } from '../common/ids';
import type { MediaType, StorageAsset } from '../common/media';

export interface DogMedia extends StorageAsset {
  id: EntityId;
  dogId: EntityId;
  mediaType: MediaType;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  isVisibleInRegistry: boolean;
  isVisibleInUsgGallery: boolean;
  uploadedByProfileId: EntityId;
  createdAt: ISODateTimeString;
}

export interface DogMediaCollectionDocument {
  dogId: EntityId;
  media: DogMedia[];
}

export interface CreateDogMediaInput {
  publicUrl: string;
  altText?: string | null;
  mediaType?: MediaType;
  mimeType?: string | null;
  sizeBytes?: number | null;
  storageKey?: string | null;
  isPrimary?: boolean;
  visibleInRegistry?: boolean;
  visibleInUsgGallery?: boolean;
}

export interface UpdateDogMediaInput {
  altText?: string | null;
  isPrimary?: boolean;
  sortOrder?: number | null;
  visibleInRegistry?: boolean;
  visibleInUsgGallery?: boolean;
}

export interface DogMediaMutationDocument {
  dogId: EntityId;
  media: DogMedia;
  mainImageUrl: string | null;
}

export interface DogMediaDeleteDocument {
  dogId: EntityId;
  mediaId: EntityId;
  deleted: boolean;
  mainImageUrl: string | null;
}
