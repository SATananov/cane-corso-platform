import type { EntityId, ISODateTimeString } from '../common/ids';
import type { AppRole } from '../auth/roles';

export interface Profile {
  id: EntityId;
  userId: EntityId;
  role: AppRole;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  locale: string | null;
  isActive: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}
