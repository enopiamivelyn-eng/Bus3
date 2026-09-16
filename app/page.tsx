import Link from 'next/link';
import Sidebar from './components/Sidebar';

const popularRoutes = [
  { id: 1, from: 'Cebu', to: 'Bato', price: 300, duration: '5 hours' },
  { id: 2, from: 'Cebu', to: 'Bato', price: 300, duration: '5 hours' },
  { id: 3, from: 'Cebu', to: 'Bato', price: 300, duration: '5 hours' },
  { id: 4, from: 'Cebu', to: 'Bato', price: 300, duration: '5 hours' },
];

export default function Home() {
  return (
    <div className="main-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <Link href="/" className="logo-link">
              <div className="logo-small">
                <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="28" fill="#1a1a4d" stroke="#fff" strokeWidth="2"/>
                  <path d="M20 25 L40 25 L38 35 L22 35 Z" fill="#fff"/>
                  <circle cx="25" cy="38" r="3" fill="#fff"/>
                  <circle cx="35" cy="38" r="3" fill="#fff"/>
                </svg>
              </div>
              <span className="logo-text">Bus Ticketing</span>
            </Link>
          </div>
          
          <div className="header-right">
            <button className="search-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            <Link href="/signin" className="btn-outline">Sign in</Link>
            <Link href="/login" className="btn-primary">Log in</Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bus">
            <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
              {/* Bus shadow */}
              <ellipse cx="200" cy="240" rx="120" ry="20" fill="#000" opacity="0.2"/>
              
              {/* Bus body */}
              <path d="M80 120 L320 120 L310 200 L90 200 Z" fill="#1a1a4d"/>
              <path d="M85 125 L315 125 L306 195 L94 195 Z" fill="#2563eb"/>
              
              {/* Windows */}
              <rect x="100" y="140" width="60" height="40" rx="4" fill="#93c5fd" opacity="0.7"/>
              <rect x="170" y="140" width="60" height="40" rx="4" fill="#93c5fd" opacity="0.7"/>
              <rect x="240" y="140" width="50" height="40" rx="4" fill="#93c5fd" opacity="0.7"/>
              
              {/* Windshield */}
              <path d="M295 135 L310 135 L308 175 L298 175 Z" fill="#93c5fd" opacity="0.7"/>
              
              {/* Wheels */}
              <circle cx="120" cy="205" r="25" fill="#1a1a4d"/>
              <circle cx="120" cy="205" r="18" fill="#4b5563"/>
              <circle cx="120" cy="205" r="8" fill="#9ca3af"/>
              
              <circle cx="280" cy="205" r="25" fill="#1a1a4d"/>
              <circle cx="280" cy="205" r="18" fill="#4b5563"/>
              <circle cx="280" cy="205" r="8" fill="#9ca3af"/>
              
              {/* Headlights */}
              <rect x="310" y="145" width="12" height="20" rx="3" fill="#fbbf24"/>
              
              {/* Grille */}
              <rect x="305" y="170" width="15" height="2" rx="1" fill="#cbd5e1"/>
              <rect x="305" y="175" width="15" height="2" rx="1" fill="#cbd5e1"/>
              <rect x="305" y="180" width="15" height="2" rx="1" fill="#cbd5e1"/>
              <rect x="305" y="185" width="15" height="2" rx="1" fill="#cbd5e1"/>
              
              {/* Details */}
              <line x1="165" y1="125" x2="165" y2="195" stroke="#1e40af" strokeWidth="2"/>
              <line x1="235" y1="125" x2="235" y2="195" stroke="#1e40af" strokeWidth="2"/>
            </svg>
          </div>

          {/* Popular Routes */}
          <div className="popular-routes-section">
            <h2 className="section-title">Popular Routes</h2>
            
            <div className="routes-grid">
              {popularRoutes.map((route) => (
                <div key={route.id} className="route-card">
                  <div className="route-placeholder"></div>
                  <div className="route-info">
                    <p className="route-name">{route.from}-{route.to}</p>
                    <p className="route-price">₱{route.price}</p>
                    <p className="route-duration">{route.duration}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reserve-btn-container">
              <Link href="/reserve" className="btn-reserve">
                Reserve Now
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
