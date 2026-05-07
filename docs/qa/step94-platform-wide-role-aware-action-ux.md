# Step 94 — Platform-wide Role-aware Action UX

## Цел

След логин или регистрация платформата вече не трябва да звучи като публичен наръчник. Гостът вижда ориентация. Логнатият потребител вижда действие, статус и следваща стъпка. Админът вижда работна опашка и решения.

## Обхват

Това е UX/copy/presentation слой. Не са променяни backend authority решенията за Registry, Certificate, Verify, Gallery, Ecosystem API/DB, Admin moderation, Auth/session или Netlify config.

## Какво е добавено

- Нов общ компонент `RoleAwareActionPanel`.
- Action-first панел за public повърхности: `/platform`, `/registry`, `/gallery`, `/knowledge`, `/community`, `/partners`, `/faq`.
- Action-first панел за member повърхности: `/member`, `/my-dogs`, `/profile`, `/ecosystem`, `/partners/apply`.
- Action-first панел за admin повърхности: `/admin`, `/review`, `/admin/ecosystem`.
- `/platform` вече показва по-смислен logged-in welcome и скрива тежките guest orientation блокове за логнати потребители.

## Принцип

- Гостът вижда ориентация.
- Логнатият член вижда: `Към моите Cane Corso`, `Добави Cane Corso`, `Виж статус`, `Профил`.
- Партньорът вижда кандидатура, статус и следваща стъпка.
- Админът вижда опашка, детайл и решение.

## QA

```bash
pnpm platform:role-aware-action:qa
pnpm platform:faq-trust:qa
pnpm usg:identity-bulgarico:qa
pnpm content:authority:qa
pnpm workspace:syntax
pnpm typecheck
```

## Заключени граници

Промяната не трябва да твърди, че USG Certificate заменя pedigree, че USG доказва чистопородност без evidence, че Bulgarico е официален стандарт, че цветът сам доказва тип или че USG заменя FCI.
