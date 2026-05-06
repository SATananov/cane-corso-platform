#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let ok = true;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  ok = false;
  console.error(`FAIL ${message}`);
}

function exists(rel, message = `${rel} exists`) {
  if (fs.existsSync(path.join(root, rel))) pass(message);
  else fail(message);
}

function has(rel, needle, message) {
  const content = read(rel);
  if (content.includes(needle)) pass(message);
  else fail(`${message} (${needle})`);
}

function notHas(rel, needle, message) {
  const content = read(rel);
  if (!content.includes(needle)) pass(message);
  else fail(`${message} (${needle})`);
}

console.log('\n--- Step 86 Owner Identity Privacy QA ---');

exists('packages/db/drizzle/0010_owner_identity_profile.sql', 'Migration 0010 owner identity profile exists');
has('packages/db/drizzle/0010_owner_identity_profile.sql', 'middle_name', 'Migration adds middle name');
has('packages/db/drizzle/0010_owner_identity_profile.sql', 'address_line', 'Migration adds private address line');
has('packages/db/drizzle/0010_owner_identity_profile.sql', 'website_url', 'Migration adds website URL');

has('packages/db/src/schema/users.ts', "middleName: text('middle_name')", 'DB schema exposes middleName');
has('packages/db/src/schema/users.ts', "addressLine: text('address_line')", 'DB schema exposes private addressLine');
has('packages/db/src/schema/users.ts', "websiteUrl: text('website_url')", 'DB schema exposes websiteUrl');

has('packages/contracts/src/profiles/profile.types.ts', 'middleName: string | null', 'Profile contract includes middleName');
has('packages/contracts/src/profiles/profile.types.ts', 'addressLine: string | null', 'Profile contract includes addressLine');
has('packages/contracts/src/profiles/profile.types.ts', 'websiteUrl: string | null', 'Profile contract includes websiteUrl');
has('packages/contracts/src/dogs/dog-registry.types.ts', 'avatarUrl: string | null', 'Public registry owner contract includes avatarUrl');

exists('apps/web/components/owner-identity-form.tsx', 'Owner identity form component exists');
has('apps/web/components/owner-identity-form.tsx', 'labels.fields.displayName', 'Owner form includes public owner name field');
has('apps/web/components/owner-identity-form.tsx', 'addressLine', 'Owner form saves addressLine');
has('apps/web/components/owner-identity-form.tsx', 'websiteUrl', 'Owner form saves websiteUrl');
has('apps/web/components/owner-identity-form.tsx', 'phone', 'Owner form saves phone');

has('apps/web/app/api/profile/me/route.ts', 'firstName', 'Profile API accepts firstName');
has('apps/web/app/api/profile/me/route.ts', 'middleName', 'Profile API accepts middleName');
has('apps/web/app/api/profile/me/route.ts', 'addressLine', 'Profile API accepts addressLine');
has('apps/web/app/api/profile/me/route.ts', 'websiteUrl', 'Profile API accepts websiteUrl');

has('apps/web/app/(member)/profile/page.tsx', '<OwnerIdentityForm profile={profile}', 'Profile page renders owner identity form');
has('apps/web/app/(member)/profile/page.tsx', 'Публично по подразбиране: име + аватар', 'BG privacy copy states name + avatar only');
has('apps/web/app/(member)/profile/page.tsx', 'Адрес, телефон, сайт, имейл и биография остават лични', 'BG privacy copy protects private owner data');

has('packages/db/src/repositories/my-dogs.repository.ts', 'avatarUrl: row.ownerProfile.avatarUrl', 'Public registry owner maps avatarUrl');
has('packages/db/src/repositories/my-dogs.repository.ts', 'city: null', 'Public registry owner does not expose city');
has('packages/db/src/repositories/my-dogs.repository.ts', 'country: null', 'Public registry owner does not expose country');
has('apps/web/components/public-owner-badge.tsx', 'PublicOwnerBadge', 'Public owner badge component exists');
has('apps/web/components/public-registry-overview.tsx', 'PublicOwnerBadge', 'Registry overview renders public owner badge');
has('apps/web/components/public-registry-profile.tsx', 'PublicOwnerBadge', 'Registry profile renders public owner badge');
notHas('apps/web/components/public-registry-profile.tsx', 'formatLocation(entry.owner.city', 'Registry detail no longer renders owner location publicly');
notHas('apps/web/components/public-registry-overview.tsx', 'formatLocation(entry.owner.city', 'Registry overview no longer renders owner location publicly');

has('apps/web/components/review-queue-dashboard.tsx', 'review-owner-protected-card', 'Admin review renders protected owner details card');
has('apps/web/components/review-queue-dashboard.tsx', 'item.owner.addressLine', 'Admin review can see owner address');
has('apps/web/components/review-queue-dashboard.tsx', 'item.owner.websiteUrl', 'Admin review can see owner website');
has('apps/web/components/review-queue-dashboard.tsx', 'item.owner.phone', 'Admin review can see owner phone');

has('package.json', 'owner:identity-privacy:qa', 'Package script owner:identity-privacy:qa exists');
exists('docs/qa/step86-owner-identity-privacy.md', 'Step 86 QA doc exists');

if (!ok) {
  console.error('\nStep 86 Owner Identity Privacy QA failed.');
  process.exit(1);
}

console.log('\nPASS Step 86 Owner Identity Privacy QA complete.');
