import { notFound } from 'next/navigation';
import { DogMediaWorkspace } from '@/components/dog-media-workspace';
import { getCurrentLocale } from '@/lib/locale.server';
import { DogMediaDogNotFoundError, getCurrentMemberDogMediaDocument } from '@/lib/my-dog-media.server';
import { getCurrentMemberDogProfileDocument } from '@/lib/my-dogs.server';

export const dynamic = 'force-dynamic';

interface DogMediaPageProps {
  params: Promise<{
    dogId: string;
  }>;
}

const pageLabels = {
  en: {
    eyebrow: 'Media library',
    title: 'Manage profile media',
    description: 'Manage images, documents, and supporting media for this Cane Corso profile in one clean workspace.',
    addCardEyebrow: 'Add media',
    addCardTitle: 'Upload a new file or link',
    addCardDescription: 'Upload a file directly or register an external URL. Each media item becomes part of the profile gallery and supporting record.',
    urlLabel: 'External URL',
    altLabel: 'Alt text',
    typeLabel: 'Media type for URL items',
    fileLabel: 'Upload file',
    selectedFileLabel: 'Selected file',
    uploadHelp: 'Choose an image, video, PDF, or supporting document up to 20 MB.',
    primaryLabel: 'Use as primary profile image',
    submitLabel: 'Save URL item',
    submittingLabel: 'Saving URL…',
    uploadLabel: 'Upload file',
    uploadingLabel: 'Uploading file…',
    emptyTitle: 'No media items yet',
    emptyDescription: 'Upload the first image or add the first supporting link to start the gallery for this Cane Corso profile.',
    primaryBadge: 'Primary media',
    setPrimaryLabel: 'Set primary',
    deleteLabel: 'Remove',
    editProfileLabel: 'Back to profile',
    mediaCountLabel: 'items',
    backLabel: 'Profile editor',
    formHelp: 'Uploaded files are stored for this profile. External URLs remain available for videos, documents, or media already hosted elsewhere.',
    noteLabel: 'Media workflow',
    sourceHint: 'Use the URL flow when the media already exists elsewhere and you only need to register it in the profile gallery.',
    uploadHint: 'The selected file will be uploaded and added automatically to the profile gallery.',
    urlSavedMessage: '{dogName} — URL item saved.',
    uploadSavedMessage: '{dogName} — file uploaded and saved.',
    removeSuccessMessage: '{dogName} — media removed.',
    primarySuccessMessage: '{dogName} — primary media updated.',
  },
  bg: {
    eyebrow: 'Медия библиотека',
    title: 'Управление на профилната медия',
    description: 'Управлявай изображения, документи и допълнителна медия за този Cane Corso профил в едно подредено пространство.',
    addCardEyebrow: 'Добави медия',
    addCardTitle: 'Качи нов файл или линк',
    addCardDescription: 'Качи файл директно или регистрирай външен URL. Всеки медиен елемент става част от профилната галерия и придружаващия запис.',
    urlLabel: 'Външен URL',
    altLabel: 'Alt текст',
    typeLabel: 'Тип медия за URL елементи',
    fileLabel: 'Качи файл',
    selectedFileLabel: 'Избран файл',
    uploadHelp: 'Избери изображение, видео, PDF или помощен документ до 20 MB.',
    primaryLabel: 'Използвай като основно профилно изображение',
    submitLabel: 'Запази URL елемент',
    submittingLabel: 'Запазване на URL…',
    uploadLabel: 'Качи файл',
    uploadingLabel: 'Качване на файл…',
    emptyTitle: 'Все още няма медийни елементи',
    emptyDescription: 'Качи първото изображение или добави първия помощен линк, за да започне галерията на този Cane Corso профил.',
    primaryBadge: 'Основна медия',
    setPrimaryLabel: 'Направи основна',
    deleteLabel: 'Премахни',
    editProfileLabel: 'Назад към профила',
    mediaCountLabel: 'елемента',
    backLabel: 'Редактор на профил',
    formHelp: 'Качените файлове се пазят към този профил. Външните URL адреси остават налични за видеа, документи или медия, която вече е качена другаде.',
    noteLabel: 'Медиен поток',
    sourceHint: 'Използвай URL режима, когато медията вече съществува другаде и искаш само да я регистрираш в профилната галерия.',
    uploadHint: 'Избраният файл ще бъде качен и автоматично добавен към профилната галерия.',
    urlSavedMessage: '{dogName} — URL елементът е записан.',
    uploadSavedMessage: '{dogName} — файлът е качен и записан.',
    removeSuccessMessage: '{dogName} — медията е премахната.',
    primarySuccessMessage: '{dogName} — основната медия е обновена.',
  },
  it: {
    eyebrow: 'Libreria media',
    title: 'Gestisci i media del profilo',
    description: 'Gestisci immagini, documenti e media di supporto per questo profilo Cane Corso in uno spazio ordinato.',
    addCardEyebrow: 'Aggiungi media',
    addCardTitle: 'Carica un nuovo file o link',
    addCardDescription: 'Carica un file direttamente oppure registra un URL esterno. Ogni elemento media entra nella galleria del profilo e nel relativo record.',
    urlLabel: 'URL esterno',
    altLabel: 'Testo alternativo',
    typeLabel: 'Tipo media per elementi URL',
    fileLabel: 'Carica file',
    selectedFileLabel: 'File selezionato',
    uploadHelp: 'Scegli un’immagine, un video, un PDF o un documento di supporto fino a 20 MB.',
    primaryLabel: 'Usa come immagine principale del profilo',
    submitLabel: 'Salva elemento URL',
    submittingLabel: 'Salvataggio URL…',
    uploadLabel: 'Carica file',
    uploadingLabel: 'Caricamento file…',
    emptyTitle: 'Nessun elemento media ancora',
    emptyDescription: 'Carica la prima immagine oppure aggiungi il primo link di supporto per iniziare la galleria di questo profilo Cane Corso.',
    primaryBadge: 'Media principale',
    setPrimaryLabel: 'Imposta principale',
    deleteLabel: 'Rimuovi',
    editProfileLabel: 'Torna al profilo',
    mediaCountLabel: 'elementi',
    backLabel: 'Editor profilo',
    formHelp: 'I file caricati vengono salvati per questo profilo. Gli URL esterni restano disponibili per video, documenti o media già ospitati altrove.',
    noteLabel: 'Flusso media',
    sourceHint: 'Usa il flusso URL quando il media esiste già altrove e devi solo registrarlo nella galleria del profilo.',
    uploadHint: 'Il file selezionato verrà caricato e aggiunto automaticamente alla galleria del profilo.',
    urlSavedMessage: '{dogName} — elemento URL salvato.',
    uploadSavedMessage: '{dogName} — file caricato e salvato.',
    removeSuccessMessage: '{dogName} — media rimosso.',
    primarySuccessMessage: '{dogName} — media principale aggiornato.',
  },
} as const;

export default async function DogMediaPage({ params }: DogMediaPageProps) {
  const { dogId } = await params;
  const locale = await getCurrentLocale();

  try {
    const [profileDocument, mediaDocument] = await Promise.all([
      getCurrentMemberDogProfileDocument(dogId),
      getCurrentMemberDogMediaDocument(dogId),
    ]);

    if (!profileDocument) {
      notFound();
    }

    return (
      <DogMediaWorkspace
        dogId={dogId}
        dogName={profileDocument.profile.name}
        initialMedia={mediaDocument.media}
        labels={pageLabels[locale]}
      />
    );
  } catch (error) {
    if (error instanceof DogMediaDogNotFoundError) {
      notFound();
    }

    throw error;
  }
}
