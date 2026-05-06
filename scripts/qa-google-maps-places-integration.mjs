import fs from 'node:fs';

const checks = [];
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(path) { if (fs.existsSync(path)) pass(`${path} exists`); else fail(`${path} exists`); }
function assertContains(path, pattern, message) {
  const text = fs.readFileSync(path, 'utf8');
  if (pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern)) pass(message);
  else fail(message);
}

assertFile('apps/web/components/google-place-picker.tsx');
assertFile('apps/web/components/friendly-places-map.tsx');
assertFile('packages/db/drizzle/0011_ecosystem_google_maps_places.sql');
assertFile('docs/qa/step88-google-maps-places-integration.md');

assertContains('packages/contracts/src/ecosystem/ecosystem.types.ts', 'googlePlaceId: string | null;', 'Contracts expose Google Place ID');
assertContains('packages/contracts/src/ecosystem/ecosystem.types.ts', 'latitude: string | null;', 'Contracts expose latitude');
assertContains('packages/db/src/schema/ecosystem.ts', "googlePlaceId: text('google_place_id')", 'DB schema includes Google place ID');
assertContains('packages/db/src/repositories/ecosystem.repository.ts', 'googleFormattedAddress: row.googleFormattedAddress', 'Repository maps Google formatted address');
assertContains('apps/web/app/(member)/ecosystem/actions.ts', "googlePlaceId: optionalString(formData, 'googlePlaceId')", 'Owner ecosystem action parses Google place ID');
assertContains('apps/web/components/ecosystem-owner-workspace.tsx', '<GooglePlacePicker', 'Owner workspace renders Google Places picker');
assertContains('apps/web/components/ecosystem-directory.tsx', '<FriendlyPlacesMap', 'Public community directory renders map');
assertContains('apps/web/components/ecosystem-profile-detail.tsx', '<FriendlyPlacesMap', 'Public detail page renders map preview');
assertContains('apps/web/components/ecosystem-moderation-dashboard.tsx', 'googleMapsUrl', 'Admin moderation shows Google Maps link');
assertContains('.env.example', 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', 'Root env example documents Google Maps key');
assertContains('apps/web/.env.example', 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', 'Web env example documents Google Maps key');
assertContains('package.json', 'ecosystem:google-maps:qa', 'Package script ecosystem:google-maps:qa exists');

if (process.exitCode) {
  throw new Error('Google Maps places integration QA failed');
}

console.log('\nGoogle Maps places integration QA complete.');
