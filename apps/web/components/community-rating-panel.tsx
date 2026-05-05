import Link from 'next/link';
import type { CommunityRatingSummary, CommunityVoteState } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';

interface CommunityRatingPanelProps {
  locale: Locale;
  variant: 'registry' | 'partner';
  slug: string;
  targetId: string;
  summary: CommunityRatingSummary;
  vote: CommunityVoteState;
  status?: string | null;
}

const copyByLocale = {
  en: {
    eyebrow: 'Community layer',
    title: 'Members can rate this Cane Corso, separate from the official USG layer.',
    partnerTitle: 'Members can rate this partner profile, separate from official approval.',
    description:
      'Each member can rate a published Cane Corso once and update the score later, while the official USG trust layer remains independent from member votes.',
    partnerDescription:
      'Each member can rate an approved partner or service once and update the score later, while official approval remains independent from community votes.',
    average: 'Average rating',
    votes: 'Votes',
    noRating: 'No ratings yet',
    yourRating: 'Your rating',
    updateHint: 'One member account can rate once and update the score later.',
    partnerUpdateHint: 'One member account can rate this partner once and update the score later.',
    ownEntry: 'You cannot rate your own profile.',
    partnerOwnEntry: 'You cannot rate your own partner profile.',
    memberRequired: 'Community rating unlocks after member sign-in.',
    partnerMemberRequired: 'Partner rating unlocks after member sign-in.',
    memberCta: 'Member access',
    saveSuccess: 'Your community rating was saved.',
    invalid: 'Choose a score from 1 to 5.',
    missing: 'This entry is no longer available for rating.',
    error: 'The rating could not be saved right now.',
    communityFavorite: 'Community favorite',
    topPartner: 'Top community partner',
    registryChip: 'Registry rating',
    partnerChip: 'Partner rating',
    note: 'Official USG trust and community rating remain two separate signals.',
    partnerNote: 'Official partner approval and community rating remain two separate signals.',
    chooseScore: 'Choose your score',
    stars: 'stars',
  },
  bg: {
    eyebrow: 'Общностен слой',
    title: 'Потребителите могат да оценяват това Cane Corso отделно от официалния USG слой.',
    partnerTitle: 'Потребителите могат да оценяват този партньорски профил отделно от официалното одобрение.',
    description:
      'Всеки член може да оцени публикувано Cane Corso по веднъж и после да обнови оценката, а официалният слой на USG остава независим от гласовете.',
    partnerDescription:
      'Всеки член може да оцени одобрен партньор или услуга по веднъж и после да обнови оценката, а официалното одобрение остава независимо от гласовете.',
    average: 'Средна оценка',
    votes: 'Гласове',
    noRating: 'Все още няма оценки',
    yourRating: 'Твоята оценка',
    updateHint: 'Един членски акаунт оценява по веднъж и по-късно може да обнови оценката.',
    partnerUpdateHint: 'Един членски акаунт може да оцени този партньор веднъж и по-късно да обнови оценката.',
    ownEntry: 'Не можеш да оценяваш собствения си профил.',
    partnerOwnEntry: 'Не можеш да оценяваш собствения си партньорски профил.',
    memberRequired: 'Оценката от общността се отключва след членски вход.',
    partnerMemberRequired: 'Оценката за партньор се отключва след членски вход.',
    memberCta: 'Вход за членове',
    saveSuccess: 'Оценката от общността е записана.',
    invalid: 'Избери оценка от 1 до 5.',
    missing: 'Този запис вече не е достъпен за оценяване.',
    error: 'Оценката не можа да бъде записана в момента.',
    communityFavorite: 'Любимец на общността',
    topPartner: 'Топ партньор на общността',
    registryChip: 'Оценка за профила',
    partnerChip: 'Оценка за партньора',
    note: 'Официалният USG слой и оценката от общността остават два отделни сигнала.',
    partnerNote: 'Официалното одобрение и оценката от общността остават два отделни сигнала.',
    chooseScore: 'Избери своята оценка',
    stars: 'звезди',
  },
  it: {
    eyebrow: 'Layer community',
    title: 'I membri possono valutare questo Cane Corso separatamente dal layer ufficiale USG.',
    partnerTitle: 'I membri possono valutare questo profilo partner separatamente dall’approvazione ufficiale.',
    description:
      'Ogni membro può valutare un Cane Corso pubblicato una volta e aggiornare il punteggio in seguito, mentre il layer ufficiale USG resta indipendente dai voti.',
    partnerDescription:
      'Ogni membro può valutare un partner o servizio approvato una volta e aggiornare il punteggio in seguito, mentre l’approvazione ufficiale resta indipendente dai voti community.',
    average: 'Valutazione media',
    votes: 'Voti',
    noRating: 'Nessuna valutazione',
    yourRating: 'La tua valutazione',
    updateHint: 'Ogni account membro può votare una volta e aggiornare il punteggio in seguito.',
    partnerUpdateHint: 'Ogni account membro può valutare questo partner una volta e aggiornare il punteggio in seguito.',
    ownEntry: 'Non puoi valutare il tuo profilo.',
    partnerOwnEntry: 'Non puoi valutare il tuo profilo partner.',
    memberRequired: 'La valutazione community si sblocca dopo l’accesso membro.',
    partnerMemberRequired: 'La valutazione partner si sblocca dopo l’accesso membro.',
    memberCta: 'Accesso membri',
    saveSuccess: 'La tua valutazione community è stata salvata.',
    invalid: 'Scegli un punteggio da 1 a 5.',
    missing: 'Questa voce non è più disponibile per la valutazione.',
    error: 'La valutazione non può essere salvata ora.',
    communityFavorite: 'Preferito della community',
    topPartner: 'Top partner della community',
    registryChip: 'Valutazione profilo',
    partnerChip: 'Valutazione partner',
    note: 'Il layer ufficiale USG e la valutazione community restano due segnali separati.',
    partnerNote: 'L’approvazione partner ufficiale e la valutazione community restano due segnali separati.',
    chooseScore: 'Scegli il tuo punteggio',
    stars: 'stelle',
  },
} as const;

function getStatusMessage(locale: Locale, status: string | null | undefined) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  switch (status) {
    case 'saved':
      return copy.saveSuccess;
    case 'own':
      return copy.ownEntry;
    case 'invalid':
      return copy.invalid;
    case 'missing':
      return copy.missing;
    case 'error':
      return copy.error;
    default:
      return null;
  }
}

function formatAverage(value: number | null) {
  return value ? value.toFixed(1) : '—';
}

function getBadgeLabel(locale: Locale, badge: CommunityRatingSummary['badge']) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  if (badge === 'community_favorite') {
    return copy.communityFavorite;
  }

  if (badge === 'top_partner') {
    return copy.topPartner;
  }

  return null;
}

function renderStars(value: number | null) {
  const filled = value == null ? 0 : Math.max(0, Math.min(5, Math.round(value)));

  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`registry-rating-stars__star${index < filled ? ' registry-rating-stars__star--filled' : ''}`}>
      ★
    </span>
  ));
}

function renderChoiceStars(value: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`community-rating-button__star${index < value ? ' community-rating-button__star--filled' : ''}`}>
      ★
    </span>
  ));
}

export function CommunityRatingPanel({ locale, variant, slug, targetId, summary, vote, status }: CommunityRatingPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const isPartnerRating = variant === 'partner';
  const action = variant === 'registry' ? '/api/community/registry/rate' : '/api/community/partners/rate';
  const chipLabel = variant === 'registry' ? copy.registryChip : copy.partnerChip;
  const panelTitle = isPartnerRating ? copy.partnerTitle : copy.title;
  const panelDescription = isPartnerRating ? copy.partnerDescription : copy.description;
  const updateHint = isPartnerRating ? copy.partnerUpdateHint : copy.updateHint;
  const ownEntryMessage = isPartnerRating ? copy.partnerOwnEntry : copy.ownEntry;
  const memberRequiredMessage = isPartnerRating ? copy.partnerMemberRequired : copy.memberRequired;
  const trustNote = isPartnerRating ? copy.partnerNote : copy.note;
  const statusMessage = getStatusMessage(locale, status);
  const badgeLabel = getBadgeLabel(locale, summary.badge);

  return (
    <section className="content-card community-rating-panel">
      <div className="community-rating-panel__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{panelTitle}</h2>
          <p>{panelDescription}</p>
        </div>
        <div className="community-rating-panel__summary">
          <div className="community-rating-panel__stat">
            <span>{copy.average}</span>
            <strong>{summary.totalRatings > 0 ? `${formatAverage(summary.averageRating)} / 5` : copy.noRating}</strong>
            <div className="registry-rating-stars registry-rating-stars--compact">{renderStars(summary.totalRatings > 0 ? summary.averageRating ?? null : null)}</div>
          </div>
          <div className="community-rating-panel__stat">
            <span>{copy.votes}</span>
            <strong>{summary.totalRatings}</strong>
          </div>
          {badgeLabel ? <span className="route-pill route-pill--glow community-rating-panel__badge">{badgeLabel}</span> : null}
        </div>
      </div>

      {statusMessage ? <div className="community-rating-panel__status">{statusMessage}</div> : null}

      <div className="community-rating-panel__body">
        <div className="community-rating-panel__chips">
          <span className="route-pill subtle">{chipLabel}</span>
          <span className="route-pill subtle">{trustNote}</span>
          {vote.userRating ? <span className="route-pill route-pill--glow">{copy.yourRating}: {vote.userRating}/5</span> : null}
        </div>

        {vote.canRate ? (
          <form action={action} method="post" className="community-rating-panel__form">
            <input type="hidden" name={variant === 'registry' ? 'registryEntryId' : 'partnerId'} value={targetId} />
            <input type="hidden" name="slug" value={slug} />
            <p className="community-rating-panel__hint">{copy.chooseScore}</p>
            <div className="community-rating-panel__buttons">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="submit"
                  name="rating"
                  value={value}
                  aria-label={`${value} ${copy.stars}`}
                  className={`community-rating-button${vote.userRating === value ? ' community-rating-button--active' : ''}`}
                >
                  <span className="community-rating-button__stars">{renderChoiceStars(value)}</span>
                  <small>{value} / 5</small>
                </button>
              ))}
            </div>
            <p className="community-rating-panel__hint">{updateHint}</p>
          </form>
        ) : vote.gate === 'member_required' ? (
          <div className="community-rating-panel__gate">
            <p>{memberRequiredMessage}</p>
            <Link href="/access?intent=member" className="button-primary small">
              {copy.memberCta}
            </Link>
          </div>
        ) : (
          <div className="community-rating-panel__gate">
            <p>{ownEntryMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
