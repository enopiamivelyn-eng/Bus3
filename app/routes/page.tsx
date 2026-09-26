'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';

interface Route {
  id: string;
  name: string;
  fromCity: string;
  toCity: string;
  distance: number;
  basePrice: number;
  duration: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusClass = (status: string) => {
  if (status === 'active') return 'ds-badge-green';
  return 'ds-badge-red';
};

const formatPrice = (amount: number): string => {
  return `₱${amount.toLocaleString('en-PH')}`;
};

export default function RoutesPage() {
  const { user } = useAuth();
  const username = user?.name ?? 'Traveller';
  const isAdmin = user?.role === 'admin';
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    fromCity: '',
    toCity: '',
    distance: '',
    basePrice: '',
    duration: '',
    status: 'active'
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoutes(data.routes || []);
      } else {
        setError('Failed to load routes');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingRoute 
        ? `/api/admin/routes/${editingRoute.id}`
        : '/api/admin/routes';
      
      const method = editingRoute ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          fromCity: formData.fromCity,
          toCity: formData.toCity,
          distance: parseFloat(formData.distance),
          basePrice: parseFloat(formData.basePrice),
          duration: formData.duration,
          status: formData.status
        })
      });

      if (response.ok) {
        setShowModal(false);
        setEditingRoute(null);
        setFormData({ name: '', fromCity: '', toCity: '', distance: '', basePrice: '', duration: '', status: 'active' });
        fetchRoutes();
      } else {
        const data = await response.json();
        setError(data.error || 'Operation failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      fromCity: route.fromCity,
      toCity: route.toCity,
      distance: route.distance.toString(),
      basePrice: route.basePrice.toString(),
      duration: route.duration,
      status: route.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;

    try {
      const response = await fetch(`/api/admin/routes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        fetchRoutes();
      } else {
        const data = await response.json();
        setError(data.error || 'Delete failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.toCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AuthGate>
        <div className="ds-app">
          <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />
          <div className="ds-app-body">
            <Sidebar isAuthenticated username={username} />
            <main className="ds-page">
              <div className="ds-empty">
                <div className="loading" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Loading routes...</p>
              </div>
            </main>
          </div>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="ds-app">
        <Navbar user={{ name: user?.name ?? 'Traveller', role: user?.role ?? 'Passenger' }} />

        <div className="ds-app-body">
          <Sidebar isAuthenticated username={username} />

          <main className="ds-page">
            <div className="ds-mb">
              <h1 className="ds-page-title">Routes</h1>
              <p className="ds-page-sub">Manage travel routes and destinations</p>
            </div>

            {error && (
              <div className="ds-alert ds-alert-error ds-mb">
                <span>{error}</span>
              </div>
            )}

            <div className="ds-card ds-card-pad ds-mb">
              <div className="ds-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ds-input"
                  style={{ maxWidth: '300px' }}
                />
                <button
                  onClick={() => {
                    setEditingRoute(null);
                    setFormData({ name: '', fromCity: '', toCity: '', distance: '', basePrice: '', duration: '', status: 'active' });
                    setShowModal(true);
                  }}
                  className="ds-btn ds-btn-primary"
                >
                  + Add New Route
                </button>
              </div>
            </div>

            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Route ID</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                        No routes found
                      </td>
                    </tr>
                  ) : (
                    filteredRoutes.map((route) => (
                      <tr key={route.id}>
                        <td className="ds-cell-strong">{route.name}</td>
                        <td>{route.fromCity}</td>
                        <td>{route.toCity}</td>
                        <td>
                          <span className={`ds-badge ${statusClass(route.status)}`}>
                            {route.status}
                          </span>
                        </td>
                        <td>
                          <div className="ds-row" style={{ gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEdit(route)}
                              className="ds-btn ds-btn-soft ds-btn-sm"
                            >
                              Edit
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(route.id)}
                                className="ds-btn ds-btn-soft ds-btn-sm"
                                style={{ color: '#ef4444' }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {showModal && (
              <div className="ds-modal-overlay" onClick={() => setShowModal(false)}>
                <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="ds-modal-head">
                    <h2 className="ds-modal-title">
                      {editingRoute ? 'Edit Route' : 'Add New Route'}
                    </h2>
                    <button onClick={() => setShowModal(false)} className="ds-modal-close">×</button>
                  </div>
                  
                  <div className="ds-modal-body">
                    <form onSubmit={handleSubmit} className="ds-form">
                      <div className="ds-field">
                        <label htmlFor="name" className="ds-label">Route Name</label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="ds-input"
                          required
                          placeholder="Cebu-Bato"
                        />
                      </div>

                      <div className="ds-trip-grid">
                        <div className="ds-field">
                          <label htmlFor="fromCity" className="ds-label">Origin</label>
                          <input
                            id="fromCity"
                            type="text"
                            value={formData.fromCity}
                            onChange={(e) => setFormData({...formData, fromCity: e.target.value})}
                            className="ds-input"
                            required
                            placeholder="Cebu City"
                          />
                        </div>

                        <div className="ds-field">
                          <label htmlFor="toCity" className="ds-label">Destination</label>
                          <input
                            id="toCity"
                            type="text"
                            value={formData.toCity}
                            onChange={(e) => setFormData({...formData, toCity: e.target.value})}
                            className="ds-input"
                            required
                            placeholder="Bato"
                          />
                        </div>
                      </div>

                      <div className="ds-trip-grid">
                        <div className="ds-field">
                          <label htmlFor="distance" className="ds-label">Distance (km)</label>
                          <input
                            id="distance"
                            type="number"
                            value={formData.distance}
                            onChange={(e) => setFormData({...formData, distance: e.target.value})}
                            className="ds-input"
                            required
                            min="1"
                            step="0.1"
                            placeholder="120.5"
                          />
                        </div>

                        <div className="ds-field">
                          <label htmlFor="basePrice" className="ds-label">Base Price</label>
                          <input
                            id="basePrice"
                            type="number"
                            value={formData.basePrice}
                            onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                            className="ds-input"
                            required
                            min="1"
                            placeholder="300"
                          />
                        </div>
                      </div>

                      <div className="ds-field">
                        <label htmlFor="duration" className="ds-label">Duration</label>
                        <input
                          id="duration"
                          type="text"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          className="ds-input"
                          required
                          placeholder="5 hours"
                        />
                      </div>

                      <div className="ds-field">
                        <label htmlFor="status" className="ds-label">Status</label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="ds-select"
                          required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="ds-row-actions">
                        <button type="button" onClick={() => setShowModal(false)} className="ds-btn ds-btn-outline">
                          Cancel
                        </button>
                        <button type="submit" className="ds-btn ds-btn-primary">
                          {editingRoute ? 'Update Route' : 'Add Route'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
