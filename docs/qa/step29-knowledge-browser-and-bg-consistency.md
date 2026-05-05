# Step 29 — Knowledge Browser Evidence + BG Consistency

Status: PASS / LOCK after QA.

## Goal

Step 29 adds a safe browser-evidence and Bulgarian terminology consistency layer after the Knowledge Center foundation and polish passes.

The purpose is to make the public Knowledge path feel cleaner in Bulgarian and to remove mixed BG/EN wording from the public help/navigation context around:

- `/knowledge`
- `/guide`
- `/community`
- `/faq`
- member-facing My Cane Corso guidance
- shared Bulgarian i18n copy that introduces Knowledge, Registry, Verify, Partners, and member workspace flows

## Safety boundary

This step is copy/QA only.

It must not change the locked business logic for:

- Registry
- Certificate
- Gallery
- Verify
- Admin moderation
- Ecosystem API / DB logic
- Review / publish workflow
- Certificate issuing or revoking
- Public registry detail logic

## Files intentionally touched

- `apps/web/lib/i18n.ts`
- `apps/web/components/platform-guide.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/app/(public)/community/page.tsx`
- `apps/web/app/(public)/faq/page.tsx`
- `docs/qa/step29-knowledge-browser-and-bg-consistency.md`
- `scripts/qa-knowledge-browser-bg-consistency.mjs`
- `package.json`

## Browser evidence checklist

When running locally, verify:

1. `/knowledge` still renders the Knowledge Center after Step 28.3.
2. `/guide` in BG no longer shows mixed labels such as `Community`, `Knowledge`, `Registry`, `Verify`, `owner workspace`, or `pet-friendly` inside Bulgarian explanatory copy.
3. `/community` in BG uses clear terms for community, new home, breeding/match, places, services, and moderation.
4. `/faq` in BG reads as “Чести въпроси” and avoids mixed BG/EN wording in cards and bullets.
5. `/my-dogs` in BG explains the private owner path without confusing mixed terminology.
6. Header, Registry, Certificate, Gallery, Verify, Admin, and Ecosystem flows remain unchanged.

## QA command

```bash
pnpm knowledge:browser-bg:qa
```

## Result

Step 29 keeps the Knowledge layer browser-ready in Bulgarian and prepares the platform for the next larger slice: Admin-managed Knowledge Articles foundation.
