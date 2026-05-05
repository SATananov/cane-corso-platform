import Link from 'next/link';
import { createRequire } from 'node:module';
import type { VerificationDocument } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { CertificatePrintButton } from '@/components/certificate-print-button';
import { getAppUrl } from '@/lib/runtime-env';

const require = createRequire(import.meta.url);
const QRCode = require('../lib/vendor/qrcode-terminal/QRCode');
const QRErrorCorrectLevel = require('../lib/vendor/qrcode-terminal/QRCode/QRErrorCorrectLevel');

const copyByLocale = {
  en: {
    actionsTitle: 'USG certificate',
    actionsNote: 'Official printable certificate generated from the issued certificate snapshot.',
    print: 'Print / save PDF',
    verify: 'Open Verify',
    registry: 'Open profile',
    qrAlt: 'QR code for certificate verification',
  },
  bg: {
    actionsTitle: 'USG сертификат',
    actionsNote: 'Официален сертификат за печат, генериран от snapshot-а при издаване.',
    print: 'Печат / запази PDF',
    verify: 'Отвори Verify',
    registry: 'Отвори профила',
    qrAlt: 'QR код за проверка на сертификата',
  },
  it: {
    actionsTitle: 'Certificato USG',
    actionsNote: 'Certificato ufficiale stampabile generato dallo snapshot emesso.',
    print: 'Stampa / salva PDF',
    verify: 'Apri Verify',
    registry: 'Apri profilo',
    qrAlt: 'Codice QR per la verifica del certificato',
  },
} as const;

const TRILINGUAL_NO_DATA = 'Not available / Няма данни / Non disponibile';
const SIGNER_NAME = 'Stefano De Tanini';

interface CertificateV2DocumentProps {
  document: VerificationDocument;
  locale: Locale;
  code: string;
}

interface QrCodeSvgProps {
  value: string;
  title: string;
}

function formatDateLabel(value: string | null | undefined, fallback = TRILINGUAL_NO_DATA) {
  if (!value) return fallback;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

function formatLocation(city: string | null, country: string | null, fallback: string) {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
}

function formatSexTrilingual(value: string | null | undefined) {
  if (value === 'male') return 'Male / Мъжки / Maschio';
  if (value === 'female') return 'Female / Женски / Femmina';
  return TRILINGUAL_NO_DATA;
}

function formatColorTrilingual(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return TRILINGUAL_NO_DATA;
  if (normalized === 'black' || normalized === 'черен' || normalized === 'nero') return 'Black / Черен / Nero';
  if (normalized === 'gray' || normalized === 'grey' || normalized === 'сив' || normalized === 'grigio') return 'Grey / Сив / Grigio';
  if (normalized === 'blue' || normalized === 'син' || normalized === 'blu') return 'Blue / Син / Blu';
  if (normalized === 'fawn' || normalized === 'жълтеникав' || normalized === 'fulvo') return 'Fawn / Фаун / Fulvo';
  if (normalized === 'brindle' || normalized === 'тигров' || normalized === 'tigrato') return 'Brindle / Тигров / Tigrato';

  return value ?? TRILINGUAL_NO_DATA;
}

function getCertificateImage(document: VerificationDocument) {
  return (
    document.entry.certificate?.certificateImageUrl ??
    document.entry.heroImageUrl ??
    document.entry.dog.mainImageUrl ??
    document.entry.galleryImages[0] ??
    null
  );
}

function joinUrl(base: string, path: string) {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${path.startsWith('/') ? path : `/${path}`}`;
}

function QrCodeSvg({ value, title }: QrCodeSvgProps) {
  const qrcode = new QRCode(-1, QRErrorCorrectLevel.M);
  qrcode.addData(value);
  qrcode.make();

  const moduleCount: number = qrcode.getModuleCount();
  const quietZone = 4;
  const size = moduleCount + quietZone * 2;
  const path: string[] = [];

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (qrcode.isDark(row, col)) {
        path.push(`M${col + quietZone} ${row + quietZone}h1v1h-1z`);
      }
    }
  }

  return (
    <svg className="usgCertQrSvg" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title} shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#fffaf0" />
      <path d={path.join('')} fill="#111111" />
    </svg>
  );
}

export function CertificateV2Document({ document, locale, code }: CertificateV2DocumentProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const entry = document.entry;
  const certificate = entry.certificate;
  const snapshot = certificate?.snapshot ?? null;
  const dog = entry.dog;
  const imageUrl = getCertificateImage(document);
  const verifyTarget = certificate?.certificateCode ?? certificate?.verificationSlug ?? code;
  const registryPath = `/registry/${entry.publicSlug}`;
  const verifyPath = `/verify/${verifyTarget}`;
  const verifyAbsoluteUrl = joinUrl(getAppUrl(), verifyPath);
  const dogName = snapshot?.dogName ?? dog.name;
  const issueDate = snapshot?.issueDate ?? certificate?.issueDate ?? null;
  const certificateCode = snapshot?.certificateCode ?? certificate?.certificateCode ?? verifyTarget;
  const publicSlug = snapshot?.publicSlug ?? entry.publicSlug;
  const ownerName = snapshot?.ownerName ?? entry.owner.displayName;
  const location = snapshot?.location ?? formatLocation(entry.owner.city, entry.owner.country, TRILINGUAL_NO_DATA);

  const fields: Array<[string, string | null | undefined]> = [
    ['Name / Име / Nome:', dogName],
    ['Breed / Порода / Razza:', snapshot?.breed ?? 'Cane Corso'],
    ['Date of Birth / Дата на раждане / Data di nascita:', formatDateLabel(snapshot?.dateOfBirth ?? dog.dateOfBirth)],
    ['Gender / Пол / Sesso:', formatSexTrilingual(snapshot?.sex ?? dog.sex)],
    ['Color / Цвят / Colore:', formatColorTrilingual(snapshot?.color ?? dog.color)],
    ['Microchip / Чип / Microchip:', snapshot?.microchipNumber ?? dog.microchipNumber ?? TRILINGUAL_NO_DATA],
    ['Pedigree / Родословие / Pedigree:', snapshot?.pedigreeNumber ?? dog.pedigreeNumber ?? TRILINGUAL_NO_DATA],
    ['Mother / Майка / Madre:', snapshot?.motherName ?? dog.pedigree?.mother?.name ?? TRILINGUAL_NO_DATA],
    ['Father / Баща / Padre:', snapshot?.fatherName ?? dog.pedigree?.father?.name ?? TRILINGUAL_NO_DATA],
    ['Owner / Собственик / Proprietario:', ownerName ?? TRILINGUAL_NO_DATA],
    ['City / Country / Град / Държава / Città / Paese:', location],
    ['Registry Profile / Профил в регистъра / Profilo nel registro:', publicSlug],
    ['Issue Date / Дата на издаване / Data di emissione:', formatDateLabel(issueDate)],
    ['Certificate No. / № на сертификат / N. certificato:', certificateCode],
  ];

  return (
    <div className="certv2-shell">
      <div className="certv2-top">
        <div>
          <h1>{copy.actionsTitle}</h1>
          <p className="certv2-note">{copy.actionsNote}</p>
        </div>
        <div className="certv2-actions">
          <CertificatePrintButton label={copy.print} fileName={`USG-Certificate-${certificateCode}`} />
          <Link href={verifyPath} className="button-secondary small">{copy.verify}</Link>
          <Link href={registryPath} className="button-ghost small">{copy.registry}</Link>
        </div>
      </div>

      <div className="usgCertViewport" aria-label={copy.actionsTitle}>
        <article className="usgCertCanvas">
          <div className="usgCertOrnament usgCertOrnament--tl" />
          <div className="usgCertOrnament usgCertOrnament--tr" />
          <div className="usgCertOrnament usgCertOrnament--bl" />
          <div className="usgCertOrnament usgCertOrnament--br" />

          <header className="usgCertHeader">
            <img className="usgCertEmblem" src="/brand/statements/one-of-a-kind-head.png" alt="UNICO SUO GENERE" />
            <div className="usgCertBrand">UNICO SUO GENERE</div>
            <div className="usgCertBrandSub">ONE OF A KIND • OFFICIAL CANE CORSO CERTIFICATE</div>
            <div className="usgCertFlourish" />
            <div className="usgCertTitleBlock">
              <h2>CERTIFICATE OF AUTHENTICITY</h2>
              <h2>СЕРТИФИКАТ ЗА АВТЕНТИЧНОСТ</h2>
              <h2>CERTIFICATO DI AUTENTICITÀ</h2>
            </div>
            <p className="usgCertSubtitle">Official Cane Corso certificate • Официален Cane Corso сертификат • Certificato ufficiale Cane Corso</p>
            <div className="usgCertSubtitleFlourish" />
          </header>

          <aside className="usgCertMediaPanel">
            <div className="usgCertPhotoFrame">
              {imageUrl ? <img className="usgCertPhoto" src={imageUrl} alt={dogName} /> : <div className="usgCertPhotoPlaceholder">Certified Cane Corso</div>}
            </div>
            <div className="usgCertPhotoCaption">Certified Cane Corso</div>
            <div className="usgCertQrPanel">
              <QrCodeSvg value={verifyAbsoluteUrl} title={copy.qrAlt} />
              <span>Scan to verify</span>
              <span>Сканирай за проверка</span>
              <span>Scansiona per verifica</span>
            </div>
          </aside>

          <section className="usgCertFields" aria-label="Certificate data">
            {fields.map(([label, value]) => (
              <div className="usgCertField" key={label}>
                <dt>{label}</dt>
                <span aria-hidden="true">◆</span>
                <dd>{value || TRILINGUAL_NO_DATA}</dd>
              </div>
            ))}
          </section>

          <section className="usgCertSignatureBlock">
            <div className="usgCertSignature"><img src="/brand/certificate/stefano-de-tanini-signature.png" alt={SIGNER_NAME} /></div>
            <div className="usgCertSignatureRule" />
            <div className="usgCertSigner">Founder&nbsp;&nbsp;•&nbsp;&nbsp;UNICO SUO GENERE</div>
          </section>

          <section className="usgCertStatement" aria-label="Certificate authenticity statement">
            <p>This certificate confirms the authenticity and certified status of the above Cane Corso in UNICO SUO GENERE.</p>
            <p>Този сертификат потвърждава автентичността и сертифицирания статус на горепосоченото Cane Corso в UNICO SUO GENERE.</p>
            <p>Questo certificato conferma l’autenticità e lo status certificato del suddetto Cane Corso in UNICO SUO GENERE.</p>
          </section>

          <img className="usgCertSeal" src="/brand/seal/usg-official-seal.png" alt="Official UNICO SUO GENERE certificate seal" />
          <div className="usgCertVerifyUrl">Verify: {verifyAbsoluteUrl}</div>
        </article>
      </div>
    </div>
  );
}
