'use client';

import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import { routes, formatPrice } from '@/lib/routes';

const methods = [
  {
    id: 'gcash',
    title: 'GCash',
    text: 'Pay instantly with your GCash wallet',
    icon: (
      <>
        <rect x="5" y="3" width="10" height="14" rx="2" />
        <path d="M9 15h2" />
      </>
    ),
  },
  {
    id: 'maya',
    title: 'Maya',
    text: 'Use your Maya wallet or linked card',
    icon: (
      <>
        <rect x="3" y="5" width="14" height="10" rx="2" />
        <path d="M3 9h14" />
      </>
    ),
  },
  {
    id: 'terminal',
    title: 'Pay at Terminal',
    text: 'Reserve now and settle the fare at the counter',
    icon: (
      <>
        <path d="M4 16V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
        <path d="M3 16h14" />
      </>
    ),
  },
];

export default function PaymentPage() {
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';
  const [method, setMethod] = useState('gcash');

  const route = routes[0];
  const seats = 1;
  const total = route.price * seats;

  return (
 <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />

          <main className="ds-page">
            <div className="ds-mb">
              <h1 className="ds-page-title">Payment</h1>
              <p className="ds-page-sub">
                Complete your booking to secure your seats
              </p>
            </div>

            <div className="ds-pay-grid">
              {/* Left: summary + method */}
              <section className="ds-card ds-card-pad">
                <div className="ds-card-head">
                  <h2 className="ds-card-title">Booking Summary</h2>
                </div>

                <div className="ds-detail-grid">
                  <div>
                    <span className="ds-detail-label">Route</span>
                    <span className="ds-detail-value">
                      {route.from} → {route.to}
                    </span>
                  </div>
                  <div>
                    <span className="ds-detail-label">Departure</span>
                    <span className="ds-detail-value">Aug 8, 2025 · 8:00 AM</span>
                  </div>
                  <div>
                    <span className="ds-detail-label">Seats</span>
                    <span className="ds-detail-value">
                      {seats} · C04, C05, C06
                    </span>
                  </div>
                  <div>
                    <span className="ds-detail-label">Passengers</span>
                    <span className="ds-detail-value">{seats}</span>
                  </div>
                </div>

                <div className="ds-pay-total">
                  <span className="ds-detail-label" style={{ margin: 0 }}>
                    Total Amount
                  </span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <h3 className="ds-subhead" style={{ marginTop: 0 }}>
                  Select Payment Method
                </h3>

                <div className="ds-methods">
                  {methods.map((option) => (
                    <label
                      key={option.id}
                      className={`ds-method ${
                        method === option.id ? 'is-selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={option.id}
                        checked={method === option.id}
                        onChange={() => setMethod(option.id)}
                      />
                      <span className="ds-method-icon" aria-hidden="true">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {option.icon}
                        </svg>
                      </span>
                      <span className="ds-method-text">
                        <strong>{option.title}</strong>
                        <span>{option.text}</span>
                      </span>
                    </label>
                  ))}
                </div>

                <button type="button" className="ds-btn ds-btn-primary ds-btn-block">
                  Pay {formatPrice(total)}
                </button>
              </section>

              {/* Right: how it works */}
              <section className="ds-card ds-card-pad">
                <div className="ds-card-head">
                  <h2 className="ds-card-title">Payment Instructions</h2>
                </div>

                <ol className="ds-steps">
                  <li>
                    <span>1</span>
                    Select your preferred payment method on the left.
                  </li>
                  <li>
                    <span>2</span>
                    Complete the payment using your GCash or Maya wallet.
                  </li>
                  <li>
                    <span>3</span>
                    Wait for confirmation — your e-ticket is issued right after.
                  </li>
                </ol>

                <div className="ds-secure">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M10 2.5 16 5v5c0 4-2.6 6.6-6 7.5-3.4-.9-6-3.5-6-7.5V5Z" />
                    <path d="M7.4 10l1.9 1.9L13 8.3" />
                  </svg>
                  <span>
                    Your payment is secure and guaranteed. Nothing is charged
                    until you confirm the transaction.
                  </span>
                </div>

                <div className="ds-note" style={{ marginTop: '1.2rem' }}>
                  No payment gateway is wired up yet — this screen is the UI
                  only. See{' '}
                  <Link href="/bookings" className="ds-link">
                    My Bookings
                  </Link>{' '}
                  for the current state of your tickets.
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
 </AuthGate>

  );
}
