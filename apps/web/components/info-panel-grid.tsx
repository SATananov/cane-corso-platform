import type { PageShellCard } from '@/components/page-shell';
import { SectionCard } from '@/components/section-card';

interface InfoPanelGridProps {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: readonly PageShellCard[];
  actionLabel: string;
  variant?: 'support' | 'statement' | 'community';
  ariaLabel?: string;
}

export function InfoPanelGrid({
  id,
  eyebrow,
  title,
  description,
  cards,
  actionLabel,
  variant = 'support',
  ariaLabel,
}: InfoPanelGridProps) {
  if (!cards.length) {
    return null;
  }

  return (
    <section id={id} className={`section-block section-block--${variant}`} aria-label={ariaLabel ?? title}>
      <div className="section-block__header">
        <div className="section-block__eyebrow">{eyebrow}</div>
        <h2 className="section-block__title">{title}</h2>
        <p className="section-block__description">{description}</p>
      </div>

      <div className="section-card-grid section-card-grid--three section-card-grid--wide-four">
        {cards.map((card) => (
          <SectionCard key={`${card.title}-${card.meta ?? ''}`} {...card} actionLabel={actionLabel} />
        ))}
      </div>
    </section>
  );
}
