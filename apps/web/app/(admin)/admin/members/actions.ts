'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import {
  articles,
  dogs,
  ecosystemListings,
  getDb,
  partnerApplications,
  partners,
  profiles,
  users,
} from '@cane-corso-platform/db';
import { canAccessAdminArea } from '@/lib/access-control';
import { requireReviewAdminSession } from '@/lib/review.server';

export async function deactivateMemberAction(formData: FormData) {
  const session = await requireReviewAdminSession();
  const profileId = String(formData.get('profileId') ?? '').trim();

  if (!profileId || profileId === session.user.profileId) {
    return;
  }

  const db = getDb();

  await db.update(profiles).set({ isActive: false }).where(eq(profiles.id, profileId));

  revalidateAfterMemberMutation();
}

export async function deleteMemberProfileAction(formData: FormData) {
  const session = await requireReviewAdminSession();
  const profileId = String(formData.get('profileId') ?? '').trim();

  if (!profileId || profileId === session.user.profileId) {
    return;
  }

  const db = getDb();
  const targetRows = await db
    .select({
      id: profiles.id,
      role: profiles.role,
      userId: profiles.userId,
    })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1);

  const target = targetRows[0];

  if (!target) {
    return;
  }

  if (canAccessAdminArea(target.role)) {
    return;
  }

  await db.transaction(async (tx) => {
    await tx.delete(articles).where(eq(articles.authorProfileId, profileId));
    await tx.delete(partnerApplications).where(eq(partnerApplications.applicantProfileId, profileId));
    await tx.delete(partners).where(eq(partners.ownerProfileId, profileId));
    await tx.delete(ecosystemListings).where(eq(ecosystemListings.ownerProfileId, profileId));
    await tx.delete(dogs).where(eq(dogs.ownerProfileId, profileId));
    await tx.delete(users).where(eq(users.id, target.userId));
  });

  revalidateAfterMemberMutation();
}

function revalidateAfterMemberMutation() {
  revalidatePath('/admin/members');
  revalidatePath('/access');
  revalidatePath('/review');
  revalidatePath('/my-dogs');
  revalidatePath('/profile');
  revalidatePath('/registry');
  revalidatePath('/partners');
  revalidatePath('/ecosystem');
  revalidatePath('/knowledge');
  revalidatePath('/admin/registry');
  revalidatePath('/admin/partners');
  revalidatePath('/admin/ecosystem');
}
