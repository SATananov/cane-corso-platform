
# Performance Optimization Pass

## What was optimized safely

The platform already uses the strongest performance boundary for this stage: server-rendered App Router pages with small client islands only where browser behavior is required.

Safe optimizations for this pass:

1. **Keep member/admin routes dynamic** because they depend on session and role checks.
2. **Keep public trust routes fresh** because Registry and Verify represent official records.
3. **Lazy-load non-critical images** such as article seals, partner logos, pedigree imagery, and decorative trust marks.
4. **Avoid unnecessary new client components** for static explanation panels.
5. **Document future cache candidates** instead of caching session or trust-sensitive pages too early.

## Client component budget

Client components remain limited to:

- Form workspaces and client-side validation.
- Verify search/navigation input.
- Image lightbox and UI controls.
- Theme/locale/header utility behavior.

## Future production tuning

After deployment targets are finalized, public non-sensitive surfaces can receive targeted `revalidate` or tag-based cache invalidation. The correct candidates are Knowledge articles, public partner lists, and stable ecosystem directory pages.

Do not cache protected admin/member routes or Auth/session route handlers.
