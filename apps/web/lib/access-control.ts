import type { AppRole } from '@cane-corso-platform/contracts';

export type AccessIntent = 'member' | 'partner';
export type AccessNotice = 'member_required' | 'partner_required' | 'admin_required' | 'signed_out';

function normalizeRole(role: AppRole | string | null | undefined): string {
  return typeof role === 'string' ? role.trim().toLowerCase() : '';
}

const elevatedRoles = new Set(['admin', 'super_admin', 'review_admin', 'moderator', 'reviewer']);

export function canAccessAdminArea(role: AppRole | string | null | undefined): boolean {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return false;
  }

  return elevatedRoles.has(normalizedRole);
}

export function getPostLoginRedirectPath(
  role: AppRole | string | null | undefined,
): '/my-dogs' | '/review' {
  return canAccessAdminArea(role) ? '/review' : '/my-dogs';
}

export function getAccessContinueLabel(
  role: AppRole | string | null | undefined,
  locale: string,
): string {
  const normalizedLocale = locale.toLowerCase();

  if (canAccessAdminArea(role)) {
    switch (normalizedLocale) {
      case 'bg':
        return 'Продължи като админ';
      case 'it':
        return 'Continua come admin';
      default:
        return 'Continue as admin';
    }
  }

  switch (normalizedLocale) {
    case 'bg':
      return 'Продължи като член';
    case 'it':
      return 'Continua come membro';
    default:
      return 'Continue as member';
  }
}

export function buildAccessPath(options?: {
  intent?: AccessIntent;
  notice?: AccessNotice;
  next?: string;
}): string {
  const params = new URLSearchParams();

  if (options?.intent) {
    params.set('intent', options.intent);
  }

  if (options?.notice) {
    params.set('notice', options.notice);
  }

  if (options?.next) {
    params.set('next', options.next);
  }

  const query = params.toString();
  return query.length > 0 ? `/access?${query}` : '/access';
}
