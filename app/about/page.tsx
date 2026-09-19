import Link from 'next/link';
import GuestNavbar from '../components/GuestNavbar';

const pillars = [
  {
    title: 'Our Mission',
    text: 'To provide safe, comfortable, and reliable bus transportation services connecting communities across the region. We strive to make travel accessible and convenient for everyone.',
    icon: (
      <>
        <rect x="4" y="6" width="12" height="9" rx="2" />
        <path d="M4 10.5h12" />
        <circle cx="7" cy="17" r="1.4" />
        <circle cx="13" cy="17" r="1.4" />
      </>
    ),
  },
  {
    title: 'Our Values',
    text: 'Safety first, customer satisfaction, punctuality, and environmental responsibility guide everything we do. We are committed to excellence in every journey.',
    icon: (
      <>
        <path d="M10 2.5 16 5v5c0 4-2.6 6.6-6 7.5-3.4-.9-6-3.5-6-7.5V5Z" />
        <path d="M7.4 10l1.9 1.9L13 8.3" />
      </>
    ),
  },
  {
    title: 'Our Team',
    text: 'Professional drivers and staff dedicated to your comfort and safety. With years of experience, our team ensures every trip is smooth and enjoyable.',
    icon: (
      <>
        <circle cx="8" cy="7" r="3" />
        <path d="M3.5 16.5c0-2.5 2-4.2 4.5-4.2s4.5 1.7 4.5 4.2" />
        <path d="M13.5 5.2a3 3 0 0 1 0 5.6" />
        <path d="M14.5 12.6c1.6.4 2.7 1.5 2.7 3.2" />
      </>
    ),
  },
];

const reasons = [
  { title: 'Modern Fleet', text: 'Well-maintained buses with comfortable seating and air conditioning.' },
  { title: 'Online Booking', text: 'Easy and convenient ticket booking from anywhere.' },
  { title: 'Multiple Routes', text: 'Wide network covering major destinations.' },
  { title: 'Affordable Prices', text: 'Competitive rates without compromising quality.' },
];

export default function AboutPage() {
  return (
    <div className="ds-app">
      <GuestNavbar />

      <main className="ds-landing">
        <div className="ds-landing-inner">
          <div className="ds-mb">
            <h1 className="ds-page-title">About Us</h1>
            <p className="ds-page-sub">Your trusted partner for bus travel</p>
          </div>

          <div className="ds-feature-grid ds-mb">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="ds-feature">
                <span className="ds-feature-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {pillar.icon}
                  </svg>
                </span>
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="ds-section-head">
            <div>
              <h2 className="ds-section-title">Why Choose Bus Ticketing?</h2>
              <p className="ds-section-sub">What passengers tell us matters most</p>
            </div>
          </div>

          <div className="ds-feature-grid ds-mb">
            {reasons.map((reason) => (
              <article key={reason.title} className="ds-feature">
                <span className="ds-feature-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                </span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="ds-section-head">
            <div>
              <h2 className="ds-section-title">Contact Information</h2>
            </div>
          </div>

          <div className="ds-contact-grid">
            <div className="ds-contact-item">
              <strong>Phone</strong>
              <span>+63 123 456 7890</span>
            </div>
            <div className="ds-contact-item">
              <strong>Email</strong>
              <span>info@busticketing.com</span>
            </div>
            <div className="ds-contact-item">
              <strong>Address</strong>
              <span>123 Main Street, Cebu City, Philippines</span>
            </div>
            <div className="ds-contact-item">
              <strong>Hours</strong>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
