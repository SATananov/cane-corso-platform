import type { Dog, EcosystemOwnerWorkspaceDocument } from '@cane-corso-platform/contracts';
import { getCurrentOwnerEcosystemDocument } from '@/lib/ecosystem.server';
import { listMemberDogs } from '@/lib/my-dogs.server';
import { getCurrentMemberSession, type MemberSessionPayload } from '@/lib/session.server';

export interface OwnerCenterDocument {
  member: {
    displayName: string;
    email: string;
    role: MemberSessionPayload['user']['role'];
    location: string | null;
  };
  dogs: {
    total: number;
    draft: number;
    submitted: number;
    needsChanges: number;
    approved: number;
    published: number;
    certified: number;
    items: Dog[];
  };
  ecosystem: EcosystemOwnerWorkspaceDocument;
}

function formatMemberLocation(session: MemberSessionPayload) {
  const parts = [session.city, session.country].filter((value): value is string => Boolean(value?.trim()));
  return parts.length ? parts.join(', ') : null;
}

export async function getCurrentOwnerCenterDocument(): Promise<OwnerCenterDocument> {
  const [{ session }, dogs, ecosystem] = await Promise.all([
    getCurrentMemberSession({ allowDevFallback: false }),
    listMemberDogs({ allowDevFallback: false }),
    getCurrentOwnerEcosystemDocument({ allowDevFallback: false }),
  ]);

  const dogSummary = {
    total: dogs.length,
    draft: dogs.filter((dog) => dog.lifecycleStatus === 'draft').length,
    submitted: dogs.filter((dog) => dog.lifecycleStatus === 'submitted').length,
    needsChanges: dogs.filter((dog) => dog.lifecycleStatus === 'needs_changes').length,
    approved: dogs.filter((dog) => dog.lifecycleStatus === 'approved').length,
    published: dogs.filter((dog) => dog.publication || dog.lifecycleStatus === 'published').length,
    certified: dogs.filter((dog) => Boolean(dog.publication?.certificateCode)).length,
    items: dogs,
  };

  return {
    member: {
      displayName: session.user.displayName ?? session.user.email,
      email: session.user.email,
      role: session.user.role,
      location: formatMemberLocation(session),
    },
    dogs: dogSummary,
    ecosystem,
  };
}
