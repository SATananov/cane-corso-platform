import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface PlatformGuideProps {
  locale: Locale;
  activeTopic?: string | null;
}

type GuideSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  ctaHref?: string;
  ctaLabel?: string;
};

const copyByLocale = {
  en: {
    jumpLabel: 'Jump to',
    sections: [
      {
        id: 'official-community',
        eyebrow: 'Официално и общностно',
        title: 'Two layers, one ecosystem',
        description:
          'The official layer protects trust. The community layer expands usefulness. They must work together, but they should never be confused with each other.',
        bullets: [
          'Official layer: registry, verification, review decisions, publication status, and the strongest trust signals.',
          'Community layer: useful visibility for places, services, transport, boarding, pet-friendly locations, and moderated activity or suggestions.',
          'Everything public still passes through review before it appears to visitors.',
        ],
        ctaHref: '/community',
        ctaLabel: 'Open community layer',
      },
      {
        id: 'access',
        eyebrow: 'Нива на достъп',
        title: 'Who uses what',
        description:
          'The platform becomes easier when every user understands which zone belongs to them and what they can actually do there.',
        bullets: [
          'Guest: can explore public pages, registry, partners, community, knowledge, and verification.',
          'Member: can manage profile, My Cane Corso, submissions, and ecosystem listings from the owner workspace.',
          'Partner: enters through the partner application flow and is visible only after approval.',
          'Reviewer / admin: moderates submissions, decides trust states, and controls publication.',
        ],
      },
      {
        id: 'registry',
        eyebrow: 'Регистър',
        title: 'The registry is the official trust core',
        description:
          'Registry is not just a list. It is the official publication layer for approved Cane Corso profiles and certificate-linked trust presentation.',
        bullets: [
          'Members prepare and submit a Cane Corso profile.',
          'Reviewers request changes, approve, and later publish.',
          'Published entries connect to verify and become part of the official read model.',
        ],
        ctaHref: '/registry',
        ctaLabel: 'Open registry',
      },
      {
        id: 'knowledge',
        eyebrow: 'Знания',
        title: 'Knowledge explains the breed, not only the product',
        description:
          'Knowledge is where users should understand the Cane Corso itself: care, temperament, history, health awareness, and long-term ownership guidance.',
        bullets: [
          'This is the educational layer of the platform.',
          'It helps new and existing owners understand the breed with more confidence.',
          'It supports trust by making the platform useful beyond listings alone.',
        ],
        ctaHref: '/knowledge',
        ctaLabel: 'Open knowledge',
      },
      {
        id: 'member-workspace',
        eyebrow: 'Лична работна зона',
        title: 'My Cane Corso is the private preparation zone',
        description:
          'The member workspace is where owners create profiles, refine data, prepare media, and move toward official review and publication.',
        bullets: [
          'This area stays personal and editable before publication.',
          'It should always explain what is private, what is under review, and what is already public.',
          'Help is especially important here because this is where users do the most real work.',
        ],
        ctaHref: '/my-dogs',
        ctaLabel: 'Open member workspace',
      },
      {
        id: 'review',
        eyebrow: 'Модерация',
        title: 'Review protects quality before anything goes public',
        description:
          'Review is the control layer between submission and publication. It is where admins protect quality, request changes, and decide what is ready for visibility.',
        bullets: [
          'Moderation is not only approval. It is trust curation.',
          'The same principle applies to registry, partners, and community visibility.',
          'This is why official vs community can stay separate while sharing the same moderation discipline.',
        ],
      },
      {
        id: 'partners',
        eyebrow: 'Партньори',
        title: 'Partners stay curated and professional',
        description:
          'Partners are part of the trusted business network: clinics, trainers, handlers, breeders, stores, relocation, hotels, and other relevant services.',
        bullets: [
          'Partner presence is not automatic.',
          'Applications are reviewed before public visibility.',
          'Partner pages should feel premium, useful, and clearly approved.',
        ],
        ctaHref: '/partners',
        ctaLabel: 'Open partners',
      },
      {
        id: 'community',
        eyebrow: 'Общност',
        title: 'Community expands the ecosystem without weakening trust',
        description:
          'Community is where broader usefulness lives: walk places, play areas, pet-friendly places, boarding, transport, and other approved ecosystem visibility.',
        bullets: [
          'This is where official vs community becomes visible to the user.',
          'Community content may be practical and local, but still reviewed before publishing.',
          'The goal is a full Cane Corso ecosystem, not only a registry website.',
        ],
        ctaHref: '/community',
        ctaLabel: 'Open community',
      },
      {
        id: 'suggestions',
        eyebrow: 'Предложения',
        title: 'Suggestions should be guided, not chaotic',
        description:
          'Owners and users should be able to propose useful places, services, or ideas, but the product must explain clearly that suggestions are reviewed before public visibility.',
        bullets: [
          'Suggestions are proposals, not immediate publications.',
          'A help layer should explain what makes a suggestion useful and acceptable.',
          'This keeps the platform open to growth while protecting quality.',
        ],
      },
      {
        id: 'activity',
        eyebrow: 'Активност',
        title: 'Activity is the living pulse of the platform',
        description:
          'Activity can later include meetups, events, walks, training fields, gatherings, and other real-world movement inside the Cane Corso ecosystem.',
        bullets: [
          'Activity should build on the same moderated engine, not on a separate disconnected module.',
          'Location-aware visibility matters here.',
          'The product should feel alive, but still controlled and premium.',
        ],
      },
      {
        id: 'premium',
        eyebrow: 'Premium direction',
        title: 'Premium is not decoration only',
        description:
          'The premium layer means clear hierarchy, strong explanations, fewer confusing paths, and a more deliberate feeling of trust and rarity.',
        bullets: [
          'Every major page should have a Help entry point.',
          'Official pages should feel more formal and trust-oriented.',
          'Community pages should feel useful, alive, and still clearly moderated.',
        ],
        ctaHref: '/platform',
        ctaLabel: 'Return to platform home',
      },
    ] satisfies GuideSection[],
  },
  bg: {
    jumpLabel: 'Премини към',
    sections: [
      {
        id: 'official-community',
        eyebrow: 'Официално и общностно',
        title: 'Два слоя, една екосистема',
        description:
          'Официалният слой пази доверието. Общностният слой разширява полезността. Те трябва да работят заедно, но никога да не се бъркат един с друг.',
        bullets: [
          'Официален слой: регистър, проверка, решения след преглед, статус на публикация и най-силните сигнали за доверие.',
          'Общностен слой: полезна видимост за места, услуги, транспорт, хотели за кучета, обекти, подходящи за Cane Corso, и модерирани предложения или активности.',
          'Всичко публично пак минава през преглед, преди да се покаже на посетителите.',
        ],
        ctaHref: '/community',
        ctaLabel: 'Отвори общностния слой',
      },
      {
        id: 'access',
        eyebrow: 'Нива на достъп',
        title: 'Кой какво използва',
        description:
          'Платформата става по-ясна, когато всеки потребител разбира коя зона е за него и какво реално може да прави в нея.',
        bullets: [
          'Гост: разглежда публичните страници, регистъра, партньорите, общността, знанията и страницата за проверка.',
          'Член: управлява профил, Моите Cane Corso, изпращания и собствени обяви в екосистемата през личната работна зона.',
          'Партньор: кандидатства през партньорския поток и става видим едва след одобрение.',
          'Проверяващ / админ: модерира изпращанията, решава състоянията на доверие и контролира публикацията.',
        ],
      },
      {
        id: 'registry',
        eyebrow: 'Регистър',
        title: 'Регистърът е официалното ядро на доверие',
        description:
          'Регистърът не е просто списък. Това е официалният слой за публикация на одобрени Cane Corso профили и сертификатно доверено присъствие.',
        bullets: [
          'Членовете подготвят и изпращат Cane Corso профил.',
          'Екипът за преглед иска корекции, одобрява и после публикува.',
          'Публикуваните записи се свързват със страницата за проверка и стават част от официалния публичен модел.',
        ],
        ctaHref: '/registry',
        ctaLabel: 'Отвори регистъра',
      },
      {
        id: 'knowledge',
        eyebrow: 'Знания',
        title: 'Знанията обясняват породата, не само продукта',
        description:
          'Знанията са мястото, където потребителят разбира самото Cane Corso: грижа, темперамент, история, здравна информираност и дългосрочни насоки за отговорно отглеждане.',
        bullets: [
          'Това е образователният слой на платформата.',
          'Той помага на нови и настоящи собственици да разбират породата по-уверено.',
          'Той подкрепя доверието, като прави платформата полезна отвъд самите списъци с профили и обяви.',
        ],
        ctaHref: '/knowledge',
        ctaLabel: 'Отвори знанията',
      },
      {
        id: 'member-workspace',
        eyebrow: 'Лична работна зона',
        title: 'Моите Cane Corso е частната зона за подготовка',
        description:
          'Личната работна зона е мястото, където собствениците създават профили, изчистват данните, подготвят медията и се движат към официален преглед и публикация.',
        bullets: [
          'Тази зона остава лична и редактируема преди публикация.',
          'Тя винаги трябва да обяснява кое е частно, кое е в преглед и кое вече е публично.',
          'Помощта е особено важна тук, защото именно тук потребителят върши най-много реална работа.',
        ],
        ctaHref: '/my-dogs',
        ctaLabel: 'Отвори личната зона',
      },
      {
        id: 'review',
        eyebrow: 'Модерация',
        title: 'Прегледът пази качеството преди нещо да стане публично',
        description:
          'Прегледът е контролният слой между изпращането и публикацията. Тук админите пазят качеството, искат корекции и решават какво е готово за видимост.',
        bullets: [
          'Модерацията не е само одобрение. Тя е курация на доверието.',
          'Същият принцип важи за регистъра, партньорите и общностната видимост.',
          'Точно затова официалният и общностният слой могат да останат разделени, но да споделят една дисциплина на модерация.',
        ],
      },
      {
        id: 'partners',
        eyebrow: 'Партньори',
        title: 'Партньорите остават curated и професионални',
        description:
          'Партньорите са част от доверената професионална мрежа: клиники, треньори, хендлъри, развъдници, магазини, международен транспорт, хотели за кучета и други релевантни услуги.',
        bullets: [
          'Партньорската видимост не е автоматична.',
          'Кандидатурите се преглеждат преди публична видимост.',
          'Партньорските страници трябва да изглеждат премиум, полезни и ясно одобрени.',
        ],
        ctaHref: '/partners',
        ctaLabel: 'Отвори партньорите',
      },
      {
        id: 'community',
        eyebrow: 'Общност',
        title: 'Общността разширява екосистемата, без да отслабва доверието',
        description:
          'Общността е мястото за по-широката полезност: места за разходка, зони за игра, обекти, подходящи за Cane Corso, хотели за кучета, транспорт и друга одобрена видимост в екосистемата.',
        bullets: [
          'Тук разликата между официалния и общностния слой става видима за потребителя.',
          'Общностното съдържание може да е практично и локално, но пак минава през преглед преди публикуване.',
          'Целта е пълна Cane Corso екосистема, а не само сайт с регистър.',
        ],
        ctaHref: '/community',
        ctaLabel: 'Отвори общността',
      },
      {
        id: 'suggestions',
        eyebrow: 'Предложения',
        title: 'Предложенията трябва да са насочени, не хаотични',
        description:
          'Собствениците и потребителите трябва да могат да предлагат полезни места, услуги или идеи, но продуктът трябва ясно да обяснява, че предложенията се преглеждат преди публична видимост.',
        bullets: [
          'Предложенията са идеи за преглед, не незабавни публикации.',
          'Слоят за помощ трябва да обяснява какво прави едно предложение полезно и приемливо.',
          'Така платформата остава отворена за растеж, но пази качеството.',
        ],
      },
      {
        id: 'activity',
        eyebrow: 'Активност',
        title: 'Активността е живият пулс на платформата',
        description:
          'Активността по-късно може да включва срещи, събития, разходки, тренировъчни терени и друга реална активност вътре в Cane Corso екосистемата.',
        bullets: [
          'Активността трябва да стъпи върху същия модериран механизъм, а не върху отделен разкачен модул.',
          'Видимостта според локация е важна тук.',
          'Продуктът трябва да изглежда жив, но пак контролиран и премиум.',
        ],
      },
      {
        id: 'premium',
        eyebrow: 'Премиум посока',
        title: 'Премиум не е само украса',
        description:
          'Премиум слой означава ясна йерархия, силни разяснения, по-малко объркващи пътища и по-съзнателно усещане за доверие и рядкост.',
        bullets: [
          'Всяка основна страница трябва да има входна точка за помощ.',
          'Официалните страници трябва да се усещат по-формални и ориентирани към доверие.',
          'Общностните страници трябва да са полезни, живи и пак ясно модерирани.',
        ],
        ctaHref: '/platform',
        ctaLabel: 'Назад към платформата',
      },
    ] satisfies GuideSection[],
  },
  it: {
    jumpLabel: 'Vai a',
    sections: [
      {
        id: 'official-community',
        eyebrow: 'Официално и общностно',
        title: 'Due layer, un ecosistema',
        description:
          'Il layer ufficiale protegge la fiducia. Il layer community amplia l’utilità. Devono lavorare insieme, ma non devono mai essere confusi.',
        bullets: [
          'Layer ufficiale: registry, verify, decisioni review, stato di pubblicazione e segnali di fiducia più forti.',
          'Layer community: visibilità utile per luoghi, servizi, trasporto, boarding, venue pet-friendly e futura logica activity o suggestions.',
          'Ogni contenuto pubblico passa comunque da una revisione prima di apparire ai visitatori.',
        ],
        ctaHref: '/community',
        ctaLabel: 'Apri il layer community',
      },
      {
        id: 'access',
        eyebrow: 'Layer di accesso',
        title: 'Chi usa cosa',
        description:
          'La piattaforma diventa più chiara quando ogni utente capisce quale zona gli appartiene e cosa può davvero fare lì.',
        bullets: [
          'Guest: esplora pagine pubbliche, registry, partner, community, knowledge e verify.',
          'Member: gestisce profilo, My Cane Corso, invii e listings ecosystem dal workspace proprietario.',
          'Partner: entra tramite partner application flow e diventa visibile solo dopo approvazione.',
          'Reviewer / admin: modera gli invii, decide gli stati di fiducia e controlla la pubblicazione.',
        ],
      },
      {
        id: 'registry',
        eyebrow: 'Регистър',
        title: 'Il registro è il nucleo ufficiale di fiducia',
        description:
          'Il registry non è solo una lista. È il layer ufficiale di pubblicazione per profili Cane Corso approvati e presentazione di fiducia collegata ai certificati.',
        bullets: [
          'I membri preparano e inviano un profilo Cane Corso.',
          'Il team review richiede modifiche, approva e poi pubblica.',
          'Le voci pubblicate si collegano a verify ed entrano nel read model ufficiale.',
        ],
        ctaHref: '/registry',
        ctaLabel: 'Apri il registro',
      },
      {
        id: 'knowledge',
        eyebrow: 'Знания',
        title: 'Knowledge spiega la razza, non solo il prodotto',
        description:
          'Knowledge è il luogo in cui l’utente dovrebbe capire il Cane Corso stesso: cura, temperamento, storia, consapevolezza salute e guida di proprietà nel lungo termine.',
        bullets: [
          'Questo è il layer educativo della piattaforma.',
          'Aiuta nuovi e attuali proprietari a comprendere la razza con più sicurezza.',
          'Supporta la fiducia rendendo la piattaforma utile oltre le sole listings.',
        ],
        ctaHref: '/knowledge',
        ctaLabel: 'Apri knowledge',
      },
      {
        id: 'member-workspace',
        eyebrow: 'Лична работна зона',
        title: 'My Cane Corso è la zona privata di preparazione',
        description:
          'Il member workspace è dove i proprietari creano profili, rifiniscono i dati, preparano i media e si muovono verso review ufficiale e pubblicazione.',
        bullets: [
          'Quest’area resta personale e modificabile prima della pubblicazione.',
          'Dovrebbe sempre spiegare cosa è privato, cosa è in review e cosa è già pubblico.',
          'L’help è particolarmente importante qui, perché è dove l’utente svolge più lavoro reale.',
        ],
        ctaHref: '/my-dogs',
        ctaLabel: 'Apri member workspace',
      },
      {
        id: 'review',
        eyebrow: 'Moderazione',
        title: 'La review protegge la qualità prima che qualcosa diventi pubblico',
        description:
          'La review è il layer di controllo tra invio e pubblicazione. Qui gli admin proteggono la qualità, richiedono modifiche e decidono cosa è pronto per la visibilità.',
        bullets: [
          'La moderazione non è solo approvazione. È curatela della fiducia.',
          'Lo stesso principio vale per registry, partner e visibilità community.',
          'Per questo official vs community può restare separato condividendo la stessa disciplina di moderazione.',
        ],
      },
      {
        id: 'partners',
        eyebrow: 'Partner',
        title: 'I partner restano curati e professionali',
        description:
          'I partner fanno parte della rete business affidabile: cliniche, trainer, handler, allevatori, negozi, relocation, hotel e altri servizi rilevanti.',
        bullets: [
          'La visibilità partner non è automatica.',
          'Le candidature vengono revisionate prima della visibilità pubblica.',
          'Le pagine partner devono risultare premium, utili e chiaramente approvate.',
        ],
        ctaHref: '/partners',
        ctaLabel: 'Apri i partner',
      },
      {
        id: 'community',
        eyebrow: 'Общност',
        title: 'La community amplia l’ecosistema senza indebolire la fiducia',
        description:
          'La community è il luogo dell’utilità più ampia: posti per passeggiare, aree gioco, luoghi pet-friendly, boarding, transport e altra visibilità approvata dell’ecosistema.',
        bullets: [
          'Qui official vs community diventa visibile per l’utente.',
          'Il contenuto community può essere pratico e locale, ma passa comunque dalla revisione prima della pubblicazione.',
          'L’obiettivo è un ecosistema Cane Corso completo, non solo un sito registro.',
        ],
        ctaHref: '/community',
        ctaLabel: 'Apri community',
      },
      {
        id: 'suggestions',
        eyebrow: 'Предложения',
        title: 'I suggerimenti devono essere guidati, non caotici',
        description:
          'Proprietari e utenti dovrebbero poter proporre luoghi, servizi o idee utili, ma il prodotto deve spiegare chiaramente che i suggerimenti vengono revisionati prima della visibilità pubblica.',
        bullets: [
          'Le suggestions sono proposte, non pubblicazioni immediate.',
          'Il layer help deve spiegare cosa rende un suggerimento utile e accettabile.',
          'Così la piattaforma resta aperta alla crescita ma protegge la qualità.',
        ],
      },
      {
        id: 'activity',
        eyebrow: 'Активност',
        title: 'L’activity è il futuro battito vivo della piattaforma',
        description:
          'In futuro l’activity può includere meetup, eventi, passeggiate, campi training e altro movimento reale dentro l’ecosistema Cane Corso.',
        bullets: [
          'L’activity deve poggiare sullo stesso motore moderato, non su un modulo separato e scollegato.',
          'La visibilità location-based conta molto qui.',
          'Il prodotto deve sembrare vivo, ma sempre controllato e premium.',
        ],
      },
      {
        id: 'premium',
        eyebrow: 'Direzione premium',
        title: 'Premium non significa solo decorazione',
        description:
          'Il layer premium significa gerarchia chiara, spiegazioni forti, meno percorsi confusi e una sensazione più deliberata di fiducia e rarità.',
        bullets: [
          'Ogni pagina principale dovrebbe avere un punto di accesso Help.',
          'Le pagine ufficiali dovrebbero sembrare più formali e orientate alla fiducia.',
          'Le pagine community dovrebbero sembrare utili, vive e comunque chiaramente moderate.',
        ],
        ctaHref: '/platform',
        ctaLabel: 'Torna alla piattaforma',
      },
    ] satisfies GuideSection[],
  },
} as const;

function isActive(activeTopic: string | null | undefined, sectionId: string) {
  return activeTopic === sectionId || activeTopic === sectionId.replace(/-/g, '_');
}

export function PlatformGuide({ locale, activeTopic }: PlatformGuideProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <div className="member-route-stack">
      <section className="content-card guide-jump-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.jumpLabel}</span>
            <h2>{copy.jumpLabel}</h2>
          </div>
        </div>

        <div className="guide-jump-grid">
          {copy.sections.map((section) => (
            <Link
              key={section.id}
              href={`/guide?topic=${section.id}#${section.id}`}
              className={`guide-jump-chip${isActive(activeTopic, section.id) ? ' guide-jump-chip--active' : ''}`}
            >
              {section.title}
            </Link>
          ))}
        </div>
      </section>

      <div className="guide-section-stack">
        {copy.sections.map((section) => (
          <section
            id={section.id}
            key={section.id}
            className={`content-card guide-section-card${isActive(activeTopic, section.id) ? ' guide-section-card--active' : ''}`}
          >
            <span className="eyebrow-label">{section.eyebrow}</span>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            {section.bullets?.length ? (
              <ul className="guide-bullet-list">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {section.ctaHref && section.ctaLabel ? (
              <div className="guide-section-actions">
                <Link href={section.ctaHref} className="button-secondary small">
                  {section.ctaLabel}
                </Link>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
