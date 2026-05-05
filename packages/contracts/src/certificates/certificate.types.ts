import type { EntityId, ISODateString, ISODateTimeString, Slug } from '../common/ids';
import type { CertificateStatus } from '../common/status';

export interface CertificateSnapshot {
  dogName: string;
  breed: 'Cane Corso';
  sex: string | null;
  dateOfBirth: ISODateString | null;
  color: string | null;
  microchipNumber: string | null;
  pedigreeNumber: string | null;
  registryClass: string | null;
  ownerName: string;
  location: string | null;
  publicSlug: Slug;
  issueDate: ISODateString;
  certificateCode: string;
  verificationSlug: Slug;
  motherName: string | null;
  fatherName: string | null;
  shortDescription: string | null;
}

export interface Certificate {
  id: EntityId;
  dogId: EntityId;
  certificateCode: string;
  issueDate: ISODateString;
  status: CertificateStatus;
  verificationSlug: Slug;
  certificateImageUrl: string | null;
  snapshot: CertificateSnapshot | null;
  issuedByProfileId: EntityId | null;
  pdfStorageKey: string | null;
  pdfUrl: string | null;
  createdAt: ISODateTimeString;
}
