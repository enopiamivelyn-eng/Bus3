'use client';

import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import { routes, formatPrice } from '@/lib/routes';

export default function RoutesPage() {
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
              <h1 className="ds-page-title">Routes</h1>
              <p className="ds-page-sub">
                All destinations we serve, with fares and travel times
              </p>
            </div>

            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Duration</th>
                    <th>Fare</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id}>
                      <td className="ds-cell-strong">{route.name}</td>
                      <td>{route.from}</td>
                      <td>{route.to}</td>
                      <td>{route.duration}</td>
                      <td className="ds-cell-price">{formatPrice(route.price)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href="/book-details"
                          className="ds-btn ds-btn-soft ds-btn-sm"
                        >
                          Book
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
 </AuthGate>

  );
}
