'use client';

import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';
  
  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '+63 912 345 6789',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street, Cebu City',
    city: 'Cebu City',
    postalCode: '6000',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    bookingReminders: true,
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password changed');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
 <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />

          <main className="ds-page">
            <div className="ds-mb">
              <h1 className="ds-page-title">Settings</h1>
              <p className="ds-page-sub">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="ds-form" style={{ gap: '1.2rem' }}>
              {/* Profile banner */}
              <div className="ds-profile-banner">
                <div className="ds-profile-identity">
                  <span className="ds-profile-avatar" aria-hidden="true">
                    <svg width="38" height="38" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="10" cy="7" r="3.2" />
                      <path d="M4.5 17c0-3 2.4-5 5.5-5s5.5 2 5.5 5" />
                    </svg>
                  </span>
                  <div>
                    <h2>
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p>{profileData.email}</p>
                  </div>
                </div>

                <div className="ds-profile-stats">
                  <div className="ds-profile-stat">
                    <strong>12</strong>
                    <span>Total Bookings</span>
                  </div>
                  <div className="ds-profile-stat">
                    <strong>2</strong>
                    <span>Upcoming Trips</span>
                  </div>
                  <div className="ds-profile-stat">
                    <strong>450</strong>
                    <span>Points Earned</span>
                  </div>
                </div>
              </div>

              {/* Personal information */}
              <div className="ds-card ds-card-pad">
                <div className="ds-card-head">
                  <h2 className="ds-card-title">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      type="button"
                      className="ds-btn ds-btn-primary ds-btn-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="ds-btn ds-btn-outline ds-btn-sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="ds-form">
                  <div className="ds-trip-grid">
                    <div className="ds-field">
                      <label htmlFor="firstName" className="ds-label">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="ds-input"
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="ds-field">
                      <label htmlFor="lastName" className="ds-label">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="ds-input"
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  <div className="ds-trip-grid">
                    <div className="ds-field">
                      <label htmlFor="email" className="ds-label">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="ds-input"
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="ds-field">
                      <label htmlFor="phone" className="ds-label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="ds-input"
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  <div className="ds-trip-grid">
                    <div className="ds-field">
                      <label htmlFor="dob" className="ds-label">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                        className="ds-input"
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="ds-field">
                      <label htmlFor="city" className="ds-label">City</label>
                      <input
                        type="text"
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        className="ds-input"
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  <div className="ds-field">
                    <label htmlFor="address" className="ds-label">Address</label>
                    <input
                      type="text"
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="ds-input"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  {isEditing && (
                    <div className="ds-row-actions">
                      <button type="submit" className="ds-btn ds-btn-primary">
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Password Change */}
              <div className="ds-card ds-card-pad">
                <div className="ds-card-head">
                  <h2 className="ds-card-title">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="ds-form">
                  <div className="ds-field">
                    <label htmlFor="currentPassword" className="ds-label">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="ds-input"
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="ds-trip-grid">
                    <div className="ds-field">
                      <label htmlFor="newPassword" className="ds-label">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="ds-input"
                        placeholder="Enter new password"
                        required
                      />
                    </div>

                    <div className="ds-field">
                      <label htmlFor="confirmPassword" className="ds-label">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="ds-input"
                        placeholder="Re-enter new password"
                        required
                      />
                    </div>
                  </div>

                  <div className="ds-row-actions">
                    <button type="submit" className="ds-btn ds-btn-primary">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Notification Preferences */}
              <div className="ds-card ds-card-pad">
                <div className="ds-card-head">
                  <h2 className="ds-card-title">Notification Preferences</h2>
                </div>

                <div className="ds-list">
                  <div className="ds-pref">
                    <div className="ds-pref-info">
                      <h3>Email Notifications</h3>
                      <p>Receive booking confirmations and updates via email</p>
                    </div>
                    <label className="ds-switch">
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={() => handlePreferenceChange('emailNotifications')}
                      />
                      <span className="ds-switch-slider"></span>
                    </label>
                  </div>

                  <div className="ds-pref">
                    <div className="ds-pref-info">
                      <h3>SMS Notifications</h3>
                      <p>Get text messages for important updates</p>
                    </div>
                    <label className="ds-switch">
                      <input
                        type="checkbox"
                        checked={preferences.smsNotifications}
                        onChange={() => handlePreferenceChange('smsNotifications')}
                      />
                      <span className="ds-switch-slider"></span>
                    </label>
                  </div>

                  <div className="ds-pref">
                    <div className="ds-pref-info">
                      <h3>Promotional Emails</h3>
                      <p>Receive special offers and discounts</p>
                    </div>
                    <label className="ds-switch">
                      <input
                        type="checkbox"
                        checked={preferences.promotionalEmails}
                        onChange={() => handlePreferenceChange('promotionalEmails')}
                      />
                      <span className="ds-switch-slider"></span>
                    </label>
                  </div>

                  <div className="ds-pref">
                    <div className="ds-pref-info">
                      <h3>Booking Reminders</h3>
                      <p>Get reminded before your scheduled trips</p>
                    </div>
                    <label className="ds-switch">
                      <input
                        type="checkbox"
                        checked={preferences.bookingReminders}
                        onChange={() => handlePreferenceChange('bookingReminders')}
                      />
                      <span className="ds-switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="ds-card ds-card-pad">
                <div className="ds-card-head">
                  <h2 className="ds-card-title">Account Management</h2>
                </div>

                <div className="ds-row-actions">
                  <button type="button" className="ds-btn ds-btn-outline">
                    Deactivate Account
                  </button>
                  <button type="button" className="ds-btn ds-btn-outline">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
 </AuthGate>

  );
}
