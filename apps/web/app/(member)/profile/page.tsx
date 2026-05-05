import Link from 'next/link';
import { redirect } from 'next/navigation';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { SectionCard } from '@/components/section-card';
import { OwnerOnboardingFinalPanel } from '@/components/owner-onboarding-final-panel';
import { getCurrentProfileDocument } from '@/lib/member-profile.server';
import { getCurrentMemberDogsDocument } from '@/lib/my-dogs.server';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { buildAccessPath } from '@/lib/access-control';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

function formatRoleLabel(locale: string, role: string) {
  const map = {
    en: {
      admin: 'Admin',
      member: 'Member',
      partner: 'Partner',
      reviewer: 'Reviewer',
    },
    bg: {
      admin: 'Админ',
      member: 'Член',
      partner: 'Партньор',
      reviewer: 'Преглед',
    },
    it: {
      admin: 'Admin',
      member: 'Membro',
      partner: 'Partner',
      reviewer: 'Revisore',
    },
  } as const;

  const localeMap = map[locale as keyof typeof map] ?? map.en;
  return localeMap[role as keyof typeof localeMap] ?? role;
}

function formatLocaleLabel(uiLocale: string, value?: string | null) {
  const normalized = (value ?? uiLocale).toLowerCase();
  const map = {
    en: {
      en: 'English',
      bg: 'Bulgarian',
      it: 'Italian',
    },
    bg: {
      en: 'Английски',
      bg: 'Български',
      it: 'Италиански',
    },
    it: {
      en: 'Inglese',
      bg: 'Bulgaro',
      it: 'Italiano',
    },
  } as const;

  const localeMap = map[uiLocale as keyof typeof map] ?? map.en;
  return localeMap[normalized as keyof typeof localeMap] ?? normalized.toUpperCase();
}

export default async function ProfilePage() {
  try {
    const [{ profile, session }, { dogs }] = await Promise.all([
      getCurrentProfileDocument({ allowDevFallback: false }),
      getCurrentMemberDogsDocument({ allowDevFallback: false }),
    ]);

    const locale = await getCurrentLocale();
    const t = getDictionary(locale);
    const displayName = session.user.displayName ?? session.user.email;
    const locationLabel = [profile.city, profile.country].filter(Boolean).join(', ') || t.common.pending;
    const nameLabel = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || displayName;

    const totalDogs = dogs.length;
    const published = dogs.filter((dog) => dog.lifecycleStatus === 'published').length;
    const inReview = dogs.filter((dog) => ['submitted', 'approved'].includes(dog.lifecycleStatus)).length;
    const drafts = dogs.filter((dog) => dog.lifecycleStatus === 'draft').length;

    const publishedDog = dogs.find((dog) => dog.publication?.publicSlug) ?? null;
    const workingDog =
      dogs.find((dog) => ['draft', 'needs_changes', 'submitted', 'approved'].includes(dog.lifecycleStatus)) ?? dogs[0] ?? null;

    const publishedProfileHref = publishedDog?.publication?.publicSlug ? `/registry/${publishedDog.publication.publicSlug}` : '/registry';
    const verifyHref = publishedDog?.publication?.verificationSlug
      ? `/verify/${publishedDog.publication.certificateCode ?? publishedDog.publication.verificationSlug}`
      : '/verify';
    const continueHref = workingDog ? `/my-dogs/${workingDog.id}/edit` : '/my-dogs/new';
    const emptyStateCopy = {
      en: {
        title: 'No Cane Corso profiles yet',
        description: 'Start your first Cane Corso profile so the private owner area can move toward review and public presence.',
        action: 'Add Cane Corso',
      },
      bg: {
        title: 'Все още няма Cane Corso профили',
        description: 'Започни първия Cane Corso профил, за да премине личната зона към преглед и публично присъствие.',
        action: 'Добави Cane Corso',
      },
      it: {
        title: 'Nessun profilo Cane Corso per ora',
        description: 'Crea il primo profilo Cane Corso per portare l’area privata verso revisione e presenza pubblica.',
        action: 'Aggiungi Cane Corso',
      },
    }[locale] ?? {
      title: 'No Cane Corso profiles yet',
      description: 'Start your first Cane Corso profile so the private owner area can move toward review and public presence.',
      action: 'Add Cane Corso',
    };

    const copy = {
      en: {
        eyebrow: 'Owner profile',
        heroDescription:
          'This page gives you a clear owner overview: who you are here, what status each Cane Corso profile has, and the next action to take.',
        quickActionsEyebrow: 'Quick actions',
        quickActionsTitle: 'Start with the next real action',
        quickActionsDescription:
          'The most important owner steps stay in front of you: continue work, add a new Cane Corso, open public presence, and use verification only when needed.',
        quickActions: {
          myDogs: 'Open My Cane Corso',
          addDog: 'Add Cane Corso',
          continueProfile: workingDog ? `Continue ${workingDog.name}` : 'Create first profile',
          publicProfile: publishedDog ? 'Open public profile' : 'Open public registry',
          verify: publishedDog ? 'Open verification' : 'Verification area',
        },
        identityEyebrow: 'Owner identity',
        identityTitle: 'Your personal foundation',
        identityDescription:
          'This is the private owner layer behind your Cane Corso profiles. Keep it clear, credible, and easy to understand.',
        labels: {
          ownerName: 'Owner name',
          email: 'Email',
          role: 'Role',
          location: 'Location',
          language: 'Language',
          account: 'Account',
          accountReady: 'Active member profile',
          bio: 'Owner note',
        },
        presenceEyebrow: 'Public presence',
        presenceTitle: 'How your owner profile connects to the registry',
        presenceDescription:
          'Your personal profile remains private. Public registry visibility, certificate trust, and verification sit on top of it as separate public layers.',
        presenceItems: [
          `${published} published profile${published === 1 ? '' : 's'}`,
          `${inReview} in review`,
          publishedDog ? `${publishedDog.name} already has a public presence` : 'No public Cane Corso profile yet',
        ],
        nextTitle: 'Best next step',
        nextDescription: workingDog
          ? `Continue working on ${workingDog.name} or open My Cane Corso if you want the full owner workspace.`
          : 'Start with your first Cane Corso profile so the owner path can move from identity to public presence.',
        centerEyebrow: 'Owner center',
        centerTitle: 'Keep the most useful sections close',
        centerDescription:
          'Your profile should not feel isolated. It should stay connected to your Cane Corso work, knowledge, and the wider community layer.',
        cards: [
          {
            eyebrow: 'My Cane Corso',
            title: 'Manage profiles, media, and pedigree in one place',
            description: 'Open the full owner workspace where drafts, edits, and publication readiness live.',
            href: '/my-dogs',
            meta: 'Profiles • media • pedigree',
            icon: 'member' as const,
          },
          {
            eyebrow: 'Knowledge',
            title: 'Find guidance, FAQs, and practical help quickly',
            description: 'Use the knowledge layer when you want clarity instead of guessing what comes next.',
            href: '/knowledge',
            meta: 'Guides • FAQ • standards',
            icon: 'knowledge' as const,
          },
          {
            eyebrow: 'Community',
            title: 'Stay connected to the life around Cane Corso',
            description: 'Keep an easy path toward community, FUN, and the ecosystem around the breed.',
            href: '/community',
            meta: 'Community • FUN • ecosystem',
            icon: 'community' as const,
          },
        ],
      },
      bg: {
        eyebrow: 'Профил на собственика',
        heroDescription:
          'Тази страница ти дава ясен поглед: кой си тук, какъв статус има всеки Cane Corso профил и кое е следващото правилно действие.',
        quickActionsEyebrow: 'Бързи действия',
        quickActionsTitle: 'Продължи от най-важната стъпка',
        quickActionsDescription:
          'Най-важните действия са пред теб: продължи текущ профил, добави нов Cane Corso, отвори публичното присъствие и използвай проверката само при нужда.',
        quickActions: {
          myDogs: 'Отвори Моите Cane Corso',
          addDog: 'Добави Cane Corso',
          continueProfile: workingDog ? `Продължи ${workingDog.name}` : 'Създай първи профил',
          publicProfile: publishedDog ? 'Отвори публичния профил' : 'Отвори публичния регистър',
          verify: publishedDog ? 'Отвори проверката' : 'Зона за проверка',
        },
        identityEyebrow: 'Идентичност на собственика',
        identityTitle: 'Твоята лична основа',
        identityDescription:
          'Това е личният слой зад профилите на твоите Cane Corso. Дръж го ясен, достоверен и лесен за разбиране.',
        labels: {
          ownerName: 'Име на собственика',
          email: 'Имейл',
          role: 'Роля',
          location: 'Локация',
          language: 'Език',
          account: 'Акаунт',
          accountReady: 'Активен членски профил',
          bio: 'Бележка за собственика',
        },
        presenceEyebrow: 'Публично присъствие',
        presenceTitle: 'Как профилът ти се свързва с регистъра',
        presenceDescription:
          'Личният ти профил остава частен. Публичният регистър, сертификатното доверие и проверката стъпват върху него като отделни публични слоеве.',
        presenceItems: [
          published === 1 ? '1 публикуван профил' : `${published} публикувани профила`,
          inReview === 1 ? '1 профил в преглед' : `${inReview} профила в преглед`,
          publishedDog ? `${publishedDog.name} вече има публично присъствие` : 'Все още няма публично публикуван Cane Corso профил',
        ],
        nextTitle: 'Следваща стъпка',
        nextDescription: workingDog
          ? `Продължи работата по ${workingDog.name} или отвори Моите Cane Corso, ако искаш пълната лична работна зона.`
          : 'Започни с първия Cane Corso профил, за да тръгне пътят от личната основа към публичното присъствие.',
        centerEyebrow: 'Център на собственика',
        centerTitle: 'Дръж най-полезните секции близо',
        centerDescription:
          'Профилът ти не трябва да стои изолиран. Той трябва да е свързан с Cane Corso профилите, знанията и по-широката общност.',
        cards: [
          {
            eyebrow: 'Моите Cane Corso',
            title: 'Управлявай профили, снимки и родословие на едно място',
            description: 'Отвори личната работна зона, където са черновите, редакциите и готовността за публикуване.',
            href: '/my-dogs',
            meta: 'Профили • снимки • родословие',
            icon: 'member' as const,
          },
          {
            eyebrow: 'Знания',
            title: 'Намери указания, въпроси и практична помощ',
            description: 'Използвай секцията със знания, когато искаш яснота за следващата стъпка.',
            href: '/knowledge',
            meta: 'Указания • въпроси • стандарти',
            icon: 'knowledge' as const,
          },
          {
            eyebrow: 'Общност',
            title: 'Остани свързан с общността около Cane Corso',
            description: 'Запази бърз достъп до общността, FUN слоя и екосистемата около породата.',
            href: '/community',
            meta: 'Общност • забавление • екосистема',
            icon: 'community' as const,
          },
        ],
      },
      it: {
        eyebrow: 'Profilo del proprietario',
        heroDescription:
          'Questa pagina ti dà una visione chiara: chi sei qui, quale stato ha ogni profilo Cane Corso e qual è la prossima azione corretta.',
        quickActionsEyebrow: 'Azioni rapide',
        quickActionsTitle: 'Continua dal prossimo passo concreto',
        quickActionsDescription:
          'Le azioni principali restano in primo piano: continua il profilo attivo, aggiungi un nuovo Cane Corso, apri la presenza pubblica e usa la verifica solo quando serve.',
        quickActions: {
          myDogs: 'Apri I miei Cane Corso',
          addDog: 'Aggiungi Cane Corso',
          continueProfile: workingDog ? `Continua ${workingDog.name}` : 'Crea il primo profilo',
          publicProfile: publishedDog ? 'Apri il profilo pubblico' : 'Apri il registro pubblico',
          verify: publishedDog ? 'Apri la verifica' : 'Area verifica',
        },
        identityEyebrow: 'Identità del proprietario',
        identityTitle: 'La tua base personale',
        identityDescription:
          'Questo è il livello personale dietro i profili dei tuoi Cane Corso. Mantienilo chiaro, credibile e facile da comprendere.',
        labels: {
          ownerName: 'Nome proprietario',
          email: 'Email',
          role: 'Ruolo',
          location: 'Località',
          language: 'Lingua',
          account: 'Account',
          accountReady: 'Profilo membro attivo',
          bio: 'Nota del proprietario',
        },
        presenceEyebrow: 'Presenza pubblica',
        presenceTitle: 'Come il tuo profilo si collega al registro',
        presenceDescription:
          'Il tuo profilo personale resta privato. Registro pubblico, fiducia del certificato e verifica si appoggiano su di esso come livelli pubblici separati.',
        presenceItems: [
          published === 1 ? '1 profilo pubblicato' : `${published} profili pubblicati`,
          inReview === 1 ? '1 profilo in revisione' : `${inReview} profili in revisione`,
          publishedDog ? `${publishedDog.name} ha già una presenza pubblica` : 'Nessun profilo Cane Corso pubblico ancora',
        ],
        nextTitle: 'Prossimo passo',
        nextDescription: workingDog
          ? `Continua il lavoro su ${workingDog.name} oppure apri I miei Cane Corso per usare l’intero spazio proprietario.`
          : 'Inizia con il primo profilo Cane Corso per portare il percorso del proprietario dalla base personale alla presenza pubblica.',
        centerEyebrow: 'Centro del proprietario',
        centerTitle: 'Tieni vicine le sezioni più utili',
        centerDescription:
          'Il tuo profilo non deve restare isolato. Deve rimanere collegato ai profili Cane Corso, alla conoscenza e alla comunità.',
        cards: [
          {
            eyebrow: 'I miei Cane Corso',
            title: 'Gestisci profili, foto e pedigree in un solo posto',
            description: 'Apri lo spazio personale completo dove trovi bozze, modifiche e preparazione alla pubblicazione.',
            href: '/my-dogs',
            meta: 'Profili • foto • pedigree',
            icon: 'member' as const,
          },
          {
            eyebrow: 'Conoscenza',
            title: 'Trova guide, FAQ e aiuto pratico rapidamente',
            description: 'Usa la sezione conoscenza quando vuoi chiarezza sul prossimo passo.',
            href: '/knowledge',
            meta: 'Guide • FAQ • standard',
            icon: 'knowledge' as const,
          },
          {
            eyebrow: 'Comunità',
            title: 'Resta connesso alla vita intorno al Cane Corso',
            description: 'Mantieni un percorso semplice verso comunità, FUN layer ed ecosistema della razza.',
            href: '/community',
            meta: 'Comunità • FUN • ecosistema',
            icon: 'community' as const,
          },
        ],
      },
    }[locale] ?? {
      eyebrow: 'Owner profile',
      heroDescription:
        'This page gives you a clear owner overview: who you are here, what status each Cane Corso profile has, and the next action to take.',
      quickActionsEyebrow: 'Quick actions',
      quickActionsTitle: 'Start with the next real action',
      quickActionsDescription:
        'The most important owner steps stay in front of you: continue work, add a new Cane Corso, open public presence, and use verification only when needed.',
      quickActions: {
        myDogs: 'Open My Cane Corso',
        addDog: 'Add Cane Corso',
        continueProfile: workingDog ? `Continue ${workingDog.name}` : 'Create first profile',
        publicProfile: publishedDog ? 'Open public profile' : 'Open public registry',
        verify: publishedDog ? 'Open verification' : 'Verification area',
      },
      identityEyebrow: 'Owner identity',
      identityTitle: 'Your personal foundation',
      identityDescription: 'This is the private owner layer behind your Cane Corso profiles. Keep it clear, credible, and easy to understand.',
      labels: {
        ownerName: 'Owner name',
        email: 'Email',
        role: 'Role',
        location: 'Location',
        language: 'Language',
        account: 'Account',
        accountReady: 'Active member profile',
        bio: 'Owner note',
      },
      presenceEyebrow: 'Public presence',
      presenceTitle: 'How your owner profile connects to the registry',
      presenceDescription:
        'Your personal profile remains private. Public registry visibility, certificate trust, and verification sit on top of it as separate public layers.',
      presenceItems: [],
      nextTitle: 'Best next step',
      nextDescription: workingDog
        ? `Continue working on ${workingDog.name} or open My Cane Corso if you want the full owner workspace.`
        : 'Start with your first Cane Corso profile so the owner path can move from identity to public presence.',
      centerEyebrow: 'Owner center',
      centerTitle: 'Keep the most useful sections close',
      centerDescription: 'Your profile should not feel isolated. It should stay connected to your Cane Corso work, knowledge, and the wider community layer.',
      cards: [],
    };

    return (
      <div className="member-route-stack profile-page">
        <section className="route-hero-card route-hero-card--member profile-page__hero">
          <div className="profile-page__hero-copy">
            <span className="eyebrow-label">{copy.eyebrow}</span>
            <h1 className="route-title">{t.pages.profile.title}</h1>
            <p className="route-copy">{copy.heroDescription}</p>
            <div className="route-hero-pills route-hero-pills--member">
              <span className="route-pill route-pill--glow">{formatRoleLabel(locale, session.user.role)}</span>
              <span className="route-pill">{locationLabel}</span>
              <span className="route-pill subtle">{copy.labels.accountReady}</span>
            </div>
          </div>

          <div className="profile-page__hero-panel">
            <div>
              <span className="eyebrow-label">{copy.quickActionsEyebrow}</span>
              <h2>{copy.quickActionsTitle}</h2>
              <p>{copy.quickActionsDescription}</p>
            </div>
            <div className="profile-page__hero-actions-grid">
              <Link href="/my-dogs" className="button-primary">
                {copy.quickActions.myDogs}
              </Link>
              <Link href="/my-dogs/new" className="button-secondary">
                {copy.quickActions.addDog}
              </Link>
              <Link href={continueHref} className="button-secondary">
                {copy.quickActions.continueProfile}
              </Link>
              <Link href={publishedProfileHref} className="button-secondary">
                {copy.quickActions.publicProfile}
              </Link>
              <Link href={verifyHref} className="button-ghost">
                {copy.quickActions.verify}
              </Link>
              <Link href="/guide?topic=member-workspace#member-workspace" className="button-ghost">
                {t.common.help}
              </Link>
            </div>
          </div>
        </section>

        <div className="stats-grid four-up profile-page__stats">
          <OverviewStatCard label={t.pages.myDogs.labels.totalProfiles} value={String(totalDogs)} tone="gold" />
          <OverviewStatCard label={t.pages.myDogs.labels.published} value={String(published)} tone="ivory" />
          <OverviewStatCard label={t.pages.myDogs.labels.inReview} value={String(inReview)} tone="gold" />
          <OverviewStatCard label={t.pages.myDogs.labels.drafts} value={String(drafts)} tone="ivory" />
        </div>

        {totalDogs === 0 ? (
          <section className="empty-state-panel profile-page__empty-state">
            <div>
              <div className="section-heading__eyebrow">{t.common.emptyState}</div>
              <h3 className="section-heading__title">{emptyStateCopy.title}</h3>
              <p className="empty-state-panel__description">{emptyStateCopy.description}</p>
            </div>
            <Link href="/my-dogs/new" className="button button--primary">
              {emptyStateCopy.action}
            </Link>
          </section>
        ) : null}

        <div className="profile-page__hub-grid">
          <section className="content-card profile-page__identity-card">
            <div className="section-head-row">
              <div>
                <span className="eyebrow-label">{copy.identityEyebrow}</span>
                <h2>{copy.identityTitle}</h2>
                <p className="section-support-copy">{copy.identityDescription}</p>
              </div>
            </div>

            <dl className="profile-page__identity-grid">
              <div>
                <dt>{copy.labels.ownerName}</dt>
                <dd>{nameLabel}</dd>
              </div>
              <div>
                <dt>{copy.labels.email}</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt>{copy.labels.role}</dt>
                <dd>{formatRoleLabel(locale, session.user.role)}</dd>
              </div>
              <div>
                <dt>{copy.labels.location}</dt>
                <dd>{locationLabel}</dd>
              </div>
              <div>
                <dt>{copy.labels.language}</dt>
                <dd>{formatLocaleLabel(locale, profile.locale)}</dd>
              </div>
              <div>
                <dt>{copy.labels.account}</dt>
                <dd>{copy.labels.accountReady}</dd>
              </div>
            </dl>

            <div className="profile-page__bio-panel">
              <span className="eyebrow-label">{copy.labels.bio}</span>
              <p>{profile.bio ?? t.pages.profile.cards.fallbackBio}</p>
            </div>
          </section>

          <div className="profile-page__side-stack">
            <section className="content-card profile-page__presence-card">
              <span className="eyebrow-label">{copy.presenceEyebrow}</span>
              <h3>{copy.presenceTitle}</h3>
              <p>{copy.presenceDescription}</p>

              <div className="profile-page__presence-chips">
                {copy.presenceItems.map((item) => (
                  <span key={item} className="profile-page__presence-chip">
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section className="content-card profile-page__next-card">
              <span className="eyebrow-label">{copy.nextTitle}</span>
              <h3>{workingDog ? workingDog.name : t.pages.profile.title}</h3>
              <p>{copy.nextDescription}</p>
              <div className="profile-page__next-actions">
                <Link href={continueHref} className="button-primary">
                  {copy.quickActions.continueProfile}
                </Link>
                <Link href="/my-dogs" className="button-secondary">
                  {copy.quickActions.myDogs}
                </Link>
              </div>
            </section>
          </div>
        </div>

        <OwnerOnboardingFinalPanel locale={locale} surface="profile" />

        <section className="content-card profile-page__center-card">
          <div className="section-head-row">
            <div>
              <span className="eyebrow-label">{copy.centerEyebrow}</span>
              <h2>{copy.centerTitle}</h2>
              <p className="section-support-copy">{copy.centerDescription}</p>
            </div>
          </div>

          <div className="section-card-grid section-card-grid--three profile-page__section-grid">
            {copy.cards.map((card) => (
              <SectionCard
                key={card.title}
                {...card}
                actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'}
              />
            ))}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: '/profile' }));
    }

    throw error;
  }
}
