'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * Wraps every page that requires a signed-in user.
 *
 * The sidebar lives inside this gate, so a visitor who has not logged in can
 * never see it — they are bounced to /login before any protected markup
 * renders. While the stored session is still being read we render a plain
 * placeholder rather than redirecting, otherwise a logged-in user would be
 * kicked to the login page for the first frame of every navigation.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="ds-auth-loading" role="status" aria-live="polite">
        <span className="ds-spinner" aria-hidden="true" />
        <span>Checking your session…</span>
      </div>
    );
  }

  return <>{children}</>;
}
