# Step 105 — User-first production clarity

## Цел

User-first production clarity pass за всички основни секции. Целта е платформата да се усеща като готов продукт, който човек ползва след login, а не като смесица от работеща апликация, pitch deck и вътрешна документация.

## Какво е променено

- Общият `SectionContentGuidePanel` вече е компактен по подразбиране.
- Дългите обяснителни карти остават налични, но са прибрани в `<details>` под „Кратко обяснение“.
- Knowledge страницата вече започва като библиотека с бърз избор и статии.
- Големите USG / Bulgarico / Standard образователни блокове остават достъпни, но са прибрани в отваряеми секции.
- Премахнат е публичният render на вътрешно звучащия editorial model блок от Knowledge страницата.
- Copy-то на Knowledge е изчистено от изрази, които звучат като “готово за бъдеща база”, “подготвена структура” или вътрешен build план.

## Граници

- No DB migration.
- No Auth/session change.
- No Registry / Certificate / Verify / Gallery authority logic change.
- No Admin moderation backend change.
- No Ecosystem authority or publication backend change.
- No Step 104 measurement archive logic change.

## Очакван UX резултат

След login потребителят трябва да вижда първо действие, статус и правилен път. Обясненията остават помощни, но вече не доминират страниците.

Knowledge трябва да се усеща като библиотека: избери тема, прочети статия, отвори USG/стандарт детайли само когато ти трябват.

## QA

Run:

```bash
pnpm step105:production-clarity:qa
pnpm step104:growth-archive:qa
pnpm step103:growth-measurement:qa
pnpm workspace:syntax
pnpm typecheck
```
