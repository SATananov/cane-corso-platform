'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { PageShellHeroChip } from '@/components/page-shell';

type PageHeroChipInput = string | PageShellHeroChip;

type NormalizedHeroChip = PageShellHeroChip & {
  id: string;
};

function normalizeId(value: string, index: number) {
  return `${value.trim().toLowerCase().replace(/[^a-z0-9а-яёіїєъь]+/gi, '-').replace(/^-+|-+$/g, '') || 'topic'}-${index}`;
}

function buildLocaleSignal(helpLabel: string, chips: readonly NormalizedHeroChip[]) {
  return [
    helpLabel,
    ...chips.flatMap((chip) => [chip.label, chip.title ?? '', chip.description ?? '', chip.actionLabel ?? '']),
  ]
    .filter(Boolean)
    .join(' ');
}

function getFallbackCopy(helpLabel: string, chips: readonly NormalizedHeroChip[]) {
  const localeSignal = buildLocaleSignal(helpLabel, chips);
  const lowerSignal = localeSignal.toLowerCase();

  if (/[\u0400-\u04ff]/.test(localeSignal)) {
    return {
      titlePrefix: 'Избран фокус',
      body: 'Тази тема е част от текущия модул. Използвай активните карти, избори и действия под основния блок — съдържанието е прибрано, за да не се губиш в дълго скролване.',
      action: 'Към съдържанието',
    } as const;
  }

  if (
    /[àèéìòù]/i.test(localeSignal) ||
    /\b(aiuto|apri|verifica|registro|certificato|scheda|comunità|piattaforma|proprietario|preparazione|voci|ecosistema|candidature|catalogo|sincronizzazione|revisione|ufficiale|suggerimento|fiducia|pubblica|sostegno|distinti|moderazione|amministrativa|controllo|opportunità|servizi|luoghi|cuccioli|adozione|riproduzione)\b/.test(lowerSignal)
  ) {
    return {
      titlePrefix: 'Focus selezionato',
      body: 'Questo tema fa parte del modulo corrente. Usa le schede, le scelte e le azioni attive sotto il blocco principale — il contenuto resta raccolto per evitare lunghi scorrimenti.',
      action: 'Vai al contenuto',
    } as const;
  }

  return {
    titlePrefix: 'Selected focus',
    body: 'This topic belongs to the current module. Use the active cards, choices, and actions below the hero block — content stays grouped so you do not have to scroll through everything.',
    action: 'Go to content',
  } as const;
}

function normalizeChip(chip: PageHeroChipInput, index: number): NormalizedHeroChip {
  const value = typeof chip === 'string' ? { label: chip } : chip;
  return {
    ...value,
    id: normalizeId(value.label, index),
  };
}

export function PageHeroChipRow({ chips, helpLabel }: { chips: readonly PageHeroChipInput[]; helpLabel: string }) {
  const normalizedChips = useMemo(() => chips.map(normalizeChip), [chips]);
  const fallback = getFallbackCopy(helpLabel, normalizedChips);
  const [activeChipId, setActiveChipId] = useState<string | null>(null);
  const activeChip = normalizedChips.find((chip) => chip.id === activeChipId) ?? null;

  if (!normalizedChips.length) return null;

  return (
    <div className="page-hero-chip-control" aria-label={fallback.titlePrefix}>
      <div className="page-hero__badge-row page-hero__badge-row--active">
        {normalizedChips.map((chip) => {
          if (chip.href) {
            return (
              <Link key={chip.id} className="page-hero__badge page-hero__badge--link" href={chip.href} title={chip.title}>
                {chip.label}
              </Link>
            );
          }

          return (
            <button
              key={chip.id}
              type="button"
              className={`page-hero__badge page-hero__badge--link page-hero__badge--button${activeChip?.id === chip.id ? ' is-active' : ''}`}
              title={chip.title}
              data-pregnancy-guide-target={chip.targetId}
              aria-expanded={activeChip?.id === chip.id}
              onClick={() => setActiveChipId((current) => (current === chip.id ? null : chip.id))}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {activeChip ? (
        <div className="page-hero-chip-control__panel" role="status">
          <span>{fallback.titlePrefix}</span>
          <strong>{activeChip.title ?? activeChip.label}</strong>
          <p>{activeChip.description ?? fallback.body}</p>
          {activeChip.actionHref ? (
            <Link className="button-secondary small" href={activeChip.actionHref}>
              {activeChip.actionLabel ?? fallback.action}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
