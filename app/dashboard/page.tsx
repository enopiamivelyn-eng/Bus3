'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeBuses: number;
  totalRoutes: number;
  todayBookings: number;
  upcomingTrips: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const username = user?.name ?? 'Admin';
  
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeBuses: 0,
    totalRoutes: 0,
    todayBookings: 0,
    upcomingTrips: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    
    // Refresh stats every 30 seconds for real-time updates
    const interval = setInterval(fetchDashboardStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [bookingsRes, busesRes, routesRes, tripsRes] = await Promise.all([
        fetch('/api/bookings', { credentials: 'include' }),
        fetch('/api/admin/buses', { credentials: 'include' }),
        fetch('/api/routes', { credentials: 'include' }),
        fetch('/api/trips', { credentials: 'include' })
      ]);

      let totalBookings = 0;
      let totalRevenue = 0;
      let todayBookings = 0;
      const today = new Date().toISOString().split('T')[0];

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        const bookings = bookingsData.bookings || [];
        totalBookings = bookings.length;
        
        bookings.forEach((booking: any) => {
          if (booking.paymentStatus === 'paid') {
            totalRevenue += booking.totalAmount;
          }
          if (booking.bookingDate.startsWith(today)) {
            todayBookings++;
          }
        });
      }

      let activeBuses = 0;
      if (busesRes.ok) {
        const busesData = await busesRes.json();
        const buses = busesData.buses || [];
        activeBuses = buses.filter((bus: any) => bus.status === 'active').length;
      }

      let totalRoutes = 0;
      if (routesRes.ok) {
        const routesData = await routesRes.json();
        totalRoutes = (routesData.routes || []).length;
      }

      let upcomingTrips = 0;
      if (tripsRes.ok) {
        const tripsData = await tripsRes.json();
        const trips = tripsData.trips || [];
        upcomingTrips = trips.filter((trip: any) => 
          trip.status === 'scheduled' && trip.departureDate >= today
        ).length;
      }

      setStats({
        totalBookings,
        totalRevenue,
        activeBuses,
        totalRoutes,
        todayBookings,
        upcomingTrips
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number): string => {
    return `₱${amount.toLocaleString('en-PH')}`;
  };

  return (
    <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Admin', role: 'Administrator' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />

          <main className="ds-page">
            <div className="ds-mb">
              <h1 className="ds-page-title">Hello, {username}!</h1>
              <p className="ds-page-sub">Dashboard Overview</p>
            </div>

            {loading ? (
              <div className="ds-empty">
                <div className="loading" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Loading dashboard...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="ds-stats-grid ds-mb">
                  <div className="ds-stat-card">
                    <div className="ds-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3.5" />
                        <path d="M3 9.5a1.8 1.8 0 0 0 0 3V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.5a1.8 1.8 0 0 1 0-3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="ds-stat-value">{stats.totalBookings}</h3>
                      <p className="ds-stat-label">Total Bookings</p>
                    </div>
                  </div>

                  <div className="ds-stat-card">
                    <div className="ds-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="ds-stat-value">{formatPrice(stats.totalRevenue)}</h3>
                      <p className="ds-stat-label">Total Revenue</p>
                    </div>
                  </div>

                  <div className="ds-stat-card">
                    <div className="ds-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2.5" y="5" width="19" height="12" rx="2.5" />
                        <path d="M2.5 11h19" />
                        <circle cx="7" cy="19" r="1.7" />
                        <circle cx="17" cy="19" r="1.7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="ds-stat-value">{stats.activeBuses}</h3>
                      <p className="ds-stat-label">Active Buses</p>
                    </div>
                  </div>

                  <div className="ds-stat-card">
                    <div className="ds-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 17.5s5.5-4.6 5.5-8.8A5.5 5.5 0 0 0 4.5 8.7c0 4.2 5.5 8.8 5.5 8.8Z" />
                        <circle cx="10" cy="8.6" r="1.9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="ds-stat-value">{stats.totalRoutes}</h3>
                      <p className="ds-stat-label">Total Routes</p>
                    </div>
                  </div>

                  <div className="ds-stat-card">
                    <div className="ds-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="ds-stat-value">{stats.todayBookings}</h3>
                      <p className="ds-stat-label">Today's Bookings</p>
                    </div>
                  </div>

                  <div className="ds-stat-card">
                    <div className="ds-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 4v8a2 2 0 0 0 2 2h6" />
                        <path d="M5 16h10" />
                        <path d="M14 8h1.5A1.5 1.5 0 0 1 17 9.5V16" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="ds-stat-value">{stats.upcomingTrips}</h3>
                      <p className="ds-stat-label">Upcoming Trips</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="ds-section-head">
                  <div>
                    <h2 className="ds-section-title">Quick Actions</h2>
                    <p className="ds-section-sub">Manage your bus ticketing system</p>
                  </div>
                </div>

                <div className="ds-row ds-mb">
                  <Link href="/buses" className="ds-card ds-card-pad" style={{ flex: 1, textDecoration: 'none' }}>
                    <div className="ds-card-head">
                      <h3 className="ds-card-title">Manage Buses</h3>
                      <p className="ds-card-sub">Add, edit, or remove buses from your fleet</p>
                    </div>
                  </Link>

                  <Link href="/routes" className="ds-card ds-card-pad" style={{ flex: 1, textDecoration: 'none' }}>
                    <div className="ds-card-head">
                      <h3 className="ds-card-title">Manage Routes</h3>
                      <p className="ds-card-sub">Configure travel routes and pricing</p>
                    </div>
                  </Link>

                  <Link href="/trips" className="ds-card ds-card-pad" style={{ flex: 1, textDecoration: 'none' }}>
                    <div className="ds-card-head">
                      <h3 className="ds-card-title">Manage Trips</h3>
                      <p className="ds-card-sub">Schedule trips and manage availability</p>
                    </div>
                  </Link>
                </div>

                <div className="ds-row">
                  <Link href="/bookings" className="ds-card ds-card-pad" style={{ flex: 1, textDecoration: 'none' }}>
                    <div className="ds-card-head">
                      <h3 className="ds-card-title">View Bookings</h3>
                      <p className="ds-card-sub">See all customer bookings and reservations</p>
                    </div>
                  </Link>

                  <Link href="/users" className="ds-card ds-card-pad" style={{ flex: 1, textDecoration: 'none' }}>
                    <div className="ds-card-head">
                      <h3 className="ds-card-title">Manage Users</h3>
                      <p className="ds-card-sub">Administer user accounts and permissions</p>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
