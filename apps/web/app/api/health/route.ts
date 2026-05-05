import type { HealthDocument } from '@cane-corso-platform/contracts';
import { jsonOk } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  return jsonOk<HealthDocument>({
    service: 'cane-corso-platform-web',
    status: 'ok',
    environment: process.env.NODE_ENV === 'production' ? 'production' : process.env.NODE_ENV === 'test' ? 'test' : 'development',
    database: process.env.DATABASE_URL ? 'configured' : 'missing',
  });
}
