'use client';

import type { DogLifecycleStatus } from '@cane-corso-platform/contracts';
import { useLocale } from '@/components/locale-provider';

interface StatusBadgeProps {
  status: DogLifecycleStatus;
}

const statusClasses: Record<DogLifecycleStatus, string> = {
  draft: 'status-badge status-badge--draft',
  submitted: 'status-badge status-badge--submitted',
  needs_changes: 'status-badge status-badge--changes',
  approved: 'status-badge status-badge--approved',
  published: 'status-badge status-badge--published',
  archived: 'status-badge status-badge--archived',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { dictionary } = useLocale();

  return <span className={statusClasses[status]}>{dictionary.form.status[status]}</span>;
}
