'use client';

interface CertificatePrintButtonProps {
  label: string;
  fileName?: string;
}

function normalizePrintTitle(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function CertificatePrintButton({ label, fileName = 'USG-Certificate' }: CertificatePrintButtonProps) {
  function handlePrint() {
    const previousTitle = document.title;
    document.title = normalizePrintTitle(fileName) || 'USG-Certificate';

    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);
    window.print();

    window.setTimeout(restoreTitle, 1200);
  }

  return (
    <button type="button" className="button-primary small" onClick={handlePrint}>
      {label}
    </button>
  );
}
