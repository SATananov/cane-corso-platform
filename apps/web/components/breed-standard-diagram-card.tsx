import Link from 'next/link';
import type { BreedStandardDiagramCard as BreedStandardDiagramCardModel } from '@/lib/breed-standard-content';

interface BreedStandardDiagramCardProps {
  card: BreedStandardDiagramCardModel;
  actionLabel?: string;
  showAction?: boolean;
}

export function BreedStandardDiagramCard({ card, actionLabel, showAction = true }: BreedStandardDiagramCardProps) {
  return (
    <article className="breed-standard-card">
      <div className="breed-standard-card__visual">
        <img src={card.imageSrc} alt={card.imageAlt} loading="lazy" />
        <span className="breed-standard-card__ratio">{card.ratioLabel}</span>
      </div>
      <div className="breed-standard-card__body">
        <span className="breed-standard-card__eyebrow">USG STANDARD</span>
        <h3>{card.title}</h3>
        <p>{card.subtitle}</p>
        <ul>
          {card.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <small>{card.sourceNote}</small>
        {showAction && actionLabel ? (
          <Link href={`/knowledge/${card.articleSlug}`} className="breed-standard-card__action">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
