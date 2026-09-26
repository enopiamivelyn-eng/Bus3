'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import { formatPrice } from '@/lib/routes';

/**
 * The shape /api/routes actually returns: a flat list of route rows whose
 * endpoint fields are `from` and `to`. (The Prisma model names the columns
 * `fromCity`/`toCity`, but the API maps them down before sending.)
 */
interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
  price: number;
  duration: string;
}

/**
 * A trip as /api/trips returns it: flat fields, already joined with the
 * route and bus by the API. There is no nested `route` object and no
 * `fare` key — the price is `price`.
 */
interface Trip {
  id: string;
  routeName: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  busNumber: string;
  busModel: string;
  capacity: number;
  duration: string;
  status: string;
}

/**
 * The signed-in main page. Everything here is wrapped in <AuthGate>, so the
 * sidebar only ever renders for an authenticated user — a guest who lands on
 * /home is redirected to /login before any of this markup appears.
 */
export default function HomePage() {
  const { user } = useAuth();
  const firstName = (user?.name ?? 'Traveller').split(' ')[0];

  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch routes and trips from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch routes
        const routesResponse = await fetch('/api/routes');
        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          setRoutes(routesData.routes || []);
        }

        // Fetch trips for today
        const today = new Date().toISOString().split('T')[0];
        const tripsResponse = await fetch(`/api/trips?date=${today}`);
        if (tripsResponse.ok) {
          const tripsData = await tripsResponse.json();
          setTrips(tripsData.trips || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique origins and destinations from the routes the API returned.
  // The endpoints live in `from`/`to`; mapping them directly is what keeps
  // this list free of `undefined` entries (and the duplicate-key warning that
  // an unreadable field produces).
  const origins = Array.from(new Set(routes.map((r) => r.from)));
  const destinations = Array.from(new Set(routes.map((r) => r.to)));

  return (
    <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={user?.name ?? 'Traveller'} />

          <main className="ds-page">
            {/* Greeting banner with bus background image (public/hero-bus.png) */}
            <div className="ds-home-hero ds-mb">
              <h1 className="ds-page-title">Hello, {firstName}!</h1>
              <p className="ds-page-sub">Where would you like to go today?</p>
            </div>

            {error && (
              <div className="ds-alert ds-alert-error ds-mb">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="10" cy="10" r="7.5" />
                  <path d="M10 6v4M10 13.5v.5" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Trip search */}
            <section className="ds-card ds-card-pad ds-mb">
              <form className="ds-trip-grid" action="/book-details">
                <div className="ds-field">
                  <label className="ds-label" htmlFor="from">From</label>
                  <select id="from" name="from" className="ds-select" defaultValue="">
                    <option value="">Select origin</option>
                    {origins.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ds-field">
                  <label className="ds-label" htmlFor="to">To</label>
                  <select id="to" name="to" className="ds-select" defaultValue="">
                    <option value="">Select destination</option>
                    {destinations.map((city) => (
                      <option key={city} value={city}>
                        {city}
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
                    defaultValue={new Date().toISOString().split('T')[0]}
                    min={new Date().toISOString().split('T')[0]}
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
                <h2 className="ds-section-title">Available Routes Today</h2>
                <p className="ds-section-sub">Pick a route to book or reserve a seat</p>
              </div>
              <Link href="/routes" className="ds-link">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="ds-empty">
                <div className="loading" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Loading routes...</p>
              </div>
            ) : trips.length > 0 ? (
              <div className="ds-route-grid ds-mb">
                {trips.slice(0, 6).map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/book-details?tripId=${trip.id}`}
                    className="ds-route-card"
                  >
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
                        {trip.from} → {trip.to}
                      </span>
                      <span className="ds-route-meta">
                        <span className="ds-route-price">{formatPrice(trip.price)}</span>
                        <span className="ds-route-duration">{trip.duration}</span>
                      </span>
                      <span className="ds-route-meta" style={{ marginTop: '0.5rem', fontSize: '0.8125rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                          Departs: {trip.departureTime}
                        </span>
                        <span style={{ color: trip.availableSeats > 10 ? '#6ee7b7' : '#fbbf24' }}>
                          {trip.availableSeats} seats left
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="ds-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, margin: '0 auto 1rem' }}>
                  <rect x="2.5" y="5" width="19" height="12" rx="2.5" />
                  <path d="M2.5 11h19" />
                  <circle cx="7" cy="19" r="1.7" />
                  <circle cx="17" cy="19" r="1.7" />
                </svg>
                <h3>No trips available</h3>
                <p>There are no scheduled trips for today. Please check back later.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
