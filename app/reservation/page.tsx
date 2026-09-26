'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import QRCode from 'qrcode';

interface Booking {
  id: string;
  tripId: string;
  seatNumber: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  totalAmount: number;
  bookingDate: string;
  trip: {
    route: {
      name: string;
      fromCity: string;
      toCity: string;
    };
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    bus: {
      busNumber: string;
      model: string;
    };
  };
}

function ReservationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
        
        // Generate QR code
        const qrData = JSON.stringify({
          bookingId: data.booking.id,
          seatNumber: data.booking.seatNumber,
          route: data.booking.trip.route.name,
          date: data.booking.trip.departureDate,
          time: data.booking.trip.departureTime
        });
        
        QRCode.toDataURL(qrData, (err, url) => {
          if (err) console.error('QR Code generation error:', err);
          else setQrCodeUrl(url);
        });
      } else {
        setError('Failed to load booking details');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number): string => {
    return `₱${amount.toLocaleString('en-PH')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />
        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />
          <main className="ds-page">
            <div className="ds-empty">
              <div className="loading" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Loading ticket...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />
        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />
          <main className="ds-page">
            <div className="ds-empty">
              <h3>Booking not found</h3>
              <p>The booking you're looking for doesn't exist.</p>
              <button 
                onClick={() => router.push('/bookings')}
                className="ds-btn ds-btn-primary"
                style={{ marginTop: '1rem' }}
              >
                View My Bookings
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-app">
      <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

      <div className="ds-app-body">
        <Sidebar isAuthenticated username={username} />

        <main className="ds-page">
          <div className="ds-section-head">
            <div>
              <h1 className="ds-page-title">My Ticket</h1>
              <p className="ds-page-sub">
                Your e-ticket for the journey
              </p>
            </div>
          </div>

          {error && (
            <div className="ds-alert ds-alert-error ds-mb">
              <span>{error}</span>
            </div>
          )}

          <div className="ds-list">
            <article className="ds-card">
              <div className="ds-ticket-banner">
                <div>
                  <h2>E-Ticket</h2>
                  <p>Booking ID: {booking.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <span
                  className={`ds-badge ${
                    booking.paymentStatus === 'paid'
                      ? 'ds-badge-green'
                      : 'ds-badge-amber'
                  }`}
                >
                  {booking.paymentStatus === 'paid'
                    ? 'Paid'
                    : 'Pending Payment'}
                </span>
              </div>

              <div className="ds-card-pad">
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 className="ds-subhead" style={{ marginTop: 0 }}>
                      Journey Details
                    </h3>
                    <div className="ds-detail-grid">
                      <div>
                        <span className="ds-detail-label">Route</span>
                        <span className="ds-detail-value">{booking.trip.route.name}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">From</span>
                        <span className="ds-detail-value">{booking.trip.route.fromCity}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">To</span>
                        <span className="ds-detail-value">{booking.trip.route.toCity}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">Date</span>
                        <span className="ds-detail-value">{formatDate(booking.trip.departureDate)}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">Departure Time</span>
                        <span className="ds-detail-value">{booking.trip.departureTime}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">Arrival Time</span>
                        <span className="ds-detail-value">{booking.trip.arrivalTime}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">Seat Number</span>
                        <span className="ds-detail-value is-price">
                          {booking.seatNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {qrCodeUrl && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        style={{ width: '150px', height: '150px', border: '2px solid #fff', borderRadius: '8px' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                        Scan for verification
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="ds-subhead">Passenger Information</h3>
                <div className="ds-detail-grid">
                  <div>
                    <span className="ds-detail-label">Name</span>
                    <span className="ds-detail-value">
                      {booking.passengerName}
                    </span>
                  </div>
                  <div>
                    <span className="ds-detail-label">Contact</span>
                    <span className="ds-detail-value">
                      {booking.passengerPhone}
                    </span>
                  </div>
                  <div>
                    <span className="ds-detail-label">Email</span>
                    <span className="ds-detail-value">{booking.passengerEmail}</span>
                  </div>
                </div>

                <h3 className="ds-subhead">Bus Information</h3>
                <div className="ds-detail-grid">
                  <div>
                    <span className="ds-detail-label">Bus Number</span>
                    <span className="ds-detail-value">
                      {booking.trip.bus.busNumber}
                    </span>
                  </div>
                  <div>
                    <span className="ds-detail-label">Bus Model</span>
                    <span className="ds-detail-value">
                      {booking.trip.bus.model}
                    </span>
                  </div>
                  <div>
                    <span className="ds-detail-label">Total Amount</span>
                    <span className="ds-detail-value is-price">
                      {formatPrice(booking.totalAmount)}
                    </span>
                  </div>
                  {booking.paymentMethod && (
                    <div>
                      <span className="ds-detail-label">Payment Method</span>
                      <span className="ds-detail-value">
                        {booking.paymentMethod}
                      </span>
                    </div>
                  )}
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
                    <button 
                      type="button" 
                      onClick={() => {
                        if (qrCodeUrl) {
                          const link = document.createElement('a');
                          link.href = qrCodeUrl;
                          link.download = `ticket-${booking.id}.png`;
                          link.click();
                        }
                      }}
                      className="ds-btn ds-btn-soft ds-btn-sm"
                    >
                      Download QR
                    </button>
                    <button 
                      type="button"
                      onClick={() => router.push('/bookings')}
                      className="ds-btn ds-btn-outline ds-btn-sm"
                    >
                      View My Bookings
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <AuthGate>
      <Suspense fallback={
        <div className="ds-app">
          <Navbar user={{ name: 'Traveller', role: 'Passenger' }} />
          <div className="ds-app-body">
            <Sidebar isAuthenticated username="Traveller" />
            <main className="ds-page">
              <div className="ds-empty">
                <div className="loading" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Loading...</p>
              </div>
            </main>
          </div>
        </div>
      }>
        <ReservationContent />
      </Suspense>
    </AuthGate>
  );
}
