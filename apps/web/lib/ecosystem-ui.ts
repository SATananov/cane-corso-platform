import type {
  EcosystemListingStatus,
  EcosystemListingType,
  EcosystemSubmissionChannel,
} from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';

export function getEcosystemListingTypeLabels(locale: Locale): Record<EcosystemListingType, string> {
  const map = {
    en: {
      partner_service: 'Partner & services',
      transport_relocation: 'Transport & relocation',
      hotel_boarding: 'Hotels & boarding',
      walk_play_place: 'Walk & play places',
      pet_friendly_place: 'Pet-friendly places',
      puppy_listing: 'Cane Corso puppies',
      adoption_new_home: 'Adoption & new home',
      breeding_match: 'Breeding / match',
      event: 'Events & activities',
    },
    bg: {
      partner_service: 'Партньори и услуги',
      transport_relocation: 'Транспорт и преместване',
      hotel_boarding: 'Хотели и престой',
      walk_play_place: 'Места за разходка и игра',
      pet_friendly_place: 'Места, подходящи за Cane Corso',
      puppy_listing: 'Малки Cane Corso',
      adoption_new_home: 'Осиновяване / търси дом',
      breeding_match: 'Разплод / търси партньор',
      event: 'Събития и активности',
    },
    it: {
      partner_service: 'Partner e servizi',
      transport_relocation: 'Trasporto e relocation',
      hotel_boarding: 'Hotel e boarding',
      walk_play_place: 'Luoghi per passeggiare e giocare',
      pet_friendly_place: 'Luoghi pet-friendly',
      puppy_listing: 'Cuccioli Cane Corso',
      adoption_new_home: 'Adozione / nuova casa',
      breeding_match: 'Riproduzione / match',
      event: 'Eventi e attività',
    },
  } as const;

  return map[locale] ?? map.en;
}

export function getEcosystemSubmissionChannelLabels(locale: Locale): Record<EcosystemSubmissionChannel, string> {
  const map = {
    en: {
      official_listing: 'Official listing',
      community_listing: 'Community listing',
      community_suggestion: 'Community suggestion',
    },
    bg: {
      official_listing: 'Официален запис',
      community_listing: 'Общностен запис',
      community_suggestion: 'Общностно предложение',
    },
    it: {
      official_listing: 'Scheda ufficiale',
      community_listing: 'Scheda community',
      community_suggestion: 'Suggerimento community',
    },
  } as const;

  return map[locale] ?? map.en;
}

export function getEcosystemListingStatusLabels(locale: Locale): Record<EcosystemListingStatus, string> {
  const map = {
    en: {
      draft: 'Draft',
      pending_review: 'Pending review',
      needs_changes: 'Needs changes',
      approved: 'Approved',
      published: 'Published',
    },
    bg: {
      draft: 'Чернова',
      pending_review: 'Чака преглед',
      needs_changes: 'Нужни корекции',
      approved: 'Одобрен',
      published: 'Публикуван',
    },
    it: {
      draft: 'Bozza',
      pending_review: 'In revisione',
      needs_changes: 'Modifiche richieste',
      approved: 'Approvata',
      published: 'Pubblicata',
    },
  } as const;

  return map[locale] ?? map.en;
}

export function getEcosystemSubmissionChannelTone(
  channel: EcosystemSubmissionChannel,
): 'official' | 'community' | 'suggestion' {
  if (channel === 'official_listing') {
    return 'official';
  }

  if (channel === 'community_listing') {
    return 'community';
  }

  return 'suggestion';
}
