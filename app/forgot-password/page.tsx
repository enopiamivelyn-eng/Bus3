'use client';

import Link from 'next/link';
import { useState } from 'react';
import GuestNavbar from '../components/GuestNavbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setError('');
    // No mail service wired up yet — this is where the reset email would go.
    setSent(true);
  };

  return (
    <div className="ds-app">
      <GuestNavbar activeLabel="Log in" />

      <main className="ds-auth">
          <div className="ds-auth-card">
            {sent ? (
              <>
                <div className="ds-auth-head">
                  <h1 className="ds-auth-title">Check your email</h1>
                  <p className="ds-auth-sub">
                    If an account exists for {email}, a reset link is on its way.
                  </p>
                </div>
                <p className="ds-note" style={{ marginBottom: '1.2rem' }}>
                  Email delivery is not configured yet, so no message was actually
                  sent.
                </p>
                <Link href="/login" className="ds-btn ds-btn-primary ds-btn-block">
                  Back to Log in
                </Link>
              </>
            ) : (
              <>
                <div className="ds-auth-head">
                  <h1 className="ds-auth-title">Forgot Password</h1>
                  <p className="ds-auth-sub">
                    We&apos;ll send a reset link to your email
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="ds-form" noValidate>
                  <div className="ds-field">
                    <label htmlFor="email" className="ds-label">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="ds-input"
                      aria-invalid={Boolean(error)}
                    />
                    {error && <p className="ds-error">{error}</p>}
                  </div>

                  <button type="submit" className="ds-btn ds-btn-primary ds-btn-block">
                    Send Reset Link
                  </button>

                  <p className="ds-form-foot">
                    Remembered it?{' '}
                    <Link href="/login" className="ds-link">
                      Back to Log in
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </main>
    </div>
  );
}
