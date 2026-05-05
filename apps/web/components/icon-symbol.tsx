import type { SVGProps } from 'react';

export type IconSymbolName =
  | 'platform'
  | 'registry'
  | 'knowledge'
  | 'partners'
  | 'community'
  | 'verify'
  | 'guide'
  | 'member'
  | 'profile'
  | 'admin'
  | 'manifesto'
  | 'faq'
  | 'elite'
  | 'gallery'
  | 'owner'
  | 'exit';

function SymbolSvg({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function IconSymbol({ name, className }: { name: IconSymbolName; className?: string }) {
  switch (name) {
    case 'platform':
      return (
        <SymbolSvg className={className}>
          <path d="M3 12 12 4l9 8" />
          <path d="M5 10v9h14v-9" />
          <path d="M10 19v-5h4v5" />
        </SymbolSvg>
      );
    case 'registry':
      return (
        <SymbolSvg className={className}>
          <path d="M12 3l7 3v6c0 4.5-2.9 7.4-7 9-4.1-1.6-7-4.5-7-9V6l7-3Z" />
          <path d="M9 12h6" />
          <path d="M9 9h6" />
        </SymbolSvg>
      );
    case 'knowledge':
      return (
        <SymbolSvg className={className}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 15h5" />
        </SymbolSvg>
      );
    case 'partners':
      return (
        <SymbolSvg className={className}>
          <path d="M8 12 5.5 9.5a2.5 2.5 0 0 1 3.5-3.5L12 9" />
          <path d="M16 12l2.5 2.5a2.5 2.5 0 1 1-3.5 3.5L12 15" />
          <path d="M9 15l6-6" />
        </SymbolSvg>
      );
    case 'community':
      return (
        <SymbolSvg className={className}>
          <path d="M12 21s-6.5-4.35-8.8-8.03A4.94 4.94 0 0 1 7.3 5.1c1.72 0 3 1 4.7 2.9 1.7-1.9 2.98-2.9 4.7-2.9a4.94 4.94 0 0 1 4.1 7.87C18.5 16.65 12 21 12 21Z" />
        </SymbolSvg>
      );
    case 'verify':
      return (
        <SymbolSvg className={className}>
          <path d="M12 3l7 3v6c0 4.5-2.9 7.4-7 9-4.1-1.6-7-4.5-7-9V6l7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </SymbolSvg>
      );
    case 'guide':
      return (
        <SymbolSvg className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.4 9.4a2.8 2.8 0 0 1 5.4 1c0 1.87-2.8 2.2-2.8 4" />
          <path d="M12 17h.01" />
        </SymbolSvg>
      );
    case 'member':
      return (
        <SymbolSvg className={className}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </SymbolSvg>
      );
    case 'profile':
      return (
        <SymbolSvg className={className}>
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M5 20a7 7 0 0 1 14 0" />
          <path d="M19 7v4" />
          <path d="M17 9h4" />
        </SymbolSvg>
      );
    case 'admin':
      return (
        <SymbolSvg className={className}>
          <path d="M12 3l2 3 3 .5-.5 3 2 2-2 2 .5 3-3 .5-2 3-2-3-3-.5.5-3-2-2 2-2-.5-3 3-.5 2-3Z" />
          <circle cx="12" cy="12" r="2.5" />
        </SymbolSvg>
      );
    case 'manifesto':
      return (
        <SymbolSvg className={className}>
          <path d="M6 4h10l2 3v13H6Z" />
          <path d="M8 9h8" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </SymbolSvg>
      );
    case 'faq':
      return (
        <SymbolSvg className={className}>
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
          <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.2-1.7 2.4" />
          <path d="M12 16h.01" />
        </SymbolSvg>
      );
    case 'elite':
      return (
        <SymbolSvg className={className}>
          <path d="m12 4 1.7 3.5L17.5 9l-2.75 2.7.65 3.8L12 13.9 8.6 15.5l.65-3.8L6.5 9l3.8-1.5L12 4Z" />
          <path d="M7 19h10" />
        </SymbolSvg>
      );
    case 'gallery':
      return (
        <SymbolSvg className={className}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m21 15-4.5-4.5L8 19" />
        </SymbolSvg>
      );
    case 'owner':
      return (
        <SymbolSvg className={className}>
          <path d="M12 5c2.2 0 4 1.8 4 4 0 1.4-.7 2.6-1.8 3.3" />
          <path d="M10.3 12.1A4 4 0 1 1 8 5.7" />
          <path d="M4 20a8 8 0 0 1 11.2-7.3" />
          <path d="M18 21v-6" />
          <path d="M15 18h6" />
        </SymbolSvg>
      );

    case 'exit':
      return (
        <SymbolSvg className={className}>
          <path d="M15 17l5-5-5-5" />
          <path d="M20 12H9" />
          <path d="M11 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
        </SymbolSvg>
      );
    default:
      return null;
  }
}
