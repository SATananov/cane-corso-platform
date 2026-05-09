# Step 106 — Full Product Structure Reset

Status: patch-ready.

Purpose: make the platform feel like one usable USG product instead of a stack of build steps.

What changed:
- primary navigation is reduced to the main public paths;
- authenticated header focuses on My Cane Corso first;
- member start page becomes action-first and removes long project explanation panels;
- Knowledge becomes a simple library-first page;
- Community removes old-project / future-layer wording and starts from real user needs;
- section guide panels are quieter and keep long explanations behind details;
- My Cane Corso removes duplicate action panels and keeps extra guidance collapsed;
- safe `.env.example` is restored for release QA.

Boundaries:
- no DB migration;
- no Registry / Certificate / Verify / Gallery authority change;
- no Auth/session change;
- no Step 104 measurement archive logic change.
