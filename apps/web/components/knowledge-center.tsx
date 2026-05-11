import Link from 'next/link';
import { KnowledgeArticleDirectory } from '@/components/knowledge-article-directory';
import { UsgIdentityBulgaricoPanel } from '@/components/usg-identity-bulgarico-panel';
import { UsgStandardKnowledgePanel } from '@/components/usg-standard-knowledge-panel';
import type { KnowledgeArticle } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import type { KnowledgeCenterCopy } from '@/lib/knowledge-center-content';

function getKnowledgeProductCopy(locale: Locale) {
  if (locale === 'bg') {
    return {
      quickEyebrow: 'Бърз избор',
      quickTitle: 'Избери какво ти трябва',
      quickDescription: 'Това е библиотека. Първо избери тема, после отвори статия. Допълнителните USG обяснения са прибрани, за да не пречат.',
      articleTitle: 'Прочети по тема',
      articleDescription: 'Статии по тема: стандарт, история, грижа, здраве, снимки, сертификат, Bulgarico и подготовка за преглед — без смесване с личните действия.',
      showUsg: 'USG идея и Bulgarico',
      showStandard: 'Официален стандарт и подготовка',
      cards: [
        { href: '/knowledge/official-cane-corso-standard-reading', label: 'Стандарт', title: 'Как да чета FCI стандарта', body: 'Размер, пропорции, структура и граници.' },
        { href: '/knowledge/cane-corso-history-and-identity', label: 'История', title: 'Произход и характер', body: 'Какво прави Cane Corso различен.' },
        { href: '/knowledge/health-screening-and-responsible-care', label: 'Грижа', title: 'Здраве и отговорност', body: 'Практични насоки за собственик.' },
        { href: '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar', label: 'Малки', title: 'Разплод и първи 40 дни', body: 'Календар от покриване до малките.' },
        { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG', title: 'Сертификат и граници', body: 'Какво доказва и какво не доказва.' },
      ],
    } as const;
  }

  if (locale === 'it') {
    return {
      quickEyebrow: 'Scelta rapida',
      quickTitle: 'Scegli ciò che ti serve',
      quickDescription: 'Questa è una biblioteca. Prima scegli il tema, poi apri l’articolo. Le spiegazioni USG aggiuntive restano raccolte per non disturbare.',
      articleTitle: 'Articoli per tema',
      articleDescription: 'Standard, storia, cura, salute, foto, certificato, Bulgarico e preparazione alla revisione — senza mescolare le azioni personali.',
      showUsg: 'Idea USG e Bulgarico',
      showStandard: 'Standard ufficiale e preparazione',
      cards: [
        { href: '/knowledge/official-cane-corso-standard-reading', label: 'Standard', title: 'Come leggere lo standard FCI', body: 'Taglia, proporzioni, struttura e limiti.' },
        { href: '/knowledge/cane-corso-history-and-identity', label: 'Storia', title: 'Origine e carattere', body: 'Cosa rende diverso il Cane Corso.' },
        { href: '/knowledge/health-screening-and-responsible-care', label: 'Cura', title: 'Salute e responsabilità', body: 'Indicazioni pratiche per proprietari.' },
        { href: '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar', label: 'Cuccioli', title: 'Riproduzione e primi 40 giorni', body: 'Calendario da mating a cuccioli.' },
        { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG', title: 'Certificato e limiti', body: 'Cosa prova e cosa non prova.' },
      ],
    } as const;
  }

  return {
    quickEyebrow: 'Quick choice',
    quickTitle: 'Choose what you need',
    quickDescription: 'This is a library. Choose the topic first, then open the article. Additional USG explanations stay grouped so they do not interrupt the user path.',
    articleTitle: 'Articles by topic',
    articleDescription: 'Standard, history, care, health, photos, certificate, Bulgarico, and review preparation — without mixing them with private actions.',
    showUsg: 'USG idea and Bulgarico',
    showStandard: 'Official standard and preparation',
    cards: [
      { href: '/knowledge/official-cane-corso-standard-reading', label: 'Standard', title: 'How to read the FCI standard', body: 'Size, proportions, structure, and limits.' },
      { href: '/knowledge/cane-corso-history-and-identity', label: 'History', title: 'Origin and temperament', body: 'What makes the Cane Corso distinct.' },
      { href: '/knowledge/health-screening-and-responsible-care', label: 'Care', title: 'Health and responsibility', body: 'Practical owner guidance.' },
      { href: '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar', label: 'Puppies', title: 'Breeding and first 40 days', body: 'Calendar from mating to puppies.' },
      { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG', title: 'Certificate and limits', body: 'What it proves and what it does not prove.' },
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
    <div className="knowledge-center knowledge-center--product-clarity knowledge-center--library-first">
      <section className="knowledge-section knowledge-section--overview" aria-label={copy.overview.title}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{productCopy.quickEyebrow}</div>
          <h2 className="section-block__title">{productCopy.quickTitle}</h2>
          <p className="section-block__description">{productCopy.quickDescription}</p>
        </div>
        <div className="knowledge-product-choice-grid knowledge-product-choice-grid--library">
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
    </div>
  );
}
