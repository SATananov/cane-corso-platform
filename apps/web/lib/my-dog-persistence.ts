import type {
  ExecuteDogProfileActionInput,
  ExecuteDogProfileActionResult,
} from '@cane-corso-platform/contracts';

const STORAGE_KEY = 'ccp:my-dogs:profile-actions:v1';

type PersistedDogProfiles = Record<string, ExecuteDogProfileActionResult>;

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readPersistedProfiles(): PersistedDogProfiles {
  if (!canUseStorage()) {
    return {};
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as PersistedDogProfiles;
  } catch {
    return {};
  }
}

function writePersistedProfiles(value: PersistedDogProfiles) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function resolveDogId(input: ExecuteDogProfileActionInput): string {
  if (input.profile.dogId) {
    return input.profile.dogId;
  }

  if (input.profile.slug) {
    return input.profile.slug;
  }

  return `dog_${Date.now()}`;
}

export function getPersistedDogProfile(dogId: string) {
  const persistedProfiles = readPersistedProfiles();
  return persistedProfiles[dogId] ?? null;
}

export function persistDogProfileAction(
  input: ExecuteDogProfileActionInput,
): ExecuteDogProfileActionResult {
  const dogId = resolveDogId(input);
  const persistedAt = new Date().toISOString();
  const lifecycleStatus = input.intent === 'submit_for_review' ? 'submitted' : 'draft';

  const result: ExecuteDogProfileActionResult = {
    ok: true,
    intent: input.intent,
    dogId,
    lifecycleStatus,
    message:
      input.intent === 'submit_for_review'
        ? 'Profile moved to submitted state through the server-ready action seam.'
        : 'Draft saved through the server-ready local persistence seam.',
    persistedAt,
    profile: {
      ...input.profile,
      dogId,
      lifecycleStatus,
    },
  };

  const persistedProfiles = readPersistedProfiles();
  persistedProfiles[dogId] = result;
  writePersistedProfiles(persistedProfiles);

  return result;
}
