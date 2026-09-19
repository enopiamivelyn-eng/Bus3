'use client';

import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import { formatPrice } from '@/lib/routes';

interface Booking {
  id: string;
  route: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seatNumber: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';

  // Sample booking data
  const [bookings] = useState<Booking[]>([
    {
      id: 'BK001',
      route: 'Cebu-Bato',
      from: 'Cebu City',
      to: 'Bato',
      date: '2026-09-20',
      time: '08:00 AM',
      seatNumber: 'A12',
      price: 300,
      status: 'confirmed',
      bookingDate: '2026-09-14'
    },
    {
      id: 'BK002',
      route: 'Cebu-Oslob',
      from: 'Cebu City',
      to: 'Oslob',
      date: '2026-09-25',
      time: '10:30 AM',
      seatNumber: 'B05',
      price: 200,
      status: 'confirmed',
      bookingDate: '2026-09-13'
    },
    {
      id: 'BK003',
      route: 'Cebu-Boljoon',
      from: 'Cebu City',
      to: 'Boljoon',
      date: '2026-09-18',
      time: '02:00 PM',
      seatNumber: 'C08',
      price: 300,
      status: 'cancelled',
      bookingDate: '2026-09-10'
    },
  ]);

  const statusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'ds-badge-green';
      case 'pending':
        return 'ds-badge-amber';
      default:
        return 'ds-badge-red';
    }
  };

  return (
 <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />

          <main className="ds-page">
            <div className="ds-mb">
              <h1 className="ds-page-title">My Bookings</h1>
              <p className="ds-page-sub">View and manage your ticket bookings</p>
            </div>

            {bookings.length === 0 ? (
              <div className="ds-card ds-empty">
                <h3>No bookings yet</h3>
                <p>Start your journey by booking a ticket</p>
                <Link href="/book-details" className="ds-btn ds-btn-primary">
                  Book Now
                </Link>
              </div>
            ) : (
              <div className="ds-list">
                {bookings.map((booking) => (
                  <article key={booking.id} className="ds-row">
                    <div className="ds-row-thumb" aria-hidden="true">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2.5" y="5" width="19" height="12" rx="2.5" />
                        <path d="M2.5 11h19" />
                        <circle cx="7" cy="19" r="1.7" />
                        <circle cx="17" cy="19" r="1.7" />
                      </svg>
                    </div>

                    <div className="ds-row-main">
                      <h3 className="ds-row-route">
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M10 17.5s5.5-4.6 5.5-8.8A5.5 5.5 0 0 0 4.5 8.7c0 4.2 5.5 8.8 5.5 8.8Z" />
                        </svg>
                        {booking.from} → {booking.to}
                      </h3>
                      <div className="ds-row-meta">
                        <span>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <rect x="3.5" y="4.5" width="13" height="12" rx="2.5" />
                            <path d="M7 3v3M13 3v3M3.5 9h13" />
                          </svg>
                          {booking.date}
                        </span>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <circle cx="10" cy="10" r="7" />
                            <path d="M10 6v4l2.5 1.5" />
                          </svg>
                          {booking.time}
                        </span>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M5 4v8a2 2 0 0 0 2 2h6" />
                            <path d="M5 16h10" />
                          </svg>
                          Seat {booking.seatNumber}
                        </span>
                        <span>Booked on {booking.bookingDate}</span>
                      </div>
                    </div>

                    <div className="ds-row-aside">
                      <span className={`ds-badge ${statusClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className="ds-row-fare">{formatPrice(booking.price)}</span>
                    </div>

                    <div className="ds-row-actions">
                      {booking.status === 'confirmed' && (
                        <>
                          <Link href="/reservation" className="ds-btn ds-btn-soft ds-btn-sm">
                            View Ticket
                          </Link>
                          <button type="button" className="ds-btn ds-btn-outline ds-btn-sm">
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'pending' && (
                        <Link href="/payment" className="ds-btn ds-btn-primary ds-btn-sm">
                          Pay Now
                        </Link>
                      )}
                      {booking.status === 'cancelled' && (
                        <Link href="/book-details" className="ds-btn ds-btn-primary ds-btn-sm">
                          Rebook
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
 </AuthGate>

  );
}
