'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginHeroPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { username, password, rememberMe });
  };

  return (
    <div className="hero-page">
      {/* Top Navigation */}
      <header className="hero-navbar">
        <Link href="/" className="hero-brand">
          <span className="hero-brand-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 16V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V16" />
              <path d="M4 11h16" />
              <path d="M2 16h20" />
              <path d="M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path d="M17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path d="M9 7.5h1.5M13.5 7.5H15" />
            </svg>
          </span>
          <span className="hero-brand-name">Bus Ticket Management System</span>
        </Link>

        <nav className="hero-nav-links">
          <Link href="/" className="hero-nav-link">Home</Link>
          <Link href="/about" className="hero-nav-link">About</Link>
          <Link href="/about#contact" className="hero-nav-link">Contact</Link>
        </nav>
      </header>

      {/* Hero + Login */}
      <main className="hero-stage">
        {/* Photographic backdrop: beautiful bus on a sunset highway (public/hero-bus.png) */}
        <div className="hero-scenery" aria-hidden="true">
          <Image
            src="/hero-bus.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-scenery-image"
          />
          <div className="hero-scenery-overlay" />
        </div>

        <div className="hero-inner">
          {/* Left: headline + features */}
          <section className="hero-copy">
            <h1 className="hero-heading">
              Travel Made
              <br />
              Easier
            </h1>
            <p className="hero-subheading">
              Book Your Bus Tickets
              <br />
              Anytime, Anywhere
            </p>

            <ul className="hero-features">
              <li className="hero-feature">
                <span className="hero-feature-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
                    <path d="M7 12.2v3.4c0 .9 1.6 1.9 5 1.9s5-1 5-1.9v-3.4" />
                  </svg>
                </span>
                <span className="hero-feature-label">Easy Booking</span>
              </li>

              <li className="hero-feature">
                <span className="hero-feature-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 5 6v6c0 4.3 2.9 7.7 7 9 4.1-1.3 7-4.7 7-9V6l-7-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <span className="hero-feature-label">Secure Payment</span>
              </li>

              <li className="hero-feature">
                <span className="hero-feature-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="8.5" r="3" />
                    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
                    <path d="M16 6.2a3 3 0 0 1 0 5.6" />
                    <path d="M17.5 14.3a5.5 5.5 0 0 1 3 4.7" />
                  </svg>
                </span>
                <span className="hero-feature-label">Comfortable Travel</span>
              </li>
            </ul>
          </section>

          {/* Right: login card */}
          <section className="hero-login-card">
            <div className="hero-login-header">
              <h2 className="hero-login-title">Login</h2>
              <p className="hero-login-subtitle">Access your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="hero-login-form">
              <div className="hero-field">
                <label htmlFor="username" className="hero-label">Username</label>
                <div className="hero-input-wrap">
                  <span className="hero-input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="3.4" />
                      <path d="M4.8 19.5a7.2 7.2 0 0 1 14.4 0" />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="hero-input has-icon"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="hero-field">
                <label htmlFor="password" className="hero-label">Password</label>
                <div className="hero-input-wrap">
                  <span className="hero-input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
                      <path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="hero-input has-icon has-trailing-icon"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="hero-input-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 6.3A9.7 9.7 0 0 1 12 6.2c5 0 9 5.8 9 5.8a17 17 0 0 1-3.2 3.7" />
                        <path d="M6.5 8.1A17.6 17.6 0 0 0 3 12s4 5.8 9 5.8c1.2 0 2.3-.3 3.3-.7" />
                        <path d="M9.9 10.2a3 3 0 0 0 4.1 4.2" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12s4-5.8 9-5.8S21 12 21 12s-4 5.8-9 5.8S3 12 3 12Z" />
                        <circle cx="12" cy="12" r="2.8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="hero-form-options">
                <label className="hero-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="hero-forgot">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="hero-btn-primary">
                Login
              </button>

              <div className="hero-divider">
                <span>or</span>
              </div>

              <Link href="/signup" className="hero-btn-outline">
                Create New Account
              </Link>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
