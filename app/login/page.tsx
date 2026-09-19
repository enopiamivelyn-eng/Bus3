'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GuestNavbar from '../components/GuestNavbar';
import { useAuth } from '../components/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // If a session is already active there is nothing to log into — go straight
  // to the signed-in main page.
  useEffect(() => {
    if (!loading && user) router.replace('/home');
  }, [loading, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // No auth server exists yet, so this accepts anything and records a local
    // session. Replace this block when a real sign-in endpoint is available.
    signIn({
      name: email.split('@')[0] || 'Traveller',
      email,
      role: 'Passenger',
    });

    router.push('/home');
  };

  return (
    <div className="ds-app ds-app-auth">
      <GuestNavbar activeLabel="Log in" />

      <main className="ds-auth-center">
        <section className="ds-auth-hero">
          <h2 className="ds-auth-hero-title">
            Travel Made
            <br />
            Easier
          </h2>
          <p className="ds-auth-hero-sub">
            Book Your Bus Tickets
            <br />
            Anytime, Anywhere
          </p>
        </section>

          <div className="ds-auth-card">
            <div className="ds-auth-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="12" rx="2.5" />
                <path d="M3 11h18" />
                <circle cx="7.5" cy="19" r="1.6" />
                <circle cx="16.5" cy="19" r="1.6" />
              </svg>
            </div>

            <div className="ds-auth-head">
              <h1 className="ds-auth-title">Welcome Back!</h1>
              <p className="ds-auth-sub">
                Log in to your account and continue booking your next trip.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="ds-form">
              <div className="ds-field">
                <label htmlFor="email" className="ds-label">Email</label>
                <span className="ds-input-wrap">
                  <span className="ds-input-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                      <rect x="2.5" y="5" width="15" height="10" rx="2" />
                      <path d="M3 6.5 10 11l7-4.5" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="ds-input"
                    required
                  />
                </span>
              </div>

              <div className="ds-field">
                <label htmlFor="password" className="ds-label">Password</label>
                <span className="ds-input-wrap">
                  <span className="ds-input-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                      <rect x="4" y="9" width="12" height="8" rx="2" />
                      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="ds-input"
                    required
                  />
                </span>
              </div>

              <div className="ds-form-row">
                <label className="ds-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="ds-link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="ds-btn ds-btn-primary ds-btn-block">
                Log in
              </button>

              <div className="ds-divider">or</div>

              <Link href="/signup" className="ds-btn ds-btn-outline ds-btn-block">
                Create New Account
              </Link>
            </form>
          </div>
        </main>
    </div>
  );
}
