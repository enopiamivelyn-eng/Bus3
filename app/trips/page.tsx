'use client';

import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import { formatPrice } from '@/lib/routes';

const trips = [
  { id: 'TR-0915-01', route: 'Cebu → Bato', date: 'Sep 5, 2025', time: '08:00 AM', bus: 'CB-2025', seats: '38 / 49', fare: 300, status: 'Scheduled' },
  { id: 'TR-0915-02', route: 'Cebu → Oslob', date: 'Sep 5, 2025', time: '10:30 AM', bus: 'CO-1820', seats: '21 / 45', fare: 200, status: 'Boarding' },
  { id: 'TR-0916-01', route: 'Cebu → Boljoon', date: 'Sep 6, 2025', time: '02:00 PM', bus: 'CB-1104', seats: '45 / 49', fare: 300, status: 'Scheduled' },
  { id: 'TR-0917-01', route: 'Cebu → Dalaguete', date: 'Sep 7, 2025', time: '07:30 AM', bus: 'CD-0731', seats: '12 / 43', fare: 300, status: 'Scheduled' },
];

const statusClass = (status: string) =>
  status === 'Boarding' ? 'ds-badge-amber' : 'ds-badge-blue';

export default function TripsPage() {
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
              <h1 className="ds-page-title">Trips</h1>
              <p className="ds-page-sub">Upcoming departures and seat availability</p>
            </div>

            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Departure</th>
                    <th>Bus</th>
                    <th>Seats left</th>
                    <th>Fare</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td className="ds-cell-strong">{trip.id}</td>
                      <td>{trip.route}</td>
                      <td>{trip.date}</td>
                      <td>{trip.time}</td>
                      <td>{trip.bus}</td>
                      <td>{trip.seats}</td>
                      <td className="ds-cell-price">{formatPrice(trip.fare)}</td>
                      <td>
                        <span className={`ds-badge ${statusClass(trip.status)}`}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ds-note ds-note-info" style={{ marginTop: '1.2rem' }}>
              Trip schedules are sample data — nothing here is persisted yet. See{' '}
              <Link href="/book-details" className="ds-link">
                Seats
              </Link>{' '}
              to pick a seat on a route.
            </div>
          </main>
        </div>
      </div>
 </AuthGate>

  );
}
