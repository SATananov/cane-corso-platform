'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}

export function AppShell({ children, header, footer }: AppShellProps) {
  const pathname = usePathname();
  const isEntryPage = pathname === '/';

  if (isEntryPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-frame">
      {header}
      {children}
      {footer}
    </div>
  );
}
