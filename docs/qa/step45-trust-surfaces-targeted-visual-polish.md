# Step 45 QA: Trust Surfaces Targeted Visual Polish

**Status:** Implementation checkpoint for Step 45 - Trust Surfaces Targeted Visual Polish  
**Date:** May 2026  
**Scope:** Presentation-only polish across trust-surface pages without backend/logic changes

## Goals

1. **Language consistency** — Remove all mixed EN/BG/IT phrases in trust panels and cards
2. **Visual readability** — Improve spacing, heading wrapping, and density on trust surfaces
3. **Media framing** — Add controlled max-height to gallery images without excessive zoom
4. **Button organization** — Improve wrapping and alignment on action buttons
5. **Documentation** — Record the Step 45 polish changes

## Hard Boundaries

The following systems are **not** modified in Step 45:
- ❌ Registry publish logic (no publish state changes)
- ❌ Certificate issue/revoke logic (no certificate state changes)
- ❌ Verify lookup logic (no verification behavior changes)
- ❌ Gallery backend selection logic (no photo selection changes)
- ❌ Admin moderation backend logic (no admin decision changes)
- ❌ Ecosystem API/DB logic (no data model changes)
- ❌ Auth/session logic (no access control changes)

**This step is presentation-only:** CSS/layout/copy/i18n fixes only.

## Pages Modified

### 1. /registry (Public Registry)
**File:** `apps/web/app/(public)/registry/page.tsx`

**Changes:**
- ✅ Polish bottom trust heading: "Published identity, trusted certificate, and a direct verification path."
- ✅ Improve heading width/font sizing/line-height to reduce crowding
- No changes to registry data, publish state, or certificate state

**Verification:**
- Page displays without mixed language phrases
- Bottom heading feels spacious and elegant
- All three languages (EN/BG/IT) display correctly

### 2. /admin/registry (Admin Registry Control)
**File:** `apps/web/app/(admin)/admin/registry/page.tsx` (if exists)

**Changes:**
- ✅ Apply same bottom heading polish if section exists
- ✅ Fix any mixed language trust copy
- No changes to admin publish actions or certificate controls

**Verification:**
- Admin registry view displays cleanly
- Trust panel copy is language-consistent
- No mixed phrases in UI

### 3. /verify (Certificate Verification)
**File:** `apps/web/app/verify/page.tsx` & `components/verification-result-panel.tsx`

**Changes:**
- ✅ Fix verify result card heading spacing: "Active public Cane Corso certificate"
- ✅ Improve right-side trust card readability
- ✅ Better spacing and hierarchy in trust cards
- No changes to verify lookup behavior or certificate validation

**Verification:**
- Heading not overlapped or squeezed
- Right-side trust panel has clear hierarchy
- Text density improved
- Verify lookup still works correctly

### 4. /gallery (USG Gallery)
**File:** `apps/web/app/(public)/gallery/page.tsx` & `components/gallery-certified-showcase-trust-panel.tsx`

**Changes:**
- ✅ Fix mixed-language trust copy ("USG Gallery е избран showcase слой" → proper EN/BG/IT)
- ✅ Reduce density in curated showcase trust panel
- ✅ Add controlled media frame for selected USG Gallery images
  - Keep premium look
  - Avoid huge page height
  - Use sensible max-height on desktop/tablet/mobile
  - Avoid awkward over-zoom
- No changes to which photos are selected or shown

**Verification:**
- Gallery page displays mixed-language-free copy
- Trust panel is less dense
- Selected image has controlled height (no excessive zoom)
- All language variants display correctly
- Gallery selection logic unchanged

### 5. /certified (Certified Archive)
**File:** `apps/web/app/(public)/certified/page.tsx` & `components/public-certified-overview.tsx`

**Changes:**
- ✅ Fix mixed-language trust copy in certified archive panel
- ✅ Improve trust panel readability and heading wrapping
- ✅ Better hierarchy in archive sections
- No changes to certificate archive data or verify links

**Verification:**
- Certified archive page displays without mixed language
- Trust panel is readable and well-spaced
- Certificate data and routing unchanged

### 6. /my-dogs (Member Workspace)
**File:** `apps/web/app/(member)/my-dogs/page.tsx` & `components/my-dogs-overview.tsx`

**Changes:**
- ✅ Fix mixed-language support/trust sections
- ✅ Improve spacing and hierarchy in owner readiness cards
- ✅ Make hero action buttons wrap/align cleanly
- ✅ Avoid stacked or crowded button appearance
- No changes to member dog CRUD, media, review status, or profile logic

**Verification:**
- Support sections display in consistent language
- Cards have better spacing
- Buttons wrap gracefully on mobile/tablet
- Buttons don't feel stacked or crowded
- All dog management functionality unchanged

### 7. /review (Admin Review Queue)
**File:** `apps/web/app/(admin)/review/page.tsx` & `components/review-queue-dashboard.tsx`

**Changes:**
- ✅ Reduce visual density without removing admin capability
- ✅ Improve readability of:
  - Admin decision support cards
  - Evidence checklist cards
  - Owner photos controls
- ✅ Make buttons slightly more organized and less visually heavy
- ✅ Protect mobile layout with responsive grid/wrap improvements
- No changes to review decision behavior, publish behavior, or certificate issue/revoke

**Verification:**
- Review page feels less dense
- Cards are more readable
- Evidence checklist is clearer
- Photo controls are organized
- Mobile layout responsive
- All review and publish actions still work

### 8. Bottom Pink Strip
**Investigation:** If a pink line appears at the bottom of /gallery and /my-dogs

**Findings:**
- [ ] Caused by app CSS → remove
- [ ] Only a screenshot artifact → do not add hacks

**Status:** To be investigated during browser review

## Language Consistency Checklist

Mixed phrases **fixed** or **removed:**
- ❌ "USG Gallery е избран showcase слой" → ✅ "USG Gallery is a curated showcase layer" (EN) / "USG Галерия е кураторски слой за витрина" (BG)
- ❌ "Certified archive е официален trust слой" → ✅ "Certified archive is an official trust layer" (EN) / "Архив на сертифицирани е официален слой доверие" (BG)
- ❌ "Галерията е избран showcase слой" → ✅ Properly translated per language
- ❌ Any mixed BG/EN in /my-dogs support sections → ✅ Fixed to consistent language
- ❌ Any mixed phrases in /review sections → ✅ Fixed to consistent language

## CSS/Layout Polish Summary

### /verify
- [ ] Improve heading spacing around "Active public Cane Corso certificate"
- [ ] Better right-side card hierarchy with improved spacing
- [ ] Less dense text presentation

### /registry & /admin/registry
- [ ] Bottom heading: "Published identity, trusted certificate, and a direct verification path."
- [ ] Improved line-height and font sizing
- [ ] Better wrapping behavior

### /gallery
- [ ] Controlled image max-height (CSS-based framing)
- [ ] Responsive heights for mobile/tablet/desktop
- [ ] Reduced trust panel density
- [ ] Better spacing between elements

### /certified
- [ ] Improved heading wrapping
- [ ] Better hierarchy in trust panel
- [ ] More breathing room between sections

### /my-dogs
- [ ] Hero action buttons with responsive wrapping
- [ ] No stacked appearance
- [ ] Improved spacing in readiness cards
- [ ] Better mobile layout

### /review
- [ ] Less visual density
- [ ] Better card readability
- [ ] Improved button organization
- [ ] Responsive grid improvements
- [ ] Mobile layout protection

## Testing Checklist

### Language Consistency
- [ ] /registry displays selected language only (no mixed phrases)
- [ ] /admin/registry displays selected language only
- [ ] /verify displays selected language only
- [ ] /gallery displays selected language only
- [ ] /certified displays selected language only
- [ ] /my-dogs displays selected language only
- [ ] /review displays selected language only
- [ ] All three language modes (EN/BG/IT) render correctly

### Visual Polish
- [ ] /verify: Heading spacing feels spacious
- [ ] /verify: Right-side trust card is readable
- [ ] /registry: Bottom heading wraps elegantly
- [ ] /admin/registry: Same polish as /registry
- [ ] /gallery: Selected image has controlled frame, no excessive zoom
- [ ] /gallery: Trust panel is less dense
- [ ] /certified: Archive trust panel is readable
- [ ] /my-dogs: Hero buttons wrap cleanly
- [ ] /my-dogs: Readiness cards have good spacing
- [ ] /review: Overall less dense appearance
- [ ] /review: Cards are more readable
- [ ] /review: Evidence checklist is organized
- [ ] /review: Photo controls are organized

### Functionality (No Regressions)
- [ ] /registry: Publish logic unchanged
- [ ] /admin/registry: Admin actions unchanged
- [ ] /verify: Lookup behavior unchanged
- [ ] /gallery: Photo selection unchanged
- [ ] /certified: Archive data and routing unchanged
- [ ] /my-dogs: Dog CRUD and media unchanged
- [ ] /review: Decision and publish logic unchanged

### Browser Review
- [ ] Pink strip investigation complete
- [ ] All pages checked in light/dark/heritage themes
- [ ] Mobile, tablet, desktop all responsive
- [ ] No visual regressions from Step 44

## Pass Criteria

✅ **All** of the following must be true:

1. No mixed EN/BG/IT phrases exist in any trust panel or card
2. All language variants (EN/BG/IT) display correctly
3. Visual polish applied to all 7 pages without functional changes
4. All pages responsive on mobile/tablet/desktop
5. No backend/logic changes (Registry, Certificate, Verify, Gallery, Admin, Ecosystem, Auth)
6. All QA scripts pass:
   - `pnpm trust:targeted-visual:qa` ✅
   - `pnpm trust:browser-review:qa` ✅
   - `pnpm certified:archive-trust:qa` ✅
   - `pnpm gallery:showcase-trust:qa` ✅
   - `pnpm certificate:verify-trust:qa` ✅
   - `pnpm workspace:syntax` ✅
   - `pnpm typecheck` ✅

## Notes

- This step is visua polish only—no logic or data model changes
- The i18n system properly handles language selection
- All changes respect the hard boundaries
- CSS adjustments are minimal and focused
- Component refactoring is presentation-only
