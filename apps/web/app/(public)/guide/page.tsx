import { PageShell } from '@/components/page-shell';
import { PlatformGuide } from '@/components/platform-guide';
import { getCurrentLocale } from '@/lib/locale.server';

interface GuidePageProps {
  searchParams?: Promise<{ topic?: string }> | { topic?: string };
}

export default async function GuidePage({ searchParams }: GuidePageProps) {
  const locale = await getCurrentLocale();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const activeTopic = typeof resolvedSearchParams?.topic === 'string' ? resolvedSearchParams.topic : null;

  const copyByLocale = {
    en: {
      eyebrow: 'Guide and help',
      title: 'About the platform',
      description:
        'A central guide that explains what each main section does, who it is for, and how official trust, community usefulness, and publication work together inside the Cane Corso platform.',
    },
    bg: {
      eyebrow: 'Наръчник и помощ',
      title: 'За платформата',
      description:
        'Централен наръчник, който обяснява какво прави всяка основна секция, за кого е и как официалното доверие, общностната полезност и публикуването работят заедно в Cane Corso платформата.',
    },
    it: {
      eyebrow: 'Guida e aiuto',
      title: 'Informazioni sulla piattaforma',
      description:
        'Una guida centrale che spiega cosa fa ogni sezione principale, per chi è e come fiducia official, utilità community e pubblicazione lavorano insieme nella piattaforma Cane Corso.',
    },
  } as const;

  const copy = copyByLocale[locale] ?? copyByLocale.en;

  const guideHeroByLocale = {
    en: {
      cards: [
        { eyebrow: 'Manifesto', title: 'A clear point of view behind the product', description: 'The platform should still speak with responsibility, breed culture, and premium conviction.', href: '/manifesto', meta: 'Identity • doctrine • responsibility', icon: 'manifesto' },
        { eyebrow: 'FAQ', title: 'Question-first clarity before the user gets lost', description: 'Access, review, trust, and visibility should be explained early, not guessed later.', href: '/faq', meta: 'Clarity • trust • less confusion', icon: 'faq' },
        { eyebrow: 'Access', title: 'A calmer threshold into member and partner paths', description: 'The deeper parts of the platform begin with a clear personal access path before anything public appears.', href: '/access?intent=member', meta: 'Member • partner • reviewed visibility', icon: 'member' },
      ],
      chips: ['Official trust', 'Community usefulness', 'Help before action'],
      note: 'USG is strongest when identity, explanation, and trust work together. The guide keeps that discipline clear across the product.',
    },
    bg: {
      cards: [
        { eyebrow: 'Манифест', title: 'Ясна гледна точка зад продукта', description: 'Платформата трябва да говори с отговорност, култура към породата и премиум увереност.', href: '/manifesto', meta: 'Идентичност • доктрина • отговорност', icon: 'manifesto' },
        { eyebrow: 'FAQ', title: 'Яснота през въпросите, преди човекът да се изгуби', description: 'Достъпът, прегледът, доверието и видимостта трябва да се обясняват рано, а не да се гадаят по-късно.', href: '/faq', meta: 'Яснота • доверие • по-малко лутане', icon: 'faq' },
        { eyebrow: 'Достъп', title: 'По-спокоен праг към членския и партньорския път', description: 'По-дълбоките части на платформата започват с ясен личен достъп, преди да се появи каквото и да е публично.', href: '/access?intent=member', meta: 'Член • партньор • видимост след преглед', icon: 'member' },
      ],
      chips: ['Официално доверие', 'Общностна полезност', 'Помощ преди действие'],
      note: 'Старият проект беше най-силен, когато идентичността, обяснението и доверието работеха заедно. Наръчникът пази тази дисциплина жива в новата структура.',
    },
    it: {
      cards: [
        { eyebrow: 'Manifesto', title: 'Un chiaro punto di vista dietro il prodotto', description: 'La piattaforma dovrebbe ancora parlare con responsabilità, cultura di razza e convinzione premium.', href: '/manifesto', meta: 'Identità • dottrina • responsabilità', icon: 'manifesto' },
        { eyebrow: 'FAQ', title: 'Chiarezza question-first prima che l’utente si perda', description: 'Accesso, review, fiducia e visibilità dovrebbero essere spiegati presto, non indovinati più tardi.', href: '/faq', meta: 'Chiarezza • fiducia • meno smarrimento', icon: 'faq' },
        { eyebrow: 'Accesso', title: 'Una soglia più calma verso il percorso membro e partner', description: 'Le parti più profonde della piattaforma iniziano con un accesso personale chiaro prima che qualcosa diventi pubblico.', href: '/access?intent=member', meta: 'Membro • partner • visibilità dopo review', icon: 'member' },
      ],
      chips: ['Fiducia official', 'Utilità community', 'Aiuto prima dell’azione'],
      note: 'Il vecchio progetto era al suo meglio quando identità, spiegazione e fiducia lavoravano insieme. La guida mantiene viva questa disciplina nella nuova struttura.',
    },
  } as const;

  const guideHero = guideHeroByLocale[locale] ?? guideHeroByLocale.en;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      accentLabel={copy.eyebrow}
      cards={guideHero.cards}
      actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'}
      heroChips={guideHero.chips}
      heroNote={guideHero.note}
      helpHref="/platform#platform-help"
      helpLabel={locale === 'bg' ? 'Начало на ориентацията' : locale === 'it' ? 'Inizio orientamento' : 'Orientation start'}
    >
      <PlatformGuide locale={locale} activeTopic={activeTopic} />
    </PageShell>
  );
}
