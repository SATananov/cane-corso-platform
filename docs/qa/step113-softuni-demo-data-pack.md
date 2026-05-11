# Step 113 — SoftUni Demo Member & Partner Data Pack

## Status

Prepared as a safe, manual seed pack. It is not executed automatically by migrations, build, deploy, or `db:bootstrap`.

## Purpose

Step 113 gives the platform a complete educational demo world so the owner, partner, admin, public registry, public ecosystem, health/growth archive, ratings, and FCI orientation surfaces can be reviewed without manually filling long forms.

## Demo identities

| Role | Display name | Email | Password | Main use |
| --- | --- | --- | --- | --- |
| Member | `SoftUni demo` | `softuni.demo@usg.local` | `DemoMember123!` | Owner profile, My Dogs, measurements, health archive, Registry profile |
| Partner | `SoftUni Partner` | `softuni.partner@usg.local` | `DemoPartner123!` | Partner profile, Partner Directory, partner ratings, match request |
| Admin | `SoftUni admin` | `softuni.admin@usg.local` | `DemoAdmin123!` | Review, Registry admin, Partner Applications, Ecosystem moderation |

## Seed command

```powershell
pnpm demo:seed:softuni
```

Run it only after migrations are applied and `DATABASE_URL` points to the intended local/demo database.

## Seeded data

- Fully filled owner profile for `SoftUni demo`.
- Fully filled partner profile for `SoftUni Partner`.
- Fully filled admin identity for `SoftUni admin`.
- Published Cane Corso profile: `Ares SoftUni demo`.
- Registry entry: `/registry/ares-softuni-demo`.
- Active Verify code: `/verify/USG-SOFTUNI-DEMO-113`.
- Dog media placeholders under `/demo/step113/`.
- Measurement archive with 4, 8, 12, 18, and 24 month records.
- Health archive with vaccine, vet visit, and deworming demo records.
- Admin assessment with Registry approved / USG certified decisions and five visible score fields.
- Community ratings for the Registry entry.
- Partner ratings for the partner profile.
- Approved/published partner record and one pending partner application for admin review.
- Published ecosystem partner service listing.
- Published admin-mediated match listing.
- Published Cane Corso-friendly place listing with Google Maps-style fields.
- Pending lost/found listing for admin moderation visibility.
- Pending match request connected to the sensitive match listing.

## Suggested manual routes

Public:

- `/registry`
- `/registry/ares-softuni-demo`
- `/verify/USG-SOFTUNI-DEMO-113`
- `/gallery`
- `/certified`
- `/partners`
- `/partners/softuni-partner`
- `/community`
- `/community/softuni-partner-cane-corso-training-transport`
- `/community/ares-softuni-demo-controlled-match-request`
- `/community/softuni-demo-cane-corso-friendly-terrace`

Member:

- Sign in as `softuni.demo@usg.local`.
- Open `/member`.
- Open `/profile`.
- Open `/my-dogs`.
- Open the `Ares SoftUni demo` edit/profile workspace.
- Open USG / FCI tools and verify the latest measurement creates a meaningful FCI orientation.
- Open Health & Growth and verify the weight/age archive and health table.

Partner:

- Sign in as `softuni.partner@usg.local`.
- Check partner-owned information and match request behavior where available.

Admin:

- Sign in as `softuni.admin@usg.local`.
- Open `/review`.
- Open `/admin/registry`.
- Open `/admin/partners` and check the pending `SoftUni Partner — Pending Expansion` application.
- Open `/admin/ecosystem` and check published, sensitive, friendly-place, lost/found, and match-request records.

## Safety boundaries

- The script is manual-only.
- The script is idempotent through deterministic IDs and upserts.
- The script does not use `DROP`, `TRUNCATE`, or broad destructive deletes.
- The script does not change migrations, schema, Auth/session logic, Registry authority logic, Certificate/Verify logic, or production secrets.
- All demo content is clearly labeled as demo/test content.
- Placeholder SVG files are generated locally under the app public folder and do not depend on external copyrighted images.
