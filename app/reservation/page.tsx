'use client';

import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import { formatPrice } from '@/lib/routes';

interface Reservation {
  id: string;
  reservationCode: string;
  route: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seatNumber: string;
  price: number;
  status: 'active' | 'upcoming' | 'completed';
  passengerName: string;
  contactNumber: string;
  email: string;
  busNumber: string;
  terminal: string;
  paymentStatus: 'paid' | 'pending';
}

export default function ReservationPage() {
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Sample reservation data
  const [reservations] = useState<Reservation[]>([
    {
      id: 'RSV001',
      reservationCode: 'BT2026-091420-001',
      route: 'Cebu-Bato',
      from: 'Cebu City Terminal',
      to: 'Bato Bus Station',
      date: '2026-09-20',
      time: '08:00 AM',
      seatNumber: 'A12',
      price: 300,
      status: 'upcoming',
      passengerName: 'Juan Dela Cruz',
      contactNumber: '+63 912 345 6789',
      email: 'juan@email.com',
      busNumber: 'CB-2025',
      terminal: 'South Bus Terminal, Cebu City',
      paymentStatus: 'paid'
    },
    {
      id: 'RSV002',
      reservationCode: 'BT2026-091425-002',
      route: 'Cebu-Oslob',
      from: 'Cebu City Terminal',
      to: 'Oslob Bus Station',
      date: '2026-09-25',
      time: '10:30 AM',
      seatNumber: 'B05',
      price: 200,
      status: 'upcoming',
      passengerName: 'Juan Dela Cruz',
      contactNumber: '+63 912 345 6789',
      email: 'juan@email.com',
      busNumber: 'CO-1820',
      terminal: 'South Bus Terminal, Cebu City',
      paymentStatus: 'paid'
    },
  ]);

  const filteredReservations = reservations.filter(reservation => {
    if (activeFilter === 'all') return true;
    return reservation.status === activeFilter;
  });

  return (
 <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />

          <main className="ds-page">
            <div className="ds-section-head">
              <div>
                <h1 className="ds-page-title">My Reservations</h1>
                <p className="ds-page-sub">
                  View and manage your active reservations
                </p>
              </div>

              <div className="ds-tabs">
                <button
                  type="button"
                  className={`ds-tab ${activeFilter === 'all' ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All Reservations
                </button>
                <button
                  type="button"
                  className={`ds-tab ${activeFilter === 'upcoming' ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  className={`ds-tab ${activeFilter === 'completed' ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>

            {filteredReservations.length === 0 ? (
              <div className="ds-card ds-empty">
                <h3>No reservations found</h3>
                <p>Book a ticket to see your reservations here</p>
                <Link href="/book-details" className="ds-btn ds-btn-primary">
                  Book Now
                </Link>
              </div>
            ) : (
              <div className="ds-list">
                {filteredReservations.map((reservation) => (
                  <article key={reservation.id} className="ds-card">
                    <div className="ds-ticket-banner">
                      <div>
                        <h2>E-Ticket</h2>
                        <p>{reservation.reservationCode}</p>
                      </div>
                      <span
                        className={`ds-badge ${
                          reservation.paymentStatus === 'paid'
                            ? 'ds-badge-green'
                            : 'ds-badge-amber'
                        }`}
                      >
                        {reservation.paymentStatus === 'paid'
                          ? 'Paid'
                          : 'Pending Payment'}
                      </span>
                    </div>

                    <div className="ds-card-pad">
                      <h3 className="ds-subhead" style={{ marginTop: 0 }}>
                        Journey Details
                      </h3>
                      <div className="ds-detail-grid">
                        <div>
                          <span className="ds-detail-label">Route</span>
                          <span className="ds-detail-value">{reservation.route}</span>
                        </div>
                        <div>
                          <span className="ds-detail-label">From</span>
                          <span className="ds-detail-value">{reservation.from}</span>
                        </div>
                        <div>
                          <span className="ds-detail-label">To</span>
                          <span className="ds-detail-value">{reservation.to}</span>
                        </div>
                        <div>
                          <span className="ds-detail-label">Date</span>
                          <span className="ds-detail-value">{reservation.date}</span>
                        </div>
                        <div>
                          <span className="ds-detail-label">Departure Time</span>
                          <span className="ds-detail-value">{reservation.time}</span>
                        </div>
                        <div>
                          <span className="ds-detail-label">Seat Number</span>
                          <span className="ds-detail-value is-price">
                            {reservation.seatNumber}
                          </span>
                        </div>
                      </div>

                      <h3 className="ds-subhead">Passenger Information</h3>
                      <div className="ds-detail-grid">
                        <div>
                          <span className="ds-detail-label">Name</span>
                          <span className="ds-detail-value">
                            {reservation.passengerName}
                          </span>
                        </div>
                        <div>
                          <span className="ds-detail-label">Contact</span>
                          <span className="ds-detail-value">
                            {reservation.contactNumber}
                          </span>
                        </div>
                        <div>
                          <span className="ds-detail-label">Email</span>
                          <span className="ds-detail-value">{reservation.email}</span>
                        </div>
                      </div>

                      <h3 className="ds-subhead">Bus Information</h3>
                      <div className="ds-detail-grid">
                        <div>
                          <span className="ds-detail-label">Bus Number</span>
                          <span className="ds-detail-value">
                            {reservation.busNumber}
                          </span>
                        </div>
                        <div>
                          <span className="ds-detail-label">Terminal</span>
                          <span className="ds-detail-value">
                            {reservation.terminal}
                          </span>
                        </div>
                        <div>
                          <span className="ds-detail-label">Fare</span>
                          <span className="ds-detail-value is-price">
                            {formatPrice(reservation.price)}
                          </span>
                        </div>
                      </div>

                      <div
                        className="ds-note ds-note-info"
                        style={{ marginTop: '1.4rem' }}
                      >
                        <strong>Important reminders:</strong> arrive 30 minutes
                        before departure, bring a valid ID for verification, and
                        present this e-ticket (printed or digital) at the terminal.
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.7rem',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '1.2rem',
                        }}
                      >
                        <span className="ds-detail-value" style={{ fontSize: '0.85rem' }}>
                          Emergency Contact: +63 123 456 7890
                        </span>
                        <div className="ds-row-actions">
                          <button type="button" className="ds-btn ds-btn-soft ds-btn-sm">
                            Download
                          </button>
                          <button type="button" className="ds-btn ds-btn-outline ds-btn-sm">
                            Modify
                          </button>
                          <button type="button" className="ds-btn ds-btn-outline ds-btn-sm">
                            Cancel
                          </button>
                        </div>
                      </div>
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
