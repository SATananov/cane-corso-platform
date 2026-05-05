import type { AppRole } from '../auth/roles';
import type { EcosystemListingType } from './ecosystem.types';

export const ECOSYSTEM_SUBMISSION_CHANNELS = [
  'official_listing',
  'community_listing',
  'community_suggestion',
] as const;

export type EcosystemSubmissionChannel = (typeof ECOSYSTEM_SUBMISSION_CHANNELS)[number];

export type EcosystemSubmissionAuthority = 'official' | 'community';
export type EcosystemSubmissionOutcome = 'public_directory' | 'internal_signal';

export interface EcosystemSubmissionRule {
  channel: EcosystemSubmissionChannel;
  authority: EcosystemSubmissionAuthority;
  outcome: EcosystemSubmissionOutcome;
  allowedRoles: readonly AppRole[];
  allowedListingTypes: readonly EcosystemListingType[];
}

const ALL_ECOSYSTEM_LISTING_TYPES: readonly EcosystemListingType[] = [
  'partner_service',
  'transport_relocation',
  'hotel_boarding',
  'walk_play_place',
  'pet_friendly_place',
  'puppy_listing',
  'adoption_new_home',
  'breeding_match',
  'event',
];

export const ECOSYSTEM_SUBMISSION_RULES: readonly EcosystemSubmissionRule[] = [
  {
    channel: 'official_listing',
    authority: 'official',
    outcome: 'public_directory',
    allowedRoles: ['member', 'partner', 'reviewer', 'admin', 'super_admin'],
    allowedListingTypes: [
      'partner_service',
      'transport_relocation',
      'hotel_boarding',
      'puppy_listing',
      'adoption_new_home',
      'breeding_match',
      'event',
    ],
  },
  {
    channel: 'community_listing',
    authority: 'community',
    outcome: 'public_directory',
    allowedRoles: ['member', 'partner', 'reviewer', 'admin', 'super_admin'],
    allowedListingTypes: [
      'walk_play_place',
      'pet_friendly_place',
      'adoption_new_home',
      'breeding_match',
      'event',
    ],
  },
  {
    channel: 'community_suggestion',
    authority: 'community',
    outcome: 'internal_signal',
    allowedRoles: ['member', 'partner', 'reviewer', 'admin', 'super_admin'],
    allowedListingTypes: ALL_ECOSYSTEM_LISTING_TYPES,
  },
] as const;

export function isEcosystemSubmissionChannel(value: string): value is EcosystemSubmissionChannel {
  return (ECOSYSTEM_SUBMISSION_CHANNELS as readonly string[]).includes(value);
}

export function getEcosystemSubmissionRule(channel: EcosystemSubmissionChannel): EcosystemSubmissionRule {
  const match = ECOSYSTEM_SUBMISSION_RULES.find((rule) => rule.channel === channel);

  if (!match) {
    throw new Error(`Missing ecosystem submission rule for ${channel}.`);
  }

  return match;
}

export function getEcosystemSubmissionAuthority(
  channel: EcosystemSubmissionChannel,
): EcosystemSubmissionAuthority {
  return getEcosystemSubmissionRule(channel).authority;
}

export function isPublishableEcosystemChannel(channel: EcosystemSubmissionChannel): boolean {
  return getEcosystemSubmissionRule(channel).outcome === 'public_directory';
}

export function isListingTypeAllowedForEcosystemChannel(
  listingType: EcosystemListingType,
  channel: EcosystemSubmissionChannel,
): boolean {
  return getEcosystemSubmissionRule(channel).allowedListingTypes.includes(listingType);
}

export function resolveDefaultEcosystemSubmissionChannel(
  listingType: EcosystemListingType,
): EcosystemSubmissionChannel {
  if (
    listingType === 'walk_play_place' ||
    listingType === 'pet_friendly_place' ||
    listingType === 'adoption_new_home' ||
    listingType === 'breeding_match' ||
    listingType === 'event'
  ) {
    return 'community_listing';
  }

  return 'official_listing';
}
