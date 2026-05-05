Mobile monorepo Metro fix v2

What changed:
- fixed the Windows-safe regex generation in apps/mobile/metro.config.js
- still blocks Next build artifacts from apps/web/.next so Expo Metro does not crash on clean workspaces

After copy:
1. Stop all running dev servers
2. Delete apps/mobile/.expo if it exists
3. Run pnpm dev again from the repo root
