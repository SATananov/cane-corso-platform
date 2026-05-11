import Image from 'next/image';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { SectionCard } from '@/components/section-card';
import type { IconSymbolName } from '@/components/icon-symbol';

export interface PageShellCard {
  eyebrow?: string;
  title: string;
  description: string;
  href?: string;
  meta?: string;
  icon?: IconSymbolName;
}

export interface PageShellHeroChip {
  label: string;
  href?: string;
  title?: string;
  targetId?: string;
}

type PageShellHeroChipInput = string | PageShellHeroChip;

function getHeroChipLabel(chip: PageShellHeroChipInput) {
  return typeof chip === 'string' ? chip : chip.label;
}

function getHeroChipHref(chip: PageShellHeroChipInput) {
  return typeof chip === 'string' ? undefined : chip.href;
}

function getHeroChipTargetId(chip: PageShellHeroChipInput) {
  return typeof chip === 'string' ? undefined : chip.targetId;
}

interface PageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  cards?: readonly PageShellCard[];
  children?: ReactNode;
  actionLabel?: string;
  accentLabel?: string;
  helpHref?: string;
  helpLabel?: string;
  visualSrc?: string;
  visualAlt?: string;
  visualFit?: 'cover' | 'contain';
  heroChips?: readonly PageShellHeroChipInput[];
  heroNote?: string;
  variant?: 'default' | 'knowledge';
}

export function PageShell({
  eyebrow,
  title,
  description,
  cards = [],
  children,
  actionLabel = 'Open section',
  accentLabel = 'Brand seal',
  helpHref,
  helpLabel = 'Help',
  visualSrc = '/brand/primary/welcome-logo.jpg',
  visualAlt = 'UNICO SUO GENERE primary mark',
  visualFit = 'cover',
  heroChips = [],
  heroNote,
  variant = 'default',
}: PageShellProps) {
  return (
    <main className={`page-shell ${variant !== 'default' ? `page-shell--${variant}` : ''}`.trim()}>
      <section className="page-hero">
        <div className="page-hero__copy">
          <div className="page-hero__eyebrow">{eyebrow}</div>
          <h1 className="page-hero__title">
            <span className="page-hero__title-text">{title}</span>
            <span className="page-hero__title-mark">USG</span>
          </h1>
          <p className="page-hero__description">{description}</p>
          {helpHref ? (
            <div className="page-hero__actions">
              <Link href={helpHref} className="button-ghost small">
                {helpLabel}
              </Link>
            </div>
          ) : null}
          {heroChips.length ? (
            <div className="page-hero__badge-row">
              {heroChips.map((chip) => {
                const label = getHeroChipLabel(chip);
                const href = getHeroChipHref(chip);
                const targetId = getHeroChipTargetId(chip);

                return targetId ? (
                  <button
                    key={`${label}-${targetId}`}
                    type="button"
                    className="page-hero__badge page-hero__badge--link page-hero__badge--button"
                    title={typeof chip === 'string' ? undefined : chip.title}
                    data-pregnancy-guide-target={targetId}
                  >
                    {label}
                  </button>
                ) : href ? (
                  <a key={`${label}-${href}`} className="page-hero__badge page-hero__badge--link" href={href} title={typeof chip === 'string' ? undefined : chip.title}>
                    {label}
                  </a>
                ) : (
                  <span key={label} className="page-hero__badge" aria-disabled="true">
                    {label}
                  </span>
                );
              })}
            </div>
          ) : null}
          {heroNote ? <p className="page-hero__note">{heroNote}</p> : null}
        </div>

        <div className="page-hero__visual" aria-label={accentLabel}>
          <div className={`page-hero__visual-frame ${visualFit === 'contain' ? 'page-hero__visual-frame--contain' : ''}`.trim()}>
            <Image
              src={visualSrc}
              alt={visualAlt}
              width={360}
              height={360}
              className={`page-hero__visual-image ${visualFit === 'contain' ? 'page-hero__visual-image--contain' : ''}`.trim()}
            />
          </div>
        </div>
      </section>

      {cards.length ? (
        <section className="page-card-grid" aria-label={`${title} sections`}>
          {cards.map((card) => (
            <SectionCard
              key={`${card.title}-${card.meta ?? ''}`}
              eyebrow={card.eyebrow}
              title={card.title}
              description={card.description}
              href={card.href}
              meta={card.meta}
              actionLabel={actionLabel}
            />
          ))}
        </section>
      ) : null}

      {children ? <section className="page-content">{children}</section> : null}
    </main>
  );
}
