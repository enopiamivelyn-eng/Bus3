'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GuestNavbar from '../components/GuestNavbar';
import PasswordVisibilityToggle from '../components/PasswordVisibilityToggle';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setApiError('');
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);

    try {
      // Call the registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: 'passenger',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.replace('/login?registered=1');
      } else {
        // Show API error
        setApiError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {apiError && (
                <div className="ds-alert ds-alert-error">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="10" cy="10" r="7.5" />
                    <path d="M10 6v4M10 13.5v.5" />
                  </svg>
                  <span>{apiError}</span>
                </div>
              )}

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
                <div className="ds-password-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={update('password')}
                    placeholder="At least 8 characters"
                    className="ds-input"
                    aria-invalid={Boolean(errors.password)}
                  />
                  <PasswordVisibilityToggle
                    visible={showPassword}
                    onToggle={() => setShowPassword((visible) => !visible)}
                  />
                </div>
                {errors.password && <p className="ds-error">{errors.password}</p>}
              </div>

              <div className="ds-field">
                <label htmlFor="confirmPassword" className="ds-label">
                  Confirm Password
                </label>
                <div className="ds-password-wrap">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    placeholder="Re-enter your password"
                    className="ds-input"
                    aria-invalid={Boolean(errors.confirmPassword)}
                  />
                  <PasswordVisibilityToggle
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((visible) => !visible)}
                  />
                </div>
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

              <button type="submit" className="ds-btn ds-btn-primary ds-btn-block" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
