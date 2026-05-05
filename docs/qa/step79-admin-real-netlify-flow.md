# Step 79 — Admin clarity and real Netlify database boundary

## Цел

Този step е ограничен repair/clarity pass. Целта е админът да разбира веднага къде да търси качените от потребителя Cane Corso данни и защо те не се виждат автоматично в публичния Registry.

## UX правило

Админът не трябва да мисли в архитектурни „слоеве“. Админът трябва да вижда работен поток:

1. **Review** — тук чакат Cane Corso кандидатурите, след като owner ги изпрати за USG преглед.
2. **Members** — тук се намират owner профилите и запазените от тях данни.
3. **Publish** — admin publish превръща одобрен профил в публичен Registry запис.
4. **Registry** — тук са вече публичните профили и сертификатният контрол.
5. **Certificate** — USG сертификатът остава отделно admin решение.

Кратката формула е: **Review → Publish → Registry**.

## Какво е променено

- `apps/web/app/(admin)/admin/page.tsx` е пренаписан като работен админ център, а не като архитектурно описание.
- Основният текст казва, че новите owner кандидатури се търсят първо в **Review**.
- Ясно е записано, че личните owner данни не са публичен Registry.
- Primary action в guide картата е **Review**.
- Премахнати са объркващи термини като „слой за идентичности“, „модерационен слой“ и „отвори слоя“.

## Реална Netlify база

Реалната Neon база остава само в **Netlify Environment Variables**. Не се записва `DATABASE_URL` в ZIP, git, `.env.example`, `netlify.toml` или source code.

Това е правилното production правило:

- `DATABASE_URL` — задава се в Netlify UI като secret environment variable.
- `AUTH_SECRET` — задава се в Netlify UI като secret environment variable.
- ZIP-ът съдържа само код, docs, QA и безопасен `.env.example` template.
- `netlify.toml` не стартира seed/bootstrap команди.
- Production build използва runtime env от Netlify, не demo база.

## Какво не е пипано

- Registry authority logic
- Certificate/Verify logic
- Gallery logic
- Ecosystem moderation logic
- Database schema/migrations
- Auth/session implementation
- Step 77 profile photo upload implementation
- Step 78 owner clarity cleanup implementation

## QA

Run:

```bash
pnpm admin:real-netlify-flow:qa
pnpm user:clarity-scroll:qa
pnpm owner:profile-photo-journey:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```

Expected: all pass locally before commit/push.
