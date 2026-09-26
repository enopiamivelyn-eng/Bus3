'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';

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
  };
}

const methods = [
  {
    id: 'gcash',
    title: 'GCash',
    text: 'Pay instantly with your GCash wallet',
    icon: (
      <>
        <rect x="5" y="3" width="10" height="14" rx="2" />
        <path d="M9 15h2" />
      </>
    ),
  },
  {
    id: 'maya',
    title: 'Maya',
    text: 'Use your Maya wallet or linked card',
    icon: (
      <>
        <rect x="3" y="5" width="14" height="10" rx="2" />
        <path d="M3 9h14" />
      </>
    ),
  },
  {
    id: 'terminal',
    title: 'Pay at Terminal',
    text: 'Reserve now and settle the fare at the counter',
    icon: (
      <>
        <path d="M4 16V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
        <path d="M3 16h14" />
      </>
    ),
  },
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';
  
  const [method, setMethod] = useState('gcash');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      } else {
        setError('Failed to load booking details');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;
    
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentMethod: method,
          status: 'confirmed'
        })
      });

      if (response.ok) {
        router.push(`/reservation?bookingId=${booking.id}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number): string => {
    return `₱${amount.toLocaleString('en-PH')}`;
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
              <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Loading booking details...</p>
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
          <div className="ds-mb">
            <h1 className="ds-page-title">Payment</h1>
            <p className="ds-page-sub">
              Complete your booking to secure your seats
            </p>
          </div>

          {error && (
            <div className="ds-alert ds-alert-error ds-mb">
              <span>{error}</span>
            </div>
          )}

          <div className="ds-pay-grid">
            {/* Left: summary + method */}
            <section className="ds-card ds-card-pad">
              <div className="ds-card-head">
                <h2 className="ds-card-title">Booking Summary</h2>
              </div>

              <div className="ds-detail-grid">
                <div>
                  <span className="ds-detail-label">Route</span>
                  <span className="ds-detail-value">
                    {booking.trip.route.fromCity} → {booking.trip.route.toCity}
                  </span>
                </div>
                <div>
                  <span className="ds-detail-label">Departure</span>
                  <span className="ds-detail-value">{booking.trip.departureDate} · {booking.trip.departureTime}</span>
                </div>
                <div>
                  <span className="ds-detail-label">Seats</span>
                  <span className="ds-detail-value">{booking.seatNumber}</span>
                </div>
                <div>
                  <span className="ds-detail-label">Passenger</span>
                  <span className="ds-detail-value">{booking.passengerName}</span>
                </div>
              </div>

              <div className="ds-pay-total">
                <span className="ds-detail-label" style={{ margin: 0 }}>
                  Total Amount
                </span>
                <strong>{formatPrice(booking.totalAmount)}</strong>
              </div>

              <h3 className="ds-subhead" style={{ marginTop: 0 }}>
                Select Payment Method
              </h3>

              <div className="ds-methods">
                {methods.map((option) => (
                  <label
                    key={option.id}
                    className={`ds-method ${
                      method === option.id ? 'is-selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={option.id}
                      checked={method === option.id}
                      onChange={() => setMethod(option.id)}
                    />
                    <span className="ds-method-icon" aria-hidden="true">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {option.icon}
                      </svg>
                    </span>
                    <span className="ds-method-text">
                      <strong>{option.title}</strong>
                      <span>{option.text}</span>
                    </span>
                  </label>
                ))}
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="ds-btn ds-btn-primary ds-btn-block"
              >
                {isProcessing ? 'Processing...' : `Pay ${formatPrice(booking.totalAmount)}`}
              </button>
            </section>

            {/* Right: how it works */}
            <section className="ds-card ds-card-pad">
              <div className="ds-card-head">
                <h2 className="ds-card-title">Payment Instructions</h2>
              </div>

              <ol className="ds-steps">
                <li>
                  <span>1</span>
                  Select your preferred payment method on the left.
                </li>
                <li>
                  <span>2</span>
                  Complete the payment using your GCash or Maya wallet.
                </li>
                <li>
                  <span>3</span>
                  Wait for confirmation — your e-ticket is issued right after.
                </li>
              </ol>

              <div className="ds-secure">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 2.5 16 5v5c0 4-2.6 6.6-6 7.5-3.4-.9-6-3.5-6-7.5V5Z" />
                  <path d="M7.4 10l1.9 1.9L13 8.3" />
                </svg>
                <span>
                  Your payment is secure and guaranteed. Nothing is charged
                  until you confirm the transaction.
                </span>
              </div>

              <div className="ds-note" style={{ marginTop: '1.2rem' }}>
                This is a demo payment flow. In production, this would integrate
                with actual payment gateways like GCash and Maya.
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function PaymentPage() {
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
        <PaymentContent />
      </Suspense>
    </AuthGate>
  );
}
