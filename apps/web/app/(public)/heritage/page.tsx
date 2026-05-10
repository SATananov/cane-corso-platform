import { PageShell } from '@/components/page-shell';
import { UsgFounderHeritagePanel } from '@/components/usg-founder-heritage-panel';
import { getCurrentLocale } from '@/lib/locale.server';

const copyByLocale = {
  en: {
    eyebrow: 'USG heritage archive',
    title: 'The story behind UNICO SUO GENERE',
    description:
      'A personal Cane Corso archive from the owner path behind USG. It is not a breeder page and not a sales surface — it is identity, memory, and the reason the platform has a living point of view.',
    helpLabel: 'Open platform',
    chips: ['Personal archive', 'di Casa Tananov', 'Not a kennel page'],
    note: 'USG respects official breed systems. This archive is a personal story layer, not a pedigree authority or breeding claim.',
  },
  bg: {
    eyebrow: 'USG личен архив',
    title: 'Историята зад UNICO SUO GENERE',
    description:
      'Личен Cane Corso архив от пътя на собственика зад USG. Това не е развъдник и не е търговска страница — това е идентичност, памет и причината платформата да има жива гледна точка.',
    helpLabel: 'Към платформата',
    chips: ['Личен архив', 'di Casa Tananov', 'Не е развъдник'],
    note: 'USG уважава официалните породни системи. Този архив е лична история, не родословна власт или развъдна претенция.',
  },
  it: {
    eyebrow: 'Archivio personale USG',
    title: 'La storia dietro UNICO SUO GENERE',
    description:
      'Archivio personale Cane Corso dal percorso owner dietro USG. Non è una pagina di allevamento e non è una superficie commerciale — è identità, memoria e il motivo per cui la piattaforma ha un punto di vista vivo.',
    helpLabel: 'Apri piattaforma',
    chips: ['Archivio personale', 'di Casa Tananov', 'Non allevamento'],
    note: 'USG rispetta i sistemi cinofili ufficiali. Questo archivio è storia personale, non autorità genealogica o pretesa di allevamento.',
  },
} as const;

export default async function HeritagePage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      helpHref="/platform"
      helpLabel={copy.helpLabel}
      visualSrc="/brand/heritage/di-casa-tananov/mark-i.jpg"
      visualAlt="Mark I di Casa Tananov"
      heroChips={copy.chips}
      heroNote={copy.note}
    >
      <UsgFounderHeritagePanel locale={locale} variant="full" />
    </PageShell>
  );
}
