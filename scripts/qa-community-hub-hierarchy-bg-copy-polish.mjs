#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let failed = false;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed = true; console.error(`FAIL ${message}`); }
function assert(condition, message) { condition ? pass(message) : fail(message); }
function indexOfOrFail(content, needle, label) {
  const index = content.indexOf(needle);
  assert(index >= 0, label);
  return index;
}
const communityPage = read('apps/web/app/(public)/community/page.tsx');
const directory = read('apps/web/components/ecosystem-directory.tsx');
const discovery = read('apps/web/components/community-discovery-experience.tsx');
const pkg = JSON.parse(read('package.json'));
const docExists = fs.existsSync(path.join(root, 'docs/qa/step90-community-hub-hierarchy-bg-copy-polish.md'));
assert(docExists, 'Step 90 QA document exists');
assert(pkg.scripts['community:hub-polish:qa'] === 'node scripts/qa-community-hub-hierarchy-bg-copy-polish.mjs', 'Package script community:hub-polish:qa exists');
const directoryIndex = indexOfOrFail(communityPage, '<EcosystemDirectory', 'Community page renders EcosystemDirectory');
const discoveryIndex = indexOfOrFail(communityPage, '<CommunityDiscoveryExperience', 'Community page renders discovery support section');
assert(directoryIndex < discoveryIndex, 'Community page shows action hub before support discovery section');
const hubIndex = indexOfOrFail(directory, 'className="content-card community-intent-hub"', 'Intent hub section exists');
const listingsIndex = indexOfOrFail(directory, 'className="content-card community-intent-listings"', 'Sensitive listings section exists');
const statsIndex = indexOfOrFail(directory, 'community-summary-stats', 'Summary stats moved into secondary position');
const placesIndex = indexOfOrFail(directory, 'id="cane-corso-friendly-places"', 'Friendly places section exists');
const servicesIndex = indexOfOrFail(directory, 'id="ecosystem-directory"', 'Services directory section exists');
assert(hubIndex < listingsIndex, 'Intent hub appears before active sensitive listings');
assert(listingsIndex < statsIndex, 'Active sensitive listings appear before summary stats');
assert(statsIndex < placesIndex, 'Summary stats appear before places after main actions');
assert(placesIndex < servicesIndex, 'Places appear before services directory');
assert(directory.includes("apply: 'Изпрати заявка'"), 'Bulgarian primary CTA uses Изпрати заявка');
assert(directory.includes("offerHelp: 'Предложи помощ'"), 'Bulgarian mediated response CTA uses Предложи помощ');
assert(directory.includes("placesTitle: 'Места, подходящи за Cane Corso'"), 'Bulgarian places headline avoids mixed friendly label');
assert(directory.includes("title: 'Загубен / намерен Cane Corso'") && directory.indexOf("title: 'Загубен / намерен Cane Corso'") < directory.indexOf("title: 'Cane Corso търси дом'"), 'Lost/found intent is first in Bulgarian intent cards');
assert(discovery.includes("eyebrow: 'Допълнителна ориентация'"), 'Discovery section is labelled as secondary orientation in Bulgarian');
assert(discovery.includes('Този блок е само ориентация'), 'Discovery section explains it is secondary support');
assert(!directory.includes('Изпрати запио'), 'No misspelled Bulgarian submit CTA remains in community directory');
assert(!directory.includes("placesEyebrow: 'Cane Corso-friendly места'"), 'No mixed BG/EN Cane Corso-friendly places eyebrow remains');
assert(!discovery.includes('Публичен каталог за партньори, услуги, места и полезни предложения, които минават през преглед.\n      emptyTitle'), 'No malformed community copy block exists');
const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/health/db/route.ts',
];
for (const file of lockedFiles) assert(fs.existsSync(path.join(root, file)), `Locked authority file remains present: ${file}`);
if (failed) { console.error('\nCommunity hub hierarchy/BG copy polish QA failed.'); process.exit(1); }
console.log('\nCommunity hub hierarchy/BG copy polish QA complete.');
