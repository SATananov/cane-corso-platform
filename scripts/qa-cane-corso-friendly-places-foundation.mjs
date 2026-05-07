#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let failed = false;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed = true; console.error(`FAIL ${message}`); }
function assert(condition, message) { condition ? pass(message) : fail(message); }
const owner = read('apps/web/components/ecosystem-owner-workspace.tsx');
const directory = read('apps/web/components/ecosystem-directory.tsx');
const css = read('apps/web/app/globals.css');
const pkg = JSON.parse(read('package.json'));
assert(owner.includes('FriendlyPlaceQuickStart'), 'Owner ecosystem workspace includes a friendly-place quick-start panel');
assert(owner.includes("defaultValue={item?.submissionChannel ?? 'community_listing'}"), 'New ecosystem submissions default to community listing');
assert(owner.includes("defaultValue={item?.listingType ?? 'walk_play_place'}"), 'New ecosystem submissions default to walk/play places');
assert(owner.indexOf('<FriendlyPlaceQuickStart') < owner.indexOf('<EcosystemListingForm'), 'Friendly-place guidance appears before the submission form');
assert(owner.indexOf('<EcosystemListingForm') < owner.indexOf('<EcosystemSubmissionMatrix'), 'Submission form appears before the explanatory matrix');
assert(owner.includes('Подходящо ли е за едри породи?'), 'Bulgarian place checklist includes large-breed suitability');
assert(owner.includes('Правила за повод или намордник'), 'Bulgarian place checklist includes leash/muzzle rules');
assert(directory.includes('friendlyPlaces = document.items.filter(isFriendlyPlace)'), 'Public directory computes friendly-place items');
assert(directory.includes('friendly-places-public-card'), 'Public directory renders friendly places spotlight card');
assert(directory.includes("const friendlyPlaceTypes = ['walk_play_place', 'pet_friendly_place']"), 'Friendly places are limited to walk/play and pet-friendly listing types');
assert(directory.includes('Места, подходящи за Cane Corso'), 'Bulgarian public copy explains approved daily Cane Corso places');
assert(directory.includes('Парк / зона за разходка'), 'Public category labels include park/walking areas');
assert(directory.includes('Заведение, подходящо за кучета'), 'Public category labels include dog-friendly venues');
assert(css.includes('Step 87 — Cane Corso-friendly places foundation'), 'Step 87 CSS block exists');
assert(css.includes('.friendly-place-start'), 'Friendly place owner panel CSS exists');
assert(css.includes('.friendly-places-public-card'), 'Friendly place public card CSS exists');
assert(pkg.scripts['ecosystem:friendly-places:qa'] === 'node scripts/qa-cane-corso-friendly-places-foundation.mjs', 'Package script ecosystem:friendly-places:qa exists');
const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/app/api/health/db/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
];
for (const file of lockedFiles) assert(fs.existsSync(path.join(root, file)), `Locked backend file remains present: ${file}`);
if (failed) { console.error('\nCane Corso-friendly places foundation QA failed.'); process.exit(1); }
console.log('\nCane Corso-friendly places foundation QA complete.');
