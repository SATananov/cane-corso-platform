import Link from 'next/link';
import { IconSymbol } from '@/components/icon-symbol';
import type { IconSymbolName } from '@/components/icon-symbol';

interface SectionCardProps {
  eyebrow?: string;
  title: string;
  description: string;
  href?: string;
  meta?: string;
  actionLabel?: string;
  icon?: IconSymbolName;
}

export function SectionCard({ eyebrow, title, description, href, meta, actionLabel = 'Open section', icon }: SectionCardProps) {
  const content = (
    <>
      {icon ? (
        <div className="section-card__icon" aria-hidden="true">
          <IconSymbol name={icon} />
        </div>
      ) : null}
      {eyebrow ? <div className="section-card__eyebrow">{eyebrow}</div> : null}
      <h3 className="section-card__title">{title}</h3>
      <p className="section-card__description">{description}</p>
      {meta ? <div className="section-card__meta">{meta}</div> : null}
      {href ? <span className="section-card__link">{actionLabel}</span> : null}
    </>
  );

  return href ? (
    <Link className="section-card section-card--interactive" href={href}>
      {content}
    </Link>
  ) : (
    <article className="section-card">{content}</article>
  );
}
