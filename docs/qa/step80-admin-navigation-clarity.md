# Step 80 — Admin Navigation Clarity / User Friendly Work Menu

## Цел

Да се реши реалният UX проблем: админът се губи между `Център`, `Потребители`, `Registry` и `Преглед` и не знае къде се approve-ва качено Cane Corso съдържание.

## Решение

- Добавен е **Admin dropdown / task menu** в глобалния header.
- Преглед е първият и най-видим admin action.
- Всяка admin страница получава видима `admin-workflow-strip` лента с директни връзки.
- `/admin/members` вече казва ясно: тази страница показва owner данни, но approve/publish започва от `Преглед`.

## UX правило

Не добавяме още дълги обяснения. Подреждаме работата по задачи:

1. Преглед на чакащи
2. Потребители / owner данни
3. Registry контрол
4. Партньори
5. Екосистема
6. Знания

## Locked boundary

Не се пипа Registry / Certificate / Verify / Gallery / Ecosystem backend логика.
Не се добавя нова DB migration.
Не се записват production secrets или `DATABASE_URL` в ZIP.

## QA

```bash
pnpm admin:navigation-clarity:qa
pnpm admin:real-netlify-flow:qa
pnpm user:clarity-scroll:qa
pnpm owner:profile-photo-journey:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```


## Post-deploy UX hotfix notes

- Admin task menu is controlled by state and closes after selecting a task, on route change, outside click, or Escape.
- Members admin view includes both Review and Registry control CTAs so admins can see whether they need approval workflow or already-public Registry control.
- Published Cane Corso entries remain managed through Registry control; not-public owner uploads route admins back to Review.
