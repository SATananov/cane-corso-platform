# Step 43 — Certified Archive Targeted Trust Pass

Status: ready for local verification.

## Scope

Step 43 wires the existing shared Step 42 trust panel into the public Certified archive route.

This is a targeted pass for `/certified`, because the page uses `PageShell` and needs the trust panel inserted as page content.

## Copy cleanup

Step 43 also fixes mojibake in the Certified page BG/IT copy.

## Locked boundaries

Step 43 must not change:

- Certificate issue/revoke logic
- Verify lookup logic
- Registry publish logic
- Gallery backend selection logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session
