# Step 72 — Public Detail Pages Runtime Smoke

Status: PASS / LOCK after the public detail runtime smoke and the Step 72 detail candidate 2xx guardrail fix.

## Purpose

Step 72 verifies that public detail routes remain accessible to anonymous visitors after the Step 66–71 auth/session, role separation, public access, and public surface content locks.

This is a read-only runtime smoke. It must not create, submit, approve, publish, archive, delete, or otherwise mutate Registry, Knowledge, Partners, Community/Ecosystem, Certificate, Verify, Gallery, Auth, or session data.

## Runtime command

Run the public detail runtime smoke with:

```powershell
$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3000"
pnpm demo:public-detail-pages:qa
```

If the local app uses another port, set:

```powershell
$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3001"
pnpm demo:public-detail-pages:qa
```

## Static command

```powershell
pnpm demo:public-detail-pages:static:qa
```

## Boundary history

Step 72 builds on and preserves the locked runtime boundary history:

- Step 66 — Demo Runtime Session / Member Area Smoke.
- Step 67 — Admin Runtime Session / Protected Admin Surface Smoke.
- Step 68 — Runtime Role Separation Smoke.
- Step 69 — Session Boundary Release Lock.
- Step 70 — Public Runtime Access Smoke.
- Step 71 — Public Surface Content Runtime Smoke.

The auth/session boundary stays locked. Public detail checks must not weaken member/admin route protection or introduce dev fallback session behavior.

## Public detail routes covered

The smoke covers the public detail page families:

- Registry public profile detail: `/registry/[slug]`
- Knowledge article detail: `/knowledge/[slug]`
- Partner profile detail: `/partners/[slug]`
- Community/Ecosystem detail: `/community/[slug]`

Registry detail is optional in demo database states where no published registry profile is available.

## Published detail acceptance rule

A published public detail page is accepted when the candidate:

- returns HTTP 2xx;
- does not redirect to `/access`;
- does not render signed-out, member-required, admin-required, or protected-route notice copy;
- does not render a real top-level server/error shell;
- renders a non-empty public HTML document;
- renders public detail evidence or substantial HTML.

This deliberately avoids implementation-specific text matching. A normal Next.js rendered HTML document, image preload payload, or development HTML shell must not be misclassified as an error shell when the route returns HTTP 2xx and public content is present.

## Non-public ecosystem detail guardrail

The smoke verifies that non-public ecosystem entries do not open publicly, including draft, pending/submitted, approved, and community suggestion states. These routes must avoid leaking server errors or protected data.

## Expected result

A successful run ends with:

```text
Step 72 public detail pages runtime smoke complete.
```

Step 72 remains a read-only guardrail and must preserve locked public/admin/session boundaries from Steps 66–71.
