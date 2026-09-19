'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export interface GuestNavbarProps {
  /** Where the auth buttons should send the user — defaults to the login page. */
  activeLabel?: 'Log in' | 'Sign up';
}

/**
 * Top bar for signed-out visitors. Unlike <Navbar> it has no search field,
 * no status cluster and no sidebar beside it — a guest sees only the brand
 * lockup plus the Log in / Sign up actions.
 */
export default function GuestNavbar({ activeLabel }: GuestNavbarProps) {
  const { user, loading } = useAuth();
  const signedIn = Boolean(user) && !loading;

  return (
    <header className="ds-nav ds-nav-guest">
      <Link href="/" className="ds-guest-brand">
        <span className="ds-guest-brand-logo">
          <Image src="/busicon.png" alt="" width={499} height={499} priority />
        </span>
        <span className="ds-guest-brand-text">
          <strong>Bus Ticket</strong>
          <span>Management System</span>
        </span>
      </Link>

      <nav className="ds-guest-actions" aria-label="Account">
        {signedIn ? (
          <Link href="/home" className="ds-btn ds-btn-primary ds-btn-sm">
            Go to Home
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className={`ds-btn ds-btn-sm ${
                activeLabel === 'Log in' ? 'ds-btn-primary' : 'ds-btn-outline'
              }`}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={`ds-btn ds-btn-sm ${
                activeLabel === 'Sign up' ? 'ds-btn-primary' : 'ds-btn-outline'
              }`}
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
