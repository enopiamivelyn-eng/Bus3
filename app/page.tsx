import Image from 'next/image';
import Link from 'next/link';
import GuestNavbar from './components/GuestNavbar';
import { popularRoutes, formatPrice } from '@/lib/routes';

const heroFeatures = [
  {
    title: 'Safe & Secure',
    text: 'Your data is protected',
    icon: (
      <>
        <path d="M10 2.5 16 5v5c0 4-2.6 6.6-6 7.5-3.4-.9-6-3.5-6-7.5V5Z" />
        <path d="M7.4 10l1.9 1.9L13 8.3" />
      </>
    ),
  },
  {
    title: 'Real-Time Booking',
    text: 'Live seat availability',
    icon: (
      <>
        <circle cx="10" cy="10" r="7.2" />
        <path d="M10 6v4l2.6 1.6" />
      </>
    ),
  },
  {
    title: 'Nationwide Routes',
    text: 'Across the Philippines',
    icon: (
      <>
        <path d="M10 17.5s5.5-4.6 5.5-8.8A5.5 5.5 0 0 0 4.5 8.7c0 4.2 5.5 8.8 5.5 8.8Z" />
        <circle cx="10" cy="8.6" r="1.9" />
      </>
    ),
  },
];

const infoStrip = [
  { label: 'Live Booking', text: 'Bookings happening now', icon: 'ticket' },
  { label: 'Available Seats', text: '184 seats left today', icon: 'seat' },
  { label: 'Popular Routes', text: 'Cebu → Davao · Manila → Baguio', icon: 'pin' },
  { label: 'System Online', text: 'Real-time updates', icon: 'signal' },
];

const infoIcons: Record<string, React.ReactNode> = {
  ticket: (
    <>
      <path d="M3 8.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.5" />
      <path d="M3 8.5a1.8 1.8 0 0 0 0 3V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2.5a1.8 1.8 0 0 1 0-3" />
    </>
  ),
  seat: (
    <>
      <path d="M5 4v8a2 2 0 0 0 2 2h6" />
      <path d="M5 16h10" />
      <path d="M14 8h1.5A1.5 1.5 0 0 1 17 9.5V16" />
    </>
  ),
  pin: (
    <>
      <path d="M10 17.5s5.5-4.6 5.5-8.8A5.5 5.5 0 0 0 4.5 8.7c0 4.2 5.5 8.8 5.5 8.8Z" />
      <circle cx="10" cy="8.6" r="1.9" />
    </>
  ),
  signal: (
    <>
      <path d="M4 14V9M8 14V5M12 14v-3M16 14v-6" />
    </>
  ),
};

export default function LandingPage() {
  return (
    <div className="ds-app">
      <GuestNavbar />

      {/* No sidebar: a visitor who has not logged in gets a single column.
          The hero is full-bleed; everything below it is centred. */}
      <main className="ds-landing">
        {/* Public hero — the login form now lives on /login */}
        <section className="ds-hero ds-hero-full">
            <div className="ds-hero-scenery">
              <Image src="/hero-bus-bg.webp" alt="" fill priority sizes="100vw" />
            </div>

            <div className="ds-hero-copy">
              <h1 className="ds-hero-heading">
                Travel Made
                <br />
                Easier
              </h1>
              <p className="ds-hero-sub">Book Your Bus Tickets Anytime, Anywhere</p>

              <ul className="ds-hero-features">
                {heroFeatures.map((feature) => (
                  <li key={feature.title} className="ds-hero-feature">
                    <span className="ds-hero-feature-icon" aria-hidden="true">
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {feature.icon}
                      </svg>
                    </span>
                    <span className="ds-hero-feature-text">
                      <strong>{feature.title}</strong>
                      <span>{feature.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

        </section>

        <div className="ds-landing-inner">
          {/* Live status strip */}
          <section className="ds-info-strip ds-mb">
            {infoStrip.map((item) => (
              <div key={item.label} className="ds-info-item">
                <span className="ds-info-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {infoIcons[item.icon]}
                  </svg>
                </span>
                <span className="ds-info-text">
                  <strong>{item.label}</strong>
                  <span>{item.text}</span>
                </span>
              </div>
            ))}
          </section>

          {/* Popular routes */}
          <div className="ds-section-head">
            <div>
              <h2 className="ds-section-title">Popular Routes</h2>
              <p className="ds-section-sub">Fares shown are per passenger, one way</p>
            </div>
            <Link href="/routes" className="ds-link">
              View All
            </Link>
          </div>

          <div className="ds-route-grid ds-mb">
            {popularRoutes.map((route) => (
              <Link key={route.id} href="/book-details" className="ds-route-card">
                <div className="ds-route-media">
                  <div className="ds-route-media-fallback">
                    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="5" width="19" height="12" rx="2.5" />
                      <path d="M2.5 11h19" />
                      <circle cx="7" cy="19" r="1.7" />
                      <circle cx="17" cy="19" r="1.7" />
                    </svg>
                  </div>
                </div>
                <div className="ds-route-body">
                  <span className="ds-route-name">
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M10 17.5s5.5-4.6 5.5-8.8A5.5 5.5 0 0 0 4.5 8.7c0 4.2 5.5 8.8 5.5 8.8Z" />
                    </svg>
                    {route.from} → {route.to}
                  </span>
                  <span className="ds-route-meta">
                    <span className="ds-route-price">{formatPrice(route.price)}</span>
                    <span className="ds-route-duration">{route.duration}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="ds-card ds-card-pad">
            <div className="ds-card-head">
              <div>
                <h2 className="ds-card-title">Ready to travel?</h2>
                <p className="ds-card-sub">
                  Hold a seat now and pay at the terminal, no account needed.
                </p>
              </div>
              <Link href="/reserve" className="ds-btn ds-btn-primary">
                Reserve Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
