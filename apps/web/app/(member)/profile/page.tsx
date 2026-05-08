import Link from 'next/link';
import type { Dog, DogMedia } from '@cane-corso-platform/contracts';
import { redirect } from 'next/navigation';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { OwnerOnboardingFinalPanel } from '@/components/owner-onboarding-final-panel';
import { OwnerIdentityForm } from '@/components/owner-identity-form';
import { OwnerProfilePhotoPanel } from '@/components/owner-profile-photo-panel';
import { OwnerCaneCorsoSpotlight, type OwnerSpotlightDog } from '@/components/owner-cane-corso-spotlight';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import { getCurrentProfileDocument } from '@/lib/member-profile.server';
import { getCurrentMemberDogsDocument } from '@/lib/my-dogs.server';
import { getCurrentMemberDogMediaDocument } from '@/lib/my-dog-media.server';
import { getPublishedRegistryProfileDocument } from '@/lib/registry.server';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { buildAccessPath } from '@/lib/access-control';
import { SessionUnavailableError } from '@/lib/session.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

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

function getOwnerIdentityFormLabels(locale: string) {
  const labels = {
    en: {
      eyebrow: 'Owner details',
      title: 'Complete the owner identity',
      description: 'Keep the full owner information here. Admins can review it, while the public Registry shows only the owner name and avatar.',
      publicNotice: 'Public by default: name + avatar only',
      privacyNotice: 'Address, phone, website, email, and biography stay private/admin-visible unless admin explicitly approves extra visibility later.',
      fields: {
        displayName: 'Public owner name',
        firstName: 'First name',
        middleName: 'Middle name',
        lastName: 'Last name',
        city: 'City',
        country: 'Country',
        addressLine: 'Address',
        websiteUrl: 'Website',
        phone: 'Phone',
        bio: 'Short owner note',
      },
      placeholders: {
        displayName: 'Stefan Tananov / kennel name',
        firstName: 'Stefan',
        middleName: 'Middle name',
        lastName: 'Tananov',
        city: 'Kardzhali',
        country: 'Bulgaria',
        addressLine: 'Private address for admin use only',
        websiteUrl: 'https://example.com',
        phone: '+359 ...',
        bio: 'Short private/admin note about the owner or kennel.',
      },
      saveLabel: 'Save owner details',
      savingLabel: 'Saving…',
      savedMessage: 'Owner details saved.',
      noChangesMessage: 'No owner detail changes to save.',
      errorMessage: 'Owner details could not be saved.',
    },
    bg: {
      eyebrow: 'Данни на собственика',
      title: 'Попълни идентичността на собственика',
      description: 'Пълните данни стоят тук. Админът ги вижда при преглед, а публичният Регистър показва само името и аватара на собственика.',
      publicNotice: 'Публично по подразбиране: име + аватар',
      privacyNotice: 'Адрес, телефон, сайт, имейл и биография остават лични/видими за админ, освен ако админ изрично не разреши друго публично показване.',
      fields: {
        displayName: 'Публично име на собственика',
        firstName: 'Име',
        middleName: 'Презиме',
        lastName: 'Фамилия',
        city: 'Град',
        country: 'Държава',
        addressLine: 'Адрес',
        websiteUrl: 'Сайт',
        phone: 'Телефон',
        bio: 'Кратка бележка за собственика',
      },
      placeholders: {
        displayName: 'Стефан Тананов / име на развъдник',
        firstName: 'Стефан',
        middleName: 'Презиме',
        lastName: 'Тананов',
        city: 'Кърджали',
        country: 'България',
        addressLine: 'Личен адрес само за админ',
        websiteUrl: 'https://example.com',
        phone: '+359 ...',
        bio: 'Кратка лична/админ бележка за собственика или развъдника.',
      },
      saveLabel: 'Запази данните',
      savingLabel: 'Запазване…',
      savedMessage: 'Данните на собственика са запазени.',
      noChangesMessage: 'Няма промени по данните за запис.',
      errorMessage: 'Данните на собственика не можаха да бъдат запазени.',
    },
    it: {
      eyebrow: 'Dati del proprietario',
      title: 'Completa l’identità del proprietario',
      description: 'Le informazioni complete restano qui. L’admin le vede in revisione, mentre il Registro pubblico mostra solo nome e avatar del proprietario.',
      publicNotice: 'Pubblico di default: nome + avatar',
      privacyNotice: 'Indirizzo, telefono, sito, email e biografia restano privati/visibili all’admin salvo approvazione esplicita dell’admin.',
      fields: {
        displayName: 'Nome pubblico proprietario',
        firstName: 'Nome',
        middleName: 'Secondo nome',
        lastName: 'Cognome',
        city: 'Città',
        country: 'Paese',
        addressLine: 'Indirizzo',
        websiteUrl: 'Sito web',
        phone: 'Telefono',
        bio: 'Nota breve sul proprietario',
      },
      placeholders: {
        displayName: 'Stefan Tananov / nome allevamento',
        firstName: 'Stefan',
        middleName: 'Secondo nome',
        lastName: 'Tananov',
        city: 'Kardzhali',
        country: 'Bulgaria',
        addressLine: 'Indirizzo privato solo per admin',
        websiteUrl: 'https://example.com',
        phone: '+359 ...',
        bio: 'Breve nota privata/admin sul proprietario o allevamento.',
      },
      saveLabel: 'Salva dati proprietario',
      savingLabel: 'Salvataggio…',
      savedMessage: 'Dati proprietario salvati.',
      noChangesMessage: 'Nessuna modifica ai dati da salvare.',
      errorMessage: 'Impossibile salvare i dati del proprietario.',
    },
  } as const;

  return labels[locale as keyof typeof labels] ?? labels.en;
}


async function enrichProfileDogsWithMedia(dogs: Dog[]): Promise<OwnerSpotlightDog[]> {
  return await Promise.all(
    dogs.map(async (dog) => {
      try {
        const document = await getCurrentMemberDogMediaDocument(dog.id, { allowDevFallback: false });
        const media = document.media
          .filter((item): item is DogMedia => item.mediaType === 'image')
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
          .slice(0, 3);

        return { ...dog, media };
      } catch {
        return { ...dog, media: [] };
      }
    }),
  );
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
    const nameLabel = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' ') || displayName;

    const identityFormLabels = getOwnerIdentityFormLabels(locale);
    const dogsWithMedia = await enrichProfileDogsWithMedia(dogs);

    const totalDogs = dogsWithMedia.length;
    const published = dogsWithMedia.filter((dog) => dog.lifecycleStatus === 'published').length;
    const inReview = dogsWithMedia.filter((dog) => ['submitted', 'approved'].includes(dog.lifecycleStatus)).length;
    const drafts = dogsWithMedia.filter((dog) => dog.lifecycleStatus === 'draft').length;
    const hasOwnerPhoto = Boolean(profile.avatarUrl);
    const hasCaneCorsoProfile = totalDogs > 0;
    const hasCaneCorsoPhoto = dogsWithMedia.some((dog) => Boolean(dog.mainImageUrl || dog.media?.some((item) => item.mediaType === 'image' && item.url)));
    const isReviewStarted = inReview > 0 || published > 0;
    const hasPublicPresence = published > 0;

    const publishedDog = dogsWithMedia.find((dog) => dog.publication?.publicSlug) ?? null;
    const workingDog =
      dogsWithMedia.find((dog) => ['draft', 'needs_changes', 'submitted', 'approved'].includes(dog.lifecycleStatus)) ?? publishedDog ?? dogsWithMedia[0] ?? null;

    const continueHref = workingDog ? `/my-dogs/${workingDog.id}/edit` : '/my-dogs/new';
    const primaryNextHref = workingDog ? continueHref : '/my-dogs/new';
    const workingDogRegistryDocument = workingDog?.publication
      ? await getPublishedRegistryProfileDocument(workingDog.publication.publicSlug, session.user.profileId ?? null)
      : null;
    const workingDogPublicHref = workingDog?.publication
      ? `/registry/${workingDog.publication.publicSlug}`
      : '/registry';
    const workingDogVerifyHref = workingDog?.publication?.certificateCode
      ? `/verify/${workingDog.publication.certificateCode}`
      : workingDog?.publication?.verificationSlug
        ? `/verify/${workingDog.publication.verificationSlug}`
        : '/verify';
    const copy = {
      en: {
        eyebrow: 'Owner profile',
        heroDescription:
          'Start here: add your owner photo, check your status, then continue to the Cane Corso profile that needs action.',
        quickActionsEyebrow: 'Quick actions',
        quickActionsTitle: 'Start with the next real action',
        quickActionsDescription:
          'Use the main button first. Public registry and verification are later layers, not the first owner task.',
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
        photo: {
          eyebrow: 'Owner photo',
          title: 'Add a clear owner photo',
          description: 'Make the owner profile feel personal and credible before adding or reviewing Cane Corso profiles.',
          currentPhotoLabel: 'Current owner profile photo',
          emptyPhotoLabel: 'No owner photo yet',
          chooseLabel: 'Choose photo',
          replaceLabel: 'Change photo',
          removeLabel: 'Remove',
          saveLabel: 'Save photo',
          savingLabel: 'Saving…',
          savedMessage: 'Owner photo saved.',
          removedMessage: 'Owner photo removed.',
          selectedFileLabel: 'Selected file',
          fileHelp: 'PNG, JPG or WebP. The image is optimized before saving.',
          fileTooLargeMessage: 'Choose an image under 5 MB.',
          unsupportedFileMessage: 'Choose a PNG, JPG or WebP image.',
          previewReadyMessage: 'Preview ready. Save when it looks right.',
          noChangesMessage: 'No photo changes to save.',
        },
        journey: {
          eyebrow: 'Simple owner path',
          title: 'Short path without confusion',
          description: 'The owner area should guide every person from profile setup to public Registry presence without confusion.',
          doneLabel: 'Done',
          nextLabel: 'Next',
          items: [
            ['Owner photo', 'Make the profile human and recognizable.'],
            ['Cane Corso profile', 'Add the first Cane Corso identity.'],
            ['Cane Corso photo', 'Add a main image before review.'],
            ['USG review', 'Send or keep a profile in review.'],
            ['Public Registry', 'Approved profiles become publicly visible.'],
          ],
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
          'Започни оттук: добави снимка на собственика, провери статуса и продължи към Cane Corso профила, който чака действие.',
        quickActionsEyebrow: 'Бързи действия',
        quickActionsTitle: 'Продължи от най-важната стъпка',
        quickActionsDescription:
          'Първо използвай основния бутон. Публичният регистър и проверката са следващи слоеве, не първата задача на собственика.',
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
        photo: {
          eyebrow: 'Снимка на собственика',
          title: 'Добави ясна профилна снимка',
          description: 'Така личният профил изглежда по-човешки, по-достоверен и по-лесен за ориентиране.',
          currentPhotoLabel: 'Текуща профилна снимка на собственика',
          emptyPhotoLabel: 'Все още няма снимка на собственика',
          chooseLabel: 'Избери снимка',
          replaceLabel: 'Смени снимката',
          removeLabel: 'Премахни',
          saveLabel: 'Запази снимката',
          savingLabel: 'Запазване…',
          savedMessage: 'Снимката на собственика е запазена.',
          removedMessage: 'Снимката на собственика е премахната.',
          selectedFileLabel: 'Избран файл',
          fileHelp: 'PNG, JPG или WebP. Снимката се оптимизира преди запис.',
          fileTooLargeMessage: 'Избери снимка под 5 MB.',
          unsupportedFileMessage: 'Избери PNG, JPG или WebP изображение.',
          previewReadyMessage: 'Прегледът е готов. Запази, когато изглежда добре.',
          noChangesMessage: 'Няма промяна по снимката за запис.',
        },
        journey: {
          eyebrow: 'Лесен път за собственика',
          title: 'Кратък път без объркване',
          description: 'Личната зона трябва да води човека от профил до публичен регистър без объркване.',
          doneLabel: 'Готово',
          nextLabel: 'Следва',
          items: [
            ['Снимка на собственика', 'Профилът става човешки и разпознаваем.'],
            ['Cane Corso профил', 'Добавя се първата Cane Corso идентичност.'],
            ['Снимка на Cane Corso', 'Добавя се основна снимка преди преглед.'],
            ['USG преглед', 'Профилът се изпраща или вече е в преглед.'],
            ['Публичен регистър', 'Одобрените профили стават публични.'],
          ],
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
          'Inizia qui: aggiungi la foto del proprietario, controlla lo stato e continua il profilo Cane Corso che richiede azione.',
        quickActionsEyebrow: 'Azioni rapide',
        quickActionsTitle: 'Continua dal prossimo passo concreto',
        quickActionsDescription:
          'Usa prima il pulsante principale. Registro pubblico e verifica sono livelli successivi, non il primo compito del proprietario.',
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
        photo: {
          eyebrow: 'Foto proprietario',
          title: 'Aggiungi una foto profilo chiara',
          description: 'Rendi il profilo proprietario più personale, credibile e facile da riconoscere.',
          currentPhotoLabel: 'Foto profilo proprietario attuale',
          emptyPhotoLabel: 'Nessuna foto proprietario ancora',
          chooseLabel: 'Scegli foto',
          replaceLabel: 'Cambia foto',
          removeLabel: 'Rimuovi',
          saveLabel: 'Salva foto',
          savingLabel: 'Salvataggio…',
          savedMessage: 'Foto proprietario salvata.',
          removedMessage: 'Foto proprietario rimossa.',
          selectedFileLabel: 'File selezionato',
          fileHelp: 'PNG, JPG o WebP. L’immagine viene ottimizzata prima del salvataggio.',
          fileTooLargeMessage: 'Scegli un’immagine sotto 5 MB.',
          unsupportedFileMessage: 'Scegli un’immagine PNG, JPG o WebP.',
          previewReadyMessage: 'Anteprima pronta. Salva quando va bene.',
          noChangesMessage: 'Nessuna modifica foto da salvare.',
        },
        journey: {
          eyebrow: 'Percorso proprietario semplice',
          title: 'Percorso breve senza confusione',
          description: 'L’area proprietario deve guidare ogni persona dal profilo alla presenza pubblica nel registro senza confusione.',
          doneLabel: 'Fatto',
          nextLabel: 'Prossimo',
          items: [
            ['Foto proprietario', 'Rende il profilo umano e riconoscibile.'],
            ['Profilo Cane Corso', 'Aggiungi la prima identità Cane Corso.'],
            ['Foto Cane Corso', 'Aggiungi l’immagine principale prima della revisione.'],
            ['Revisione USG', 'Invia o mantieni un profilo in revisione.'],
            ['Registro pubblico', 'I profili approvati diventano visibili.'],
          ],
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
            description: 'Mantieni un percorso semplice verso comunità, livello FUN ed ecosistema della razza.',
            href: '/community',
            meta: 'Comunità • FUN • ecosistema',
            icon: 'community' as const,
          },
        ],
      },
    }[locale] ?? {
      eyebrow: 'Owner profile',
      heroDescription:
        'Start here: add your owner photo, check your status, then continue to the Cane Corso profile that needs action.',
      quickActionsEyebrow: 'Quick actions',
      quickActionsTitle: 'Start with the next real action',
      quickActionsDescription:
        'Use the main button first. Public registry and verification are later layers, not the first owner task.',
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
      photo: {
        eyebrow: 'Owner photo',
        title: 'Add a clear owner photo',
        description: 'Make the owner profile feel personal and credible before adding or reviewing Cane Corso profiles.',
        currentPhotoLabel: 'Current owner profile photo',
        emptyPhotoLabel: 'No owner photo yet',
        chooseLabel: 'Choose photo',
        replaceLabel: 'Change photo',
        removeLabel: 'Remove',
        saveLabel: 'Save photo',
        savingLabel: 'Saving…',
        savedMessage: 'Owner photo saved.',
        removedMessage: 'Owner photo removed.',
        selectedFileLabel: 'Selected file',
        fileHelp: 'PNG, JPG or WebP. The image is optimized before saving.',
        fileTooLargeMessage: 'Choose an image under 5 MB.',
        unsupportedFileMessage: 'Choose a PNG, JPG or WebP image.',
        previewReadyMessage: 'Preview ready. Save when it looks right.',
        noChangesMessage: 'No photo changes to save.',
      },
      journey: {
        eyebrow: 'Simple owner path',
        title: 'Short path without confusion',
        description: 'The owner area should guide every person from profile setup to public Registry presence without confusion.',
        doneLabel: 'Done',
        nextLabel: 'Next',
        items: [
          ['Owner photo', 'Make the profile human and recognizable.'],
          ['Cane Corso profile', 'Add the first Cane Corso identity.'],
          ['Cane Corso photo', 'Add a main image before review.'],
          ['USG review', 'Send or keep a profile in review.'],
          ['Public Registry', 'Approved profiles become publicly visible.'],
        ],
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

    const ownerJourneyItems = copy.journey.items.map(([title, description], index) => ({
      title,
      description,
      complete: [hasOwnerPhoto, hasCaneCorsoProfile, hasCaneCorsoPhoto, isReviewStarted, hasPublicPresence][index] ?? false,
    }));

    return (
      <div className="member-route-stack profile-page">
        <RoleAwareActionPanel locale={locale} surface="profile" role={session.user.role} />
        <SectionContentGuidePanel locale={locale} surface="profile" />
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
            <div className="profile-page__hero-actions-grid profile-page__hero-actions-grid--priority">
              <Link href={primaryNextHref} className="button-primary">
                {copy.quickActions.continueProfile}
              </Link>
              <Link href="/my-dogs" className="button-secondary">
                {copy.quickActions.myDogs}
              </Link>
              <Link href="/guide?topic=member-workspace#member-workspace" className="button-ghost">
                {t.common.help}
              </Link>
            </div>
          </div>
        </section>

        <OwnerCaneCorsoSpotlight
          locale={locale}
          dog={workingDog}
          registryEntry={workingDogRegistryDocument?.entry ?? null}
          variant="profile"
          editHref={workingDog ? `/my-dogs/${workingDog.id}/edit` : undefined}
          mediaHref={workingDog ? `/my-dogs/${workingDog.id}/media` : undefined}
          publicHref={workingDogPublicHref}
          verifyHref={workingDogVerifyHref}
        />

        <div className="stats-grid four-up profile-page__stats">
          <OverviewStatCard label={t.pages.myDogs.labels.totalProfiles} value={String(totalDogs)} tone="gold" />
          <OverviewStatCard label={t.pages.myDogs.labels.published} value={String(published)} tone="ivory" />
          <OverviewStatCard label={t.pages.myDogs.labels.inReview} value={String(inReview)} tone="gold" />
          <OverviewStatCard label={t.pages.myDogs.labels.drafts} value={String(drafts)} tone="ivory" />
        </div>

        <section className="content-card profile-page__journey-card">
          <div className="section-head-row">
            <div>
              <span className="eyebrow-label">{copy.journey.eyebrow}</span>
              <h2>{copy.journey.title}</h2>
              <p className="section-support-copy">{copy.journey.description}</p>
            </div>
          </div>
          <div className="profile-page__journey-steps">
            {ownerJourneyItems.map((item, index) => (
              <div
                key={item.title}
                className={`profile-page__journey-step${item.complete ? ' profile-page__journey-step--complete' : ''}`}
              >
                <span className="profile-page__journey-index">{index + 1}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <em>{item.complete ? copy.journey.doneLabel : copy.journey.nextLabel}</em>
              </div>
            ))}
          </div>
        </section>

        <div className="profile-page__hub-grid">
          <section className="content-card profile-page__identity-card">
            <div className="section-head-row">
              <div>
                <span className="eyebrow-label">{copy.identityEyebrow}</span>
                <h2>{copy.identityTitle}</h2>
                <p className="section-support-copy">{copy.identityDescription}</p>
              </div>
            </div>

            <OwnerProfilePhotoPanel
              initialAvatarUrl={profile.avatarUrl}
              displayName={nameLabel}
              email={session.user.email}
              labels={copy.photo}
            />

            <OwnerIdentityForm profile={profile} labels={identityFormLabels} />

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
                <dt>{identityFormLabels.fields.websiteUrl}</dt>
                <dd>{profile.websiteUrl ?? t.common.pending}</dd>
              </div>
              <div>
                <dt>{identityFormLabels.fields.phone}</dt>
                <dd>{profile.phone ?? t.common.pending}</dd>
              </div>
              <div>
                <dt>{identityFormLabels.fields.addressLine}</dt>
                <dd>{profile.addressLine ?? t.common.pending}</dd>
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

      </div>
    );
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: '/profile' }));
    }

    throw error;
  }
}
