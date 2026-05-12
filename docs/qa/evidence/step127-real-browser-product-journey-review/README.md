# Step 127 — Real Browser Product Journey Review Evidence

This folder is reserved for manual browser review evidence after the Step 127 static QA checklist has passed.

It currently contains this README only. Do not add screenshots or exported browser evidence unless a real local or Netlify browser review is intentionally performed.

## Route groups

Capture evidence in this order when performing the review:

1. Guest / public journey — home, platform, registry, registry detail, gallery, certified, verify, knowledge, community, partners, FAQ, access, and runtime DB health.
2. Member / owner journey — member center, profile, My Cane Corso, new/edit/media/health flows, ecosystem workspace, and partner application.
3. Admin / reviewer journey — review queue, registry admin, members admin, partners admin, ecosystem admin, and knowledge admin.

## Evidence rules

- Do not capture secrets, database URLs, API keys, cookies, or private contact data.
- Do not capture hidden admin-only owner details unless intentionally redacted.
- Do not commit screenshots that include real user data without explicit permission.
- Treat `/api/health/db` as production-valid only when the expected database target is confirmed and no secret connection details are exposed.
- Screenshots are evidence, not a replacement for `pnpm step127:browser-product-journey:qa`, `pnpm release:fullstack-final:qa`, and `pnpm typecheck`.

## Suggested names

```txt
01-guest-home.png
02-guest-platform.png
03-guest-registry.png
04-guest-registry-detail.png
05-guest-gallery.png
06-guest-certified.png
07-guest-verify.png
08-guest-knowledge.png
09-guest-community.png
10-guest-partners.png
11-guest-faq.png
12-access.png
13-runtime-db-health.txt
14-member-dashboard.png
15-member-profile.png
16-member-my-dogs.png
17-member-new-dog.png
18-member-dog-edit.png
19-member-dog-media.png
20-member-dog-health.png
21-member-ecosystem.png
22-partner-apply.png
23-admin-review.png
24-admin-registry.png
25-admin-members.png
26-admin-partners.png
27-admin-ecosystem.png
28-admin-knowledge.png
```
