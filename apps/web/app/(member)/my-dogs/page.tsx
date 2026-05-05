import { redirect } from 'next/navigation';
import { MyDogsOverview } from '../../../components/my-dogs-overview';
import { getCurrentMemberDogsDocument } from '../../../lib/my-dogs.server';
import { buildAccessPath } from '@/lib/access-control';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

export default async function MyDogsPage() {
  try {
    const { dogs } = await getCurrentMemberDogsDocument({ allowDevFallback: false });
    return <MyDogsOverview dogs={dogs} />;
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: '/my-dogs' }));
    }

    throw error;
  }
}
