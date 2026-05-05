import type { EntityId, ISODateTimeString, Slug } from '../common/ids';
import type { PartnerStatus } from '../common/status';

export interface Partner {
  id: EntityId;
  ownerProfileId: EntityId;
  businessName: string;
  slug: Slug;
  category: string;
  shortDescription: string | null;
  longDescription: string | null;
  country: string | null;
  city: string | null;
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  status: PartnerStatus;
  isFeatured: boolean;
  publishedAt: ISODateTimeString | null;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}
