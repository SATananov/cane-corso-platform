# Step 108.1.1 — FCI / Intelligence Empty-State & Location Polish

## Purpose

This polish pass keeps Step 108.1 useful without making a new or empty Cane Corso profile feel judged too early.

## Scope

- New dog drafts must not prefill city or country with assumed demo values.
- The FCI conformity panel must show a calm empty state until enough evidence exists.
- Raw technical labels such as `low` must be localized in the visible FCI panel.
- The USG Intelligence panel must avoid presenting the feature as an active trained ML model in the visible UI.
- USG certificate and FCI conformity boundaries remain separate.

## Locked boundaries

No changes are intended for:

- Registry publication authority;
- Certificate issue/revoke logic;
- Verify lookup;
- Gallery curation;
- Auth/session;
- Neon schema or migrations;
- Admin moderation backend.

## QA command

```bash
pnpm step108-1-1:fci-ux-polish:qa
```
