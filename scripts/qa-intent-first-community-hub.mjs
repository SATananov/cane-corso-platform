#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let failed = false;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed = true; console.error(`FAIL ${message}`); }
function assert(condition, message) { condition ? pass(message) : fail(message); }
const contracts = read('packages/contracts/src/ecosystem/ecosystem.types.ts');
const submissions = read('packages/contracts/src/ecosystem/ecosystem-submission.types.ts');
const repo = read('packages/db/src/repositories/ecosystem.repository.ts');
const ui = read('apps/web/lib/ecosystem-ui.ts');
const communityPage = read('apps/web/app/(public)/community/page.tsx');
const directory = read('apps/web/components/ecosystem-directory.tsx');
const detail = read('apps/web/components/ecosystem-profile-detail.tsx');
const owner = read('apps/web/components/ecosystem-owner-workspace.tsx');
const actions = read('apps/web/app/(member)/ecosystem/actions.ts');
const admin = read('apps/web/components/ecosystem-moderation-dashboard.tsx');
const mobile = read('apps/mobile/App.tsx');
const css = read('apps/web/app/globals.css');
const pkg = JSON.parse(read('package.json'));
assert(contracts.includes("'lost_found'"), 'Contracts include lost/found listing type');
assert(submissions.includes("'lost_found'") && submissions.includes("'puppy_listing'") && submissions.includes("community_listing"), 'Submission rules include community intent types');
assert(submissions.includes("listingType === 'lost_found'"), 'Lost/found defaults to community listing');
assert(repo.includes("'lost_found'"), 'DB repository accepts lost/found listing type');
assert(ui.includes("lost_found: 'Загубени / намерени Cane Corso'"), 'Bulgarian UI labels include lost/found Cane Corso');
assert(mobile.includes("lost_found: 'Lost / found'"), 'Mobile listing type labels include lost/found');
assert(communityPage.includes('Cane Corso търси: помощ, дом, партньор, места и услуги'), 'Community page hero is intent-first in Bulgarian');
assert(directory.includes('community-intent-hub'), 'Public community directory renders intent hub');
assert(directory.includes('Cane Corso търси:'), 'Public community hub uses Cane Corso търси headline');
assert(directory.includes('Загубени / намерени Cane Corso'), 'Public hub includes lost/found card');
assert(directory.includes('Женско търси мъжко'), 'Public hub includes female/male breeding intent');
assert(directory.includes('adminConnection'), 'Public directory uses admin-mediated contact label');
assert(directory.includes('isAdminMediatedContactType'), 'Public directory protects sensitive contact fields');
assert(detail.includes('isAdminMediatedListing'), 'Public detail detects admin-mediated listing types');
assert(detail.includes('Връзка чрез админ'), 'Public detail shows admin-mediated Bulgarian contact copy');
assert(detail.includes('!isMediated'), 'Public detail hides direct website/contact actions for mediated listings');
assert(owner.includes('CommunityIntentQuickStart'), 'Owner workspace renders intent-first quick start');
assert(owner.includes('Без директно публично свързване'), 'Owner workspace explains no direct public matching');
assert(owner.includes('coverImageUrl') && owner.includes('logoUrl'), 'Owner ecosystem form supports visual image URL fields');
assert(actions.includes("coverImageUrl: optionalString(formData, 'coverImageUrl')"), 'Owner ecosystem action parses cover image URL');
assert(actions.includes("logoUrl: optionalString(formData, 'logoUrl')"), 'Owner ecosystem action parses secondary image URL');
assert(admin.includes('чувствителни заявки за свързване'), 'Admin moderation copy mentions sensitive connection requests');
assert(css.includes('Step 89 — Intent-first Community Hub'), 'Step 89 CSS block exists');
assert(pkg.scripts['community:intent-hub:qa'] === 'node scripts/qa-intent-first-community-hub.mjs', 'Package script community:intent-hub:qa exists');
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
if (failed) { console.error('\nIntent-first community hub QA failed.'); process.exit(1); }
console.log('\nIntent-first community hub QA complete.');
