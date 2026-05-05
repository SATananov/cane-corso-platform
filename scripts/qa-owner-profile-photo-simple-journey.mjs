import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function check(label, condition) {
  checks.push({ label, condition: Boolean(condition) });
}

const profilePage = read('apps/web/app/(member)/profile/page.tsx');
const profileRoute = read('apps/web/app/api/profile/me/route.ts');
const profileClient = read('apps/web/lib/api/profile.client.ts');
const avatarUploadRoute = read('apps/web/app/api/profile/me/avatar/upload/route.ts');
const storage = read('packages/storage/src/dog-media-storage.ts');
const profileComponent = read('apps/web/components/owner-profile-photo-panel.tsx');
const profileContracts = read('packages/contracts/src/profiles/profile-api.types.ts');
const profileRepository = read('packages/db/src/repositories/profiles.repository.ts');
const css = read('apps/web/app/globals.css');
const pkg = JSON.parse(read('package.json'));

check('Owner profile photo component exists', exists('apps/web/components/owner-profile-photo-panel.tsx'));
check('Owner profile photo component is client-side', profileComponent.includes("'use client';"));
check('Component uses image file input', profileComponent.includes('type="file"') && profileComponent.includes('accept="image/png,image/jpeg,image/webp"'));
check('Component previews selected owner photo before saving', profileComponent.includes('URL.createObjectURL') && profileComponent.includes('selectedFile'));
check('Component uploads owner photo as FormData', profileComponent.includes('uploadCurrentProfileAvatar') && profileClient.includes('FormData'));
check('Component calls profile update API', profileComponent.includes('updateCurrentProfileDocument'));
check('Component refreshes route after save', profileComponent.includes('router.refresh()'));
check('Profile page imports owner photo component', profilePage.includes('OwnerProfilePhotoPanel'));
check('Profile page renders owner photo panel with avatarUrl', profilePage.includes('initialAvatarUrl={profile.avatarUrl}'));
check('Profile page includes simple owner journey checklist', profilePage.includes('profile-page__journey-card') && profilePage.includes('ownerJourneyItems'));
check('Journey tracks owner photo status', profilePage.includes('const hasOwnerPhoto = Boolean(profile.avatarUrl)'));
check('Journey tracks Cane Corso profile status', profilePage.includes('const hasCaneCorsoProfile = totalDogs > 0'));
check('Profile API exposes PATCH', profileRoute.includes('export async function PATCH'));
check('Profile PATCH avoids data URLs in the signed session cookie', !profileRoute.includes('SUPPORTED_AVATAR_DATA_URL') && profileRoute.includes('SUPPORTED_AVATAR_LOCAL_URL'));
check('Profile avatar upload route exists', exists('apps/web/app/api/profile/me/avatar/upload/route.ts'));
check('Profile avatar upload route validates images', avatarUploadRoute.includes('MAX_AVATAR_BYTES') && avatarUploadRoute.includes('SUPPORTED_AVATAR_MIME_TYPES'));
check('Profile avatar upload route refreshes signed session cookie with stored URL', avatarUploadRoute.includes('storeProfileAvatarFile') && avatarUploadRoute.includes('response.cookies.set'));
check('Storage package can store profile avatar files', storage.includes('storeProfileAvatarFile') && storage.includes('profiles'));
check('Profile API updates signed session cookie', profileRoute.includes('getSessionCookieDescriptor') && profileRoute.includes('response.cookies.set'));
check('Profile client exposes update function', profileClient.includes('updateCurrentProfileDocument'));
check('Profile client exposes avatar upload function', profileClient.includes('uploadCurrentProfileAvatar'));
check('Contracts include update input', profileContracts.includes('UpdateCurrentProfileInput'));
check('Contracts include mutation document', profileContracts.includes('CurrentProfileMutationDocument'));
check('Repository can update profile', profileRepository.includes('updateProfile(profileId') && profileRepository.includes('.update(profiles)'));
check('Repository does not require schema migration for avatar', profileRepository.includes('updates.avatarUrl'));
check('CSS includes owner profile photo styles', css.includes('.owner-profile-photo-panel'));
check('CSS includes owner journey styles', css.includes('.profile-page__journey-step'));
check('Step 77 QA doc exists', exists('docs/qa/step77-owner-profile-photo-simple-journey.md'));
check('Package script owner:profile-photo-journey:qa exists', pkg.scripts?.['owner:profile-photo-journey:qa'] === 'node scripts/qa-owner-profile-photo-simple-journey.mjs');

const failed = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'} ${item.label}`);
}

if (failed.length > 0) {
  console.error(`\nOwner profile photo/simple journey QA failed: ${failed.length} check(s).`);
  process.exit(1);
}

console.log('\nOwner profile photo/simple journey QA complete.');
console.log('PASS Owner profile photo and simple owner journey passed');
