Copy these files into the project root.

Files included:
- .env.local
- apps/web/.env.local

Then fully stop the dev server and run:
  pnpm dev

Check:
  http://localhost:3000/api/health

Expected:
  database should no longer be "missing"
