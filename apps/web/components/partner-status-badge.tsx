import type { PartnerStatus } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';

interface PartnerStatusBadgeProps {
  status: PartnerStatus;
  locale: Locale;
}

const copyByLocale: Record<Locale, Record<PartnerStatus, string>> = {
  en: {
    draft: 'Draft',
    pending_review: 'Pending review',
    approved: 'Approved',
    rejected: 'Rejected',
    suspended: 'Suspended',
  },
  bg: {
    draft: 'Чернова',
    pending_review: 'Чака преглед',
    approved: 'Одобрен',
    rejected: 'Отхвърлен',
    suspended: 'Спрян',
  },
  it: {
    draft: 'Bozza',
    pending_review: 'In revisione',
    approved: 'Approvato',
    rejected: 'Rifiutato',
    suspended: 'Sospeso',
  },
};

const classByStatus: Record<PartnerStatus, string> = {
  draft: 'status-badge status-badge--draft',
  pending_review: 'status-badge status-badge--submitted',
  approved: 'status-badge status-badge--approved',
  rejected: 'status-badge status-badge--archived',
  suspended: 'status-badge status-badge--changes',
};

export function PartnerStatusBadge({ status, locale }: PartnerStatusBadgeProps) {
  return <span className={classByStatus[status]}>{copyByLocale[locale][status]}</span>;
}
