import { PageShell } from '@/components/page-shell';
import type { PageShellCard } from '@/components/page-shell';
import { PartnerDirectoryOverview } from '@/components/partner-directory-overview';
import { PartnersServicesExperience } from '@/components/partners-services-experience';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPartnerDirectoryDocument } from '@/lib/partners.server';

export const dynamic = 'force-dynamic';

interface PartnersPageProps {
  searchParams?: Promise<{
    category?: string;
  }> | {
    category?: string;
  };
}

type PartnersPageCopy = {
  eyebrow: string;
  title: string;
  description: string;
  help: string;
  action: string;
  heroChips: readonly string[];
  cards: readonly PageShellCard[];
};

export default async function PartnersPage({ searchParams }: PartnersPageProps) {
  const locale = await getCurrentLocale();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const category = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : null;
  const document = await getPartnerDirectoryDocument({ category });

  const copyByLocale: Record<string, PartnersPageCopy> = {
    en: {
      eyebrow: 'Trusted partners',
      title: 'Approved Cane Corso services',
      description:
        'A curated public directory for services that support Cane Corso owners — clinics, training, handlers, transport, boarding, shops, places, and other useful partner profiles.',
      help: 'Help',
      action: 'Open',
      heroChips: ['Approved directory', 'Moderated visibility', 'Owner support'],
      cards: [
        {
          eyebrow: 'Directory',
          title: 'Browse approved profiles',
          description: 'Find public partner profiles with category, location, contact details, and a dedicated detail page.',
          href: '#partner-directory',
          meta: 'Catalog • categories • profiles',
          icon: 'partners',
        },
        {
          eyebrow: 'Application',
          title: 'Apply through moderation',
          description: 'New partner profiles stay private until an administrator reviews and approves them for public visibility.',
          href: '/partners/apply',
          meta: 'Apply • review • publish',
          icon: 'verify',
        },
        {
          eyebrow: 'Ecosystem',
          title: 'Separate from community posts',
          description: 'Partner profiles are curated business or service pages, not ordinary public suggestions.',
          href: '/community',
          meta: 'Partners • services • trust',
          icon: 'owner',
        },
      ],
    },
    bg: {
      eyebrow: 'Доверени партньори',
      title: 'Одобрени услуги за Cane Corso',
      description:
        'Куриран публичен каталог за услуги, които помагат на собствениците на Cane Corso — клиники, обучение, хендлъри, транспорт, настаняване, магазини, места и други полезни партньорски профили.',
      help: 'Помощ',
      action: 'Отвори',
      heroChips: ['Одобрен каталог', 'Модерирана видимост', 'Подкрепа за собственика'],
      cards: [
        {
          eyebrow: 'Каталог',
          title: 'Разгледай одобрени профили',
          description: 'Намери публични партньорски профили с категория, локация, контакт и отделна детайлна страница.',
          href: '#partner-directory',
          meta: 'Каталог • категории • профили',
          icon: 'partners',
        },
        {
          eyebrow: 'Кандидатстване',
          title: 'Кандидатствай през модерация',
          description: 'Новите партньорски профили остават скрити, докато администратор не ги прегледа и одобри.',
          href: '/partners/apply',
          meta: 'Кандидатура • преглед • публикация',
          icon: 'verify',
        },
        {
          eyebrow: 'Екосистема',
          title: 'Отделно от community записи',
          description: 'Партньорските профили са курирани бизнес или сервизни страници, а не обикновени публични предложения.',
          href: '/community',
          meta: 'Партньори • услуги • доверие',
          icon: 'owner',
        },
      ],
    },
    it: {
      eyebrow: 'Partner affidabili',
      title: 'Servizi Cane Corso approvati',
      description:
        'Una directory pubblica curata per servizi utili ai proprietari di Cane Corso — cliniche, training, handler, trasporto, boarding, negozi, luoghi e altri profili partner.',
      help: 'Aiuto',
      action: 'Apri',
      heroChips: ['Directory approvata', 'Visibilità moderata', 'Supporto proprietari'],
      cards: [
        {
          eyebrow: 'Directory',
          title: 'Esplora profili approvati',
          description: 'Trova profili partner pubblici con categoria, località, contatti e pagina dettaglio dedicata.',
          href: '#partner-directory',
          meta: 'Catalogo • categorie • profili',
          icon: 'partners',
        },
        {
          eyebrow: 'Candidatura',
          title: 'Candidati con moderazione',
          description: 'I nuovi profili partner restano privati finché un amministratore non li revisiona e approva.',
          href: '/partners/apply',
          meta: 'Candidatura • revisione • pubblicazione',
          icon: 'verify',
        },
        {
          eyebrow: 'Ecosistema',
          title: 'Separato dai post community',
          description: 'I profili partner sono pagine business o servizi curate, non semplici suggerimenti pubblici.',
          href: '/community',
          meta: 'Partner • servizi • fiducia',
          icon: 'owner',
        },
      ],
    },
  };

  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cards={copy.cards}
      actionLabel={copy.action}
      accentLabel={copy.eyebrow}
      helpHref="/guide?topic=partners#partners"
      helpLabel={copy.help}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="USG partners layer"
      visualFit="contain"
      heroChips={copy.heroChips}
    >
      <div className="partners-page-flow">
        <PartnersServicesExperience
          locale={locale}
          totalVisible={document.total}
          totalApproved={document.totalAll}
          featuredTotal={document.featuredTotal}
        />
        <PartnerDirectoryOverview document={document} locale={locale} />
      </div>
    </PageShell>
  );
}
