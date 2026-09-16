'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isAuthenticated?: boolean;
  username?: string;
}

export default function Sidebar({ isAuthenticated = false, username }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="sidebar">
      {/* Logo and Title */}
      <div className="sidebar-header">
        <div className="logo">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" fill="#1a1a4d" stroke="#fff" strokeWidth="2"/>
            <path d="M20 25 L40 25 L38 35 L22 35 Z" fill="#fff"/>
            <circle cx="25" cy="38" r="3" fill="#fff"/>
            <circle cx="35" cy="38" r="3" fill="#fff"/>
          </svg>
        </div>
        <h1 className="sidebar-title">Bus Ticketing</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <Link 
          href="/" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`nav-item ${isActive('/about') ? 'active' : ''}`}
        >
          About Us
        </Link>
        <Link 
          href="/bookings" 
          className={`nav-item ${isActive('/bookings') ? 'active' : ''}`}
        >
          My Bookings
        </Link>
        <Link 
          href="/book-details" 
          className={`nav-item ${isActive('/book-details') ? 'active' : ''}`}
        >
          Book Details
        </Link>
        <Link 
          href="/reservation" 
          className={`nav-item ${isActive('/reservation') ? 'active' : ''}`}
        >
          My Reservation
        </Link>
        <Link 
          href="/profile" 
          className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
        >
          Profile
        </Link>
      </nav>

      {/* Bus Graphic */}
      <div className="sidebar-bus">
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          {/* Bus body */}
          <rect x="20" y="60" width="140" height="80" rx="8" fill="#1a1a4d"/>
          <rect x="25" y="65" width="130" height="70" rx="6" fill="#2563eb"/>
          
          {/* Windows */}
          <rect x="35" y="75" width="35" height="30" rx="3" fill="#93c5fd" opacity="0.6"/>
          <rect x="80" y="75" width="35" height="30" rx="3" fill="#93c5fd" opacity="0.6"/>
          <rect x="125" y="75" width="20" height="30" rx="3" fill="#93c5fd" opacity="0.6"/>
          
          {/* Wheels */}
          <circle cx="50" cy="145" r="15" fill="#1a1a4d"/>
          <circle cx="50" cy="145" r="10" fill="#4b5563"/>
          <circle cx="130" cy="145" r="15" fill="#1a1a4d"/>
          <circle cx="130" cy="145" r="10" fill="#4b5563"/>
          
          {/* Headlights */}
          <rect x="155" y="85" width="8" height="12" rx="2" fill="#fbbf24"/>
          
          {/* Grille lines */}
          <line x1="150" y1="105" x2="160" y2="105" stroke="#cbd5e1" strokeWidth="2"/>
          <line x1="150" y1="110" x2="160" y2="110" stroke="#cbd5e1" strokeWidth="2"/>
          <line x1="150" y1="115" x2="160" y2="115" stroke="#cbd5e1" strokeWidth="2"/>
          <line x1="150" y1="120" x2="160" y2="120" stroke="#cbd5e1" strokeWidth="2"/>
        </svg>
      </div>

      {/* User Profile (if authenticated) */}
      {isAuthenticated && username && (
        <div className="sidebar-user">
          <div className="user-avatar"></div>
          <span className="username">{username}</span>
        </div>
      )}
    </aside>
  );
}
