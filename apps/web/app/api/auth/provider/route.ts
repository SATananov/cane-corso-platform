import type { AuthStrategyDocument } from '@cane-corso-platform/contracts';
import { jsonOk } from '@/lib/api-response';
import { getAuthStrategy } from '@/lib/runtime-env';

export const dynamic = 'force-dynamic';

export async function GET() {
  return jsonOk<AuthStrategyDocument>(getAuthStrategy());
}
