# USG Language Terminology Lock

This document defines the visible-language rule for the Cane Corso Platform.

## Core rule

Visible UI copy must follow the active locale. Internal route names, component names, and code identifiers may remain English, but the user-facing text should not mix languages unless the term is intentionally a brand, breed, organization, or technology name.

## Brand and domain terms that can stay original

These terms may remain unchanged in BG, EN, and IT UI:

- USG
- Unico Suo Genere
- Cane Corso
- Cane Corso Italiano
- FCI
- ENCI
- AKC
- CCAA
- FAQ
- Bulgarico
- Neon
- Netlify
- Next.js
- Drizzle

## Bulgarian UI terminology

In Bulgarian visible UI, prefer:

| Avoid | Use |
| --- | --- |
| Knowledge | Знания |
| Registry | Регистър |
| Gallery | Галерия |
| Verify | Проверка |
| Review | Преглед |
| My Dogs | Моите Cane Corso |
| Member | Член / Членска зона / Собственик |
| Owner | Собственик |
| Public | Публичен |
| Guide | Насоки / Наръчник |
| Admin review | Админ преглед |
| Screenshot | Екранна снимка |
| Wording | Формулировка |
| Score badge | Етикет за оценка |

## Italian UI terminology

In Italian visible UI, prefer:

| Avoid | Use |
| --- | --- |
| Knowledge | Conoscenza |
| Review | Revisione |
| Owner | Proprietario |
| Public | Pubblico |
| Guide | Guida |

## QA guardrail

`pnpm step102:language-purity:qa` checks the most active visible-copy files so new passes do not reintroduce mixed Bulgarian/English UI copy around the Step 101 knowledge layer, active-section action panels, and section guide panels.

This guardrail is not a replacement for browser review. It is a release safety net.
