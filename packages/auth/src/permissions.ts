import type { AppRole } from '@cane-corso-platform/contracts';

export const ROLE_RANK: Record<AppRole, number> = {
  member: 10,
  partner: 20,
  reviewer: 30,
  admin: 40,
  super_admin: 50,
};

export function hasRoleAtLeast(currentRole: AppRole, requiredRole: AppRole): boolean {
  return ROLE_RANK[currentRole] >= ROLE_RANK[requiredRole];
}

export function canAccessAdminArea(role: AppRole): boolean {
  return hasRoleAtLeast(role, 'admin');
}

export function canReviewDogs(role: AppRole): boolean {
  return role === 'reviewer' || canAccessAdminArea(role);
}

export function canManagePartners(role: AppRole): boolean {
  return role === 'reviewer' || canAccessAdminArea(role);
}

export function canOwnDogs(role: AppRole): boolean {
  return role === 'member' || role === 'partner' || canAccessAdminArea(role);
}
