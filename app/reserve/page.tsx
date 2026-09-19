'use client';

import Link from 'next/link';
import { useState } from 'react';
import GuestNavbar from '../components/GuestNavbar';
import { routes, formatPrice } from '@/lib/routes';

export default function ReservePage() {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [held, setHeld] = useState(false);

  const route = routes.find((r) => r.id.toString() === selectedRoute);
  const total = route ? route.price * passengers : 0;

  return (
    <div className="ds-app">
      <GuestNavbar />

      <main className="ds-landing">
        <div className="ds-landing-inner">
          <div className="ds-mb">
            <h1 className="ds-page-title">Reserve a Seat</h1>
            <p className="ds-page-sub">
              Hold a seat now and pay at the terminal — no account needed
            </p>
          </div>

          <div className="ds-pay-grid">
            <form
              className="ds-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (route) setHeld(true);
              }}
            >
              <div className="ds-card ds-card-pad">
                <div className="ds-card-head">
                  <h2 className="ds-card-title">Reservation Details</h2>
                </div>

                <div className="ds-trip-grid">
                  <div className="ds-field">
                    <label htmlFor="route" className="ds-label">Select Route *</label>
                    <select
                      id="route"
                      className="ds-select"
                      value={selectedRoute}
                      onChange={(e) => {
                        setSelectedRoute(e.target.value);
                        setHeld(false);
                      }}
                      required
                    >
                      <option value="">Choose a route</option>
                      {routes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} - {formatPrice(r.price)} ({r.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ds-field">
                    <label htmlFor="passengers" className="ds-label">
                      Number of Seats *
                    </label>
                    <input
                      id="passengers"
                      type="number"
                      className="ds-input"
                      min="1"
                      max="10"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>
              </div>

              {route && (
                <div className="ds-card ds-card-pad">
                  <div className="ds-card-head">
                    <h2 className="ds-card-title">Reservation Summary</h2>
                  </div>

                  <div className="ds-detail-grid">
                    <div>
                      <span className="ds-detail-label">Route</span>
                      <span className="ds-detail-value">{route.name}</span>
                    </div>
                    <div>
                      <span className="ds-detail-label">Duration</span>
                      <span className="ds-detail-value">{route.duration}</span>
                    </div>
                    <div>
                      <span className="ds-detail-label">Fare per seat</span>
                      <span className="ds-detail-value">{formatPrice(route.price)}</span>
                    </div>
                    <div>
                      <span className="ds-detail-label">Seats</span>
                      <span className="ds-detail-value">{passengers}</span>
                    </div>
                  </div>

                  <div className="ds-pay-total">
                    <span className="ds-detail-label" style={{ margin: 0 }}>
                      Total Amount
                    </span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                </div>
              )}

              {held && (
                <p className="ds-note ds-note-info">
                  Seats held for {route?.name}. Reservations aren&apos;t connected to
                  a database yet, so this hold is not saved.
                </p>
              )}

              <div className="ds-row-actions">
                <Link href="/book-details" className="ds-btn ds-btn-outline">
                  Book and pay instead
                </Link>
                <button type="submit" className="ds-btn ds-btn-primary">
                  Reserve Seats
                </button>
              </div>
            </form>

            <aside className="ds-card ds-card-pad">
              <div className="ds-card-head">
                <h2 className="ds-card-title">How reserving works</h2>
              </div>
              <ol className="ds-steps">
                <li><span>1</span>Pick your route and the number of seats.</li>
                <li><span>2</span>We hold the seats until your departure time.</li>
                <li><span>3</span>Settle the fare at the terminal counter to board.</li>
              </ol>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
