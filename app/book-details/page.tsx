'use client';

import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import { routes, timeSlots, formatPrice } from '@/lib/routes';

export default function BookDetailsPage() {
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';
  const [selectedRoute, setSelectedRoute] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [passengerName, setPassengerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');

  const selectedRouteData = routes.find((r) => r.id.toString() === selectedRoute);
  const totalPrice = selectedRouteData
    ? selectedRouteData.price * passengers
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      selectedRoute,
      travelDate,
      selectedTime,
      passengers,
      passengerName,
      contactNumber,
      email,
      totalPrice
    });
    alert('Booking submitted! Redirecting to payment...');
  };

  return (
 <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />

          <main className="ds-page">
            <div className="ds-mb">
              <h1 className="ds-page-title">Book Your Ticket</h1>
              <p className="ds-page-sub">
                Fill in the details to reserve your seat
              </p>
            </div>

            <div className="ds-pay-grid">
              <form onSubmit={handleSubmit} className="ds-form">
                {/* Trip details */}
                <div className="ds-card ds-card-pad">
                  <div className="ds-card-head">
                    <h2 className="ds-card-title">Trip Details</h2>
                  </div>

                  <div className="ds-form" style={{ gap: '0.9rem' }}>
                    <div className="ds-field">
                      <label htmlFor="route" className="ds-label">Select Route *</label>
                      <select
                        id="route"
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                        className="ds-select"
                        required
                      >
                        <option value="">Choose a route</option>
                        {routes.map((route) => (
                          <option key={route.id} value={route.id}>
                            {route.name} - {formatPrice(route.price)} ({route.duration})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="ds-trip-grid">
                      <div className="ds-field">
                        <label htmlFor="date" className="ds-label">Travel Date *</label>
                        <input
                          type="date"
                          id="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          className="ds-input"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="ds-field">
                        <label htmlFor="time" className="ds-label">Departure Time *</label>
                        <select
                          id="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="ds-select"
                          required
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div className="ds-field">
                        <label htmlFor="passengers" className="ds-label">Number of Passengers *</label>
                        <input
                          type="number"
                          id="passengers"
                          value={passengers}
                          onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                          className="ds-input"
                          min="1"
                          max="10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passenger information */}
                <div className="ds-card ds-card-pad">
                  <div className="ds-card-head">
                    <h2 className="ds-card-title">Passenger Information</h2>
                  </div>

                  <div className="ds-form" style={{ gap: '0.9rem' }}>
                    <div className="ds-field">
                      <label htmlFor="name" className="ds-label">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="ds-input"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="ds-trip-grid">
                      <div className="ds-field">
                        <label htmlFor="contact" className="ds-label">Contact Number *</label>
                        <input
                          type="tel"
                          id="contact"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          className="ds-input"
                          placeholder="+63 912 345 6789"
                          required
                        />
                      </div>

                      <div className="ds-field">
                        <label htmlFor="email" className="ds-label">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="ds-input"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking summary */}
                {selectedRouteData && (
                  <div className="ds-card ds-card-pad">
                    <div className="ds-card-head">
                      <h2 className="ds-card-title">Booking Summary</h2>
                    </div>

                    <div className="ds-detail-grid">
                      <div>
                        <span className="ds-detail-label">Route</span>
                        <span className="ds-detail-value">{selectedRouteData.name}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">From</span>
                        <span className="ds-detail-value">{selectedRouteData.from}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">To</span>
                        <span className="ds-detail-value">{selectedRouteData.to}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">Duration</span>
                        <span className="ds-detail-value">{selectedRouteData.duration}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">Price per ticket</span>
                        <span className="ds-detail-value">{formatPrice(selectedRouteData.price)}</span>
                      </div>
                      <div>
                        <span className="ds-detail-label">Passengers</span>
                        <span className="ds-detail-value">{passengers}</span>
                      </div>
                    </div>

                    <div className="ds-pay-total">
                      <span className="ds-detail-label" style={{ margin: 0 }}>
                        Total Amount
                      </span>
                      <strong>{formatPrice(totalPrice)}</strong>
                    </div>
                  </div>
                )}

                <div className="ds-row-actions">
                  <button
                    type="button"
                    className="ds-btn ds-btn-outline"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ds-btn ds-btn-primary">
                    Proceed to Payment
                  </button>
                </div>
              </form>

              {/* Guidelines */}
              <aside className="ds-card ds-card-pad">
                <div className="ds-card-head">
                  <h2 className="ds-card-title">Booking Guidelines</h2>
                </div>

                <ol className="ds-steps">
                  <li><span>1</span>Arrive at the terminal 30 minutes before departure.</li>
                  <li><span>2</span>Bring a valid ID for verification.</li>
                  <li><span>3</span>Tickets are non-transferable.</li>
                  <li><span>4</span>Cancellations must be made 24 hours in advance.</li>
                </ol>

                <div className="ds-note ds-note-info" style={{ marginTop: '1.2rem' }}>
                  Children under 3 travel free (no seat). Senior citizens and PWDs get a
                  20% discount. Maximum 2 bags per passenger (20kg total).
                </div>

                <h3 className="ds-subhead">Need Help?</h3>
                <div className="ds-contact-grid">
                  <div className="ds-contact-item">
                    <strong>Phone</strong>
                    <span>+63 123 456 7890</span>
                  </div>
                  <div className="ds-contact-item">
                    <strong>Email</strong>
                    <span>support@busticketing.com</span>
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
 </AuthGate>

  );
}
