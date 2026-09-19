'use client';

import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';

const users = [
  { name: 'Juan Dela Cruz', email: 'juan.delacruz@email.com', role: 'Passenger', bookings: 12, status: 'Active' },
  { name: 'Maria Santos', email: 'maria.santos@email.com', role: 'Passenger', bookings: 7, status: 'Active' },
  { name: 'Pedro Reyes', email: 'pedro.reyes@email.com', role: 'Conductor', bookings: 0, status: 'Active' },
  { name: 'Ana Lim', email: 'ana.lim@email.com', role: 'Passenger', bookings: 3, status: 'Suspended' },
];

export default function UsersPage() {
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
              <h1 className="ds-page-title">Users</h1>
              <p className="ds-page-sub">Accounts registered on the platform</p>
            </div>

            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Bookings</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email}>
                      <td className="ds-cell-strong">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.bookings}</td>
                      <td>
                        <span
                          className={`ds-badge ${
                            user.status === 'Active'
                              ? 'ds-badge-green'
                              : 'ds-badge-red'
                          }`}
                        >
                          {user.status}
                        </span>
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
