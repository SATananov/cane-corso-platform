'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { destroyCurrentSession } from '@/lib/api/session.client';
import { buildAccessPath } from '@/lib/access-control';
import { IconSymbol } from '@/components/icon-symbol';

interface SignOutButtonProps {
  label: string;
  variant?: 'menu' | 'header';
}

export function SignOutButton({ label, variant = 'menu' }: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);

    try {
      await destroyCurrentSession();
      router.push(buildAccessPath({ notice: 'signed_out', intent: 'member' }));
      router.refresh();
    } catch {
      window.location.href = buildAccessPath({ notice: 'signed_out', intent: 'member' });
    } finally {
      setPending(false);
    }
  };

  const className =
    variant === 'header'
      ? 'header-direct-link header-direct-link--soft header-direct-link--button'
      : 'utility-menu__link utility-menu__link--soft utility-menu__button';

  const buttonLabel = pending ? `${label}…` : label;

  return (
    <button type="button" className={className} onClick={() => void handleClick()} disabled={pending}>
      {variant === 'header' ? (
        <>
          <span className="header-tool-link__icon" aria-hidden="true">
            <IconSymbol name="exit" />
          </span>
          <span>{buttonLabel}</span>
        </>
      ) : (
        buttonLabel
      )}
    </button>
  );
}
