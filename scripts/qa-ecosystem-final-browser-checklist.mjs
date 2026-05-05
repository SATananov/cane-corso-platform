#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const failures = [];
function read(p){ const a=path.join(root,p); if(!existsSync(a)){failures.push(`Missing file: ${p}`); return '';} return readFileSync(a,'utf8'); }
function ok(desc, pass, detail=''){ console.log(`${pass?'PASS':'FAIL'} ${desc}${detail?` — ${detail}`:''}`); if(!pass) failures.push(`${desc}${detail?` — ${detail}`:''}`); }
function has(src,p,values,desc){ const m=values.filter(v=>!src.includes(v)); ok(desc, m.length===0, m.length?`${p} missing ${m.join(', ')}`:p); }
function lacks(src,p,value,desc){ ok(desc, !src.includes(value), `${p} must not include ${value}`); }
const pkg=read('package.json');
const doc=read('docs/qa/step26-final-browser-qa-checklist.md');
const ownerPage=read('apps/web/app/(member)/ecosystem/page.tsx');
const owner=read('apps/web/components/ecosystem-owner-workspace.tsx');
const community=read('apps/web/app/(public)/community/page.tsx');
const detail=read('apps/web/app/(public)/community/[slug]/page.tsx');
const api=read('apps/web/app/api/ecosystem/[slug]/route.ts');
const admin=read('apps/web/app/(admin)/admin/ecosystem/page.tsx');
const mod=read('apps/web/components/ecosystem-moderation-dashboard.tsx');
const partners=read('apps/web/app/(public)/partners/page.tsx');
const registry=read('apps/web/app/(public)/registry/page.tsx');
const gallery=read('apps/web/app/(public)/gallery/page.tsx');
const verify=read('apps/web/app/verify/page.tsx');
const cert=read('apps/web/app/certificate/[code]/page.tsx');
[
'apps/web/app/(public)/registry/page.tsx','apps/web/app/(public)/registry/[slug]/page.tsx','apps/web/app/(public)/gallery/page.tsx','apps/web/app/certificate/[code]/page.tsx','apps/web/app/verify/page.tsx','apps/web/app/verify/[code]/page.tsx','apps/web/app/(public)/community/page.tsx','apps/web/app/(public)/community/[slug]/page.tsx','apps/web/app/(public)/partners/page.tsx','apps/web/app/(public)/partners/[slug]/page.tsx','apps/web/app/(admin)/review/page.tsx','apps/web/app/(admin)/admin/partners/page.tsx','apps/web/app/(admin)/admin/ecosystem/page.tsx'
].forEach(f=>ok(`Locked release surface still exists: ${f}`, existsSync(path.join(root,f)), f));
has(pkg,'package.json',['"ecosystem:browser-final:qa": "node scripts/qa-ecosystem-final-browser-checklist.mjs"'],'Root package exposes Step 26 final browser checklist QA command');
has(doc,'docs/qa/step26-final-browser-qa-checklist.md',['Step 26 — Final Browser QA Checklist','authenticated member `/ecosystem` owner workspace','public ecosystem detail `/community/[slug]`','certificate / verify detail routes `/certificate/[code]` and `/verify/[code]`','pnpm ecosystem:browser-final:qa','cane-corso-platform_release_candidate_after_step27_ecosystem_cycle.zip'],'Step 26 document records final manual browser QA scope');
has(ownerPage,'apps/web/app/(member)/ecosystem/page.tsx',['getOptionalCookieMemberSession','redirect','<EcosystemOwnerWorkspace'],'Member ecosystem route remains authenticated and owner-workspace based');
has(owner,'apps/web/components/ecosystem-owner-workspace.tsx',['Owner workspace safety','function canEditMemberListing(status: EcosystemListingStatus)',"return status === 'draft' || status === 'needs_changes';",'ecosystem-owner-guardrail-card','ecosystem-owner-item__state-note--editable','ecosystem-owner-item__state-note--locked'],'Owner workspace keeps Step 25 safety copy and edit boundary');
has(community,'apps/web/app/(public)/community/page.tsx',['getPublishedEcosystemDirectoryDocument','<EcosystemDirectory'],'Community route remains public ecosystem directory');
has(detail,'apps/web/app/(public)/community/[slug]/page.tsx',['getPublishedEcosystemProfileDocument','notFound()','<EcosystemProfileDetail document={document} locale={locale} />'],'Community detail route remains published-profile based');
has(api,'apps/web/app/api/ecosystem/[slug]/route.ts',['export async function GET','getPublishedEcosystemProfileDocument','ECOSYSTEM_PROFILE_NOT_FOUND'],'Public detail API remains read-only and published-profile based');
lacks(api,'apps/web/app/api/ecosystem/[slug]/route.ts','export async function POST','Public detail API still has no write action');
has(admin,'apps/web/app/(admin)/admin/ecosystem/page.tsx',['getEcosystemModerationDocument','<EcosystemModerationDashboard'],'Admin ecosystem route remains moderation-dashboard based');
has(mod,'apps/web/components/ecosystem-moderation-dashboard.tsx',["const canReview = item.listing.status === 'pending_review'","const canPublish = item.listing.status === 'approved' && !isSuggestion",'requestEcosystemChangesAction','approveEcosystemListingAction','publishEcosystemListingAction'],'Admin moderation controls remain status-gated');
has(partners,'apps/web/app/(public)/partners/page.tsx',['getPartnerDirectoryDocument','<PartnerDirectoryOverview'],'Partners route remains partner directory sanity surface');
has(registry,'apps/web/app/(public)/registry/page.tsx',['getPublishedRegistryDocument','<PublicRegistryOverview'],'Registry route remains published-registry based');
has(gallery,'apps/web/app/(public)/gallery/page.tsx',['getUsgGalleryDocument','ImageLightbox'],'Gallery route remains USG-gallery based');
has(verify,'apps/web/app/verify/page.tsx',['<VerifyEntryPanel','VerifyLandingPage'],'Verify landing route remains available');
has(cert,'apps/web/app/certificate/[code]/page.tsx',['getVerificationDocument','<CertificateV2Document'],'Certificate route remains verification-document based');
if(failures.length){ console.error('\nFinal browser checklist guardrail QA failed:'); failures.forEach(f=>console.error(`- ${f}`)); process.exit(1); }
console.log('\nFinal browser checklist guardrail QA complete. Step 26 is ready for local browser evidence without unlocking protected surfaces.');
