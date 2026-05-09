import Link from 'next/link';
import { SectionCard } from '@/components/section-card';
import { KnowledgeEducationExperience } from '@/components/knowledge-education-experience';
import { KnowledgeArticleDirectory } from '@/components/knowledge-article-directory';
import { UsgIdentityBulgaricoPanel } from '@/components/usg-identity-bulgarico-panel';
import { UsgStandardKnowledgePanel } from '@/components/usg-standard-knowledge-panel';
import type { KnowledgeArticle } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import type { KnowledgeCenterCard, KnowledgeCenterCopy, KnowledgeFact, KnowledgeSource } from '@/lib/knowledge-center-content';

function KnowledgeMiniCard({ card }: { card: KnowledgeCenterCard }) {
  return (
    <article className="knowledge-mini-card">
      <div className="knowledge-mini-card__eyebrow">{card.eyebrow}</div>
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      {card.meta ? <span>{card.meta}</span> : null}
    </article>
  );
}

function FactRow({ fact }: { fact: KnowledgeFact }) {
  return (
    <div className="knowledge-fact-row">
      <dt>{fact.label}</dt>
      <dd>
        <strong>{fact.value}</strong>
        {fact.note ? <span>{fact.note}</span> : null}
      </dd>
    </div>
  );
}

function SourceCard({ source, actionLabel }: { source: KnowledgeSource; actionLabel: string }) {
  return (
    <a className="knowledge-source-card" href={source.href} target="_blank" rel="noreferrer">
      <span>{source.label}</span>
      <p>{source.description}</p>
      <strong>{actionLabel}</strong>
    </a>
  );
}

function getKnowledgeProductCopy(locale: Locale) {
  if (locale === 'bg') {
    return {
      quickEyebrow: 'Бърз избор',
      quickTitle: 'Избери тема и продължи без излишно четене',
      quickDescription: 'Знанията са библиотека. Главното действие е да отвориш точната тема, а по-дългите USG обяснения остават прибрани по-долу.',
      articleTitle: 'Прочети по тема',
      articleDescription: 'Избери статия за стандарт, история, грижа, сертификат, Bulgarico или подготовка на профил. Публично се показва само подредено и прегледано съдържание.',
      showUsg: 'USG идея и Bulgarico',
      showStandard: 'Стандарт, снимки и подготовка',
      showLibrary: 'Допълнителна библиотека',
      cards: [
        { href: '/knowledge/official-cane-corso-standard-reading', label: 'Стандарт', title: 'FCI прочит', body: 'Размер, пропорции, структура и граници.' },
        { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG', title: 'Сертификат', body: 'Какво доказва и какво не доказва.' },
        { href: '/my-dogs', label: 'Действие', title: 'Моето Cane Corso', body: 'Попълни профил, снимки и измервания.' },
      ],
    } as const;
  }

  if (locale === 'it') {
    return {
      quickEyebrow: 'Scelta rapida',
      quickTitle: 'Scegli un tema e continua senza lettura inutile',
      quickDescription: 'Le Conoscenze funzionano come biblioteca. L’azione principale è aprire il tema giusto; le spiegazioni USG lunghe restano raccolte più sotto.',
      articleTitle: 'Leggi per tema',
      articleDescription: 'Scegli un articolo su standard, storia, cura, certificato, Bulgarico o preparazione del profilo. Pubblicamente appare solo contenuto ordinato e revisionato.',
      showUsg: 'Idea USG e Bulgarico',
      showStandard: 'Standard, foto e preparazione',
      showLibrary: 'Biblioteca aggiuntiva',
      cards: [
        { href: '/knowledge/official-cane-corso-standard-reading', label: 'Standard', title: 'Lettura FCI', body: 'Taglia, proporzioni, struttura e limiti.' },
        { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG', title: 'Certificato', body: 'Cosa prova e cosa non prova.' },
        { href: '/my-dogs', label: 'Azione', title: 'Il mio Cane Corso', body: 'Completa profilo, foto e misure.' },
      ],
    } as const;
  }

  return {
    quickEyebrow: 'Quick choice',
    quickTitle: 'Choose a topic and move without extra reading',
    quickDescription: 'Knowledge works as a library. The main action is opening the right topic; longer USG explanations stay grouped below.',
    articleTitle: 'Read by topic',
    articleDescription: 'Choose an article about standard, history, care, certificate, Bulgarico, or profile preparation. Publicly visible content stays organized and reviewed.',
    showUsg: 'USG idea and Bulgarico',
    showStandard: 'Standard, photos, and preparation',
    showLibrary: 'Additional library',
    cards: [
      { href: '/knowledge/official-cane-corso-standard-reading', label: 'Standard', title: 'FCI reading', body: 'Size, proportions, structure, and limits.' },
      { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG', title: 'Certificate', body: 'What it proves and what it does not prove.' },
      { href: '/my-dogs', label: 'Action', title: 'My Cane Corso', body: 'Complete profile, photos, and measurements.' },
    ],
  } as const;
}

export function KnowledgeCenter({
  copy,
  actionLabel,
  articles,
  locale,
}: {
  copy: KnowledgeCenterCopy;
  actionLabel: string;
  articles: readonly KnowledgeArticle[];
  locale: Locale;
}) {
  const productCopy = getKnowledgeProductCopy(locale);

  return (
    <div className="knowledge-center knowledge-center--product-clarity">
      <section className="knowledge-section knowledge-section--overview" aria-label={copy.overview.title}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{productCopy.quickEyebrow}</div>
          <h2 className="section-block__title">{productCopy.quickTitle}</h2>
          <p className="section-block__description">{productCopy.quickDescription}</p>
        </div>
        <div className="knowledge-product-choice-grid">
          {productCopy.cards.map((card) => (
            <Link className="knowledge-product-choice-card" href={card.href} key={card.href}>
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <strong>{actionLabel}</strong>
            </Link>
          ))}
        </div>
      </section>

      <KnowledgeArticleDirectory
        articles={articles}
        locale={locale}
        title={productCopy.articleTitle}
        description={productCopy.articleDescription}
        actionLabel={actionLabel}
      />

      <details className="knowledge-product-detail">
        <summary>{productCopy.showUsg}</summary>
        <UsgIdentityBulgaricoPanel locale={locale} variant="knowledge" />
      </details>

      <details className="knowledge-product-detail">
        <summary>{productCopy.showStandard}</summary>
        <UsgStandardKnowledgePanel locale={locale} />
      </details>

      <details className="knowledge-product-detail">
        <summary>{productCopy.showLibrary}</summary>
        <div className="knowledge-product-detail__body">
          <section className="knowledge-section knowledge-section--timeline" aria-label={copy.timeline.title}>
            <div className="section-block__header">
              <div className="section-block__eyebrow">{copy.timeline.eyebrow}</div>
              <h2 className="section-block__title">{copy.timeline.title}</h2>
              <p className="section-block__description">{copy.timeline.description}</p>
            </div>
            <div className="knowledge-timeline">
              {copy.timeline.items.map((item) => (
                <article className="knowledge-timeline__item" key={`${item.period}-${item.title}`}>
                  <div className="knowledge-timeline__period">{item.period}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="knowledge-section knowledge-section--standard" aria-label={copy.standard.title}>
            <div className="knowledge-section__split-header">
              <div>
                <div className="section-block__eyebrow">{copy.standard.eyebrow}</div>
                <h2 className="section-block__title">{copy.standard.title}</h2>
                <p className="section-block__description">{copy.standard.description}</p>
              </div>
            </div>
            <dl className="knowledge-fact-grid">
              {copy.standard.facts.map((fact) => (
                <FactRow key={fact.label} fact={fact} />
              ))}
            </dl>
            <div className="knowledge-mini-grid">
              {copy.standard.notes.map((card) => (
                <KnowledgeMiniCard key={card.title} card={card} />
              ))}
            </div>
          </section>

          <section className="knowledge-section knowledge-section--temperament" aria-label={copy.temperament.title}>
            <div className="section-block__header">
              <div className="section-block__eyebrow">{copy.temperament.eyebrow}</div>
              <h2 className="section-block__title">{copy.temperament.title}</h2>
              <p className="section-block__description">{copy.temperament.description}</p>
            </div>
            <div className="knowledge-mini-grid knowledge-mini-grid--four">
              {copy.temperament.principles.map((card) => (
                <KnowledgeMiniCard key={card.title} card={card} />
              ))}
            </div>
          </section>

          <section className="knowledge-section knowledge-section--health" aria-label={copy.health.title}>
            <div className="knowledge-section__split-header">
              <div>
                <div className="section-block__eyebrow">{copy.health.eyebrow}</div>
                <h2 className="section-block__title">{copy.health.title}</h2>
                <p className="section-block__description">{copy.health.description}</p>
              </div>
              <aside className="knowledge-disclaimer">{copy.health.disclaimer}</aside>
            </div>
            <dl className="knowledge-fact-grid knowledge-fact-grid--screenings">
              {copy.health.screenings.map((fact) => (
                <FactRow key={fact.label} fact={fact} />
              ))}
            </dl>
          </section>

          <section className="knowledge-section knowledge-section--owner" aria-label={copy.ownerGuide.title}>
            <div className="section-block__header">
              <div className="section-block__eyebrow">{copy.ownerGuide.eyebrow}</div>
              <h2 className="section-block__title">{copy.ownerGuide.title}</h2>
              <p className="section-block__description">{copy.ownerGuide.description}</p>
            </div>
            <div className="section-card-grid section-card-grid--three">
              {copy.ownerGuide.sections.map((card) => (
                <SectionCard key={card.title} {...card} actionLabel={actionLabel} icon="owner" />
              ))}
            </div>
          </section>

          <KnowledgeEducationExperience articles={articles} locale={locale} actionLabel={actionLabel} />

          <section className="knowledge-section knowledge-section--sources" aria-label={copy.sources.title}>
            <div className="section-block__header">
              <div className="section-block__eyebrow">{copy.sources.eyebrow}</div>
              <h2 className="section-block__title">{copy.sources.title}</h2>
              <p className="section-block__description">{copy.sources.description}</p>
            </div>
            <div className="knowledge-source-grid">
              {copy.sources.items.map((source) => (
                <SourceCard key={source.href} source={source} actionLabel={actionLabel} />
              ))}
            </div>
          </section>
        </div>
      </details>
    </div>
  );
}
