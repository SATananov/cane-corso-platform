import type { DatabaseTargetHealthDocument } from '@cane-corso-platform/contracts';
import { jsonOk } from '@/lib/api-response';
import { getRuntimeDatabaseTargetDocument } from '@/lib/database-target.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getHttpStatus(document: DatabaseTargetHealthDocument): number {
  if (document.status === 'ok') {
    return 200;
  }

  if (document.status === 'misconfigured') {
    return 409;
  }

  return 503;
}

export async function GET() {
  const document = await getRuntimeDatabaseTargetDocument();

  return jsonOk<DatabaseTargetHealthDocument>(document, {
    status: getHttpStatus(document),
    headers: {
      'cache-control': 'no-store',
    },
  });
}
