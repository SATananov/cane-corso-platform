import { PageShell } from '@/components/page-shell';
import type { PageShellCard } from '@/components/page-shell';
import { EcosystemDirectory } from '@/components/ecosystem-directory';
import { CommunityDiscoveryExperience } from '@/components/community-discovery-experience';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPublishedEcosystemDirectoryDocument } from '@/lib/ecosystem.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Community',
    title: 'Find help, home, match, places, and services',
    description:
      'Start from the real need: lost or found Cane Corso, new home, breeding match, puppies, friendly places, transport, boarding, and trusted services. Public visibility is reviewed first.',
    cards: [
      { eyebrow: 'Help', title: 'Lost / found Cane Corso', description: 'Visible community signals with city, context, and reviewed public information.', href: '#cane-corso-intent-listings', meta: 'urgent • safe contact', icon: 'gallery' },
      { eyebrow: 'Home and match', title: 'New home, puppies, and breeding interest', description: 'Sensitive requests stay moderated. The platform does not expose private contacts automatically.', href: '#cane-corso-intent-listings', meta: 'admin-mediated', icon: 'community' },
      { eyebrow: 'Daily life', title: 'Places and services', description: 'Find or suggest useful locations, transport, boarding, trainers, and Cane Corso-friendly services.', href: '#cane-corso-intent-listings', meta: 'places • services', icon: 'partners' },
    ] satisfies readonly PageShellCard[],
    supportTitle: 'How community stays safe',
    supportDescription: 'Community is useful only when people understand the rules: sensitive contact is protected, public listings are reviewed, and official trust remains separate from community requests.',
    supportBullets: ['Registry and certificate decisions stay separate.', 'Sensitive contact is not published automatically.', 'Owner requests are managed from the private member area.'],
  },
  bg: {
    eyebrow: 'Общност',
    title: 'Намери помощ, дом, партньор, места и услуги',
    description:
      'Започни от реалната нужда: загубен или намерен Cane Corso, нов дом, разплоден интерес, малки, подходящи места, транспорт, престой и доверени услуги. Публичната видимост минава през преглед.',
    cards: [
      { eyebrow: 'Помощ', title: 'Загубен / намерен Cane Corso', description: 'Видим общностен сигнал с град, контекст и прегледана публична информация.', href: '#cane-corso-intent-listings', meta: 'спешно • безопасен контакт', icon: 'gallery' },
      { eyebrow: 'Дом и свързване', title: 'Нов дом, малки и разплоден интерес', description: 'Чувствителните заявки остават модерирани. Платформата не публикува лични контакти автоматично.', href: '#cane-corso-intent-listings', meta: 'връзка чрез админ', icon: 'community' },
      { eyebrow: 'Ежедневие', title: 'Места и услуги', description: 'Намери или предложи полезни локации, транспорт, престой, треньори и услуги за Cane Corso.', href: '#cane-corso-intent-listings', meta: 'места • услуги', icon: 'partners' },
    ] satisfies readonly PageShellCard[],
    supportTitle: 'Как общността остава безопасна',
    supportDescription: 'Общността е полезна само когато правилата са ясни: чувствителният контакт е защитен, публичните записи се преглеждат, а официалното доверие остава отделно от заявките.',
    supportBullets: ['Регистърът и сертификатните решения остават отделни.', 'Личният контакт не се публикува автоматично.', 'Заявките на собственика се управляват от личната зона.'],
  },
  it: {
    eyebrow: 'Comunità',
    title: 'Trova aiuto, casa, abbinamento, luoghi e servizi',
    description:
      'Parti dal bisogno reale: Cane Corso smarrito o trovato, nuova casa, interesse di accoppiamento, cuccioli, luoghi adatti, trasporto, pensione e servizi fidati. La visibilità pubblica viene prima revisionata.',
    cards: [
      { eyebrow: 'Aiuto', title: 'Cane Corso smarrito / trovato', description: 'Segnale comunitario visibile con città, contesto e informazioni pubbliche revisionate.', href: '#cane-corso-intent-listings', meta: 'urgente • contatto sicuro', icon: 'gallery' },
      { eyebrow: 'Casa e contatto', title: 'Nuova casa, cuccioli e interesse breeding', description: 'Le richieste sensibili restano moderate. La piattaforma non pubblica contatti privati automaticamente.', href: '#cane-corso-intent-listings', meta: 'mediazione admin', icon: 'community' },
      { eyebrow: 'Vita quotidiana', title: 'Luoghi e servizi', description: 'Trova o suggerisci luoghi, trasporto, pensione, trainer e servizi utili per Cane Corso.', href: '#cane-corso-intent-listings', meta: 'luoghi • servizi', icon: 'partners' },
    ] satisfies readonly PageShellCard[],
    supportTitle: 'Come la comunità resta sicura',
    supportDescription: 'La comunità è utile solo quando le regole sono chiare: il contatto sensibile è protetto, le schede pubbliche sono revisionate e la fiducia ufficiale resta separata dalle richieste.',
    supportBullets: ['Registro e certificato restano decisioni separate.', 'Il contatto privato non viene pubblicato automaticamente.', 'Le richieste del proprietario si gestiscono dall’area privata.'],
  },
} as const;

export default async function CommunityPage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const document = await getPublishedEcosystemDirectoryDocument();
  const currentSession = await getOptionalCookieMemberSession();

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cards={copy.cards}
      actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'}
      accentLabel={copy.eyebrow}
      helpHref="/faq"
      helpLabel={locale === 'bg' ? 'Помощ' : locale === 'it' ? 'Aiuto' : 'Help'}
      visualSrc="/brand/editorial-member-shadow-eye.jpg"
      visualAlt="Cane Corso community visual"
    >
      <RoleAwareActionPanel locale={locale} surface="community" role={currentSession?.user.role ?? null} />

      <EcosystemDirectory document={document} locale={locale} applyHref="/ecosystem" />

      <details className="community-secondary-details">
        <summary>{locale === 'bg' ? 'Допълнителна ориентация' : locale === 'it' ? 'Orientamento aggiuntivo' : 'Additional orientation'}</summary>
        <CommunityDiscoveryExperience
          locale={locale}
          publishedCount={document.summary.total}
          countryCount={document.summary.countries}
          featuredCount={document.summary.featured}
        />
        <section className="content-card faq-bullet-panel">
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.supportTitle}</h2>
          <p>{copy.supportDescription}</p>
          <ul className="platform-help-list">
            {copy.supportBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      </details>
    </PageShell>
  );
}
