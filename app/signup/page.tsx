'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GuestNavbar from '../components/GuestNavbar';
import { useAuth } from '../components/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 10)
      next.phone = 'Enter a valid contact number.';
    if (form.password.length < 8)
      next.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match.';
    if (!acceptedTerms) next.terms = 'You must accept the terms to continue.';

    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // No backend yet — the account is recorded as a local session so the rest
    // of the app can treat the visitor as signed in.
    signIn({
      name: form.fullName.trim() || 'Traveller',
      email: form.email,
      role: 'Passenger',
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="ds-app ds-app-auth">
        <GuestNavbar />

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
            <div className="ds-auth-head">
              <h1 className="ds-auth-title">Account created</h1>
              <p className="ds-auth-sub">
                Welcome aboard, {form.fullName.split(' ')[0]}.
              </p>
            </div>
            <p className="ds-note" style={{ marginBottom: '1.2rem' }}>
              Account creation is not connected to a server yet, so nothing was
              saved to a database. You are signed in for this session.
            </p>
            <button
              type="button"
              className="ds-btn ds-btn-primary ds-btn-block"
              onClick={() => router.push('/home')}
            >
              Continue to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ds-app ds-app-auth">
      <GuestNavbar activeLabel="Sign up" />

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
              <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="10" cy="7" r="3.2" />
                <path d="M4.5 17c0-3 2.4-5 5.5-5s5.5 2 5.5 5" />
              </svg>
            </div>

            <div className="ds-auth-head">
              <h1 className="ds-auth-title">Create Account</h1>
              <p className="ds-auth-sub">Book tickets in a few taps</p>
            </div>

            <form onSubmit={handleSubmit} className="ds-form" noValidate>
              <div className="ds-field">
                <label htmlFor="fullName" className="ds-label">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={update('fullName')}
                  placeholder="Juan Dela Cruz"
                  className="ds-input"
                  aria-invalid={Boolean(errors.fullName)}
                />
                {errors.fullName && <p className="ds-error">{errors.fullName}</p>}
              </div>

              <div className="ds-field">
                <label htmlFor="email" className="ds-label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@email.com"
                  className="ds-input"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="ds-error">{errors.email}</p>}
              </div>

              <div className="ds-field">
                <label htmlFor="phone" className="ds-label">Contact Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="+63 912 345 6789"
                  className="ds-input"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <p className="ds-error">{errors.phone}</p>}
              </div>

              <div className="ds-field">
                <label htmlFor="password" className="ds-label">Password</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={update('password')}
                  placeholder="At least 8 characters"
                  className="ds-input"
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && <p className="ds-error">{errors.password}</p>}
              </div>

              <div className="ds-field">
                <label htmlFor="confirmPassword" className="ds-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="Re-enter your password"
                  className="ds-input"
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                {errors.confirmPassword && (
                  <p className="ds-error">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="ds-field">
                <label className="ds-check">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
                {errors.terms && <p className="ds-error">{errors.terms}</p>}
              </div>

              <button type="submit" className="ds-btn ds-btn-primary ds-btn-block">
                Create Account
              </button>

              <p className="ds-form-foot">
                Already have an account? <Link href="/login" className="ds-link">Log in</Link>
              </p>
            </form>
          </div>
        </main>
    </div>
  );
}
