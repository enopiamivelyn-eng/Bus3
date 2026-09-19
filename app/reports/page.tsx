'use client';

import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import { formatPrice } from '@/lib/routes';

const tiles = [
  {
    label: 'Tickets sold this week',
    value: '128',
    icon: (
      <>
        <path d="M3 8.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.5" />
        <path d="M3 8.5a1.8 1.8 0 0 0 0 3V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2.5a1.8 1.8 0 0 1 0-3" />
      </>
    ),
  },
  {
    label: 'Gross revenue',
    value: formatPrice(38400),
    icon: (
      <>
        <rect x="2.5" y="5" width="15" height="10" rx="2.5" />
        <path d="M2.5 9h15" />
      </>
    ),
  },
  {
    label: 'Active reservations',
    value: '46',
    icon: (
      <>
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 5.5V10l3 2" />
      </>
    ),
  },
  {
    label: 'Seat occupancy',
    value: '78%',
    icon: (
      <>
        <path d="M5 4v8a2 2 0 0 0 2 2h6" />
        <path d="M5 16h10" />
      </>
    ),
  },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';

  return (
 <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />

          <main className="ds-page">
            <div className="ds-mb">
              <h1 className="ds-page-title">Reports</h1>
              <p className="ds-page-sub">Sales and occupancy at a glance</p>
            </div>

            <div className="ds-stats ds-mb">
              {tiles.map((tile) => (
                <div key={tile.label} className="ds-stat">
                  <span className="ds-stat-icon" aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {tile.icon}
                    </svg>
                  </span>
                  <span className="ds-stat-body">
                    <strong>{tile.value}</strong>
                    <span>{tile.label}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="ds-note">
              These figures are placeholder values. Once bookings move out of
              component state and into a database, this page can read real
              aggregates.
            </div>
          </main>
        </div>
      </div>
 </AuthGate>

  );
}
