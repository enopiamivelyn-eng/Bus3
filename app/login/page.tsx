'use client';

import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { email, password, rememberMe });
  };

  return (
    <div className="main-container">
      <Sidebar />
      
      <main className="main-content login-content">
        {/* Login Box */}
        <div className="login-box">
          <div className="login-header">
            <h1 className="login-title">Welcome!</h1>
            <p className="login-subtitle">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter you password"
                className="form-input"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="forgot-password">
                Forgot Password
              </Link>
            </div>

            <button type="submit" className="btn-signin">
              Sign in
            </button>

            <div className="signup-link">
              <Link href="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
