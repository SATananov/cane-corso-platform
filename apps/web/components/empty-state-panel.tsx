'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';

interface EmptyStatePanelProps {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}

export function EmptyStatePanel({ title, description, actionHref, actionLabel }: EmptyStatePanelProps) {
  const { dictionary } = useLocale();

  return (
    <section className="empty-state-panel">
      <div>
        <div className="section-heading__eyebrow">{dictionary.common.emptyState}</div>
        <h3 className="section-heading__title">{title}</h3>
        <p className="empty-state-panel__description">{description}</p>
      </div>

      <Link href={actionHref} className="button button--primary">
        {actionLabel}
      </Link>
    </section>
  );
}
