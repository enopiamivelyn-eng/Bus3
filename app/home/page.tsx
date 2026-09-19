'use client';

import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import { popularRoutes, formatPrice } from '@/lib/routes';

/**
 * The signed-in main page. Everything here is wrapped in <AuthGate>, so the
 * sidebar only ever renders for an authenticated user — a guest who lands on
 * /home is redirected to /login before any of this markup appears.
 */
export default function HomePage() {
  const { user } = useAuth();
  const firstName = (user?.name ?? 'Traveller').split(' ')[0];

  return (
    <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={user?.name ?? 'Traveller'} />

          <main className="ds-page">
            <div className="ds-mb">
              <h1 className="ds-page-title">Hello, {firstName}!</h1>
              <p className="ds-page-sub">Where would you like to go today?</p>
            </div>

            {/* Trip search */}
            <section className="ds-card ds-card-pad ds-mb">
              <form className="ds-trip-grid" action="/book-details">
                <div className="ds-field">
                  <label className="ds-label" htmlFor="from">From</label>
                  <select id="from" name="from" className="ds-select" defaultValue="Cebu City">
                    <option value="Cebu City">Cebu City</option>
                    <option value="Oslob">Oslob</option>
                    <option value="Bato">Bato</option>
                    <option value="Dalaguete">Dalaguete</option>
                  </select>
                </div>

                <div className="ds-field">
                  <label className="ds-label" htmlFor="to">To</label>
                  <select id="to" name="to" className="ds-select" defaultValue="">
                    <option value="">Select destination</option>
                    {popularRoutes.map((route) => (
                      <option key={route.id} value={route.to}>
                        {route.to}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ds-field">
                  <label className="ds-label" htmlFor="departure">Departure Date</label>
                  <input
                    id="departure"
                    name="date"
                    type="date"
                    className="ds-input"
                    defaultValue="2025-09-05"
                  />
                </div>

                <div className="ds-field">
                  <button type="submit" className="ds-btn ds-btn-primary">
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="9" cy="9" r="6" />
                      <path d="M17 17l-4-4" />
                    </svg>
                    Search
                  </button>
                </div>
              </form>
            </section>

            {/* Available routes */}
            <div className="ds-section-head">
              <div>
                <h2 className="ds-section-title">Available Routes</h2>
                <p className="ds-section-sub">Pick a route to book or reserve a seat</p>
              </div>
              <Link href="/routes" className="ds-link">
                View All
              </Link>
            </div>

            <div className="ds-route-grid ds-mb">
              {popularRoutes.map((route) => (
                <Link key={route.id} href="/book-details" className="ds-route-card">
                  <div className="ds-route-media">
                    <div className="ds-route-media-fallback">
                      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2.5" y="5" width="19" height="12" rx="2.5" />
                        <path d="M2.5 11h19" />
                        <circle cx="7" cy="19" r="1.7" />
                        <circle cx="17" cy="19" r="1.7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ds-route-body">
                    <span className="ds-route-name">
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M10 17.5s5.5-4.6 5.5-8.8A5.5 5.5 0 0 0 4.5 8.7c0 4.2 5.5 8.8 5.5 8.8Z" />
                      </svg>
                      {route.from} → {route.to}
                    </span>
                    <span className="ds-route-meta">
                      <span className="ds-route-price">{formatPrice(route.price)}</span>
                      <span className="ds-route-duration">{route.duration}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
