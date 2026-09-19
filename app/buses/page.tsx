'use client';

import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';

const fleet = [
  { id: 'CB-2025', model: 'MAN Lion’s Coach', seats: 49, route: 'Cebu → Bato', status: 'On trip' },
  { id: 'CO-1820', model: 'Higer KLQ6122', seats: 45, route: 'Cebu → Oslob', status: 'Available' },
  { id: 'CB-1104', model: 'Yutong ZK6122', seats: 49, route: 'Cebu → Boljoon', status: 'Available' },
  { id: 'CD-0731', model: 'Golden Dragon', seats: 43, route: 'Cebu → Dalaguete', status: 'Maintenance' },
];

const statusClass = (status: string) => {
  if (status === 'Available') return 'ds-badge-green';
  if (status === 'On trip') return 'ds-badge-blue';
  return 'ds-badge-amber';
};

export default function BusesPage() {
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
              <h1 className="ds-page-title">Buses</h1>
              <p className="ds-page-sub">Fleet status and seat capacity</p>
            </div>

            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Bus No.</th>
                    <th>Model</th>
                    <th>Seats</th>
                    <th>Assigned Route</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {fleet.map((bus) => (
                    <tr key={bus.id}>
                      <td className="ds-cell-strong">{bus.id}</td>
                      <td>{bus.model}</td>
                      <td>{bus.seats}</td>
                      <td>{bus.route}</td>
                      <td>
                        <span className={`ds-badge ${statusClass(bus.status)}`}>
                          {bus.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href="/book-details"
                          className="ds-btn ds-btn-soft ds-btn-sm"
                        >
                          Book seat
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
