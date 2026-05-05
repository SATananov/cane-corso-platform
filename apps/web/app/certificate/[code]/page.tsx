import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CertificateV2Document } from '@/components/certificate-v2-document';
import { getCurrentLocale } from '@/lib/locale.server';
import { getVerificationDocument } from '@/lib/registry.server';

interface CertificatePageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `USG Certificate — ${decodeURIComponent(code)}`,
  };
}

export const dynamic = 'force-dynamic';

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { code } = await params;
  const locale = await getCurrentLocale();
  const decodedCode = decodeURIComponent(code);
  const document = await getVerificationDocument(decodedCode);

  if (!document) {
    notFound();
  }

  return <CertificateV2Document document={document} locale={locale} code={decodedCode} />;
}
