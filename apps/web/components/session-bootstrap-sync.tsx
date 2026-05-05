'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBootstrapSession, fetchCurrentSession } from '@/lib/api/session.client';

export function SessionBootstrapSync() {
  const router = useRouter();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) {
      return;
    }

    attemptedRef.current = true;

    void (async () => {
      try {
        const current = await fetchCurrentSession();

        if (current.bootstrap === 'dev-fallback') {
          await createBootstrapSession();
          router.refresh();
        }
      } catch {
        // Keep the bootstrap sync silent. Member routes still have the dev fallback.
      }
    })();
  }, [router]);

  return null;
}
