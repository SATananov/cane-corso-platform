import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageHeroChipRow } from '@/components/page-hero-chip-row';
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
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

type PageShellHeroChipInput = string | PageShellHeroChip;



type ModulePriorityAction = {
  href: string;
  label: string;
  meta?: string;
};

function detectModulePriorityLocaleSignal(value: string) {
  if ([...value].some((char) => {
    const code = char.charCodeAt(0);
    return code >= 1024 && code <= 1279;
  })) return 'bg';
  if (/[àèéìòù]/i.test(value) || /\b(aiuto|apri|registro|certificato|conoscenza|comunità|proprietario|servizi)\b/i.test(value)) return 'it';
  return 'en';
}

function getModulePriorityCopy(signal: string) {
  const locale = detectModulePriorityLocaleSignal(signal);

  if (locale === 'bg') {
    return {
      eyebrow: 'Най-важното в този модул',
      title: 'Започни от правилното действие',
      primary: 'Първо действие',
      sections: 'Бързи секции',
    } as const;
  }

  if (locale === 'it') {
    return {
      eyebrow: 'La cosa più importante in questo modulo',
      title: 'Inizia dall’azione giusta',
      primary: 'Prima azione',
      sections: 'Sezioni rapide',
    } as const;
  }

  return {
    eyebrow: 'Most important in this module',
    title: 'Start with the right action',
    primary: 'Primary action',
    sections: 'Quick sections',
  } as const;
}

function normalizePriorityHref(chip: PageShellHeroChip): string | null {
  if (chip.actionHref) return chip.actionHref;
  if (chip.href) return chip.href;
  if (chip.targetId) return `#${chip.targetId}`;
  return null;
}

function buildModulePriorityActions({
  cards,
  heroChips,
  helpHref,
  helpLabel,
}: {
  cards: readonly PageShellCard[];
  heroChips: readonly PageShellHeroChipInput[];
  helpHref?: string;
  helpLabel: string;
}): readonly ModulePriorityAction[] {
  const actions: ModulePriorityAction[] = [];
  const seen = new Set<string>();

  function push(action: ModulePriorityAction | null) {
    if (!action?.href || seen.has(`${action.href}-${action.label}`)) return;
    seen.add(`${action.href}-${action.label}`);
    actions.push(action);
  }

  cards.forEach((card) => {
    if (!card.href) return;
    push({ href: card.href, label: card.title, meta: card.meta ?? card.eyebrow });
  });

  heroChips.forEach((chip) => {
    if (typeof chip === 'string') return;
    const href = normalizePriorityHref(chip);
    if (!href) return;
    push({ href, label: chip.actionLabel ?? chip.label, meta: chip.title ?? chip.description });
  });

  if (helpHref) {
    push({ href: helpHref, label: helpLabel });
  }

  return actions.slice(0, 6);
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
  modulePriorityNav?: boolean;
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
  modulePriorityNav = true,
}: PageShellProps) {
  const prioritySignal = [eyebrow, title, description, helpLabel, ...cards.map((card) => `${card.title} ${card.description} ${card.meta ?? ''}`)].join(' ');
  const priorityCopy = getModulePriorityCopy(prioritySignal);
  const priorityActions = modulePriorityNav ? buildModulePriorityActions({ cards, heroChips, helpHref, helpLabel }) : [];
  const primaryPriorityAction = priorityActions[0] ?? null;
  const secondaryPriorityActions = priorityActions.slice(1);

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
          {heroChips.length ? <PageHeroChipRow chips={heroChips} helpLabel={helpLabel} /> : null}
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

      {primaryPriorityAction ? (
        <section className="module-priority-nav" aria-label={priorityCopy.eyebrow}>
          <div className="module-priority-nav__copy">
            <span className="module-priority-nav__eyebrow">{priorityCopy.eyebrow}</span>
            <strong>{priorityCopy.title}</strong>
            <p>{description}</p>
          </div>
          <div className="module-priority-nav__actions">
            <Link href={primaryPriorityAction.href} className="module-priority-nav__primary">
              <small>{priorityCopy.primary}</small>
              <span>{primaryPriorityAction.label}</span>
              {primaryPriorityAction.meta ? <em>{primaryPriorityAction.meta}</em> : null}
            </Link>
            {secondaryPriorityActions.length ? (
              <div className="module-priority-nav__secondary" aria-label={priorityCopy.sections}>
                <small>{priorityCopy.sections}</small>
                <div>
                  {secondaryPriorityActions.map((action) => (
                    <Link href={action.href} className="module-priority-nav__chip" key={`${action.href}-${action.label}`}>
                      <span>{action.label}</span>
                      {action.meta ? <em>{action.meta}</em> : null}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

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
