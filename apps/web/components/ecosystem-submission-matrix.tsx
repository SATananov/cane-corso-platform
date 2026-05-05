import type { Locale } from '@/lib/i18n';

interface EcosystemSubmissionMatrixProps {
  locale: Locale;
}

const copyByLocale = {
  en: {
    eyebrow: 'Access & publication matrix',
    title: 'Official vs community submission lanes',
    description:
      'Choose the lane before you submit. The lane controls who the entry represents, how moderation works, and whether the result becomes a public listing or an internal signal.',
    cards: [
      {
        key: 'official',
        badge: 'Official listing',
        title: 'For real businesses, services, transport, boarding, puppies, adoption, breeding, and events',
        body:
          'Use this when the entry represents the actual owner, business, or operator. After admin approval it can be published as an official ecosystem listing.',
        meta: 'Public result: official badge • admin-reviewed • directory-ready',
      },
      {
        key: 'community',
        badge: 'Community listing',
        title: 'For useful places, adoption leads, breeding matches, events, and pet-friendly discoveries',
        body:
          'Use this when members are sharing a real place that can help other Cane Corso owners. After review it can be published as a community-approved listing.',
        meta: 'Public result: community badge • admin-reviewed • directory-ready',
      },
      {
        key: 'suggestion',
        badge: 'Community suggestion',
        title: 'For tips, corrections, leads, and future ideas',
        body:
          'Use this when you are sending something the admin team should inspect first. Suggestions do not publish directly; they stay as an internal signal until converted.',
        meta: 'Public result: not direct • internal queue • admin conversion later',
      },
    ],
  },
  bg: {
    eyebrow: 'Матрица за достъп и публикуване',
    title: 'Официални срещу общностни пътеки за изпращане',
    description:
      'Избери правилната пътека преди изпращане. Тя определя кого представлява записът, как минава модерацията и дали резултатът става публичен запис или остава вътрешен сигнал.',
    cards: [
      {
        key: 'official',
        badge: 'Официален запис',
        title: 'За реални бизнеси, услуги, транспорт, престой, малки Cane Corso, търси дом, разплод и събития',
        body:
          'Използвай това, когато записът представлява реалния собственик, бизнес или оператор. След админ одобрение може да се публикува като официален запис в екосистемата.',
        meta: 'Публичен резултат: официален знак • админ преглед • готов за директория',
      },
      {
        key: 'community',
        badge: 'Общностен запис',
        title: 'За полезни места, търси дом, разплод, събития и открития, подходящи за Cane Corso',
        body:
          'Използвай това, когато член споделя реално място, полезно за други собственици на Cane Corso. След преглед може да се публикува като общностен запис.',
        meta: 'Публичен резултат: общностен знак • админ преглед • готов за директория',
      },
      {
        key: 'suggestion',
        badge: 'Общностно предложение',
        title: 'За идеи, корекции, сигнали и бъдещи предложения',
        body:
          'Използвай това, когато изпращаш нещо, което първо трябва да бъде прегледано от админа. Предложенията не се публикуват директно; остават вътрешен сигнал, докато не бъдат превърнати в реален запис.',
        meta: 'Публичен резултат: не директно • вътрешна опашка • по-късно решение от админ',
      },
    ],
  },
  it: {
    eyebrow: 'Matrice di accesso e pubblicazione',
    title: 'Percorsi official vs community',
    description:
      'Scegli il percorso prima di inviare. Il percorso controlla chi rappresenta la scheda, come funziona la moderazione e se il risultato diventa pubblico o resta un segnale interno.',
    cards: [
      {
        key: 'official',
        badge: 'Scheda ufficiale',
        title: 'Per business reali, servizi, trasporto, boarding, cuccioli, adozione, match ed eventi',
        body:
          'Usalo quando la scheda rappresenta il vero proprietario, business o operatore. Dopo l’approvazione admin può diventare una scheda ufficiale pubblica.',
        meta: 'Risultato pubblico: badge ufficiale • admin-reviewed • pronta per la directory',
      },
      {
        key: 'community',
        badge: 'Scheda community',
        title: 'Per luoghi utili, adozione, match, eventi e scoperte pet-friendly',
        body:
          'Usalo quando i membri condividono un luogo reale utile ad altri proprietari di Cane Corso. Dopo la revisione può diventare una scheda community pubblica.',
        meta: 'Risultato pubblico: badge community • admin-reviewed • pronta per la directory',
      },
      {
        key: 'suggestion',
        badge: 'Suggerimento community',
        title: 'Per correzioni, segnalazioni, idee e piste future',
        body:
          'Usalo quando stai inviando qualcosa che il team admin deve ispezionare per primo. I suggerimenti non si pubblicano direttamente; restano interni finché non vengono convertiti.',
        meta: 'Risultato pubblico: non diretto • coda interna • conversione admin successiva',
      },
    ],
  },
} as const;

export function EcosystemSubmissionMatrix({ locale }: EcosystemSubmissionMatrixProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <section className="content-card submission-matrix-card">
      <div className="section-head-row">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p className="section-card__description">{copy.description}</p>
        </div>
      </div>

      <div className="submission-matrix-grid">
        {copy.cards.map((card) => (
          <article
            key={card.key}
            className={`submission-matrix-entry submission-matrix-entry--${card.key}`}
          >
            <span className={`submission-channel-chip submission-channel-chip--${card.key}`}>
              {card.badge}
            </span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <div className="submission-matrix-entry__meta">{card.meta}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
